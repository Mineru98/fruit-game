import { mkdir, writeFile, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const deckDir = path.join(root, 'decks', 'vibe-coding-2026');
const assetsDir = path.join(deckDir, 'assets');

const palette = {
  bg: '#05070d',
  panel: '#0d1321',
  panelAlt: '#111a2b',
  text: '#f5f7ff',
  muted: '#9aa7c7',
  primary: '#4f7dff',
  primarySoft: '#86a7ff',
  cyan: '#67d5ff',
  line: 'rgba(122, 154, 255, 0.24)',
  danger: '#ff6b6b',
  success: '#71f5b1',
  warning: '#ffd166',
};

const deckMeta = {
  title: '바이브 코딩, 문서화, 그리고 Harness Engineering',
  subtitle: 'Claude Code로 게임을 완성한 2일짜리 실험',
  speaker: '임근석',
  companies: '쓸모랩 · 우리기획',
  date: '2026년 4월 17일',
};

const customSvgAssets = {
  'vibe-signal.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" x2="1">
      <stop offset="0%" stop-color="#05070d"/>
      <stop offset="100%" stop-color="#0b1120"/>
    </linearGradient>
    <linearGradient id="line" x1="0" x2="1">
      <stop offset="0%" stop-color="#4f7dff"/>
      <stop offset="100%" stop-color="#67d5ff"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feColorMatrix in="blur" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -8"/>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <g stroke="rgba(255,255,255,0.08)" fill="none">
    <path d="M0 160H1280"/>
    <path d="M0 360H1280"/>
    <path d="M0 560H1280"/>
    <path d="M180 0V720"/>
    <path d="M500 0V720"/>
    <path d="M820 0V720"/>
    <path d="M1140 0V720"/>
  </g>
  <g filter="url(#glow)">
    <path d="M140 530C300 520 360 360 470 345C575 330 593 450 710 450C830 450 875 205 1030 200C1125 197 1180 250 1210 280" fill="none" stroke="url(#line)" stroke-width="10" stroke-linecap="round"/>
  </g>
  <g fill="#4f7dff">
    <circle cx="470" cy="345" r="16"/>
    <circle cx="710" cy="450" r="16"/>
    <circle cx="1030" cy="200" r="16"/>
  </g>
  <g fill="#f5f7ff" font-family="Pretendard, sans-serif">
    <text x="138" y="580" font-size="26" opacity="0.8">2025.02</text>
    <text x="430" y="300" font-size="28" font-weight="700">Karpathy tweet</text>
    <text x="670" y="500" font-size="28" font-weight="700">Vibe coding practice</text>
    <text x="935" y="160" font-size="28" font-weight="700">Game project</text>
  </g>
</svg>`,
  'skills-assembly-line.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g1" x1="0" x2="1">
      <stop offset="0%" stop-color="#4f7dff"/>
      <stop offset="100%" stop-color="#67d5ff"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="#07101b"/>
  <g fill="none" stroke="rgba(122,154,255,0.18)">
    <rect x="70" y="120" width="1140" height="460" rx="30"/>
    <path d="M160 350H1120" stroke-width="6"/>
  </g>
  <g font-family="Pretendard, sans-serif">
    <g>
      <rect x="120" y="210" width="160" height="160" rx="22" fill="#121d30" stroke="rgba(122,154,255,0.3)"/>
      <text x="145" y="255" fill="#86a7ff" font-size="22">STEP 1</text>
      <text x="145" y="305" fill="#f5f7ff" font-size="34" font-weight="700">기획</text>
      <text x="145" y="340" fill="#9aa7c7" font-size="18">장르 / 목표 / 범위</text>
    </g>
    <g>
      <rect x="330" y="210" width="160" height="160" rx="22" fill="#121d30" stroke="rgba(122,154,255,0.3)"/>
      <text x="355" y="255" fill="#86a7ff" font-size="22">STEP 2</text>
      <text x="355" y="305" fill="#f5f7ff" font-size="34" font-weight="700">설계</text>
      <text x="355" y="340" fill="#9aa7c7" font-size="18">문서 / 구조 / 역할</text>
    </g>
    <g>
      <rect x="540" y="210" width="200" height="160" rx="22" fill="#13233d" stroke="#4f7dff"/>
      <text x="565" y="255" fill="#86a7ff" font-size="22">STEP 3</text>
      <text x="565" y="305" fill="#f5f7ff" font-size="34" font-weight="700">SKILLS</text>
      <text x="565" y="340" fill="#9aa7c7" font-size="18">문서화된 실행 방식</text>
    </g>
    <g>
      <rect x="790" y="210" width="160" height="160" rx="22" fill="#121d30" stroke="rgba(122,154,255,0.3)"/>
      <text x="815" y="255" fill="#86a7ff" font-size="22">STEP 4</text>
      <text x="815" y="305" fill="#f5f7ff" font-size="34" font-weight="700">구현</text>
      <text x="815" y="340" fill="#9aa7c7" font-size="18">병렬 / 자동화</text>
    </g>
    <g>
      <rect x="1000" y="210" width="160" height="160" rx="22" fill="#121d30" stroke="rgba(122,154,255,0.3)"/>
      <text x="1025" y="255" fill="#86a7ff" font-size="22">STEP 5</text>
      <text x="1025" y="305" fill="#f5f7ff" font-size="34" font-weight="700">검증</text>
      <text x="1025" y="340" fill="#9aa7c7" font-size="18">리뷰 / 테스트</text>
    </g>
  </g>
  <g stroke="url(#g1)" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M280 290H330"/>
    <path d="M490 290H540"/>
    <path d="M740 290H790"/>
    <path d="M950 290H1000"/>
  </g>
</svg>`,
  'claude-components-board.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#07101b"/>
  <g font-family="Pretendard, sans-serif">
    <rect x="440" y="220" width="400" height="220" rx="32" fill="#142440" stroke="#4f7dff" stroke-width="4"/>
    <text x="640" y="290" text-anchor="middle" font-size="50" fill="#f5f7ff" font-weight="800">Claude Code</text>
    <text x="640" y="340" text-anchor="middle" font-size="24" fill="#9aa7c7">한 명의 AI가 아니라 작업 시스템</text>
    <g fill="#121d30" stroke="rgba(122,154,255,0.25)">
      <rect x="80" y="120" width="250" height="120" rx="24"/>
      <rect x="80" y="300" width="250" height="120" rx="24"/>
      <rect x="80" y="480" width="250" height="120" rx="24"/>
      <rect x="950" y="120" width="250" height="120" rx="24"/>
      <rect x="950" y="300" width="250" height="120" rx="24"/>
      <rect x="950" y="480" width="250" height="120" rx="24"/>
    </g>
    <g fill="#f5f7ff" font-size="32" font-weight="700">
      <text x="120" y="190">CLAUDE.md</text>
      <text x="120" y="370">MCP</text>
      <text x="120" y="550">Hooks</text>
      <text x="985" y="190">Subagents</text>
      <text x="985" y="370">Skills</text>
      <text x="985" y="550">Agent Teams</text>
    </g>
    <g fill="#9aa7c7" font-size="18">
      <text x="120" y="220">기준과 기억 유지</text>
      <text x="120" y="400">외부 도구 연결</text>
      <text x="120" y="580">자동 개입 지점</text>
      <text x="985" y="220">역할 분리</text>
      <text x="985" y="400">재사용 워크플로우</text>
      <text x="985" y="580">다중 에이전트 협업</text>
    </g>
  </g>
  <g stroke="#67d5ff" stroke-width="4" opacity="0.8">
    <path d="M330 180H440"/>
    <path d="M330 360H440"/>
    <path d="M330 540H440"/>
    <path d="M840 180H950"/>
    <path d="M840 360H950"/>
    <path d="M840 540H950"/>
  </g>
</svg>`,
  'problem-scope-ladder.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#07101b"/>
  <g font-family="Pretendard, sans-serif">
    <text x="120" y="120" fill="#f5f7ff" font-size="52" font-weight="800">Problem scope ladder</text>
    <text x="120" y="165" fill="#9aa7c7" font-size="24">문제가 클수록 AI가 못하는 게 아니라, 내가 제대로 지시하지 못할 확률이 커집니다.</text>
    <g>
      <rect x="160" y="460" width="280" height="120" rx="20" fill="#101927" stroke="rgba(122,154,255,0.18)"/>
      <text x="195" y="525" fill="#f5f7ff" font-size="34" font-weight="700">과일 게임</text>
      <text x="195" y="560" fill="#71f5b1" font-size="20">성공 가능한 적정 범위</text>
    </g>
    <g>
      <rect x="520" y="320" width="280" height="170" rx="20" fill="#1b1620" stroke="rgba(255,107,107,0.28)"/>
      <text x="555" y="385" fill="#f5f7ff" font-size="34" font-weight="700">다크소울</text>
      <text x="555" y="420" fill="#ff6b6b" font-size="20">엔진 / 물리 / 시스템 과대</text>
    </g>
    <g>
      <rect x="880" y="180" width="280" height="220" rx="20" fill="#1b1620" stroke="rgba(255,107,107,0.28)"/>
      <text x="915" y="245" fill="#f5f7ff" font-size="34" font-weight="700">마인크래프트</text>
      <text x="915" y="280" fill="#ff6b6b" font-size="20">스코프가 제품 수준</text>
      <text x="915" y="312" fill="#9aa7c7" font-size="18">월드 · 렌더링 · 상호작용 · 컨텐츠</text>
    </g>
    <path d="M260 420L620 280L980 140" stroke="#67d5ff" stroke-width="8" fill="none" stroke-linecap="round"/>
    <g fill="#67d5ff">
      <circle cx="260" cy="420" r="12"/>
      <circle cx="620" cy="280" r="12"/>
      <circle cx="980" cy="140" r="12"/>
    </g>
  </g>
</svg>`,
  'fruit-architecture.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#07101b"/>
  <g font-family="Pretendard, sans-serif">
    <rect x="140" y="170" width="1000" height="380" rx="30" fill="#0d1321" stroke="rgba(122,154,255,0.18)"/>
    <rect x="200" y="240" width="190" height="240" rx="22" fill="#121d30" stroke="rgba(122,154,255,0.28)"/>
    <rect x="430" y="240" width="190" height="240" rx="22" fill="#121d30" stroke="rgba(122,154,255,0.28)"/>
    <rect x="660" y="240" width="190" height="240" rx="22" fill="#121d30" stroke="rgba(122,154,255,0.28)"/>
    <rect x="890" y="240" width="190" height="240" rx="22" fill="#13233d" stroke="#4f7dff" stroke-width="3"/>
    <text x="240" y="295" fill="#86a7ff" font-size="22">INPUT</text>
    <text x="240" y="345" fill="#f5f7ff" font-size="34" font-weight="700">InputHandler</text>
    <text x="240" y="385" fill="#9aa7c7" font-size="18">키보드 / 터치 / 마우스</text>
    <text x="470" y="295" fill="#86a7ff" font-size="22">STATE</text>
    <text x="470" y="345" fill="#f5f7ff" font-size="34" font-weight="700">GameState</text>
    <text x="470" y="385" fill="#9aa7c7" font-size="18">점수 / 스폰 / 게임오버</text>
    <text x="700" y="295" fill="#86a7ff" font-size="22">PHYSICS</text>
    <text x="700" y="345" fill="#f5f7ff" font-size="34" font-weight="700">Physics</text>
    <text x="700" y="385" fill="#9aa7c7" font-size="18">중력 / 마찰 / 충돌</text>
    <text x="930" y="295" fill="#86a7ff" font-size="22">RENDER</text>
    <text x="930" y="345" fill="#f5f7ff" font-size="34" font-weight="700">Game + UI</text>
    <text x="930" y="385" fill="#9aa7c7" font-size="18">Canvas / SVG / HUD</text>
  </g>
  <g stroke="#67d5ff" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M390 360H430"/>
    <path d="M620 360H660"/>
    <path d="M850 360H890"/>
  </g>
</svg>`,
  'feedback-loop.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#07101b"/>
  <g font-family="Pretendard, sans-serif">
    <circle cx="640" cy="360" r="190" fill="none" stroke="rgba(122,154,255,0.2)" stroke-width="22"/>
    <circle cx="640" cy="360" r="190" fill="none" stroke="#4f7dff" stroke-width="18" stroke-dasharray="250 1000" transform="rotate(-90 640 360)"/>
    <rect x="530" y="300" width="220" height="120" rx="26" fill="#13233d" stroke="#4f7dff" stroke-width="3"/>
    <text x="640" y="355" text-anchor="middle" fill="#f5f7ff" font-size="40" font-weight="800">ITERATE</text>
    <text x="640" y="388" text-anchor="middle" fill="#9aa7c7" font-size="18">테스트 -> 피드백 -> 수정</text>
    <g fill="#121d30" stroke="rgba(122,154,255,0.24)">
      <rect x="160" y="110" width="220" height="96" rx="22"/>
      <rect x="905" y="110" width="220" height="96" rx="22"/>
      <rect x="905" y="515" width="220" height="96" rx="22"/>
      <rect x="160" y="515" width="220" height="96" rx="22"/>
    </g>
    <g fill="#f5f7ff" font-size="28" font-weight="700" text-anchor="middle" dominant-baseline="middle">
      <text x="195" y="168">Play test</text>
      <text x="943" y="168">Bug trace</text>
      <text x="944" y="573">Design polish</text>
      <text x="195" y="573">Browser verify</text>
    </g>
  </g>
</svg>`,
  'harness-blueprint.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <marker id="arrow" markerWidth="9.5" markerHeight="9.5" refX="8.4" refY="4.75" orient="auto" markerUnits="userSpaceOnUse">
      <polygon points="0 0, 9.5 4.75, 0 9.5" fill="#67d5ff"/>
    </marker>
  </defs>
  <rect width="1280" height="720" fill="#07101b"/>
  <g font-family="Pretendard, sans-serif">
    <rect x="420" y="210" width="440" height="300" rx="34" fill="#13233d" stroke="#4f7dff" stroke-width="4"/>
    <text x="640" y="322" text-anchor="middle" font-size="58" fill="#f5f7ff" font-weight="900" dominant-baseline="middle">HARNESS</text>
    <text x="640" y="382" text-anchor="middle" font-size="24" fill="#9aa7c7" dominant-baseline="middle">계획 · 위임 · 검증 · 반복</text>
    <g fill="#121d30" stroke="rgba(122,154,255,0.26)">
      <rect x="120" y="150" width="220" height="110" rx="24"/>
      <rect x="120" y="460" width="220" height="110" rx="24"/>
      <rect x="940" y="150" width="220" height="110" rx="24"/>
      <rect x="940" y="460" width="220" height="110" rx="24"/>
    </g>
    <g fill="#f5f7ff" font-size="28" font-weight="700" text-anchor="middle" dominant-baseline="middle">
      <text x="230" y="205">문서화</text>
      <text x="230" y="515">브라우저 검증</text>
      <text x="1050" y="205">서브 에이전트</text>
      <text x="1050" y="515">리뷰 루프</text>
    </g>
  </g>
  <g stroke="#67d5ff" stroke-width="6" stroke-linecap="round" fill="none" marker-end="url(#arrow)">
    <path d="M340 205 C372 205,390 250,420 285"/>
    <path d="M340 515 C372 515,390 470,420 435"/>
    <path d="M860 285 C890 250,908 205,940 205"/>
    <path d="M860 435 C890 470,908 515,940 515"/>
  </g>
</svg>`,
  'role-shift.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#07101b"/>
  <g font-family="Pretendard, sans-serif">
    <rect x="120" y="180" width="420" height="340" rx="28" fill="#151820" stroke="rgba(255,107,107,0.3)"/>
    <rect x="740" y="180" width="420" height="340" rx="28" fill="#13233d" stroke="#4f7dff"/>
    <text x="180" y="250" fill="#ff6b6b" font-size="24">OLD HAND POSITION</text>
    <text x="180" y="325" fill="#f5f7ff" font-size="52" font-weight="900">Code typing</text>
    <text x="180" y="382" fill="#9aa7c7" font-size="24">구현 세부에 손이 머문다</text>
    <text x="800" y="250" fill="#86a7ff" font-size="24">NEW HAND POSITION</text>
    <text x="800" y="325" fill="#f5f7ff" font-size="52" font-weight="900">System design</text>
    <text x="800" y="382" fill="#9aa7c7" font-size="24">문서 · 검증 · 오케스트레이션</text>
    <text x="600" y="372" fill="#67d5ff" font-size="84" font-weight="900">→</text>
  </g>
</svg>`,
};

const themeCss = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

:root {
  --bg: ${palette.bg};
  --panel: ${palette.panel};
  --panel-alt: ${palette.panelAlt};
  --text: ${palette.text};
  --muted: ${palette.muted};
  --primary: ${palette.primary};
  --primary-soft: ${palette.primarySoft};
  --cyan: ${palette.cyan};
  --line: ${palette.line};
  --danger: ${palette.danger};
  --success: ${palette.success};
  --warning: ${palette.warning};
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 720px; height: 405px; overflow: hidden; }
body {
  font-family: 'Pretendard', sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top right, rgba(79,125,255,0.18), transparent 30%),
    radial-gradient(circle at bottom left, rgba(103,213,255,0.1), transparent 25%),
    linear-gradient(180deg, #070b14 0%, #04060c 100%);
  padding: 18px 22px 16px;
  position: relative;
  display: flex;
  flex-direction: column;
}
body::before {
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px solid var(--line);
  border-radius: 18px;
  pointer-events: none;
}
.noise {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 14px 14px;
  opacity: 0.35;
  pointer-events: none;
  animation: gridDrift 18s linear infinite;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 8px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--primary-soft);
  margin-bottom: 6px;
}
.eyebrow::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--cyan));
  box-shadow: 0 0 12px rgba(79,125,255,0.5);
}
.title {
  font-size: 22px;
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 800;
  max-width: 600px;
  padding-bottom: 3px;
}
.title.large { font-size: 34px; }
.subtitle {
  margin-top: 4px;
  font-size: 10px;
  line-height: 1.45;
  color: var(--muted);
  max-width: 600px;
}
.page {
  font-size: 9px;
  color: rgba(255,255,255,0.55);
  padding: 4px 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  min-width: 30px;
  text-align: center;
}
.content {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.52);
  font-size: 8px;
  margin-top: 8px;
  position: relative;
  z-index: 1;
}
.footer strong { color: var(--primary-soft); }
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: 100%;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card {
  background: linear-gradient(180deg, rgba(17,26,43,0.96), rgba(11,16,27,0.96));
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.24);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0,0,0,0.28);
  border-color: rgba(103,213,255,0.32);
}
.card h3 {
  font-size: 15px;
  line-height: 1.2;
  margin-bottom: 7px;
  color: var(--text);
}
.card h4 {
  font-size: 10px;
  color: var(--primary-soft);
  margin-bottom: 6px;
}
.card p, .card li {
  font-size: 10px;
  line-height: 1.52;
  color: var(--muted);
}
.card ul {
  padding-left: 14px;
  display: grid;
  gap: 4px;
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.metric {
  padding: 12px 10px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(15,22,37,0.98), rgba(10,14,24,0.98));
  border: 1px solid var(--line);
  position: relative;
  overflow: hidden;
}
.metric::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.05) 48%, transparent 55%);
  transform: translateX(-120%);
  animation: sheen 6s ease-in-out infinite;
}
.metric .label {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.metric .value {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
}
.metric .hint {
  margin-top: 6px;
  font-size: 8px;
  color: var(--muted);
}
.quote {
  font-size: 20px;
  line-height: 1.36;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.quote .accent { color: var(--cyan); }
.divider {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.divider .index {
  color: var(--primary-soft);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}
.divider .big {
  margin-top: 8px;
  font-size: 34px;
  line-height: 1.03;
  letter-spacing: -0.04em;
  font-weight: 900;
  max-width: 600px;
  text-shadow: 0 0 16px rgba(79,125,255,0.18);
}
.divider .desc {
  margin-top: 10px;
  max-width: 520px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--muted);
}
.image-frame, .video-frame {
  height: 100%;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: #02040a;
  box-shadow: 0 10px 24px rgba(0,0,0,0.28);
}
.image-frame.pulse, .video-frame.pulse {
  animation: softPulse 4.2s ease-in-out infinite;
}
.image-frame img, .video-frame video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.image-contain img {
  object-fit: contain;
  background: rgba(255,255,255,0.02);
}
.caption {
  margin-top: 6px;
  font-size: 8px;
  color: var(--muted);
}
.timeline {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.timeline .step {
  position: relative;
  padding: 10px;
  border-radius: 14px;
  background: rgba(17,26,43,0.92);
  border: 1px solid var(--line);
}
.timeline .step .num {
  color: var(--primary-soft);
  font-size: 8px;
  margin-bottom: 6px;
}
.timeline .step .name {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 6px;
}
.timeline .step p {
  font-size: 8.5px;
  line-height: 1.42;
  color: var(--muted);
}
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.compare .bad, .compare .good {
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
}
.compare .bad { background: linear-gradient(180deg, rgba(86,18,18,0.35), rgba(39,10,10,0.24)); }
.compare .good { background: linear-gradient(180deg, rgba(26,55,92,0.42), rgba(9,18,33,0.32)); }
.compare h3 {
  font-size: 15px;
  margin-bottom: 8px;
}
.compare ul {
  padding-left: 14px;
  display: grid;
  gap: 5px;
}
.compare li {
  font-size: 10px;
  line-height: 1.52;
  color: var(--muted);
}
.callout {
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(79,125,255,0.12);
  border: 1px solid rgba(79,125,255,0.28);
}
.callout p {
  font-size: 10px;
  line-height: 1.5;
  color: var(--text);
}
.list-large {
  display: grid;
  gap: 8px;
}
.list-large .row {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 8px;
  align-items: start;
}
.list-large .dot {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid rgba(103,213,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cyan);
  font-size: 8px;
  font-weight: 700;
}
.list-large .text strong {
  display: block;
  font-size: 11px;
  color: var(--text);
  margin-bottom: 2px;
}
.list-large .text p {
  font-size: 9px;
  line-height: 1.5;
  color: var(--muted);
}
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--line);
  font-size: 8px;
  color: var(--text);
}
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.hero-statement {
  font-size: 24px;
  line-height: 1.3;
  letter-spacing: -0.03em;
  font-weight: 800;
  max-width: 600px;
}
.hero-statement .accent { color: var(--cyan); }
.hero-statement .accent2 { color: var(--primary-soft); }
.hero-visual {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;
  height: 100%;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}
.hero-svg-card {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
  box-shadow: 0 12px 28px rgba(0,0,0,0.28);
}
.hero-svg-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.chip-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(122,154,255,0.22);
  background: rgba(255,255,255,0.03);
  font-size: 9px;
  color: var(--text);
}
.chip::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 10px rgba(103,213,255,0.45);
  animation: softPulse 2.8s ease-in-out infinite;
}
.diagram-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: 100%;
}
.diagram-panel .text-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.diagram-panel .visual-col {
  min-height: 0;
}
.visual-card {
  height: 100%;
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255,255,255,0.02);
  box-shadow: 0 10px 24px rgba(0,0,0,0.28);
}
.visual-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.visual-card.contain img { object-fit: contain; }
.floating-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(79,125,255,0.14);
  border: 1px solid rgba(79,125,255,0.3);
  color: #dfe6ff;
  font-size: 9px;
  animation: floatY 4.2s ease-in-out infinite;
}
.stage-ribbon {
  display: flex;
  gap: 6px;
  align-items: center;
}
.stage-ribbon span {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
  position: relative;
}
.stage-ribbon span::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--primary), var(--cyan));
  transform-origin: left center;
  animation: fillGrow 3.2s ease-in-out infinite;
}
@keyframes gridDrift {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(-6px, -4px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
@keyframes softPulse {
  0%, 100% { box-shadow: 0 10px 24px rgba(0,0,0,0.28), 0 0 0 rgba(79,125,255,0.0); }
  50% { box-shadow: 0 10px 24px rgba(0,0,0,0.28), 0 0 22px rgba(79,125,255,0.18); }
}
@keyframes sheen {
  0%, 100% { transform: translateX(-120%); }
  50% { transform: translateX(120%); }
}
@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes fillGrow {
  0%, 100% { transform: scaleX(0.28); opacity: 0.75; }
  50% { transform: scaleX(1); opacity: 1; }
}
.architecture {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: center;
  gap: 12px;
}
.arch-box {
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(17,26,43,0.92);
}
.arch-box h3 {
  font-size: 16px;
  margin-bottom: 8px;
}
.arch-box ul {
  padding-left: 14px;
  display: grid;
  gap: 5px;
}
.arch-arrow {
  text-align: center;
  color: var(--primary-soft);
  font-size: 34px;
  font-weight: 900;
}
.matrix {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.matrix .cell {
  padding: 10px;
  border-radius: 14px;
  background: rgba(17,26,43,0.9);
  border: 1px solid var(--line);
}
.matrix .cell h4 {
  font-size: 9px;
  margin-bottom: 6px;
  color: var(--primary-soft);
}
.matrix .cell p {
  font-size: 9px;
  line-height: 1.48;
  color: var(--muted);
}
.process-diagram {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  align-items: stretch;
}
.process-step {
  position: relative;
  padding: 10px 8px;
  border-radius: 14px;
  background: rgba(17,26,43,0.95);
  border: 1px solid var(--line);
}
.process-step h4 {
  font-size: 9px;
  color: var(--primary-soft);
  margin-bottom: 4px;
}
.process-step p {
  font-size: 8px;
  line-height: 1.42;
  color: var(--muted);
}
.process-step:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cyan);
  font-size: 14px;
  font-weight: 800;
}
.small-note {
  font-size: 8px;
  color: var(--muted);
}
.cover-grid {
  height: 100%;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 12px;
}
.cover-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cover-title {
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: -0.04em;
  font-weight: 900;
  padding-bottom: 4px;
}
.cover-meta {
  margin-top: 12px;
  display: grid;
  gap: 5px;
  color: var(--muted);
  font-size: 10px;
}
.cover-right {
  display: grid;
  gap: 8px;
}
.cover-panel {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px;
  background: rgba(17,26,43,0.92);
}
.cover-panel .k {
  color: var(--primary-soft);
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.cover-panel .v {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.36;
  color: var(--text);
  font-weight: 700;
}
.mini-chart {
  height: 72px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
}
.mini-chart .bar {
  flex: 1;
  border-radius: 10px 10px 4px 4px;
  background: linear-gradient(180deg, var(--cyan), var(--primary));
  opacity: 0.92;
}
.spacer-8 { height: 6px; }
.spacer-12 { height: 10px; }
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--cyan);
}
`;

const footer = (section) => `
  <div class="footer">
    <div>${deckMeta.speaker} · <strong>${deckMeta.companies}</strong></div>
    <div>${section} · ${deckMeta.date}</div>
  </div>
