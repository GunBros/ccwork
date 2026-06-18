# 디자인 시스템: The Digital Atelier — 개요

> 스타일 작업 시 `/ds-component`, `/ds-token`, `/ds-check` 스킬을 활용한다.

---

## 크리에이티브 방향성: The Curated Archive

**Soft Minimalism** 철학. 콘텐츠를 딱딱한 경계 박스에 가두지 않고, 정교한 중립 톤 레이어 위에 '부유'시킨다. UI가 콘텐츠와 경쟁하지 않도록 타이포그래피가 숨 쉴 공간을 확보하는 것이 최우선이다.

**3가지 핵심 원칙:**

1. **No-Line 규칙** — 영역 구분에 border 사용 금지. 오직 배경색 전환으로 경계 표현
2. **Tonal Layering** — 카드 깊이는 그림자가 아닌 배경색 차이(`surface_container_lowest` on `surface_container`)로 표현
3. **Spacing 리듬** — 기준 단위 `1.4rem`. 간격이 부족하면 줄이지 말고 늘릴 것

---

## 파일 맵

| 작업                    | 스킬 / 파일                 |
| ----------------------- | --------------------------- |
| 컴포넌트 스타일 생성    | `/ds-component [이름]`      |
| 색상/스페이싱 토큰 조회 | `/ds-token [키워드]`        |
| 규칙 준수 검토          | `/ds-check`                 |
| 색상 토큰 상세 참조     | `docs/design/tokens.md`     |
| 타이포그래피            | `docs/design/typography.md` |
| 레이어링/그림자         | `docs/design/elevation.md`  |
| 컴포넌트 스펙           | `docs/design/components.md` |
| Do/Don't 규칙           | `docs/design/rules.md`      |
