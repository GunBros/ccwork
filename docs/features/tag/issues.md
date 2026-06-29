# 태그 기능 이슈 목록

> 수직 슬라이싱 원칙에 따라 분해. 각 이슈는 타입-API-로직-UI-저장 레이어를 관통하며, 완료 시 사용자에게 독립적 가치를 전달한다.
> 기반 PRD: `docs/features/tag/prd.md`

---

## Issue #1: NoteEditor에서 태그를 추가하고 저장할 수 있다

### 설명

노트 편집 화면에서 태그를 입력하고, 저장 버튼으로 서버에 반영하는 전체 흐름을 구현한다. `Note` 타입 변경부터 API, Context, 커스텀 훅(`useTagEditor`), UI 컴포넌트(`TagInput`), 저장 흐름까지 모든 레이어를 관통한다.

### 사용자 가치

사용자가 노트에 태그를 붙이고 저장하여 분류할 수 있다.

### 관련 사용자 스토리

US-01 (태그 추가), US-03 (NoteEditor에서 태그 확인), US-05 (태그 포함 저장)

### 변경 대상

| 레이어  | 파일                            | 변경 내용                                                           |
| ------- | ------------------------------- | ------------------------------------------------------------------- |
| 타입    | `src/types/note.ts`             | `tags: string[]` 필드 추가                                          |
| API     | `src/api/notes.ts`              | `createNote`에서 `tags: []` 기본값 주입                             |
| Context | `src/context/NotesContext.tsx`  | `createNote` 호출 시 `tags: []` 포함, 낙관적 업데이트에 tags 반영   |
| 데이터  | `db.json`                       | 기존 노트에 `tags: []` 필드 추가                                    |
| 로직    | `src/hooks/useTagEditor.ts`     | 신규 — `addTag`, `setTags` 및 유효성 검사                           |
| UI      | `src/components/TagInput.tsx`   | 신규 — 인라인 태그 뱃지 + 입력창                                    |
| UI      | `src/components/NoteEditor.tsx` | `useTagEditor` 훅 사용, `TagInput` 렌더링, `handleSave`에 tags 포함 |

### 완료 조건 (Acceptance Criteria)

1. `Note` 인터페이스에 `tags: string[]` 필드가 존재한다.
2. NoteEditor에 태그 입력창과 뱃지 목록이 인라인으로 표시된다 (`[react ×] [hooks ×] [____]`).
3. 입력창에서 Enter 또는 쉼표(,) 입력 시 태그가 확정되고, 입력창이 비워진다.
4. 쉼표 문자는 태그에 포함되지 않는다.
5. 입력값 앞뒤 공백이 자동 제거(trim)된다.
6. trim 후 빈 문자열이면 태그로 추가되지 않는다.
7. 20자를 초과하는 입력은 무시된다.
8. 같은 노트 내 동일 태그가 이미 있으면 추가되지 않는다 (대소문자 구분).
9. 저장 버튼 클릭 시 `tags`가 `title`, `content`와 함께 단일 API 호출로 서버에 반영된다.
10. 새 노트 생성 시 `tags: []` 기본값이 포함된다.
11. 저장 후 Context 낙관적 업데이트로 노트 목록이 즉시 갱신된다.
12. 기존 노트를 선택하면 해당 노트의 태그가 TagInput에 표시된다.
13. `useTagEditor` 훅의 유효성 검사 규칙에 대한 `renderHook` 단위 테스트가 통과한다.

### 시나리오

```gherkin
Scenario: Enter로 태그를 추가하고 저장한다
  Given NoteEditor에서 노트를 편집 중이다
  When 태그 입력창에 "react"를 입력하고 Enter를 누른다
  And 저장 버튼을 클릭한다
  Then "react" 뱃지가 태그 목록에 표시된다
  And API에 tags: ["react"]가 포함된 요청이 전송된다
  And db.json에 해당 노트의 tags가 ["react"]로 저장된다

Scenario: 쉼표로 태그를 추가한다
  Given NoteEditor에서 노트를 편집 중이다
  When 태그 입력창에 "hooks,"를 입력한다
  Then "hooks" 뱃지가 태그 목록에 표시된다
  And 입력창이 비워진다
  And 쉼표 문자는 태그에 포함되지 않는다

Scenario: 빈 문자열은 무시된다
  Given NoteEditor에서 노트를 편집 중이다
  When 태그 입력창에 공백만 입력하고 Enter를 누른다
  Then 태그가 추가되지 않는다

Scenario: 20자 초과 입력은 무시된다
  Given NoteEditor에서 노트를 편집 중이다
  When 21자 이상의 문자열을 입력하고 Enter를 누른다
  Then 태그가 추가되지 않는다

Scenario: 중복 태그는 추가되지 않는다 (대소문자 구분)
  Given 노트에 "React" 태그가 있다
  When "React"를 다시 입력하고 Enter를 누른다
  Then 태그가 추가되지 않는다

  When "react"를 입력하고 Enter를 누른다
  Then "react" 태그가 추가된다 (대소문자 구분)

Scenario: 신규 노트에 태그를 포함하여 생성한다
  Given 새 노트 작성 모드이다
  When 제목, 내용을 입력하고 "typescript" 태그를 추가한 후 저장한다
  Then 생성된 노트에 tags: ["typescript"]가 포함된다

Scenario: 기존 노트의 태그를 불러온다
  Given db.json에 tags: ["react", "hooks"]인 노트가 있다
  When 해당 노트를 선택한다
  Then NoteEditor에 "react", "hooks" 뱃지가 표시된다
```

