# Issue #1: 태그 추가 + 저장: 전 레이어 관통 구현

> GitHub Issue: #1
> 생성일: 2026-07-08

## 확정 시그니처

### 타입 변경

```ts
// src/types/note.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[]; // 추가
  createdAt: string;
  updatedAt: string;
}
```

### API 함수 — 시그니처 변경 없음

```ts
// src/api/notes.ts
// Note 타입에 tags가 추가되므로 Omit 타입이 자동으로 { title, content, tags }를 요구
// 본문에서 tags: [] 기본값을 spread로 주입: { tags: [], ...note, createdAt: now, updatedAt: now }
export async function createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;

// Partial<Note>이므로 tags 전달 자동 지원, 변경 없음
export async function updateNote(id: string, updates: Partial<Note>): Promise<Note>;
```

### Context — 시그니처 변경 없음

```ts
// src/context/NotesContext.tsx
// 내부에서 api.createNote({ title, content, tags: [] }) 호출
createNote: (title: string, content: string) => Promise<void>;

// Partial<Note>이므로 tags 포함 가능, 변경 없음
updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
```

### 커스텀 훅 (신규)

```ts
// src/hooks/useTagEditor.ts
interface UseTagEditorReturn {
  tags: string[];
  addTag: (value: string) => boolean; // 유효성 검사 후 추가, 성공 시 true
  setTags: (tags: string[]) => void; // 기존 노트의 태그로 초기화
}

function useTagEditor(initialTags?: string[]): UseTagEditorReturn;
```

**`addTag` 내부 처리 순서:**

1. 쉼표 제거 (`value.replace(',', '')`)
2. 앞뒤 공백 trim
3. 빈 문자열 → `false`
4. 20자 초과 → `false`
5. 중복 검사 (`tags.includes(trimmed)`, 대소문자 구분) → `false`
6. 통과 시 태그 추가 → `true`

### 컴포넌트 Props (신규)

```ts
// src/components/TagInput.tsx
interface TagInputProps {
  tags: string[];
  onAddTag: (value: string) => boolean;
}

// 순수 UI 컴포넌트
// - 로컬 inputValue state로 입력 관리
// - Enter 또는 쉼표 입력 시 onAddTag 호출, 성공 시 입력창 클리어
// - tags를 뱃지로 표시 (Issue #1에서는 × 버튼 없음)
export function TagInput({ tags, onAddTag }: TagInputProps): JSX.Element;
```

### NoteEditor — Props 변경 없음

```ts
// src/components/NoteEditor.tsx
interface NoteEditorProps {
  selectedNoteId: string | null;
  isCreating: boolean;
  onDone: () => void;
}

// 내부 변경사항:
// - useTagEditor(selectedNote?.tags) 훅 사용
// - useEffect에서 노트 변경 시 setTags(selectedNote.tags) 호출
// - handleSave에서 updateNote(id, { title, content, tags }) 전달
// - <TagInput tags={tags} onAddTag={addTag} /> 렌더링
```

---

## 테스트 시나리오

### useTagEditor (훅)

| #    | 분류 | 시나리오                                                                           |
| ---- | ---- | ---------------------------------------------------------------------------------- |
| 1-1  | 정상 | useTagEditor — should initialize with empty tags when no initialTags provided      |
| 1-2  | 정상 | useTagEditor — should initialize with given tags when initialTags provided         |
| 1-3  | 정상 | addTag — should add tag to list when valid tag is provided                         |
| 1-4  | 정상 | addTag — should return true when tag is successfully added                         |
| 1-5  | 정상 | addTag — should add multiple tags when called sequentially with valid values       |
| 1-6  | 경계 | addTag — should trim whitespace when tag has leading/trailing spaces               |
| 1-7  | 경계 | addTag — should remove comma from value when input contains comma                  |
| 1-8  | 경계 | addTag — should accept tag when tag is exactly 20 characters                       |
| 1-9  | 예외 | addTag — should return false when input is empty string                            |
| 1-10 | 예외 | addTag — should return false when input is only whitespace                         |
| 1-11 | 예외 | addTag — should return false when tag exceeds 20 characters                        |
| 1-12 | 예외 | addTag — should return false when duplicate tag exists (case-sensitive)            |
| 1-13 | 정상 | addTag — should add tag when same text with different case exists (case-sensitive) |
| 1-14 | 경계 | addTag — should return false when input is only comma                              |
| 1-15 | 정상 | setTags — should replace tags with given array                                     |
| 1-16 | 정상 | setTags — should set empty array when called with empty array                      |

### TagInput (컴포넌트)

| #   | 분류 | 시나리오                                                      |
| --- | ---- | ------------------------------------------------------------- |
| 2-1 | 정상 | TagInput — should render tag badges when tags are provided    |
| 2-2 | 정상 | TagInput — should render input field for tag entry            |
| 2-3 | 정상 | TagInput — should call onAddTag when Enter key is pressed     |
| 2-4 | 정상 | TagInput — should call onAddTag when comma is typed           |
| 2-5 | 정상 | TagInput — should clear input when onAddTag returns true      |
| 2-6 | 경계 | TagInput — should not clear input when onAddTag returns false |
| 2-7 | 정상 | TagInput — should display empty input when no text entered    |

### NoteEditor 통합 (컴포넌트)

| #   | 분류 | 시나리오                                                                         |
| --- | ---- | -------------------------------------------------------------------------------- |
| 3-1 | 정상 | NoteEditor — should display existing tags when note with tags is selected        |
| 3-2 | 정상 | NoteEditor — should include tags in API call when save button is clicked         |
| 3-3 | 정상 | NoteEditor — should send tags as empty array when creating new note without tags |
| 3-4 | 정상 | NoteEditor — should update tags in TagInput when different note is selected      |

---

## AC 커버리지

| AC #  | AC 내용 (요약)                                   | 시나리오 #    |
| ----- | ------------------------------------------------ | ------------- |
| AC-1  | `Note` 인터페이스에 `tags: string[]` 존재        | 1-1, 1-2      |
| AC-2  | NoteEditor에 태그 입력창과 뱃지 목록 인라인 표시 | 2-1, 2-2      |
| AC-3  | Enter 또는 쉼표 입력 시 태그 확정, 입력창 비워짐 | 2-3, 2-4, 2-5 |
| AC-4  | 쉼표 문자는 태그에 포함되지 않음                 | 1-7           |
| AC-5  | 입력값 앞뒤 공백 자동 제거(trim)                 | 1-6           |
| AC-6  | trim 후 빈 문자열이면 태그 추가 안 됨            | 1-9, 1-10     |
| AC-7  | 20자 초과 입력 무시                              | 1-8, 1-11     |
| AC-8  | 동일 태그 중복 추가 안 됨 (대소문자 구분)        | 1-12, 1-13    |
| AC-9  | 저장 시 tags가 단일 API 호출로 반영              | 3-2           |
| AC-10 | 새 노트 생성 시 `tags: []` 기본값 포함           | 3-3           |
| AC-11 | 낙관적 업데이트로 노트 목록 즉시 갱신            | 3-2           |
| AC-12 | 기존 노트 선택 시 태그가 TagInput에 표시         | 3-1, 3-4      |
| AC-13 | `useTagEditor` 훅 renderHook 단위 테스트 통과    | 1-1 ~ 1-16    |

✅ 모든 AC가 최소 1개 이상의 시나리오로 커버됨
