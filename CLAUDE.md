# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

React 19 + TypeScript + Vite 기반 노트 앱 실습 프로젝트. JSON Server를 백엔드 목(mock) API로 사용한다.

- 앱: http://localhost:5173
- API: http://localhost:3001/notes

## 명령어

```bash
npm run dev        # Vite(5173) + JSON Server(3001) 동시 실행
npm run build      # tsc + vite build
npm run lint       # ESLint 자동 수정
npm run format     # Prettier 포맷
npm test           # Vitest 단일 실행
npm run test:watch # Vitest 감시 모드
```

단일 테스트 실행:
```bash
npx vitest run src/components/NoteEditor.test.tsx
```

## 아키텍처

### 데이터 흐름

```
App (선택 상태 관리: selectedNoteId, isCreating)
 └── NotesProvider (notes[], loading, error + CRUD 메서드)
      ├── NoteList   → useNotes() → 목록 표시
      └── NoteEditor → useNotes() → 생성/편집
```

- **UI 상태** (`selectedNoteId`, `isCreating`): `App.tsx`가 직접 보유하고 props로 전달
- **서버 상태** (노트 목록 + CRUD): `NotesContext`가 관리하고 `useNotes()` 훅으로 소비

### 레이어 분리

| 레이어 | 위치 | 역할 |
|--------|------|------|
| 타입 | `src/types/note.ts` | `Note` 인터페이스 단일 정의 |
| API | `src/api/notes.ts` | fetch 래핑, `createdAt`/`updatedAt` 자동 주입 |
| Context | `src/context/NotesContext.tsx` | API 호출 + 로컬 상태 동기화 |
| 컴포넌트 | `src/components/` | UI만 담당, 비즈니스 로직 없음 |

### Note 타입

```ts
interface Note {
  id: string
  title: string
  content: string
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
  // tags 필드는 미구현 — 강의에서 추후 추가 예정
}
```

### 데이터 저장소

`db.json`이 JSON Server의 영구 저장소. `notes` 배열을 직접 수정해도 된다.

## 구현 패턴

### 컴포넌트

- **named export** 사용 (`export function Foo`, default export 없음)
- Props 타입은 컴포넌트 파일 내부에 `ComponentNameProps` 인터페이스로 정의
- 함수 시그니처에서 바로 구조분해: `function NoteList({ selectedNoteId, onSelect }: NoteListProps)`
- 조건부 조기 반환(early return) 패턴으로 로딩/에러/빈 상태 처리 후 메인 JSX 반환

### 상태 관리

- **UI 상태** (선택/편집 모드): `App.tsx`의 `useState`로 보유, props로 하위 전달
- **서버 상태** (노트 목록 CRUD): `NotesContext`에서 `useState`로 보유, `useNotes()` 훅으로만 소비
- 비동기 작업(저장 등) 중 로컬 `saving` 상태를 컴포넌트 내부에 별도 선언
- Context에서 낙관적 업데이트 패턴: API 호출 결과로 로컬 배열을 직접 갱신
  - 추가: `setNotes(prev => [...prev, newNote])`
  - 수정: `setNotes(prev => prev.map(n => n.id === id ? updated : n))`
  - 삭제: `setNotes(prev => prev.filter(n => n.id !== id))`

### API 호출

- `src/api/notes.ts`는 순수 fetch 래퍼. Context나 컴포넌트 로직 없음
- `createNote` / `updateNote`에서 `createdAt` / `updatedAt` 타임스탬프를 API 레이어에서 주입
- 컴포넌트에서 API 에러는 `try/catch/finally`로 처리하고 `alert()`로 표시
- 컴포넌트에서 API 에러는 `try/catch`로 잡고 `console.error()`로만 기록 (`alert` 사용 금지)
- Context 초기 로드 에러는 `error` state로 저장하여 컴포넌트에 전달

### 네이밍

| 패턴 | 규칙 | 예시 |
|------|------|------|
| 이벤트 핸들러 | `handle` prefix | `handleSave`, `handleSelectNote` |
| 이벤트 props | `on` prefix | `onSelect`, `onDelete`, `onDone` |
| boolean props/state | `is` prefix | `isSelected`, `isCreating` |
| API 함수 | HTTP 동사 스타일 | `fetchNotes`, `createNote`, `updateNote`, `deleteNote` |
| Context 메서드 | API와 동일한 동사 | `createNote`, `updateNote`, `deleteNote` |

## 일관성 주의 사항

1. **스타일링 방식 불일치**: 대부분 Tailwind 유틸리티 클래스만 사용하지만, `Layout.tsx`에서 Tailwind로 표현 불가한 경우 인라인 `style` 병용(`fontFamily`, `calc(100vh - 65px)`).

## 코딩 규칙 (.prettierrc 기준)

- 세미콜론: **있음** (`"semi": true`)
- 따옴표: 싱글 쿼트
- 들여쓰기: 2칸
- 줄 길이: 100자
- trailing comma: all

## 테스트 환경

- Vitest + jsdom + React Testing Library
- 전역 설정: `src/test-setup.ts` (`@testing-library/jest-dom` 임포트)
- `vitest.config`은 별도 파일 없이 `vite.config.ts`의 `test` 필드에 통합