`;

const wrap = ({ page, section, eyebrow, title, subtitle = '', content, footerSection = section }) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./theme.css">
  <title>${page}. ${title}</title>
</head>
<body>
  <div class="noise"></div>
  <div class="header">
    <div>
      <div class="eyebrow">${eyebrow}</div>
      <h1 class="title">${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </div>
    <div class="page">${String(page).padStart(2, '0')}</div>
  </div>
  <main class="content">${content}</main>
  ${footer(footerSection)}
</body>
</html>`;

const wrapDivider = ({ page, section, index, big, desc }) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./theme.css">
  <title>${page}. ${big}</title>
</head>
<body>
  <div class="noise"></div>
  <div class="header">
    <div class="eyebrow">${section}</div>
    <div class="page">${String(page).padStart(2, '0')}</div>
  </div>
  <main class="content divider">
    <div class="index">${index}</div>
    <div class="big">${big}</div>
    <div class="desc">${desc}</div>
  </main>
  ${footer(section)}
</body>
</html>`;

const wrapCover = ({ page }) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./theme.css">
  <title>${deckMeta.title}</title>
</head>
<body>
  <div class="noise"></div>
  <main class="content cover-grid">
    <section class="cover-left">
      <div class="eyebrow">40 MIN TECH TALK · VIBE CODING</div>
      <h1 class="cover-title">${deckMeta.title}</h1>
      <p class="subtitle" style="font-size:15pt;max-width:520pt;">${deckMeta.subtitle}</p>
      <div class="cover-meta">
        <div>발표자 · ${deckMeta.speaker}</div>
        <div>회사 · ${deckMeta.companies}</div>
        <div>발표일 · ${deckMeta.date}</div>
        <div>톤앤매너 · Dark blueprint, neon HUD, Pretendard</div>
      </div>
    </section>
    <section class="cover-right">
      <div class="cover-panel">
        <div class="k">Core thesis</div>
        <div class="v">AI가 알아서 만든 게 아니라<br>문서화와 harness로<br>끝까지 완성시킨 프로젝트</div>
      </div>
      <div class="cover-panel">
        <div class="k">Keywords</div>
        <div class="badge-row" style="margin-top:12pt;">
          <span class="badge">Vibe Coding</span>
          <span class="badge">Documentation</span>
          <span class="badge">Skills</span>
          <span class="badge">Subagents</span>
          <span class="badge">Playwright</span>
          <span class="badge">Harness Engineering</span>
        </div>
      </div>
      <div class="cover-panel">
        <div class="k">40-minute map</div>
        <div class="mini-chart">
          <div class="bar" style="height:34%;"></div>
          <div class="bar" style="height:48%;"></div>
          <div class="bar" style="height:62%;"></div>
          <div class="bar" style="height:78%;"></div>
          <div class="bar" style="height:92%;"></div>
        </div>
      </div>
    </section>
  </main>
  ${footer('OPENING')}
</body>
</html>`;

