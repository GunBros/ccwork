---
name: tdd-red
description: >
  승인된 테스트 시나리오(docs/features/tag/issue-{N}.md)를 실패하는 테스트 코드로 변환하는
  TDD Red 단계 스킬. /tdd-red {이슈번호}로 호출한다.
  '테스트 코드 작성', 'Red 단계', '실패 테스트 만들어줘', 'TDD 시작', '테스트 먼저 작성' 등을
  언급할 때도 이 스킬을 사용한다. 구현 코드는 절대 건드리지 않고, 오직 테스트 파일만 생성한다.
---

# TDD Red — 실패 테스트 작성

이 스킬은 TDD의 Red 단계를 수행한다. 이슈 문서에 정의된 시그니처와 테스트 시나리오를
Vitest + React Testing Library 테스트 코드로 변환하되, 구현 코드는 아직 없으므로
모든 테스트가 실패하는 것이 정상이다.

## 입력

`$ARGUMENTS`로 이슈 번호를 받는다. 예: `/tdd-red 1` → issue-1.md를 처리한다.

## 실행 순서

### 1단계: 이슈 문서 읽기

`docs/features/tag/issue-$ARGUMENTS.md`를 읽고 다음을 파악한다:

- **확정 시그니처**: 테스트 대상의 import 경로, 함수/컴포넌트 이름, 파라미터, 반환 타입
- **테스트 시나리오 표**: 시나리오 번호, 분류(정상/경계/예외), 시나리오 설명

### 2단계: 테스트 파일 생성

시나리오 표의 테스트 대상별로 테스트 파일을 생성한다.

#### 파일 위치 규칙

테스트 파일은 테스트 대상과 같은 디렉토리에 둔다:

| 테스트 대상                     | 테스트 파일                          |
| ------------------------------- | ------------------------------------ |
| `src/hooks/useTagEditor.ts`     | `src/hooks/useTagEditor.test.ts`     |
| `src/components/TagInput.tsx`   | `src/components/TagInput.test.tsx`   |
| `src/components/NoteEditor.tsx` | `src/components/NoteEditor.test.tsx` |
| `src/api/notes.ts`              | `src/api/notes.test.ts`              |

#### 테스트 코드 구조

```ts
import { describe, it, expect } from 'vitest';

describe('테스트대상이름', () => {
  // 시나리오 표의 설명을 그대로 테스트 이름으로 사용
  it('should [기대 동작] when [조건]', () => {
    // 테스트 코드
  });
});
```

- `describe` 블록: 함수 또는 컴포넌트 단위로 묶는다.
  하위 함수가 있으면 중첩 describe를 사용한다.
  예) `describe('useTagEditor', () => { describe('addTag', () => { ... }) })`
- `it` 블록: 이슈 문서의 시나리오 설명을 테스트 이름으로 사용한다.
  시나리오 설명이 `addTag — should add tag to list when valid tag is provided` 형식이면
  describe가 이미 함수명을 감싸므로 `it('should add tag to list when valid tag is provided', ...)` 로 작성한다.

#### 훅 테스트 패턴

```ts
import { renderHook, act } from '@testing-library/react';
import { useTagEditor } from './useTagEditor';

describe('useTagEditor', () => {
  it('should initialize with empty tags when no initialTags provided', () => {
    const { result } = renderHook(() => useTagEditor());
    expect(result.current.tags).toEqual([]);
  });

  describe('addTag', () => {
    it('should add tag to list when valid tag is provided', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => {
        result.current.addTag('react');
      });
      expect(result.current.tags).toContain('react');
    });
  });
});
```

#### 컴포넌트 테스트 패턴

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  it('should render tag badges when tags are provided', () => {
    render(<TagInput tags={['react', 'vue']} onAddTag={() => true} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('vue')).toBeInTheDocument();
  });
});
```

- `userEvent`를 사용할 수 있으면 `fireEvent`보다 우선한다.
  단, 키보드 이벤트(Enter, 쉼표 등)는 `fireEvent.keyDown`이 더 명확할 수 있다.
- NoteEditor 통합 테스트처럼 Context가 필요한 경우 `NotesContext.Provider`로 감싸거나,
  API 모듈을 `vi.mock`으로 모킹한다.

### 3단계: 개별 실행 및 실패 확인

테스트 파일을 하나 작성할 때마다 해당 파일만 실행한다:

```bash
npx vitest run src/hooks/useTagEditor.test.ts
```

- 모든 테스트가 **FAIL**인지 확인한다 (구현이 없으므로 import 에러 또는 assertion 실패).
- 만약 테스트가 통과하면 테스트가 의미 있는 assertion을 하고 있는지 재검토한다.

### 4단계: 전체 실행

모든 테스트 파일 작성이 끝나면 전체 테스트를 실행한다:

```bash
npm test
```

- 이번 이슈에서 작성한 테스트가 모두 실패하는지 확인한다.
- 기존 테스트가 있다면 기존 테스트는 통과해야 한다(기존 코드를 건드리지 않았으므로).

### 5단계: 결과 보고

사용자에게 다음을 보고한다:

- 생성한 테스트 파일 목록
- 시나리오별 실패 현황 (총 N개 테스트, N개 실패)
- 예상과 다른 결과가 있으면 해당 내용 설명

## 제약 사항

- **테스트 파일만 생성/수정한다.** `src/`의 구현 코드(`.ts`, `.tsx`)는 절대 수정하지 않는다.
  이 제약의 이유: Red 단계는 "아직 구현이 없는 상태에서 테스트가 실패함"을 확인하는 것이
  목적이다. 구현을 건드리면 Red-Green 경계가 무너진다.
- 테스트 코드에서 import하는 모듈이 존재하지 않아도 괜찮다.
  존재하지 않는 모듈을 import하면 Vitest가 모듈 해석 에러로 실패하며, 이것이 Red 단계의
  정상 동작이다.
- 이슈 문서에 정의되지 않은 시나리오를 임의로 추가하지 않는다.
