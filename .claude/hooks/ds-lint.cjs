#!/usr/bin/env node
// PostToolUse 훅: Edit/Write 후 디자인 시스템 위반 패턴 자동 감지
// 감지 기준: docs/design/rules.md
// CommonJS (.cjs) — package.json "type":"module" 환경에서 require() 사용을 위해 .cjs 확장자 사용

const fs = require('fs');

let input = '';
process.stdin.on('data', chunk => (input += chunk));
process.stdin.on('end', () => {
  let toolInput = {};
  try {
    const parsed = JSON.parse(input);
    toolInput = parsed.tool_input || {};
  } catch {
    process.exit(0);
  }

  const filePath = toolInput.file_path || '';

  // src/ 파일만 검사 (문서, 설정 파일 제외)
  if (!filePath.includes('/src/') && !filePath.includes('\\src\\')) {
    process.exit(0);
  }

  // .tsx, .ts, .css 파일만 검사
  if (!/\.(tsx?|css)$/.test(filePath)) {
    process.exit(0);
  }

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    process.exit(0);
  }

  const violations = [];

  // DS-001: 순수 검정 금지 (text-black 또는 #000000)
  if (/text-black|#000000/.test(content)) {
    violations.push('[DS-001] 순수 검정 감지 (text-black / #000000) → on_surface (#2b3437) 사용');
  }

  // DS-002: 일반 shadow 클래스 금지
  if (/\bshadow-(?:sm|md|lg|xl|2xl)\b/.test(content)) {
    violations.push('[DS-002] 일반 shadow 클래스 감지 → Tonal Layering 사용. 플로팅 요소에만 Ambient Shadow 허용');
  }

  // DS-003: 리스트 구분선 금지 (divide 클래스)
  if (/\bdivide-/.test(content)) {
    violations.push('[DS-003] divide 클래스 감지 → 리스트 구분선 금지. gap-[1.4rem] (spacing.4) 간격으로 대체');
  }

  // DS-004: 인라인 solid border 금지
  if (/border\s*:\s*['"]?\d+px\s+solid/.test(content)) {
    violations.push('[DS-004] 인라인 solid border 감지 → No-Line 규칙: 배경색 전환으로 구분. 접근성 필요 시 Ghost Border(opacity 15%)만 허용');
  }

  // DS-005: map의 두 번째 파라미터(index)를 key로 사용하는 패턴 감지
  // .map((item, index) => ...) 에서 인덱스 변수명을 추출한 뒤 key={변수명} 여부 확인
  const mapIndexNames = new Set();
  const mapParamPattern = /\.map\(\s*\(?\s*[\w$]+\s*,\s*([\w$]+)\s*\)?/g;
  let mapMatch;
  while ((mapMatch = mapParamPattern.exec(content)) !== null) {
    mapIndexNames.add(mapMatch[1]);
  }
  for (const idxName of mapIndexNames) {
    if (new RegExp(`key=\\{${idxName}\\}`).test(content)) {
      violations.push(
        `[DS-005] map의 index(${idxName})를 key로 사용 금지 → 고유 식별자(item.id 등) 사용`
      );
      break;
    }
  }

  if (violations.length > 0) {
    const srcIndex = Math.max(filePath.lastIndexOf('/src/'), filePath.lastIndexOf('\\src\\'));
    const relativePath = srcIndex >= 0 ? 'src/' + filePath.slice(srcIndex + 5).replace(/\\/g, '/') : filePath;
    console.log('');
    console.log(`DS-Lint: 디자인 시스템 위반 감지 — ${relativePath}`);
    violations.forEach(v => console.log(`  ${v}`));
    console.log('  상세 규칙: docs/design/rules.md | 수동 검토: /ds-check');
    console.log('');
  }

  process.exit(0);
});
