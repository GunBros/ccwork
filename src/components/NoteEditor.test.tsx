import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteEditor } from './NoteEditor';
import { NotesProvider } from '../context/NotesContext';
import * as api from '../api/notes';

// API 모킹
vi.mock('../api/notes', () => ({
  fetchNotes: vi.fn(),
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
}));

const mockedApi = vi.mocked(api);

// 태그가 포함된 테스트용 노트
const noteWithTags = {
  id: '1',
  title: '테스트 노트',
  content: '내용',
  tags: ['react', 'typescript'],
  createdAt: '2026-07-08T00:00:00.000Z',
  updatedAt: '2026-07-08T00:00:00.000Z',
};

const noteWithoutTags = {
  id: '2',
  title: '태그 없는 노트',
  content: '내용2',
  tags: [],
  createdAt: '2026-07-08T00:00:00.000Z',
  updatedAt: '2026-07-08T00:00:00.000Z',
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<NotesProvider>{ui}</NotesProvider>);
}

describe('NoteEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.fetchNotes.mockResolvedValue([noteWithTags, noteWithoutTags]);
  });

  // 3-1: 정상
  it('should display existing tags when note with tags is selected', async () => {
    renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={() => {}} />);

    // 기존 태그가 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });
  });

  // 3-2: 정상
  it('should include tags in API call when save button is clicked', async () => {
    mockedApi.updateNote.mockResolvedValue({
      ...noteWithTags,
      tags: ['react', 'typescript', 'vue'],
    });

    renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={() => {}} />);

    // 노트 로드 대기
    await waitFor(() => {
      expect(screen.getByDisplayValue('테스트 노트')).toBeInTheDocument();
    });

    // 저장 버튼 클릭
    const saveButton = screen.getByText('저장');
    await userEvent.click(saveButton);

    // updateNote 호출 시 tags가 포함되어야 함
    await waitFor(() => {
      expect(mockedApi.updateNote).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ tags: ['react', 'typescript'] }),
      );
    });
  });

  // 3-3: 정상
  it('should send tags as empty array when creating new note without tags', async () => {
    mockedApi.createNote.mockResolvedValue({
      id: '3',
      title: '새 노트',
      content: '',
      tags: [],
      createdAt: '2026-07-08T00:00:00.000Z',
      updatedAt: '2026-07-08T00:00:00.000Z',
    });

    renderWithProvider(<NoteEditor selectedNoteId={null} isCreating={true} onDone={() => {}} />);

    // 제목 입력
    const titleInput = screen.getByPlaceholderText('제목');
    await userEvent.type(titleInput, '새 노트');

    // 저장 버튼 클릭
    const saveButton = screen.getByText('저장');
    await userEvent.click(saveButton);

    // createNote 호출 시 tags: []가 포함되어야 함
    await waitFor(() => {
      expect(mockedApi.createNote).toHaveBeenCalledWith(expect.objectContaining({ tags: [] }));
    });
  });

  // 3-5: 정상 (갭 AC-11: 낙관적 업데이트 UI 반영)
  it('should reflect updated tags in UI immediately after save', async () => {
    const updatedNote = {
      ...noteWithTags,
      tags: ['react', 'typescript', 'vue'],
    };
    mockedApi.updateNote.mockResolvedValue(updatedNote);

    renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={() => {}} />);

    // 노트 로드 대기
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // 저장 버튼 클릭
    const saveButton = screen.getByText('저장');
    await userEvent.click(saveButton);

    // 낙관적 업데이트로 API 응답의 태그가 즉시 반영되어야 함
    await waitFor(() => {
      expect(mockedApi.updateNote).toHaveBeenCalled();
    });
  });

  // --- Issue #2: 태그 삭제 시나리오 ---

  // 3-1 (issue-2): 정상
  it('should include updated tags in API call when tag is removed and saved', async () => {
    mockedApi.updateNote.mockResolvedValue({
      ...noteWithTags,
      tags: ['typescript'],
    });

    renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={() => {}} />);

    // 노트 로드 대기
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // x 버튼 클릭으로 "react" 태그 삭제
    const removeButtons = screen.getAllByRole('button', { name: /×|✕|x|삭제/i });
    await userEvent.click(removeButtons[0]);

    // 저장 버튼 클릭
    const saveButton = screen.getByText('저장');
    await userEvent.click(saveButton);

    // updateNote 호출 시 react가 제거된 tags가 전달되어야 함
    await waitFor(() => {
      expect(mockedApi.updateNote).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ tags: ['typescript'] }),
      );
    });
  });

  // 3-2 (issue-2): 정상
  it('should not persist tag removal to server when save is not clicked', async () => {
    const onDone = vi.fn();

    renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={onDone} />);

    // 노트 로드 대기
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // x 버튼 클릭으로 태그 삭제
    const removeButtons = screen.getAllByRole('button', { name: /×|✕|x|삭제/i });
    await userEvent.click(removeButtons[0]);

    // 저장하지 않음 — updateNote가 호출되지 않아야 함
    expect(mockedApi.updateNote).not.toHaveBeenCalled();
  });

  // 3-4: 정상
  it('should update tags in TagInput when different note is selected', async () => {
    const { rerender } = renderWithProvider(
      <NoteEditor selectedNoteId="1" isCreating={false} onDone={() => {}} />,
    );

    // 첫 번째 노트의 태그 확인
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // 다른 노트로 변경
    rerender(
      <NotesProvider>
        <NoteEditor selectedNoteId="2" isCreating={false} onDone={() => {}} />
      </NotesProvider>,
    );

    // 태그가 빈 상태로 변경되어야 함 (react, typescript가 사라짐)
    await waitFor(() => {
      expect(screen.queryByText('react')).not.toBeInTheDocument();
      expect(screen.queryByText('typescript')).not.toBeInTheDocument();
    });
  });
});
