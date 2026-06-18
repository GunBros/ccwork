다음 파일들을 읽어라:

- docs/design/tokens.md
- docs/design/components.md
- docs/design/typography.md
- docs/design/rules.md

그런 다음 **$ARGUMENTS** 컴포넌트를 디자인 시스템 기준으로 스타일링해줘.

요구사항:

1. Tailwind 유틸리티 클래스 사용 (프로젝트 표준)
2. 토큰명과 실제 HEX 값을 주석으로 함께 표시 (예: `{/* surface_container_lowest: #ffffff */}`)
3. rules.md의 Don't 항목을 위반하지 않도록 주의
4. hover/focus 상태도 디자인 시스템 기준으로 포함
5. 컴포넌트 구조(JSX 뼈대)도 함께 제안

출력 형식: TSX 코드 블록 + 사용된 토큰 목록
