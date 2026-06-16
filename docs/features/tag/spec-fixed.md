# 태그 기능 확정 스펙

## 기능 개요

노트에 태그를 추가하고 관리할 수 있다.

## 구현 범위

- 노트에 태그를 추가할 수 있다
- 노트에 추가된 태그를 삭제할 수 있다
- 태그 목록을 노트 상세 화면(NoteEditor)에서 확인할 수 있다
- NoteList에서 각 노트에 달린 태그를 뱃지로 표시한다
- 태그로 노트를 필터링하는 기능은 이번 범위에 포함하지 않는다

## 데이터 구조

`Note` 인터페이스에 `tags` 필드를 추가한다.

```ts
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[]; // 추가
  createdAt: string;
  updatedAt: string;
}
```

`db.json` 저장 예시:

```json
{
  "id": "1",
  "title": "제목",
  "content": "내용",
  "tags": ["react", "hooks"],
  "createdAt": "...",
  "updatedAt": "..."
}
```

별도 `tags` 컬렉션은 만들지 않는다.

## UI 패턴

### NoteEditor — 태그 입력

인라인 입력 방식. 태그 목록과 입력창이 한 줄에 표시된다.

```
[react ×] [hooks ×] [____________]
```

- 입력창에서 **Enter** 또는 **쉼표(,)** 입력 시 태그 확정
- 쉼표 입력 시 쉼표 문자는 태그에 포함하지 않는다
- `×` 클릭 시 해당 태그 즉시 제거 (로컬 상태에서만)
- 태그 변경은 **저장 버튼**을 눌러야 서버에 반영된다 (제목/내용 저장과 동일한 흐름)

### NoteList — 태그 표시

각 노트 항목 아래에 태그를 뱃지로 표시한다. 클릭 기능 없음.

```
제목
내용 미리보기...
[react] [hooks]
```

## 유효성 검사

| 항목      | 규칙                                        |
| --------- | ------------------------------------------- |
| 공백 처리 | 입력값 앞뒤 공백 trim 후 저장               |
| 빈 태그   | trim 후 빈 문자열이면 무시                  |
| 최대 길이 | 20자 초과 시 무시                           |
| 중복      | 같은 노트 내 동일 태그 불허 (대소문자 구분) |
| 개수 제한 | 없음                                        |
| 허용 문자 | 제한 없음 (한글, 특수문자 허용)             |

## 저장 흐름

1. 사용자가 태그 추가/삭제 → 컴포넌트 로컬 상태(`tags`)만 변경
2. 저장 버튼 클릭 → `updateNote({ ...note, tags })` API 호출
3. Context 낙관적 업데이트: `setNotes(prev => prev.map(n => n.id === id ? updated : n))`

## 변경 파일 목록

| 파일                            | 변경 내용                             |
| ------------------------------- | ------------------------------------- |
| `src/types/note.ts`             | `tags: string[]` 필드 추가            |
| `src/context/NotesContext.tsx`  | `createNote` 기본값에 `tags: []` 추가 |
| `src/components/NoteEditor.tsx` | 태그 인라인 입력 UI 추가              |
| `src/components/NoteList.tsx`   | 태그 뱃지 표시 추가                   |
| `db.json`                       | 기존 노트에 `tags: []` 필드 추가      |
