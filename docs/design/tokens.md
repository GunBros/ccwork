# 디자인 토큰 — 단일 진실 원천

> 모든 색상과 스페이싱 값은 이 파일에서 정의한다. 다른 파일은 이 파일의 토큰명을 참조한다.

---

## 색상 토큰

| 토큰명                      | HEX       | 용도                                            |
| --------------------------- | --------- | ----------------------------------------------- |
| `background`                | `#f8f9fa` | 기본 캔버스 (`surface`와 동일)                  |
| `surface`                   | `#f8f9fa` | 1차 레이어                                      |
| `surface_container_lowest`  | `#ffffff` | 최상위 카드, 활성 작업 영역 (lifted paper 효과) |
| `surface_container_low`     | `#f1f4f6` | 사이드바, 내비게이션 배경                       |
| `surface_container`         | `#eaeff1` | 2차 섹션 배경                                   |
| `surface_container_high`    | `#e2e9ec` | Secondary 버튼 배경                             |
| `surface_container_highest` | `#dbe4e7` | 선택 상태 (사이드바), Knowledge Token 배경      |
| `on_surface`                | `#2b3437` | 기본 텍스트, 강조 텍스트                        |
| `on_surface_variant`        | `#586064` | 본문 텍스트, 메타데이터                         |
| `outline_variant`           | `#abb3b7` | Ghost Border 기준색 (15% 불투명도로 사용)       |
| `tertiary`                  | `#0053dc` | Primary 액션, 포커스 테두리, Ghost 버튼 텍스트  |
| `tertiary_container`        | `#3e76fe` | Primary 버튼 그라디언트 끝 색상                 |
| `on_tertiary`               | `#faf8ff` | Primary 버튼 텍스트                             |

---

## 서피스 계층 구조

물리적 레이어를 쌓듯이 깊이를 표현한다. 위로 갈수록 더 밝다.

```
surface_container_lowest (#ffffff)  ← 최상단: 카드, 활성 영역
surface_container_low   (#f1f4f6)  ← 사이드바, 내비게이션
surface / background    (#f8f9fa)  ← 기본 캔버스
surface_container       (#eaeff1)  ← 섹션 배경
surface_container_high  (#e2e9ec)  ← Secondary 버튼
surface_container_highest (#dbe4e7) ← 선택 상태, 태그 칩
```

---

## 스페이싱 토큰

**기준 단위: `1.4rem` (spacing.4)**

| 토큰         | 값        | 주요 용도                      |
| ------------ | --------- | ------------------------------ |
| `spacing.1`  | `0.35rem` | 레이블 ↔ 인풋 간격             |
| `spacing.2`  | `0.7rem`  | 제목 ↔ 본문 간격               |
| `spacing.4`  | `1.4rem`  | 리스트 아이템 간격 (기본 리듬) |
| `spacing.10` | `3.5rem`  | 레이아웃 블록 간 대형 여백     |

`spacing.10`의 대형 여백이 디자인의 '대기(Atmospheric)' 품질을 만든다.