---

## Issue #2: NoteEditor에서 태그를 삭제하고 저장할 수 있다

### 설명

NoteEditor에서 기존 태그를 제거하고 저장하는 흐름을 구현한다. `useTagEditor` 훅에 `removeTag`를 추가하고, `TagInput` 뱃지에 `x` 삭제 버튼을 추가하며, 삭제된 태그가 저장 시 서버에 반영되는 전체 흐름을 포함한다.

### 사용자 가치

사용자가 잘못 붙인 태그를 제거하여 태그를 정확하게 유지할 수 있다.

### 관련 사용자 스토리

US-02 (태그 삭제)

### 변경 대상

| 레이어 | 파일                            | 변경 내용                                        |
| ------ | ------------------------------- | ------------------------------------------------ |
| 로직   | `src/hooks/useTagEditor.ts`     | `removeTag` 함수 추가                            |
| UI     | `src/components/TagInput.tsx`   | 뱃지에 `x` 삭제 버튼 추가 + `onRemove` 콜백 연결 |
| UI     | `src/components/NoteEditor.tsx` | `removeTag`를 `TagInput`에 전달                  |

### 완료 조건 (Acceptance Criteria)

1. 태그 뱃지에 `x` 버튼이 표시된다.
2. `x` 버튼 클릭 시 해당 태그가 즉시 로컬 상태에서 제거된다.
3. 태그 삭제 후 저장 버튼을 클릭하면 삭제가 서버에 반영된다.
4. `removeTag`에 대한 `renderHook` 단위 테스트가 통과한다.

### 시나리오

```gherkin
Scenario: 태그를 삭제하고 저장한다
  Given 노트에 tags: ["react", "hooks"]가 있다
  When "react" 뱃지의 x 버튼을 클릭한다
  Then "react" 뱃지가 목록에서 즉시 사라진다
  And 저장 버튼을 클릭한다
  Then API에 tags: ["hooks"]가 포함된 요청이 전송된다
  And db.json에서 해당 노트의 tags가 ["hooks"]로 저장된다

Scenario: 태그를 삭제하고 저장하지 않으면 서버에 반영되지 않는다
  Given 노트에 tags: ["react", "hooks"]가 있다
  When "react" 뱃지의 x 버튼을 클릭한다
  And 저장하지 않고 다른 노트를 선택한다
  Then db.json에서 해당 노트의 tags는 ["react", "hooks"] 그대로이다
```

---

## Issue #3: NoteList에서 태그 뱃지를 확인할 수 있다

### 설명

노트 목록(NoteList)의 각 노트 항목에 태그를 읽기 전용 뱃지로 표시한다. 이미 #1에서 `Note` 타입에 `tags` 필드가 추가되어 데이터가 흐르고 있으므로, UI 렌더링을 추가하여 사용자가 목록에서 바로 태그를 확인할 수 있게 한다.

### 사용자 가치

사용자가 노트를 열지 않고도 목록에서 태그를 확인하여 내용을 가늠할 수 있다.

### 관련 사용자 스토리

US-04 (NoteList에서 태그 확인)

### 변경 대상

| 레이어 | 파일                                              | 변경 내용             |
| ------ | ------------------------------------------------- | --------------------- |
| UI     | `src/components/NoteList.tsx` 또는 `NoteItem.tsx` | 태그 뱃지 렌더링 추가 |

### 완료 조건 (Acceptance Criteria)

1. NoteList의 각 노트 항목 아래에 태그가 뱃지 형태로 표시된다.
2. 태그가 없는 노트(`tags: []`)는 뱃지 영역이 표시되지 않는다.
3. 뱃지는 클릭 이벤트를 처리하지 않는다 (삭제 버튼 없음).
4. 여러 태그가 있을 때 뱃지가 가로로 나열된다.

### 시나리오

```gherkin
Scenario: 태그가 있는 노트의 뱃지를 확인한다
  Given 노트에 tags: ["react", "hooks"]가 저장되어 있다
  When NoteList에서 해당 노트를 본다
  Then 노트 항목 아래에 "react", "hooks" 뱃지가 표시된다

Scenario: 태그가 없는 노트는 뱃지 영역이 없다
  Given 노트에 tags: []가 저장되어 있다
  When NoteList에서 해당 노트를 본다
  Then 뱃지 영역이 표시되지 않는다

Scenario: 뱃지는 클릭할 수 없다
  Given NoteList에 태그 뱃지가 표시되어 있다
  When 뱃지를 클릭한다
  Then 아무 동작도 발생하지 않는다 (삭제 버튼 없음)
```

---

## 이슈 의존성 및 구현 순서

```
#1 태그 추가 + 저장 (타입 → API → 훅 → UI → 저장, 전 레이어 관통)
 ├── #2 태그 삭제 + 저장 (#1의 훅·UI 확장)
 └── #3 NoteList 뱃지 표시 (#1 이후 독립 진행 가능)
```

| 이슈 | 선행 이슈 | 병렬 가능 |
| ---- | --------- | --------- |
| #1   | 없음      | -         |
| #2   | #1        | #3과 병렬 |
| #3   | #1        | #2와 병렬 |
