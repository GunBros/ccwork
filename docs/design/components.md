# 컴포넌트 스펙

> 색상값은 `docs/design/tokens.md` 참조.

---

## 버튼

| 종류             | 배경                                         | 텍스트                  | 테두리 | 모서리     |
| ---------------- | -------------------------------------------- | ----------------------- | ------ | ---------- |
| Primary          | `tertiary` → `tertiary_container` 그라디언트 | `on_tertiary` (#faf8ff) | 없음   | `0.375rem` |
| Secondary        | `surface_container_high` (#e2e9ec)           | `on_surface` (#2b3437)  | 없음   | `0.375rem` |
| Ghost (Tertiary) | 없음                                         | `tertiary` (#0053dc)    | 없음   | —          |

- **Primary CTA 그라디언트**: `linear-gradient(to right, #0053dc, #3e76fe)` — 보석처럼 깊이감 부여
- **Ghost 버튼 hover**: 배경에 `tertiary` 색상 **2% 불투명도** 적용

---

## 카드 & 리스트

- **카드 배경**: `surface_container_lowest` (#ffffff) → Tonal Layering으로 부유감 표현
- **리스트 아이템 구분**: 구분선(`divide-*`) 없음. `spacing.4` (1.4rem) 간격으로만 구분
- **hover 상태**: 배경 `surface` → `surface_container_low` (#f1f4f6) 전환

```
카드: bg-white (surface_container_lowest)
리스트 래퍼: bg-[#eaeff1] (surface_container) + gap-[1.4rem]
hover: bg-[#f1f4f6] (surface_container_low)
```

---

## 인풋 필드

- **기본 배경**: `surface_container_lowest` (#ffffff)
- **기본 테두리**: Ghost Border (1px, `outline_variant` #abb3b7 at 15% opacity)
- **포커스 테두리**: `1px solid tertiary` (#0053dc)로 전환
- **레이블**: `label-md` 스타일, 인풋 위에 `spacing.1` (0.35rem) 간격으로 배치

```css
/* 기본 */
border: 1px solid rgba(171, 179, 183, 0.15);
background: #ffffff;

/* 포커스 */
border: 1px solid #0053dc;
```

---

## Knowledge Token (태그 칩)

주제 태그(`#javascript`, `#design` 등)에 사용.

- **배경**: `surface_container_highest` (#dbe4e7)
- **텍스트**: `on_surface_variant` (#586064)
- **모서리**: `full` (완전한 pill 형태, `border-radius: 9999px`)
- **테두리**: 없음

```
bg-[#dbe4e7] text-[#586064] rounded-full px-3 py-1 text-xs
```

---

## Do / Don't

|           | 규칙                                                   |
| --------- | ------------------------------------------------------ |
| **Do**    | 리스트 아이템 간격은 `spacing.4` (1.4rem) gap으로 구분 |
| **Do**    | 카드에 `surface_container_lowest` (#ffffff) 배경 사용  |
| **Don't** | 리스트에 `divide-y`, `divide-x` 클래스 사용 금지       |
| **Don't** | Primary 버튼에 단색 배경 사용 금지 — 그라디언트 필수   |
