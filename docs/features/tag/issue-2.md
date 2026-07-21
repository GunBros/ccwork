# Issue #2: 태그 삭제 + 저장

> GitHub Issue: #2
> 생성일: 2026-07-22

## 확정 시그니처

### 함수/훅 시그니처

```ts
// src/hooks/useTagEditor.ts

interface UseTagEditorReturn {
  tags: string[];
  addTag: (value: string) => boolean;
  removeTag: (tag: string) => void; // 추가
  setTags: (tags: string[]) => void;
}

// removeTag — 해당 tag를 tags 배열에서 제거. 존재하지 않는 tag면 변경 없음.
removeTag: (tag: string) => void;
```

### 컴포넌트 Props

```ts
// src/components/TagInput.tsx

interface TagInputProps {
  tags: string[];
  onAddTag: (value: string) => boolean;
  onRemoveTag: (tag: string) => void; // 추가
}
```

### NoteEditor 연결

```ts
// src/components/NoteEditor.tsx

// useTagEditor에서 removeTag 추가 구조분해
const { tags, addTag, removeTag, setTags } = useTagEditor();

// TagInput에 onRemoveTag 전달
<TagInput tags={tags} onAddTag={addTag} onRemoveTag={removeTag} />
```

---

## 테스트 시나리오

### useTagEditor 훅 — removeTag (훅)

| #   | 분류 | 시나리오                                                                               |
| --- | ---- | -------------------------------------------------------------------------------------- |
| 1-1 | 정상 | removeTag — should remove the specified tag from tags when tag exists                  |
| 1-2 | 정상 | removeTag — should keep other tags unchanged when one tag is removed                   |
| 1-3 | 경계 | removeTag — should not change tags when tag does not exist                             |
| 1-4 | 경계 | removeTag — should result in empty array when removing the only tag                    |
| 1-5 | 경계 | removeTag — should remove only the first matching tag when called once (대소문자 구분) |
| 1-6 | 경계 | removeTag — should not remove "React" when removing "react" (case-sensitive)           |

### TagInput 컴포넌트 (UI)

| #   | 분류 | 시나리오                                                                        |
| --- | ---- | ------------------------------------------------------------------------------- |
| 2-1 | 정상 | TagInput — should render remove button on each tag badge                        |
| 2-2 | 정상 | TagInput — should call onRemoveTag with tag value when remove button is clicked |
| 2-3 | 정상 | TagInput — should remove badge from display when onRemoveTag is triggered       |

### NoteEditor 통합 (저장 흐름)

| #   | 분류 | 시나리오                                                                           |
| --- | ---- | ---------------------------------------------------------------------------------- |
| 3-1 | 정상 | NoteEditor — should include updated tags in API call when tag is removed and saved |
| 3-2 | 정상 | NoteEditor — should not persist tag removal to server when save is not clicked     |

---

## AC 커버리지

| AC # | AC 내용 (요약)                                                   | 시나리오 #         |
| ---- | ---------------------------------------------------------------- | ------------------ |
| AC-1 | 태그 뱃지에 x 버튼이 표시된다                                    | 2-1                |
| AC-2 | x 버튼 클릭 시 해당 태그가 즉시 로컬 상태에서 제거된다           | 1-1, 1-2, 2-2, 2-3 |
| AC-3 | 태그 삭제 후 저장 버튼 클릭하면 삭제가 서버에 반영된다           | 3-1                |
| AC-4 | 저장하지 않고 다른 노트로 이동하면 삭제가 서버에 반영되지 않는다 | 3-2                |
| AC-5 | removeTag에 대한 renderHook 단위 테스트가 통과한다               | 1-1 ~ 1-6          |

모든 AC가 최소 1개 이상의 시나리오로 커버됨
