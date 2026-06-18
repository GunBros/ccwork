# 타이포그래피

> 폰트: **Inter** 단독 사용. 크기와 굵기 조합으로 위계를 만든다.

---

## 타이포 스케일

| 스케일        | 크기      | 용도               | 색상                 | 비고                                    |
| ------------- | --------- | ------------------ | -------------------- | --------------------------------------- |
| `display-lg`  | `3.5rem`  | 랜딩 첫 화면 전용  | `on_surface`         | letter-spacing: `-0.02em`               |
| `headline-md` | `1.75rem` | TIL 항목 제목      | `on_surface`         | line-height: `1.4`                      |
| `body-lg`     | `1rem`    | 본문 내용          | `on_surface_variant` | 강조 시 `on_surface` 전환               |
| `label-md`    | `0.75rem` | 메타데이터, 레이블 | `on_surface_variant` | `uppercase` + letter-spacing: `+0.05em` |

---

## 사용 규칙

- **장문 가독성**: `body-lg`에 `on_surface_variant` (#586064) 사용 → 눈의 피로 감소
- **강조**: `on_surface` (#2b3437)로 전환
- **레이블**: 반드시 `uppercase` + `+0.05em` 자간으로 내러티브 텍스트와 시각적 구분
- **`display-lg`** 는 랜딩 첫 화면 전용. 카드 제목에 남용 금지

## Do / Don't

|           | 규칙                                                                 |
| --------- | -------------------------------------------------------------------- |
| **Do**    | 메타데이터 레이블은 반드시 `uppercase` + `+0.05em` 자간 적용         |
| **Do**    | TIL 제목(`headline-md`)에 `line-height: 1.4` 적용                    |
| **Don't** | `display-lg`를 카드 제목 등 일반 위치에 사용 금지                    |
| **Don't** | 텍스트에 순수 검정 `#000000` 사용 금지 → `on_surface` (#2b3437) 사용 |
