---
name: mermaid-diagram
description: React/TypeScript 프로젝트의 src/ 디렉토리를 분석해서 컴포넌트 의존성과 상태 흐름을 Mermaid.js 다이어그램으로 시각화하고 docs/architecture/index.html을 생성한다. "프로젝트 구조 보여줘", "아키텍처 다이어그램 만들어줘", "컴포넌트 관계 시각화", "의존성 그래프", "mermaid 다이어그램" 같은 요청에 반드시 이 스킬을 사용한다. 코드베이스 구조 파악이나 온보딩 목적으로도 적극 사용한다.
---

# mermaid-diagram

src/ 디렉토리를 분석해서 컴포넌트 의존성과 상태 흐름을 Mermaid.js 다이어그램으로 시각화하고, 브라우저에서 바로 확인할 수 있는 HTML 파일을 생성한다.

## 실행 순서

### 1단계: src/ 분석

Glob으로 `src/**/*.{ts,tsx}` 파일 목록을 수집한 뒤, 각 파일을 Read해서 다음을 추출한다:

- **import 문**: 어떤 파일이 어떤 모듈/컴포넌트를 가져오는지
- **JSX 렌더링 관계**: 어떤 컴포넌트가 어떤 컴포넌트를 렌더링하는지
- **props 전달**: 부모→자식으로 내려가는 상태값과 콜백 (`onXxx`, `isXxx`)
- **useContext/커스텀 훅**: Context를 소비하는 컴포넌트 식별
- **외부 API 호출**: fetch 대상 URL이나 서버 정보

### 2단계: 두 개의 Mermaid 다이어그램 설계

**다이어그램 1 — 컴포넌트 의존성 그래프** (`graph TD`)

렌더링 포함 관계와 import 관계를 시각화한다. 노드를 레이어로 그룹화(subgraph)하면 구조가 명확해진다:
- 진입점 레이어: main, App
- Provider/Context 레이어
- 컴포넌트 레이어
- API/데이터 레이어
- 외부 시스템 (JSON Server, REST API 등)

화살표 레이블로 관계의 성격을 표현한다 (renders, imports, useNotes() 등).

**다이어그램 2 — 상태 흐름** (`flowchart TD`)

데이터가 어떻게 흐르는지를 시각화한다:
- UI 상태 (useState): 어디서 선언되고 어떻게 props로 전달되는지
- 서버 상태 (Context): 어디서 관리되고 어떤 훅으로 소비되는지
- CRUD 흐름: 컴포넌트 → Context 메서드 → API → 외부 서버
- 낙관적 업데이트 같은 중요한 패턴은 화살표 레이블로 명시

`flowchart LR` 대신 `flowchart TD`를 사용한다. LR은 subgraph 간 cross-연결이 많을 때 레이아웃이 깨지기 쉽다.

### 3단계: HTML 파일 생성

`docs/architecture/` 디렉토리가 없으면 먼저 생성한다:
```bash
mkdir -p docs/architecture
```

`docs/architecture/index.html`을 Write 도구로 생성한다. HTML 구성 요소:

- **Mermaid.js CDN**: `https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`
- **탭 UI**: 다이어그램 1(의존성)과 다이어그램 2(상태 흐름) 전환
- **헤더**: 프로젝트 이름, 생성 날짜
- **각 다이어그램 아래 설명**: 읽는 법을 한두 줄로 안내
- **스타일**: 깔끔한 타이포그래피, 충분한 여백

```html
<!-- 기본 구조 참고 -->
<!DOCTYPE html>
<html>
<head>
  <title>Architecture - [프로젝트명]</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>
  <!-- 탭 네비게이션 -->
  <!-- 탭 1: 컴포넌트 의존성 -->
  <!-- 탭 2: 상태 흐름 -->
  <script>
    // startOnLoad: false — 숨겨진 탭의 다이어그램은 display:none 상태에서
    // 크기 계산이 불가능해 렌더링이 실패하므로, 탭 전환 시점에 직접 렌더링한다.
    mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });

    async function switchTab(name) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      const tab = document.getElementById('tab-' + name);
      tab.classList.add('active');
      event.target.classList.add('active');

      // 아직 렌더링되지 않은 다이어그램만 그린다
      const unrendered = tab.querySelectorAll('.mermaid:not([data-processed="true"])');
      if (unrendered.length > 0) {
        await mermaid.run({ nodes: Array.from(unrendered) });
      }
    }

    // 페이지 로드 시 첫 번째 탭만 렌더링
    document.addEventListener('DOMContentLoaded', async () => {
      const first = document.querySelectorAll('.tab-content.active .mermaid');
      await mermaid.run({ nodes: Array.from(first) });
    });
  </script>
</body>
</html>
```

### 4단계: 브라우저 오픈

OS에 맞는 명령으로 바로 브라우저를 연다:

```bash
# Windows
start docs/architecture/index.html

# macOS
open docs/architecture/index.html

# Linux
xdg-open docs/architecture/index.html
```

현재 OS를 모른다면 Bash로 `uname -s` 또는 `echo $OS` 로 확인한 뒤 실행한다. Windows 환경에서는 `$OS` 변수가 `Windows_NT`로 설정되어 있다.

## 품질 기준

좋은 다이어그램은 처음 보는 사람도 30초 안에 전체 구조를 파악할 수 있어야 한다:

- 노드가 10개 이상이면 `subgraph`로 레이어를 묶어 가독성을 높인다
- 화살표 레이블은 "왜 연결되어 있는지"를 전달하는 단어를 쓴다
- 테스트 파일, 타입 정의 파일은 별도 그룹이나 생략으로 처리해 핵심 구조를 강조한다
- Mermaid 노드 이름에 슬래시(`/`), 점(`.`), 괄호가 들어가면 따옴표로 감싼다

## 주의사항

- 기존 `docs/architecture/index.html`이 있으면 덮어쓰기 전 사용자에게 확인한다
- 분석 중 파악한 핵심 아키텍처 패턴(낙관적 업데이트, Context 분리 등)을 HTML 설명에 간략히 언급하면 문서로서의 가치가 높아진다

### Mermaid 렌더링 오류 체크리스트

1. **숨겨진 탭 문제** (가장 흔한 원인): `startOnLoad: true`로 설정하면 `display: none` 상태의 탭은 크기 계산이 불가능해 렌더링 실패. 반드시 `startOnLoad: false` + 탭 전환 시 `mermaid.run()` 호출 패턴을 사용한다.
2. **특수문자**: subgraph 레이블에 `/`, `.`, `—`(em dash) 사용 금지. 노드 레이블은 `["..."]` 따옴표 안에서는 대부분 허용되나, `[]`, `()` 는 파서를 혼란시킬 수 있으므로 피한다.
3. **방향 선택**: `flowchart LR`은 subgraph 간 cross-연결이 많을 때 레이아웃이 깨지기 쉬우므로 `flowchart TD`를 사용한다.
4. **노드 ID 충돡**: 서로 다른 subgraph에 같은 ID를 쓰지 않는다. ID는 고유하게, 레이블로 표시명을 구분한다.
