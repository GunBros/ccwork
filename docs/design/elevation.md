# 엘리베이션 & 깊이

> 깊이는 그림자가 아니라 **배경색 차이**로 표현한다.

---

## Tonal Layering (기본 방식)

일반 카드에 `box-shadow`를 사용하지 않는다. 배경색 차이로 '종이가 겹쳐진' 효과를 낸다.

```
surface_container_lowest (#ffffff) 카드    ← 위 (밝음)
─────────────────────────────────────────
surface_container (#eaeff1) 섹션 배경      ← 아래 (어두움)
```

→ 색상 차이만으로 카드가 '부유'하는 것처럼 보인다.

---

## Ambient Shadow (플로팅 요소 전용)

모달, 팝오버 등 실제로 레이아웃 위에 뜨는 요소에만 사용한다.

- blur: `24px ~ 40px`
- opacity: `on_surface` (#2b3437)의 **6%**
- 색상: 그림자에 `tertiary` 색상을 살짝 혼합하여 팔레트 통일감 유지

---

## Ghost Border (접근성 폴백)

유사한 배경색끼리 맞닿아 대비가 부족할 때만 사용한다.

- `outline_variant` (#abb3b7)을 **15% 불투명도**로 적용
- 선이 아니라 '선의 암시'처럼 보여야 한다

---

## Glassmorphism (플로팅 오버레이)

모달, 드롭다운 등 유리 효과가 필요한 경우:

- 배경: `surface` (#f8f9fa) **80% 불투명도**
- `backdrop-filter: blur(12px)`

---

## Do / Don't

|           | 규칙                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| **Do**    | 카드 깊이는 Tonal Layering(`surface_container_lowest` on `surface_container`)으로 표현 |
| **Do**    | 실제 플로팅 요소(모달, 팝오버)에만 Ambient Shadow 적용                                 |
| **Don't** | 일반 카드에 `shadow-sm`, `shadow-md`, `shadow-lg` 사용 금지                            |
| **Don't** | 기본 CSS `box-shadow` 사용 금지 — "엔지니어드" 느낌으로 디자인 품질 저하               |
