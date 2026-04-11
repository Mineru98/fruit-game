# Harness Engineering 관점에서 본 이 프로젝트

## 한 줄 정의

`harness engineering`은 모델에게 말을 잘 거는 기술만이 아니라,
모델이 일하는 `환경`, `도구`, `역할 분리`, `메모리`, `검증 루프`, `안전 장치`를 함께 설계하는 방식입니다.

이 발표에서는 이 개념을 이렇게 번역하는 편이 좋습니다.

`Claude Code를 잘 쓴다 = 프롬프트를 잘 쓰는 것 + Claude Code가 잘 일하도록 작업 환경을 설계하는 것`

## 왜 이 발표에 중요한가

지금 발표가 단순히 `AI가 게임을 만들어줬다`로 들리면 메시지가 약합니다.
반대로 이렇게 들리면 강해집니다.

`이 프로젝트는 Claude Code를 그냥 사용한 게 아니라, 계획-위임-리뷰-검증이 돌아가도록 harness를 설계해서 완성했다`

즉 발표의 핵심은 `모델 성능 자랑`이 아니라 `운영 방식 설계`입니다.

## 외부 자료 기준으로 본 핵심 구성 요소

Anthropic 공식 문서와 관련 자료를 기준으로 보면, Claude Code에서 harness에 해당하는 축은 대체로 아래입니다.

1. 메모리와 프로젝트 지침
- `CLAUDE.md`, 프로젝트 컨텍스트, 메모리 파일
- 세션이 달라져도 일관된 기준을 유지하게 함

2. 역할 분리
- 서브에이전트
- 설계, 구현, 리뷰, 디버깅을 같은 문맥창에서 한꺼번에 하지 않게 함

3. 도구 연결
- MCP, 셸, 브라우저 자동화, 파일 시스템
- 모델이 추상 답변이 아니라 실제 작업을 하게 만듦

4. 자동 개입 지점
- hooks
- 특정 도구 실행 전후에 검사, 차단, 알림, 정책 주입 가능

5. 검증 루프
- 코드 리뷰, 브라우저 테스트, 재현 가능한 디버깅
- `만들었다`가 아니라 `검증했다`로 품질 기준을 올림

## 이 프로젝트에 대입하면

이 저장소에서는 harness engineering을 이렇게 설명할 수 있습니다.

### 1. 계획을 먼저 만드는 구조

이 프로젝트는 처음부터 코드만 찍지 않았습니다.
`docs/superpowers/plans/`와 `docs/superpowers/specs/`에 기획서와 설계 문서를 먼저 만들고,
그 문서를 기준으로 구현과 리디자인을 진행했습니다.

이건 단순 프롬프트 엔지니어링이 아니라 `작업 순서를 통제하는 harness`입니다.

### 2. 역할을 나누는 구조

발표에 이미 나온 `architect`, `planner`, `executor`, `debugger`, `code-reviewer` 같은 역할 분리는
곧 harness engineering의 핵심 사례입니다.

한 모델에게 다 맡기지 않고:
- 설계는 설계대로
- 구현은 구현대로
- 디버깅은 디버깅대로
- 리뷰는 리뷰대로

분리해서 다뤘기 때문에 품질이 올라갔습니다.

### 3. 자연어 피드백을 작업 루프로 바꾼 구조

`왜 시작할 때 공은 과일로 안되어 있어?`
`스페이스 누르면 동작 안 하네?`

이런 문장은 단순 잡담이 아니라, Claude Code에게 들어가는 `운영 입력`이었습니다.
중요한 건 프롬프트를 길게 쓰는 게 아니라, 작은 피드백이 바로 수정-검증 루프로 들어가게 한 점입니다.

### 4. 브라우저 검증을 붙인 구조

`playwright-cli`를 통해 실제 브라우저에서 재현하고,
버그를 감이 아니라 사건으로 만든 점도 harness engineering입니다.