const slides = [
  { page: 1, file: 'slide-01.html', html: wrapCover({ page: 1 }) },
  { page: 2, file: 'slide-02.html', html: wrap({
    page: 2,
    section: 'OPENING',
    eyebrow: 'Presentation thesis',
    title: '오늘 발표에서 정말 말하고 싶은 것',
    subtitle: '이 발표는 AI가 코드를 대신 써줬다는 자랑이 아니라, Claude Code가 잘 일하도록 작업 시스템을 설계한 이야기입니다.',
    content: `
      <div class="centered" style="height:100%;">
        <div class="hero-statement">
          <span class="accent2">문서화</span>와
          <span class="accent">Harness Engineering</span>이 없었다면<br>
          이 프로젝트는 <span class="accent2">끝까지 가지 못했습니다.</span>
        </div>
      </div>
    `
  })},
  { page: 3, file: 'slide-03.html', html: wrap({
    page: 3,
    section: 'OPENING',
    eyebrow: 'Agenda',
    title: '40분 동안 따라갈 흐름',
    subtitle: '도구 설명보다 먼저, 왜 이 이야기가 시작됐는지부터 갑니다.',
    content: `
      <div class="hero-visual">
        <div class="hero-copy">
          <div class="floating-badge">PART MAP</div>
          <div class="timeline">
            <div class="step"><div class="num">01</div><div class="name">바이브 코딩의 등장</div><p>카파시 트윗과 초기 실험</p></div>
            <div class="step"><div class="num">02</div><div class="name">SKILLS와 구조화</div><p>문서화된 실행 흐름</p></div>
            <div class="step"><div class="num">03</div><div class="name">Claude Code</div><p>구성 요소와 조합</p></div>
            <div class="step"><div class="num">04</div><div class="name">과일 게임 사례</div><p>실패와 성공의 전환점</p></div>
            <div class="step"><div class="num">05</div><div class="name">Harness</div><p>운영 방식 설계</p></div>
          </div>
          <div class="stage-ribbon"><span></span><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="hero-svg-card">
          <img src="./assets/vibe-signal.svg" alt="presentation storyline signal graphic">
        </div>
      </div>
    `
  })},
  { page: 4, file: 'slide-04.html', html: wrap({
    page: 4,
    section: 'OPENING',
    eyebrow: 'Spark',
    title: '바이브 코딩이라는 말을 처음 진지하게 받아들인 순간',
    subtitle: '2025년 2월, 안드레 카파시의 트윗 하나가 작업 태도를 바꿨습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>왜 이 한 문장이 강했나</h3>
          <ul>
            <li>FSD와 OpenAI를 경험한 사람도 AI에게 코딩을 맡기고 있었다.</li>
            <li>즉 이건 초보자의 편법이 아니라, 최전선 개발자의 작업 방식일 수 있었다.</li>
            <li>저는 그 순간 “내가 왜 아직도 직접만 치고 있지?”라고 생각했다.</li>
          </ul>
          <div class="spacer-12"></div>
          <div class="callout"><p>바이브 코딩은 게으름의 핑계가 아니라, 개발자의 역할이 이동하는 신호로 받아들였습니다.</p></div>
        </div>
        <div class="image-frame image-contain">
          <img src="./assets/vibe-coding-twitter-en.png" alt="Andrej Karpathy vibe coding tweet in English">
        </div>
      </div>
    `
  })},
  { page: 5, file: 'slide-05.html', html: wrap({
    page: 5,
    section: 'OPENING',
    eyebrow: 'Spark',
    title: '같은 메시지를 한국어로 다시 읽었을 때 더 명확해진 것',
    subtitle: '핵심은 프롬프트 문장력이 아니라, AI에게 일을 맡기는 방식 자체였습니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/vibe-coding-twitter-ko.png" alt="Andrej Karpathy vibe coding tweet in Korean">
        </div>
        <div class="stack">
          <div class="card">
            <h3>제가 받아들인 번역</h3>
            <p class="quote" style="font-size:16px;">“AI에게 코딩을 시킨다”는 건<br><span class="accent">직접 타이핑을 안 한다</span>가 아니라,<br><span class="accent2">일을 위임하고 통제한다</span>에 가깝다.</p>
          </div>
          <div class="metric-grid" style="grid-template-columns:repeat(2,1fr);">
            <div class="metric"><div class="label">keyword</div><div class="value">2025.02</div><div class="hint">용어를 처음 강하게 의식한 시점</div></div>
            <div class="metric"><div class="label">shift</div><div class="value">Coder → Director</div><div class="hint">역할 이동</div></div>
          </div>
        </div>
      </div>
    `
  })},
  { page: 6, file: 'slide-06.html', html: wrap({
    page: 6,
    section: 'OPENING',
    eyebrow: 'Why me',
    title: '저는 이걸 그냥 소비한 사람이 아니라 먼저 실험한 사람이었습니다',
    subtitle: '부산 오프라인 강의, 온라인 홍보, 카카오 그룹 엔지니어 세미나까지 이어졌습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>2025년 3월에 있었던 일</h3>
          <ul>
            <li>국내에서 비교적 이른 시점에 바이브 코딩 오프라인 강의를 진행</li>
            <li>온라인에서도 이 키워드를 적극적으로 알림</li>
            <li>서울과 카카오 그룹 엔지니어 대상 세미나까지 연결</li>
          </ul>
        </div>
        <div class="card">
          <h3>이 경험이 중요했던 이유</h3>
          <ul>
            <li>남의 성공담을 인용하는 발표가 아니라, 실제 시행착오를 겪은 사람의 이야기다.</li>
            <li>도구의 환상보다 운영 방식의 현실을 더 일찍 보게 됐다.</li>
            <li>그래서 오늘도 “딸깍 한 번”이 아니라 “끝까지 완성하는 방법”을 말하려 한다.</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 7, file: 'slide-07.html', html: wrap({
    page: 7,
    section: 'OPENING',
    eyebrow: 'Early proof',
    title: '처음으로 코드 한 줄 없이 끝낸 프로젝트',
    subtitle: 'Netflix 클론 계열 실험은 바이브 코딩이 실전 작업 방식이 될 수 있다는 첫 증거였습니다.',
    content: `
      <div class="metric-grid">
        <div class="metric"><div class="label">duration</div><div class="value">2일</div><div class="hint">프로젝트 총 작업 기간</div></div>
        <div class="metric"><div class="label">hands-on AI time</div><div class="value">6시간</div><div class="hint">실제 코드 작업을 시킨 시간</div></div>
        <div class="metric"><div class="label">tooling</div><div class="value">Cursor + Sonnet 3.7 Max</div><div class="hint">당시 사용 환경</div></div>
        <div class="metric"><div class="label">edge</div><div class="value">MCP</div><div class="hint">등장 초기의 큰 생산성 레버</div></div>
      </div>
      <div class="spacer-12"></div>
      <div class="card">
        <h3>그때 얻은 핵심 인사이트</h3>
        <p>Figma MCP 같은 외부 도구가 붙으면서 화면 구현 속도는 엄청나게 빨라졌습니다. 그런데 정말 남은 교훈은 속도 그 자체가 아니라, 기능 명세와 구현 계획서를 먼저 만들 때 결과물 품질이 압도적으로 좋아진다는 사실이었습니다.</p>
      </div>
    `
  })},
  { page: 8, file: 'slide-08.html', html: wrap({
    page: 8,
    section: 'OPENING',
    eyebrow: 'Early proof',
    title: '실제 초기 실험 결과물',
    subtitle: '비디오를 보면 “AI가 UI를 만든다”는 감각은 전달됩니다. 하지만 이 발표에서 더 중요한 건 그 다음에 남은 교훈입니다.',
    content: `
      <div class="grid-2">
        <div class="video-frame">
          <video src="./assets/miniflex.mp4" poster="./assets/miniflex-poster.png" controls muted playsinline></video>
        </div>
        <div class="stack">
          <div class="card">
            <h3>이 프로젝트가 보여준 것</h3>
            <ul>
              <li>화면과 상호작용은 놀랄 만큼 빠르게 나올 수 있다.</li>
              <li>Figma MCP를 쓰면 이미 만들어 둔 화면을 거의 그대로 가져오는 것도 가능하다.</li>
              <li>하지만 길어지는 프로젝트에서 진짜 병목은 생성이 아니라 정리와 검증이다.</li>
            </ul>
          </div>
          <div class="callout"><p>그래서 이때부터 저는 “좋은 프롬프트”보다 “좋은 문서”를 더 중요하게 보기 시작했습니다.</p></div>
        </div>
      </div>
    `
  })},
  { page: 9, file: 'slide-09.html', html: wrap({
    page: 9,
    section: 'OPENING',
    eyebrow: 'Thesis',
    title: '그때도 지금도 가장 중요했던 건 문서화였습니다',
    subtitle: '긴 작업일수록 문서가 없으면 결국 방향을 잃습니다.',
    content: `
      <div class="compare">
        <div class="bad">
          <h3>문서가 없을 때</h3>
          <ul>
            <li>작업 목표가 매번 대화 속에서 흔들린다.</li>
            <li>AI가 한 번 낸 결과를 다음 턴에 스스로 뒤집기 쉽다.</li>
            <li>검증 기준이 없어 “그럴듯함”으로 끝난다.</li>
          </ul>
        </div>
        <div class="good">
          <h3>문서가 있을 때</h3>
          <ul>
            <li>목표, 제약, 완료 조건이 지속적으로 남는다.</li>
            <li>설계와 구현을 분리할 수 있다.</li>
            <li>검증 기준이 생겨서 품질을 유지할 수 있다.</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 10, file: 'slide-10.html', html: wrapDivider({
    page: 10,
    section: 'PART 1',
    index: '01 · DOCUMENTATION',
    big: '문서화 없이는\n바이브 코딩도 오래 못 갑니다',
    desc: 'SKILLS가 왜 강력한지 설명하기 전에, 문서화된 워크플로우가 왜 AI 시대의 기본 단위가 되었는지부터 정리합니다.'
  })},
  { page: 11, file: 'slide-11.html', html: wrap({
    page: 11,
    section: 'DOCUMENTATION',
    eyebrow: 'Documentation',
    title: '문서화는 AI에게 주는 기억 장치이자 실행 기준입니다',
    subtitle: '사람에게도 중요하지만, 컨텍스트가 쉽게 흔들리는 에이전트에게는 더 중요합니다.',
    content: `
      <div class="diagram-panel">
        <div class="text-col">
          <div class="chip-strip">
            <span class="chip">목표 고정</span>
            <span class="chip">작업 분리</span>
            <span class="chip">검증 가능성</span>
          </div>
          <div class="card"><h3>왜 문서가 먼저인가</h3><p>문서가 없으면 AI는 매 턴마다 목표를 다시 해석합니다. 문서가 있으면 같은 기준을 보고 계속 앞으로 나아갑니다.</p></div>
          <div class="callout"><p>문서화는 AI를 위한 친절한 설명이 아니라, 긴 프로젝트를 버티게 하는 상태 관리 방식입니다.</p></div>
        </div>
        <div class="visual-col">
          <div class="visual-card contain pulse">
            <img src="./assets/skills-assembly-line.svg" alt="documentation and skills assembly line">
          </div>
        </div>
      </div>
    `
  })},
  { page: 12, file: 'slide-12.html', html: wrap({
    page: 12,
    section: 'DOCUMENTATION',
    eyebrow: 'Earlier lesson',
    title: 'Netflix 클론 실험에서 이미 본 패턴',
    subtitle: '기능 명세를 자세히 적고, 그 문서를 바탕으로 구현 계획서를 만들어 순차 실행했을 때 결과가 가장 안정적이었습니다.',
    content: `
      <div class="process-diagram">
        <div class="process-step"><h4>Spec</h4><p>무엇을 만들지, 어떤 화면이 필요한지, 완료 조건이 무엇인지 정의</p></div>
        <div class="process-step"><h4>Plan</h4><p>구현 단위와 우선순위, 파일 구조, 필요한 외부 도구 분해</p></div>
        <div class="process-step"><h4>Build</h4><p>문서 기준으로 순차 작업. 중간에 목표가 흔들리지 않음</p></div>
        <div class="process-step"><h4>Review</h4><p>보는 사람 기준으로 다시 검토하고 화면 완성도를 점검</p></div>
        <div class="process-step"><h4>Fix</h4><p>자연어 피드백을 곧바로 수정 루프로 연결</p></div>
        <div class="process-step"><h4>Deploy</h4><p>결과를 보여줄 수 있는 상태까지 밀어붙임</p></div>
      </div>
    `
  })},
  { page: 13, file: 'slide-13.html', html: wrap({
    page: 13,
    section: 'DOCUMENTATION',
    eyebrow: 'Skill emergence',
    title: 'SKILLS는 문서화를 실행 가능한 워크플로우로 바꾸는 장치입니다',
    subtitle: '2025년 10월 이후, “문서를 잘 쓰는 사람”에서 “문서화된 작업 방식을 재사용하는 사람”으로 관점이 이동했습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>SKILLS를 짧게 말하면</h3>
          <p class="quote" style="font-size:18pt;">어떤 일을 잘하기 위한<br><span class="accent">작업 매뉴얼</span>을,<br>AI가 다시 실행할 수 있게 만든 것</p>
        </div>
        <div class="card">
          <h3>그래서 달라지는 것</h3>
          <ul>
            <li>매번 같은 품질의 기획과 설계를 반복할 수 있다.</li>
            <li>작업 순서가 흔들리지 않는다.</li>
            <li>문서가 곧 실행 방식이 된다.</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 14, file: 'slide-14.html', html: wrap({
    page: 14,
    section: 'DOCUMENTATION',
    eyebrow: 'Workflow',
    title: '게임 개발은 원래도 워크플로우 산업입니다',
    subtitle: '기획부터 운영까지, 대부분의 단계는 사실상 문서와 의사결정의 연속입니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/mermaid-diagram.png" alt="Game development workflow diagram">
        </div>
        <div class="card">
          <h3>왜 이 그림이 중요한가</h3>
          <ul>
            <li>게임 개발은 처음부터 끝까지 다층 워크플로우로 이루어져 있다.</li>
            <li>각 단계는 물리 노동보다 지식 노동의 산출물에 가깝다.</li>
            <li>그래서 문서화된 워크플로우가 있으면 AI가 실제 팀원처럼 참여할 여지가 커진다.</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 15, file: 'slide-15.html', html: wrap({
    page: 15,
    section: 'DOCUMENTATION',
    eyebrow: 'Observation',
    title: '문제는 인간이 동시에 여러 역할을 다 할 수 없다는 것입니다',
    subtitle: '기획, 설계, 구현, 테스트, 리뷰, 디자인은 다 다른 에너지와 관점을 요구합니다.',
    content: `
      <div class="grid-3">
        <div class="card"><h3>현실의 한계</h3><p>사람은 물리적인 시간과 집중력의 제약을 받습니다.</p></div>
        <div class="card"><h3>지식 노동의 병목</h3><p>특히 개발자는 몸으로 때우는 방식이 잘 통하지 않습니다.</p></div>
        <div class="card"><h3>AI의 기회</h3><p>문서와 기준이 충분히 명확하면, 많은 단계를 병렬로 밀 수 있습니다.</p></div>
      </div>
    `
  })},
  { page: 16, file: 'slide-16.html', html: wrap({
    page: 16,
    section: 'DOCUMENTATION',
    eyebrow: 'Bridge',
    title: '그래서 다음 질문이 생깁니다',
    subtitle: '문서와 워크플로우가 중요하다면, Claude Code 안에서는 무엇을 이해해야 이걸 실제로 굴릴 수 있을까?',
    content: `
      <div class="centered" style="height:100%;">
        <div class="hero-statement">
          <span class="accent">SKILLS</span>를 잘 쓰려면<br>
          그 아래에 있는 <span class="accent2">Claude Code의 핵심 구성 요소</span>를<br>
          같이 이해해야 합니다.
        </div>
      </div>
    `
  })},
  { page: 17, file: 'slide-17.html', html: wrapDivider({
    page: 17,
    section: 'PART 2',
    index: '02 · CLAUDE CODE',
    big: '프롬프트 몇 줄보다\n구성 요소의 조합이 더 중요합니다',
    desc: 'CLAUDE.md, MCP, hooks, subagents, skills, agent teams를 백과사전식으로 나열하기보다, 긴 프로젝트에서 어떤 역할을 하는지 중심으로 봅니다.'
  })},
  { page: 18, file: 'slide-18.html', html: wrap({
    page: 18,
    section: 'CLAUDE CODE',
    eyebrow: 'System map',
    title: 'Claude Code의 핵심 구성 요소 한 장 요약',
    subtitle: '이 발표의 관점에서 중요한 건 개념 암기가 아니라, 어디에 어떻게 써야 하는지입니다.',
    content: `
      <div class="diagram-panel">
        <div class="visual-col">
          <div class="visual-card contain pulse">
            <img src="./assets/claude-components-board.svg" alt="Claude Code components board">
          </div>
        </div>
        <div class="text-col">
          <div class="card"><h3>핵심 해석</h3><p>이 발표의 관점에서 중요한 건 개념 암기가 아니라, 어디에 어떤 역할을 맡겨야 긴 프로젝트가 흔들리지 않는지입니다.</p></div>
          <div class="chip-strip">
            <span class="chip">Memory</span>
            <span class="chip">MCP</span>
            <span class="chip">Hooks</span>
            <span class="chip">Subagents</span>
            <span class="chip">Skills</span>
            <span class="chip">Teams</span>
          </div>
        </div>
      </div>
    `
  })},
  { page: 19, file: 'slide-19.html', html: wrap({
    page: 19,
    section: 'CLAUDE CODE',
    eyebrow: 'Memory',
    title: 'CLAUDE.md와 메모리는 “기억력”이 아니라 “기준 유지 장치”입니다',
    subtitle: '긴 프로젝트에서 가장 무서운 건 코드보다 목표가 흔들리는 것입니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>메모리가 하는 일</h3>
          <ul>
            <li>프로젝트의 목적, 제약, 스타일 기준을 고정한다.</li>
            <li>세션이 길어져도 매번 같은 맥락으로 출발하게 만든다.</li>
            <li>중간에 불필요하게 재해석되는 것을 막는다.</li>
          </ul>
        </div>
        <div class="card">
          <h3>발표에서의 메시지</h3>
          <p>AI가 똑똑해도 기준이 없으면 흔들립니다. 메모리는 모델의 지능을 높여주는 것이 아니라, 팀이 같은 문서를 보고 일하게 만드는 효과를 만듭니다.</p>
        </div>
      </div>
    `
  })},
  { page: 20, file: 'slide-20.html', html: wrap({
    page: 20,
    section: 'CLAUDE CODE',
    eyebrow: 'MCP',
    title: 'MCP는 모델이 실제 환경과 만나는 포트입니다',
    subtitle: '문서와 코드만 보는 것에서 끝나지 않고, 외부 도구와 서비스까지 작업 반경을 넓혀줍니다.',
    content: `
      <div class="grid-3">
        <div class="card"><h3>Design</h3><p>Figma MCP 같은 연결로 디자인 자산을 바로 가져올 수 있습니다.</p></div>
        <div class="card"><h3>Research</h3><p>필요한 문서나 외부 정보를 작업 흐름 안으로 끌어옵니다.</p></div>
        <div class="card"><h3>Action</h3><p>AI가 말만 하는 것이 아니라 실제 툴과 데이터에 닿게 만듭니다.</p></div>
      </div>
      <div class="spacer-12"></div>
      <div class="callout"><p>초기 MCP 시대에 Netflix 실험이 강했던 이유도, 화면을 “설명”한 게 아니라 디자인 원본과 직접 연결했기 때문입니다.</p></div>
    `
  })},
  { page: 21, file: 'slide-21.html', html: wrap({
    page: 21,
    section: 'CLAUDE CODE',
    eyebrow: 'Hooks',
    title: 'Hooks는 자동 개입 지점입니다',
    subtitle: '긴 작업에서는 실행 전에 검사하고, 실행 후에 다시 점검하는 자동 루프가 중요합니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>왜 필요한가</h3>
          <ul>
            <li>사람은 매번 같은 체크를 빠뜨리기 쉽다.</li>
            <li>AI도 긴 컨텍스트에서는 기준을 놓치기 쉽다.</li>
            <li>Hook은 특정 시점마다 강제로 품질 게이트를 만든다.</li>
          </ul>
        </div>
        <div class="card">
          <h3>발표용 해석</h3>
          <p>Hook은 개발자에게 “다시 생각해”라고 말하는 자동 알림입니다. 일을 빠르게 하기 위한 기능이 아니라, 방향 이탈을 줄이기 위한 기능입니다.</p>
        </div>
      </div>
    `
  })},
  { page: 22, file: 'slide-22.html', html: wrap({
    page: 22,
    section: 'CLAUDE CODE',
    eyebrow: 'Subagents',
    title: '가장 핵심적인 구성 요소는 서브 에이전트입니다',
    subtitle: '실시간으로 역할을 만들고, 병렬로 돌릴 수 있다는 점이 긴 프로젝트에서 결정적입니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>서브 에이전트가 강한 이유</h3>
          <ul>
            <li>설계, 구현, 디버깅, 리뷰를 다른 관점으로 분리할 수 있다.</li>
            <li>서로 독립적인 일은 동시에 진행할 수 있다.</li>
            <li>하나의 모델에게 모든 역할을 억지로 시키지 않아도 된다.</li>
          </ul>
        </div>
        <div class="image-frame image-contain">
          <img src="./assets/agent-orchestra.svg" alt="Agent orchestra diagram">
        </div>
      </div>
    `
  })},
  { page: 23, file: 'slide-23.html', html: wrap({
    page: 23,
    section: 'CLAUDE CODE',
    eyebrow: 'Subagents vs teams',
    title: '서브 에이전트와 에이전트 팀은 다르게 생각해야 합니다',
    subtitle: '둘 다 병렬화이지만, 정보가 흐르는 방식이 다릅니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>Subagents</h3>
          <ul>
            <li>각자 역할을 수행한 뒤 오케스트레이터에게 결과를 전달</li>
            <li>실행 단위가 명확하고 빠르다</li>
            <li>중간 상호 토론은 제한적</li>
          </ul>
        </div>
        <div class="card">
          <h3>Agent teams</h3>
          <ul>
            <li>에이전트끼리 서로 피드백하며 보강</li>
            <li>더 많은 컨텍스트를 사용하지만 검토가 강해진다</li>
            <li>복잡한 아이데이션과 반박이 필요할 때 유리</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 24, file: 'slide-24.html', html: wrap({
    page: 24,
    section: 'CLAUDE CODE',
    eyebrow: 'Why it matters',
    title: '왜 병렬성이 중요한가',
    subtitle: '실제 개발에는 순서대로 하지 않아도 되는 단계가 훨씬 많습니다.',
    content: `
      <div class="list-large">
        <div class="row"><div class="dot">1</div><div class="text"><strong>설계 검토와 구현 준비</strong><p>설계 문서를 보고 구현 단위를 쪼개는 일은 동시에 달릴 수 있습니다.</p></div></div>
        <div class="row"><div class="dot">2</div><div class="text"><strong>리서치와 시각 아이데이션</strong><p>도메인 조사와 표현 방식 탐색은 서로를 막지 않습니다.</p></div></div>
        <div class="row"><div class="dot">3</div><div class="text"><strong>디버깅 가설 탐색</strong><p>서로 다른 원인 후보를 병렬로 좁혀갈 수 있습니다.</p></div></div>
        <div class="row"><div class="dot">4</div><div class="text"><strong>리뷰와 수정 분리</strong><p>만드는 역할과 평가하는 역할을 분리하면 자기합리화를 줄일 수 있습니다.</p></div></div>
      </div>
    `
  })},
  { page: 25, file: 'slide-25.html', html: wrap({
    page: 25,
    section: 'CLAUDE CODE',
    eyebrow: 'System view',
    title: '결국 Claude Code의 핵심은 “똑똑한 한 명”이 아닙니다',
    subtitle: '문서, 메모리, 역할 분리, 검증 루프를 가진 작업 시스템으로 봐야 합니다.',
    content: `
      <div class="centered" style="height:100%;">
        <div class="hero-statement">
          Claude Code의 핵심은<br>
          <span class="accent">한 명의 똑똑한 AI</span>가 아니라,<br>
          <span class="accent2">문서와 역할, 검증 루프를 가진 작업 시스템</span>입니다.
        </div>
      </div>
    `
  })},
  { page: 26, file: 'slide-26.html', html: wrapDivider({
    page: 26,
    section: 'PART 3',
    index: '03 · FRUIT GAME',
    big: '그럼 이 구조를 실제로 게임에 써보면\n어떻게 될까요?',
    desc: '실패했던 실험과 성공한 과일 게임을 대비해 보면, 바이브 코딩의 본질이 훨씬 선명하게 드러납니다.'
  })},
  { page: 27, file: 'slide-27.html', html: wrap({
    page: 27,
    section: 'FRUIT GAME',
    eyebrow: 'Start',
    title: '처음엔 어떤 게임을 만들지부터 막혔습니다',
    subtitle: '발표 요청을 받고 “바이브 코딩만으로 게임 개발”을 보여주려 했지만, 무엇을 선택할지가 가장 먼저 어려웠습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>초기 후보</h3>
          <ul>
            <li>다크소울 만들기</li>
            <li>마인크래프트 만들기</li>
            <li>큰 장르, 큰 기대, 큰 실패</li>
          </ul>
        </div>
        <div class="card">
          <h3>문제가 뭐였나</h3>
          <p>문제가 너무 컸고, 제가 엔진과 물리, 장르 구현 키워드를 제대로 모르는 상태였습니다. 즉 AI보다 먼저 제 쪽의 문제 정의가 틀려 있었습니다.</p>
        </div>
      </div>
    `
  })},
  { page: 28, file: 'slide-28.html', html: wrap({
    page: 28,
    section: 'FRUIT GAME',
    eyebrow: 'Failure',
    title: '실패 사례는 오히려 중요한 증거였습니다',
    subtitle: '딸깍 한 번으로 모든 게임이 되는 것이 아니라는 사실을 몸으로 확인했습니다.',
    content: `
      <div class="grid-2">
        <div class="video-frame">
          <video src="./assets/dark-soul.mp4" poster="./assets/dark-soul-poster.png" controls muted playsinline></video>
        </div>
        <div class="stack">
          <div class="card">
            <h3>왜 의미 있는 실패인가</h3>
            <ul>
              <li>문제가 너무 크면 AI도 좋은 답을 내기 어렵다.</li>
              <li>도메인 키워드를 모르면 올바른 지시도 못 내린다.</li>
              <li>바이브 코딩은 마법이 아니라, 문제 설정 능력의 시험이다.</li>
            </ul>
          </div>
          <div class="callout"><p>이 실패가 있었기 때문에, 나중에 왜 과일 게임이 성공했는지를 더 정확히 설명할 수 있게 됐습니다.</p></div>
        </div>
      </div>
    `
  })},
  { page: 29, file: 'slide-29.html', html: wrap({
    page: 29,
    section: 'FRUIT GAME',
    eyebrow: 'Why fail',
    title: '왜 실패했는가: 문제를 너무 크게 잡았고, 물리 키워드를 몰랐기 때문',
    subtitle: '게임 개발에서 AI를 잘 쓰려면, 적어도 무엇을 물어봐야 하는지는 알아야 합니다.',
    content: `
      <div class="diagram-panel">
        <div class="text-col">
          <div class="card"><h3>실패 이유 3개</h3><ul><li>도메인 이해 부족</li><li>스코프 과대</li><li>지시 불명확</li></ul></div>
          <div class="callout"><p>좋은 결과는 좋은 모델만이 아니라, 좋은 문제 정의에서 나옵니다.</p></div>
        </div>
        <div class="visual-col">
          <div class="visual-card contain">
            <img src="./assets/problem-scope-ladder.svg" alt="problem scope ladder">
          </div>
        </div>
      </div>
    `
  })},
  { page: 30, file: 'slide-30.html', html: wrap({
    page: 30,
    section: 'FRUIT GAME',
    eyebrow: 'Turning point',
    title: '전환점은 “수박 게임을 설명한 영상”이었습니다',
    subtitle: '결과보다 원리를 설명하는 자료를 만났을 때, AI에게 줄 수 있는 가이드라인이 생겼습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>왜 이 영상이 달랐나</h3>
          <ul>
            <li>중력을 어떻게 표현하는지</li>
            <li>충돌을 어떻게 판단하는지</li>
            <li>물리적으로 어떤 가정을 쓰는지</li>
          </ul>
          <p class="small-note" style="margin-top:10pt;">이건 단순한 영상이 아니라, AI에게 줄 수 있는 게임 메커닉 설명서였습니다.</p>
        </div>
        <div class="card">
          <h3>그래서 한 일</h3>
          <ul>
            <li>영상 스크립트를 정리</li>
            <li>Opus로 과일 게임 가이드 문서 작성</li>
            <li>아이디어가 아니라 문서 기반 설계 문제로 전환</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 31, file: 'slide-31.html', html: wrap({
    page: 31,
    section: 'FRUIT GAME',
    eyebrow: 'Real vibe coding',
    title: '진짜 바이브 코딩은 “과일 게임 만들어줘”가 아니었습니다',
    subtitle: '먼저 기획 문서를 만들고, 그 문서를 기준으로 첫 구현을 시켰습니다.',
    content: `
      <div class="diagram-panel">
        <div class="text-col">
          <div class="architecture">
            <div class="arch-box">
              <h3>Before</h3>
              <ul>
                <li>막연한 한 줄 요청</li>
                <li>도메인 이해 부족</li>
                <li>큰 문제를 그대로 던짐</li>
              </ul>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-box">
              <h3>After</h3>
              <ul>
                <li>게임 메커닉 가이드 문서</li>
                <li>역할 분리된 첫 구현</li>
                <li>검증 기준 포함</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="visual-col">
          <div class="visual-card contain">
            <img src="./assets/fruit-architecture.svg" alt="fruit game architecture system">
          </div>
        </div>
      </div>
    `
  })},
  { page: 32, file: 'slide-32.html', html: wrap({
    page: 32,
    section: 'FRUIT GAME',
    eyebrow: 'Version 1',
    title: '첫 구현은 Canvas + Vanilla JavaScript였습니다',
    subtitle: '이미 역할이 분리된 구조로 시작했기 때문에, 초기 버전인데도 설명 가능한 구조가 있었습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>첫 버전 파일 구조</h3>
          <ul>
            <li>Game.js</li>
            <li>Fruit.js</li>
            <li>Physics.js</li>
            <li>CollisionDetector.js</li>
            <li>GameState.js</li>
            <li>InputHandler.js</li>
          </ul>
        </div>
        <div class="card">
          <h3>문서가 명시한 것</h3>
          <ul>
            <li>중력과 마찰의 방식</li>
            <li>중심 거리와 반지름 합으로 충돌 판정</li>
            <li>겹친 과일을 어떻게 분리할지</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 33, file: 'slide-33.html', html: wrap({
    page: 33,
    section: 'FRUIT GAME',
    eyebrow: 'Version 1 proof',
    title: '처음부터 “돌아가는 척하는 프로토타입”은 아니었습니다',
    subtitle: '물리적으로 설명 가능한 게임이 나왔고, 이 단계에서만도 Jest 단위 테스트 51개를 통과했습니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/physics-diagram.svg" alt="Physics diagram">
        </div>
        <div class="stack">
          <div class="metric-grid">
            <div class="metric"><div class="label">tests</div><div class="value">51</div><div class="hint">초기 단계 Jest 단위 테스트</div></div>
            <div class="metric"><div class="label">core</div><div class="value">Physics</div><div class="hint">중력 · 마찰 · 충돌 분리</div></div>
          </div>
          <div class="card">
            <h3>이 단계의 의미</h3>
            <p>제가 직접 한 줄 한 줄 구현하지 않았더라도, 무엇을 검증해야 하는지와 어떤 단위로 쪼개야 하는지를 문서로 던졌기 때문에 가능한 결과였습니다.</p>
          </div>
        </div>
      </div>
    `
  })},
  { page: 34, file: 'slide-34.html', html: wrap({
    page: 34,
    section: 'FRUIT GAME',
    eyebrow: 'Migration',
    title: '그런데 “된다”와 “쓸 만하다”는 달랐습니다',
    subtitle: '그래서 곧바로 TypeScript + React + Cannon.js로의 마이그레이션 설계를 먼저 다시 만들었습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>설계 문서에서 정리한 것</h3>
          <ul>
            <li>Vite 도입</li>
            <li>engine 계층 분리</li>
            <li>React 컴포넌트 구조 설계</li>
            <li>Cannon-es 기반 물리 방향 전환</li>
          </ul>
        </div>
        <div class="image-frame image-contain">
          <img src="./assets/tech-evolution.svg" alt="Tech stack evolution">
        </div>
      </div>
    `
  })},
  { page: 35, file: 'slide-35.html', html: wrap({
    page: 35,
    section: 'FRUIT GAME',
    eyebrow: 'Lesson',
    title: '바이브 코딩에서 AI가 가장 잘하는 건 무에서 유보다 “재배치”입니다',
    subtitle: '바로 구현보다, 설계 후 구현이 훨씬 잘 먹혔던 이유입니다.',
    content: `
      <div class="compare">
        <div class="bad">
          <h3>바로 구현</h3>
          <ul>
            <li>방향이 자주 흔들린다.</li>
            <li>코드가 생겨도 구조가 남지 않는다.</li>
            <li>수정 시 전체가 다시 흔들린다.</li>
          </ul>
        </div>
        <div class="good">
          <h3>설계 후 구현</h3>
          <ul>
            <li>이미 정리된 구조를 더 나은 구조로 재배치한다.</li>
            <li>구현을 역할 단위로 분리하기 쉽다.</li>
            <li>사람이 유지보수 가능한 형태로 수렴한다.</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 36, file: 'slide-36.html', html: wrapDivider({
    page: 36,
    section: 'PART 4',
    index: '04 · ITERATE',
    big: '진짜 차이는\n여기서부터 벌어졌습니다',
    desc: '좋은 AI가 만든 첫 결과보다, 테스트와 피드백을 통해 어떻게 계속 밀어붙였는지가 이 프로젝트의 진짜 핵심입니다.'
  })},
  { page: 37, file: 'slide-37.html', html: wrap({
    page: 37,
    section: 'ITERATION',
    eyebrow: 'Product loop',
    title: '이후 흐름은 거의 사람 팀이 만드는 것과 비슷했습니다',
    subtitle: '플레이 테스트를 붙이고, 문제를 발견하고, 다시 문장으로 피드백해 수정하는 루프가 계속 반복됐습니다.',
    content: `
      <div class="diagram-panel">
        <div class="visual-col">
          <div class="visual-card contain pulse">
            <img src="./assets/feedback-loop.svg" alt="feedback loop">
          </div>
        </div>
        <div class="text-col">
          <div class="card"><h3>이 장면이 말하는 것</h3><p>핵심은 AI가 완벽한 답을 한 번에 낸 것이 아니라, 사람처럼 여러 차례 테스트하고 피드백을 먹이며 점점 더 완성도 높은 방향으로 밀어붙였다는 점입니다.</p></div>
          <div class="chip-strip">
            <span class="chip">Play test</span>
            <span class="chip">Bug trace</span>
            <span class="chip">Design polish</span>
            <span class="chip">Browser verify</span>
          </div>
        </div>
      </div>
    `
  })},
  { page: 38, file: 'slide-38.html', html: wrap({
    page: 38,
    section: 'ITERATION',
    eyebrow: 'Bug 1',
    title: '버그 사례 1: 스페이스 키가 안 먹고, 페이지는 스크롤됐습니다',
    subtitle: '문제는 입력 처리만이 아니라 React StrictMode와 lifecycle까지 걸쳐 있었습니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/react-bug.svg" alt="React StrictMode bug diagram">
        </div>
        <div class="card">
          <h3>왜 흥미로운 버그였나</h3>
          <ul>
            <li><code>preventDefault()</code> 누락으로 페이지 스크롤 발생</li>
            <li>StrictMode에서 <code>useEffect</code>가 두 번 돌며 리스너 소실</li>
            <li>코드만 눈으로 보면 놓치기 쉬운 유형</li>
          </ul>
          <div class="spacer-8"></div>
          <p class="small-note">즉 “왜 안 되지?”라는 질문 뒤에 브라우저 동작, React lifecycle, 입력 시스템이 동시에 얽혀 있었습니다.</p>
        </div>
      </div>
    `
  })},
  { page: 39, file: 'slide-39.html', html: wrap({
    page: 39,
    section: 'ITERATION',
    eyebrow: 'Bug 2',
    title: '버그 사례 2: 과일은 사라졌는데 물리 바디는 남아 있었습니다',
    subtitle: 'CollisionHandler와 physics layer 사이의 불일치가 만든 전형적인 계층 경계 버그였습니다.',
    content: `
      <div class="compare">
        <div class="bad">
          <h3>Before</h3>
          <ul>
            <li>데이터만 제거</li>
            <li>화면상으로는 합쳐진 것처럼 보임</li>
            <li>하지만 physics body가 남아서 이상 동작 발생</li>
          </ul>
        </div>
        <div class="good">
          <h3>After</h3>
          <ul>
            <li>물리와 데이터를 함께 제거</li>
            <li>경계가 맞아 떨어지도록 수정</li>
            <li>겉보기 수정이 아니라 구조 수정이 됨</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 40, file: 'slide-40.html', html: wrap({
    page: 40,
    section: 'ITERATION',
    eyebrow: 'Bug 3',
    title: '버그 사례 3: 첫 프레임에서 과일이 안 보이는 비동기 레이스 컨디션',
    subtitle: 'data URI 기반 이미지도 결국 비동기라는 사실이 첫 프레임 공백을 만들었습니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/svg-race.svg" alt="SVG async race condition diagram">
        </div>
        <div class="card">
          <h3>무엇을 배웠나</h3>
          <ul>
            <li>문제는 종종 “렌더링”이 아니라 “타이밍”에 있다.</li>
            <li>비동기 자체를 없애는 쪽이 더 좋은 해결일 수 있다.</li>
            <li>작은 <code>&lt;rect&gt;</code> 기반 픽셀 아트는 오히려 동기 렌더링으로 전환할 수 있었다.</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 41, file: 'slide-41.html', html: wrap({
    page: 41,
    section: 'ITERATION',
    eyebrow: 'Feedback loop',
    title: '흥미로운 건, 많은 개선이 거대한 프롬프트가 아니라 생활어에서 나왔다는 점입니다',
    subtitle: '제품을 만지면서 느끼는 문장을 그대로 피드백으로 썼습니다.',
    content: `
      <div class="stack">
        <div class="card"><h3>실제 피드백들</h3><p class="quote" style="font-size:18pt;">“왜 시작할 때 공은 과일처럼 안 보이지?”<br>“왜 스폰 프리뷰에 원형 테두리가 없지?”<br>“왜 스페이스를 누르고 나면 현재 커서가 안 보이지?”</p></div>
        <div class="callout"><p>즉 프롬프트는 장문의 지시문만이 아닙니다. 사람처럼 제품을 만지고 느낀 작은 문장을 수정 루프로 빨리 넣는 것이 더 중요했습니다.</p></div>
      </div>
    `
  })},
  { page: 42, file: 'slide-42.html', html: wrap({
    page: 42,
    section: 'ITERATION',
    eyebrow: 'Validation',
    title: 'Playwright를 붙였을 때부터 버그는 감이 아니라 사건이 됐습니다',
    subtitle: '실제로 브라우저를 열어 재현하게 하면, 눈으로 놓치기 쉬운 문제도 구조적으로 다룰 수 있습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>Playwright가 한 역할</h3>
          <ul>
            <li>입력 버그를 재현 가능한 동작으로 바꿈</li>
            <li>브라우저 레벨 문제를 코드 문제와 연결</li>
            <li>수정 후 다시 검증하는 루프를 자동화</li>
          </ul>
        </div>
        <div class="card">
          <h3>발표용 메시지</h3>
          <p>AI가 코드를 생성하는 것만으로는 프로젝트가 완성되지 않습니다. 실제 환경에서 다시 확인하는 순간부터 품질의 언어가 달라집니다.</p>
        </div>
      </div>
    `
  })},
  { page: 43, file: 'slide-43.html', html: wrap({
    page: 43,
    section: 'ITERATION',
    eyebrow: 'Asset generation',
    title: '시각 자산은 Claude 혼자서가 아니라 역할을 나눠 만들었습니다',
    subtitle: 'Gemini는 11개 과일 SVG 같은 강점 영역에만 제한적으로 사용했습니다.',
    content: `
      <div class="grid-2">
        <div class="card">
          <h3>멀티 모델 전략</h3>
          <ul>
            <li>Claude Code: 구조, 구현, 디버깅, 오케스트레이션</li>
            <li>Gemini: SVG 디자인과 비주얼 생성</li>
            <li>즉 “모델 하나를 신봉”한 게 아니라, 강점에 맞게 배치</li>
          </ul>
        </div>
        <div class="image-frame image-contain">
          <img src="./assets/pixel-fruits.svg" alt="Pixel fruit assets">
        </div>
      </div>
    `
  })},
  { page: 44, file: 'slide-44.html', html: wrap({
    page: 44,
    section: 'ITERATION',
    eyebrow: 'Expansion',
    title: '기능은 여기서 끝나지 않았습니다: 모바일과 리디자인으로 확장했습니다',
    subtitle: '되는 게임을 넘어서, 보여줄 수 있는 게임으로 가는 단계였습니다.',
    content: `
      <div class="grid-3">
        <div class="card"><h3>모바일 대응</h3><p>터치 좌표 변환, iOS 바운스 방지, 뷰포트 고정</p></div>
        <div class="card"><h3>브랜딩 요소</h3><p>체리 SVG 파비콘, 네온 톤, 레트로 HUD 정리</p></div>
        <div class="card"><h3>리디자인</h3><p>팩맨 같은 오락실 감성으로 분위기를 완전히 재정의</p></div>
      </div>
    `
  })},
  { page: 45, file: 'slide-45.html', html: wrap({
    page: 45,
    section: 'ITERATION',
    eyebrow: 'Redesign',
    title: '아케이드 리디자인은 단순한 예쁘게 꾸미기가 아니었습니다',
    subtitle: '검정 배경, 네온 글로우, 픽셀 아트는 제품 인상을 바꾸는 전략적 전환점이었습니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/arcade-palette.svg" alt="Arcade palette">
        </div>
        <div class="card">
          <h3>왜 전환점이었나</h3>
          <ul>
            <li>기능 중심 데모에서, 기억에 남는 경험으로 이동</li>
            <li>발표에서 보여줄 가치가 생김</li>
            <li>리디자인도 문서와 계획을 먼저 만든 뒤 실행</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 46, file: 'slide-46.html', html: wrap({
    page: 46,
    section: 'ITERATION',
    eyebrow: 'Progress',
    title: '여정 전체를 보면 “기술 스택 진화”보다 “완성도 진화”에 가깝습니다',
    subtitle: 'Vanilla JS에서 React로 간 것도 중요하지만, 진짜 변화는 제품 완성도였습니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/session-timeline.svg" alt="Session timeline">
        </div>
        <div class="card">
          <h3>진화의 방향</h3>
          <ul>
            <li>작동하는 프로토타입</li>
            <li>구조가 있는 코드베이스</li>
            <li>디버깅 가능한 제품</li>
            <li>보여줄 수 있는 디자인</li>
            <li>발표 가능한 완성도</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 47, file: 'slide-47.html', html: wrap({
    page: 47,
    section: 'ITERATION',
    eyebrow: 'Visual payoff',
    title: '결국 이런 비주얼까지 왔습니다',
    subtitle: '픽셀 아트 과일, 검은 배경, HUD UI가 붙으면서 “실험”이 “작품”처럼 보이기 시작했습니다.',
    content: `
      <div class="grid-2">
        <div class="image-frame image-contain">
          <img src="./assets/pixel-fruits.svg" alt="Pixel fruits set">
        </div>
        <div class="stack">
          <div class="card">
            <h3>좋았던 점</h3>
            <ul>
              <li>주제와 어울리는 강한 스타일 확보</li>
              <li>게임 메커닉만이 아니라 감정적 인상까지 강화</li>
              <li>발표 중간 시각 피로를 줄이는 리듬 포인트</li>
            </ul>
          </div>
          <div class="badge-row">
            <span class="badge">Black background</span>
            <span class="badge">Neon UI</span>
            <span class="badge">Pixel fruits</span>
            <span class="badge">Arcade mood</span>
          </div>
        </div>
      </div>
    `
  })},
  { page: 48, file: 'slide-48.html', html: wrap({
    page: 48,
    section: 'ITERATION',
    eyebrow: 'Result',
    title: '최종 결과를 숫자로 보면 더 선명합니다',
    subtitle: '짧은 시간 안에 끝났다는 점보다, 설계-구현-검증-개선-리디자인이 다 돌아갔다는 점이 더 중요합니다.',
    content: `
      <div class="metric-grid">
        <div class="metric"><div class="label">sessions</div><div class="value">10</div><div class="hint">개발 세션</div></div>
        <div class="metric"><div class="label">commits</div><div class="value">22</div><div class="hint">짧은 기간 내 누적 기록</div></div>
        <div class="metric"><div class="label">duration</div><div class="value">2일</div><div class="hint">집중 제작 기간</div></div>
        <div class="metric"><div class="label">manual code</div><div class="value">0줄</div><div class="hint">직접 입력한 코드 기준</div></div>
      </div>
      <div class="spacer-12"></div>
      <div class="card">
        <h3>이 숫자를 해석하는 방식</h3>
        <p>이건 단순한 속도 자랑이 아닙니다. 도메인 선정, 설계 문서화, 버그 추적, 브라우저 검증, 리디자인까지 돌아간 “공정”이 2일 안에 밀도 높게 수행됐다는 의미입니다.</p>
      </div>
    `
  })},
  { page: 49, file: 'slide-49.html', html: wrapDivider({
    page: 49,
    section: 'PART 5',
    index: '05 · HARNESS',
    big: '여기서부터가\n오늘 발표의 진짜 핵심입니다',
    desc: '왜 이 프로젝트가 단순한 AI 생성 결과물이 아니라, 운영 방식 설계의 결과물이라고 말할 수 있는지 설명합니다.'
  })},
  { page: 50, file: 'slide-50.html', html: wrap({
    page: 50,
    section: 'HARNESS',
    eyebrow: 'Definition',
    title: 'Harness Engineering이란 무엇인가',
    subtitle: '모델에게 말을 잘 거는 기술만이 아니라, 모델이 일하는 환경과 검증 루프를 함께 설계하는 방식입니다.',
    content: `
      <div class="diagram-panel">
        <div class="visual-col">
          <div class="visual-card contain pulse">
            <img src="./assets/harness-blueprint.svg" alt="harness blueprint">
          </div>
        </div>
        <div class="text-col">
          <div class="card">
            <h3>짧은 정의</h3>
            <p class="quote" style="font-size:16px;">프롬프트를 잘 쓰는 것<br>+<br>Claude Code가 잘 일하도록 <span class="accent">작업 환경을 설계하는 것</span></p>
          </div>
          <div class="callout"><p>좋은 결과는 좋은 모델에서만이 아니라 좋은 harness에서 나옵니다.</p></div>
        </div>
      </div>
    `
  })},
  { page: 51, file: 'slide-51.html', html: wrap({
    page: 51,
    section: 'HARNESS',
    eyebrow: 'Mental model',
    title: '잘못된 그림과 더 나은 그림',
    subtitle: '이 프로젝트를 이해할 때 가장 피해야 할 오해는 “Claude Code가 알아서 만들었다”는 해석입니다.',
    content: `
      <div class="compare">
        <div class="bad">
          <h3>나쁜 설명</h3>
          <ul>
            <li>Prompt → Claude Code → Output</li>
            <li>모델 하나가 처음부터 끝까지 다 해줌</li>
            <li>결과가 좋으면 모델 덕분, 나쁘면 모델 탓</li>
          </ul>
        </div>
        <div class="good">
          <h3>좋은 설명</h3>
          <ul>
            <li>Goal → Plan → Agents → Tools → Verify → Iterate → Product</li>
            <li>계획, 역할 분리, 검증, 반복이 같이 돌아감</li>
            <li>결과 품질은 운영 방식 설계에 달려 있음</li>
          </ul>
        </div>
      </div>
    `
  })},
  { page: 52, file: 'slide-52.html', html: wrap({
    page: 52,
    section: 'HARNESS',
    eyebrow: 'Architecture',
    title: 'Claude Code를 “천재 개발자”보다 “잘 세팅된 오락실 기판”으로 보는 편이 맞습니다',
    subtitle: '현재 발표의 레트로 아케이드 톤과도 잘 맞는 비유입니다.',
    content: `
      <div class="diagram-panel">
        <div class="visual-col">
          <div class="visual-card contain">
            <img src="./assets/harness-blueprint.svg" alt="arcade board metaphor">
          </div>
        </div>
        <div class="text-col">
          <div class="matrix">
            <div class="cell"><h4>Model = CPU</h4><p>중앙에서 추론하지만 혼자서 모든 것을 보장하진 않는다.</p></div>
            <div class="cell"><h4>Plans = 회로도</h4><p>작업의 방향과 연결 관계를 먼저 정리한다.</p></div>
            <div class="cell"><h4>Subagents = 모듈 보드</h4><p>역할별로 다른 처리 회로가 붙는다.</p></div>
            <div class="cell"><h4>MCP / Tools = 포트</h4><p>외부 세계와 닿게 만드는 연결 지점</p></div>
            <div class="cell"><h4>Playwright = 테스트 장비</h4><p>실행 환경에서 실제로 확인하는 계측기</p></div>
            <div class="cell"><h4>Review loop = 진단 모니터</h4><p>이상 징후를 다시 구조 문제로 연결</p></div>
          </div>
        </div>
      </div>
    `
  })},
  { page: 53, file: 'slide-53.html', html: wrap({
    page: 53,
    section: 'HARNESS',
    eyebrow: 'Project mapping',
    title: '이 저장소에 대입하면 harness는 이렇게 작동했습니다',
    subtitle: '이건 이론이 아니라 실제 프로젝트 운영 지도입니다.',
    content: `
      <div class="process-diagram">
        <div class="process-step"><h4>Plan</h4><p>기획 문서와 설계 문서를 먼저 만든다</p></div>
        <div class="process-step"><h4>Build</h4><p>구현 역할에게 문서 기준으로 작업시킨다</p></div>
        <div class="process-step"><h4>Review</h4><p>code-reviewer와 다른 시각으로 중간 품질 점검</p></div>
        <div class="process-step"><h4>Run</h4><p>Playwright로 실제 브라우저 동작을 확인</p></div>
        <div class="process-step"><h4>Debug</h4><p>가설 기반 디버깅으로 원인을 좁혀간다</p></div>
        <div class="process-step"><h4>Iterate</h4><p>자연어 피드백과 리디자인까지 다시 루프에 넣는다</p></div>
      </div>
    `
  })},
  { page: 54, file: 'slide-54.html', html: wrap({
    page: 54,
    section: 'HARNESS',
    eyebrow: 'Planner / Generator / Evaluator',
    title: '핵심은 생성과 검증을 분리하는 것입니다',
    subtitle: '긴 개발 작업에서 planner, generator, evaluator를 분리하면 자기합리화를 막을 수 있습니다.',
    content: `
      <div class="diagram-panel">
        <div class="visual-col">
          <div class="visual-card contain pulse">
            <img src="./assets/harness-blueprint.svg" alt="planner generator evaluator split">
          </div>
        </div>
        <div class="text-col">
          <div class="grid-3">
            <div class="card"><h3>Planner</h3><p>스펙, 제약, 완료 조건, 우선순위 정리</p></div>
            <div class="card"><h3>Generator</h3><p>실제 구현과 수정, 디자인 반영</p></div>
            <div class="card"><h3>Evaluator</h3><p>브라우저 실행, 코드 리뷰, 사용자 관점 검증</p></div>
          </div>
          <div class="callout"><p>한 명의 AI에게 처음부터 끝까지 맡기면, 길어질수록 방향을 잃거나 자기 결과를 과대평가하기 쉽습니다. 그래서 역할 분리가 필수입니다.</p></div>
        </div>
      </div>
    `
  })},
  { page: 55, file: 'slide-55.html', html: wrap({
    page: 55,
    section: 'HARNESS',
    eyebrow: 'What changed',
    title: '그래서 바이브 코딩에서 손이 가야 하는 위치가 바뀝니다',
    subtitle: '핵심은 손을 안 대는 게 아니라, 손이 키보드 코드 입력에서 문서와 검증, 오케스트레이션으로 이동한다는 점입니다.',
    content: `
      <div class="diagram-panel">
        <div class="visual-col">
          <div class="visual-card contain pulse">
            <img src="./assets/role-shift.svg" alt="role shift from coding to system design">
          </div>
        </div>
        <div class="text-col">
          <div class="compare">
            <div class="bad">
              <h3>예전의 손</h3>
              <ul>
                <li>코드를 직접 친다</li>
                <li>구현 세부를 직접 관리한다</li>
                <li>테스트와 리뷰도 같은 머리로 처리한다</li>
              </ul>
            </div>
            <div class="good">
              <h3>지금의 손</h3>
              <ul>
                <li>문서를 만든다</li>
                <li>검증 기준을 정한다</li>
                <li>역할을 나누고 작업을 오케스트레이션한다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  })},
  { page: 56, file: 'slide-56.html', html: wrap({
    page: 56,
    section: 'CLOSING',
    eyebrow: 'Conclusion',
    title: '제가 내린 결론',
    subtitle: '바이브 코딩은 운 좋은 한 방이 아니라, 잘게 쪼개고 계속 검증하는 개발 공정 그 자체에 더 가깝습니다.',
    content: `
      <div class="stack">
        <div class="card">
          <p class="quote">AI 시대 개발자의 경쟁력은<br><span class="accent">프롬프트를 그럴듯하게 쓰는 능력</span>보다,<br><span class="accent2">에이전트가 잘 일하도록 작업 시스템을 설계하는 능력</span>에 더 가까워지고 있습니다.</p>
        </div>
        <div class="metric-grid">
          <div class="metric"><div class="label">one line</div><div class="value">문서화</div><div class="hint">기준을 고정한다</div></div>
          <div class="metric"><div class="label">one line</div><div class="value">Subagents</div><div class="hint">역할을 분리한다</div></div>
          <div class="metric"><div class="label">one line</div><div class="value">Validation</div><div class="hint">실행 환경에서 검증한다</div></div>
          <div class="metric"><div class="label">one line</div><div class="value">Harness</div><div class="hint">끝까지 완성시킨다</div></div>
        </div>
      </div>
    `
  })},
  { page: 57, file: 'slide-57.html', html: wrap({
    page: 57,
    section: 'CLOSING',
    eyebrow: 'Takeaways',
    title: '오늘 가져가면 좋은 세 문장',
    subtitle: '발표 후 기억에 남아야 할 메시지는 많지 않아도 됩니다. 대신 선명해야 합니다.',
    content: `
      <div class="list-large">
        <div class="row"><div class="dot">1</div><div class="text"><strong>문서화 없는 바이브 코딩은 오래 못 간다</strong><p>긴 프로젝트일수록 목표, 제약, 완료 조건을 문서로 남겨야 한다.</p></div></div>
        <div class="row"><div class="dot">2</div><div class="text"><strong>좋은 프롬프트보다 좋은 운영 방식이 중요하다</strong><p>설계, 구현, 리뷰, 검증을 분리하면 결과 품질이 달라진다.</p></div></div>
        <div class="row"><div class="dot">3</div><div class="text"><strong>좋은 결과는 좋은 모델에서만 나오지 않는다</strong><p>좋은 harness가 있어야 에이전트가 끝까지 올바르게 일한다.</p></div></div>
      </div>
    `
  })},
  { page: 58, file: 'slide-58.html', html: wrap({
    page: 58,
    section: 'CLOSING',
    eyebrow: 'Q&A',
    title: 'Q&A',
    subtitle: '임근석 · 쓸모랩 / 우리기획',
    content: `
      <div class="centered" style="height:100%;">
        <div class="hero-statement">
          질문 받겠습니다.<br>
          <span class="accent">vibe coding</span>은 결국<br>
          <span class="accent2">개발 공정 설계</span>의 문제였습니다.
        </div>
      </div>
    `
  })},
];

const slideOutline = `# Vibe Coding 40분 발표 슬라이드 아웃라인

- 총 슬라이드 수: ${slides.length}
- 발표자: ${deckMeta.speaker}
- 회사: ${deckMeta.companies}
- 날짜: ${deckMeta.date}

## 구성

1. Opening
2. Documentation / Skills
3. Claude Code core components
4. Fruit game case study
5. Iteration and redesign
6. Harness engineering
7. Closing / Q&A
`;

const viewerHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${deckMeta.title}</title>
  <link rel="icon" href="./assets/vibe-coding-twitter-ko.png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #05070d;
      font-family: 'Pretendard', system-ui, sans-serif;
      color: #f5f7ff;
    }
    .app {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background:
        radial-gradient(circle at top right, rgba(79,125,255,0.14), transparent 30%),
        radial-gradient(circle at bottom left, rgba(103,213,255,0.08), transparent 25%),
        linear-gradient(180deg, #070b14 0%, #04060c 100%);
    }
    .bar {
      height: 52px;
      border-bottom: 1px solid rgba(122,154,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      position: relative;
      background: rgba(4,6,12,0.82);
      backdrop-filter: blur(10px);
      flex-shrink: 0;
    }
    .brand {
      position: absolute;
      left: 16px;
      font-size: 11px;
      color: #86a7ff;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .bar button {
      border: 1px solid rgba(122,154,255,0.2);
      background: rgba(255,255,255,0.04);
      color: #f5f7ff;
      border-radius: 999px;
      padding: 7px 14px;
      font-size: 12px;
      cursor: pointer;
    }
    .bar button:hover { background: rgba(255,255,255,0.08); }
    .bar button:disabled { opacity: 0.3; cursor: default; }
    .counter {
      min-width: 64px;
      text-align: center;
      color: #9aa7c7;
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }
    .fs {
      position: absolute;
      right: 16px;
    }
    .viewport {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 16px;
    }
    .scaler {
      width: 720px;
      height: 405px;
      position: relative;
      transform-origin: center center;
    }
    .slide-frame {
      position: absolute;
      inset: 0;
      width: 720px;
      height: 405px;
      border: none;
      background: #000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      border-radius: 16px;
      box-shadow: 0 18px 48px rgba(0,0,0,0.35);
    }
    .slide-frame.active {
      opacity: 1;
      pointer-events: auto;
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="bar">
      <div class="brand">${deckMeta.speaker} · ${deckMeta.companies}</div>
      <button id="prev">Prev</button>
      <div class="counter" id="counter">1 / ${slides.length}</div>
      <button id="next">Next</button>
      <button class="fs" id="fs">Fullscreen</button>
    </div>
    <div class="viewport" id="viewport">
      <div class="scaler" id="scaler">
        ${slides.map((slide, index) => `<iframe class="slide-frame${index === 0 ? ' active' : ''}" data-slide="${index + 1}" src="./${slide.file}" loading="lazy" allowfullscreen></iframe>`).join('\n        ')}
      </div>
    </div>
  </div>
  <script>
    const TOTAL = ${slides.length};
    let current = 1;
    const frames = Array.from(document.querySelectorAll('.slide-frame'));
    const counter = document.getElementById('counter');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const scaler = document.getElementById('scaler');
    const viewport = document.getElementById('viewport');

    function render() {
      frames.forEach((frame, index) => frame.classList.toggle('active', index === current - 1));
      counter.textContent = current + ' / ' + TOTAL;
      prev.disabled = current === 1;
      next.disabled = current === TOTAL;
    }

    function goTo(index) {
      current = Math.max(1, Math.min(TOTAL, index));
      render();
    }

    function rescale() {
      const scale = Math.min(viewport.clientWidth / 720, viewport.clientHeight / 405) * 0.98;
      scaler.style.transform = 'scale(' + scale + ')';
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));
    document.getElementById('fs').addEventListener('click', async () => {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen().catch(() => {});
      else await document.exitFullscreen().catch(() => {});
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        goTo(current + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(current - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(1);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(TOTAL);
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        document.getElementById('fs').click();
      }
    });

    window.addEventListener('resize', rescale);
    document.addEventListener('fullscreenchange', () => setTimeout(rescale, 50));
    render();
    rescale();
  </script>
</body>
</html>`;

async function main() {
  await mkdir(path.join(root, 'decks'), { recursive: true });
  await rm(deckDir, { recursive: true, force: true });
  await mkdir(assetsDir, { recursive: true });
  await writeFile(path.join(deckDir, 'theme.css'), themeCss, 'utf8');
  await writeFile(path.join(deckDir, 'slide-outline.md'), slideOutline, 'utf8');
  await writeFile(path.join(deckDir, 'viewer.html'), viewerHtml, 'utf8');

  for (const slide of slides) {
    await writeFile(path.join(deckDir, slide.file), slide.html, 'utf8');
  }

  const assetsToCopy = [
    ['docs/assets/vibe-coding-twitter-en.png', 'vibe-coding-twitter-en.png'],
    ['docs/assets/vibe-coding-twitter-ko.png', 'vibe-coding-twitter-ko.png'],
    ['docs/assets/miniflex.mp4', 'miniflex.mp4'],
    ['docs/assets/dark-soul.mp4', 'dark-soul.mp4'],
    ['docs/assets/mermaid-diagram.png', 'mermaid-diagram.png'],
    ['slides/assets/agent-orchestra.svg', 'agent-orchestra.svg'],
    ['slides/assets/arcade-palette.svg', 'arcade-palette.svg'],
    ['slides/assets/dev-cycle.svg', 'dev-cycle.svg'],
    ['slides/assets/physics-diagram.svg', 'physics-diagram.svg'],
    ['slides/assets/pixel-fruits.svg', 'pixel-fruits.svg'],
    ['slides/assets/react-bug.svg', 'react-bug.svg'],
    ['slides/assets/session-timeline.svg', 'session-timeline.svg'],
    ['slides/assets/svg-race.svg', 'svg-race.svg'],
    ['slides/assets/tech-evolution.svg', 'tech-evolution.svg'],
  ];

  for (const [from, to] of assetsToCopy) {
    await copyFile(path.join(root, from), path.join(assetsDir, to));
  }

  for (const [filename, svg] of Object.entries(customSvgAssets)) {
    await writeFile(path.join(assetsDir, filename), svg.trim(), 'utf8');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

