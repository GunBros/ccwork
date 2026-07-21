import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  // 2-1: 정상
  it('should render tag badges when tags are provided', () => {
    render(<TagInput tags={['react', 'vue']} onAddTag={() => true} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('vue')).toBeInTheDocument();
  });

  // 2-2: 정상
  it('should render input field for tag entry', () => {
    render(<TagInput tags={[]} onAddTag={() => true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  // 2-3: 정상
  it('should call onAddTag when Enter key is pressed', async () => {
    const onAddTag = vi.fn(() => true);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'react');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAddTag).toHaveBeenCalledWith('react');
  });

  // 2-4: 정상
  it('should call onAddTag when comma is typed', async () => {
    const onAddTag = vi.fn(() => true);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'react,');
    expect(onAddTag).toHaveBeenCalledWith('react,');
  });

  // 2-5: 정상
  it('should clear input when onAddTag returns true', async () => {
    const onAddTag = vi.fn(() => true);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'react');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('');
  });

  // 2-6: 경계
  it('should not clear input when onAddTag returns false', async () => {
    const onAddTag = vi.fn(() => false);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'react');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('react');
  });

  // 2-8: 경계 (갭 AC-3: 쉼표 경로의 입력창 클리어 검증)
  it('should clear input when comma triggers successful tag add', async () => {
    const onAddTag = vi.fn(() => true);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'react,');
    expect(input.value).toBe('');
  });

  // 2-7: 정상
  it('should display empty input when no text entered', () => {
    render(<TagInput tags={[]} onAddTag={() => true} onRemoveTag={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  // --- Issue #2: 태그 삭제 시나리오 ---

  // 2-1 (issue-2): 정상
  it('should render remove button on each tag badge', () => {
    render(<TagInput tags={['react', 'vue']} onAddTag={() => true} onRemoveTag={() => {}} />);
    const removeButtons = screen.getAllByRole('button');
    expect(removeButtons).toHaveLength(2);
  });

  // 2-2 (issue-2): 정상
  it('should call onRemoveTag with tag value when remove button is clicked', async () => {
    const onRemoveTag = vi.fn();
    render(<TagInput tags={['react', 'vue']} onAddTag={() => true} onRemoveTag={onRemoveTag} />);
    const removeButtons = screen.getAllByRole('button');
    await userEvent.click(removeButtons[0]);
    expect(onRemoveTag).toHaveBeenCalledWith('react');
  });

  // 2-3 (issue-2): 정상
  it('should remove badge from display when onRemoveTag is triggered', () => {
    const { rerender } = render(
      <TagInput tags={['react', 'vue']} onAddTag={() => true} onRemoveTag={() => {}} />,
    );
    // onRemoveTag 호출 후 부모가 tags를 갱신하면 뱃지가 사라져야 함
    rerender(<TagInput tags={['vue']} onAddTag={() => true} onRemoveTag={() => {}} />);
    expect(screen.queryByText('react')).not.toBeInTheDocument();
    expect(screen.getByText('vue')).toBeInTheDocument();
  });
});