모델이 코드를 썼다고 끝내지 않고,
실행 환경에서 다시 확인하게 만드는 것이기 때문입니다.

### 5. 외부 모델을 제한적으로 섞는 구조

Gemini는 디자인과 SVG 생성처럼 강점이 분명한 곳에만 사용하고,
전체 오케스트레이션은 Claude Code가 맡았습니다.

이 역시 `모델 하나를 신봉`한 게 아니라,
각 모델을 어디에 써야 하는지 정한 harness 설계라고 설명할 수 있습니다.

## 발표에서 이렇게 말하면 좋다

### 나쁜 설명

`Claude Code가 알아서 게임을 만들어줬습니다.`

이 문장은 결과는 전달하지만, 왜 잘 됐는지는 설명하지 못합니다.

### 좋은 설명

`이 프로젝트는 Claude Code에 한 번에 맡겨서 완성한 게 아닙니다.`
`기획 문서를 만들고, 역할을 나누고, 브라우저에서 검증하고, 버그를 다시 자연어로 되먹임하는 harness를 만들었기 때문에 완성할 수 있었습니다.`

## 발표용 핵심 문장 후보

- `프롬프트만 잘 쓴다고 프로젝트가 완성되지는 않습니다. Claude Code가 잘 일하도록 환경을 설계해야 합니다.`
- `이 발표의 핵심은 AI가 똑똑했다가 아니라, Claude Code가 잘 일하도록 harness를 만들었다는 점입니다.`
- `좋은 결과는 좋은 모델에서만 나오지 않습니다. 좋은 harness에서 나옵니다.`
- `계획, 역할 분리, 브라우저 검증, 리뷰 루프. 이 네 가지가 이 프로젝트의 진짜 엔진이었습니다.`

## 슬라이드로 시각화할 때 좋은 포인트

### 추천 비유

Claude Code를 `천재 개발자`처럼 그리지 말고 `잘 세팅된 오락실 기판`처럼 보여주는 편이 좋습니다.

- 모델 = CPU
- 서브에이전트 = 보드별 모듈
- 계획 문서 = 회로도
- Playwright = 테스트 장비
- 리뷰 루프 = 진단 모니터
- hooks / memory / MCP = 배선과 입출력 포트

이 비유가 현재 레트로 아케이드 발표 톤과도 잘 맞습니다.

### 추천 도식 1

`Prompt -> Claude Code -> Output`

이런 단선 구조 대신

`Goal -> Plan -> Agents -> Tools -> Verify -> Iterate -> Product`

구조로 보여줘야 합니다.

### 추천 도식 2

`모델 중심 그림`보다 `운영 시스템 그림`이 좋습니다.

- 가운데: Claude Code
- 좌측: 목표, 기획, 메모리
- 상단: 서브에이전트
- 우측: Playwright, Gemini, 파일, Git
- 하단: 리뷰, 테스트, 디버깅, 반복 개선

## 이 발표에 넣으면 좋은 결론

이 프로젝트를 가능하게 한 건 `좋은 모델` 하나가 아니라,
Claude Code가 계획하고, 위임하고, 검증하고, 반복할 수 있게 만든 harness였습니다.

그래서 발표의 결론은 이렇게 가는 게 좋습니다.

`AI 시대 개발자의 경쟁력은 프롬프트 문장력보다, 에이전트가 잘 일하도록 작업 시스템을 설계하는 능력에 더 가까워지고 있다.`

## 참고 자료

- Anthropic, Claude Code Subagents
  https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Anthropic, Claude Code Hooks Reference
  https://docs.anthropic.com/en/docs/claude-code/hooks
- Anthropic, Manage Claude's Memory
  https://docs.anthropic.com/en/docs/claude-code/memory
- Anthropic, Connect Claude Code to tools via MCP
  https://docs.anthropic.com/en/docs/claude-code/mcp
- Harn, What is Harness Engineering?
  https://harn.app/
