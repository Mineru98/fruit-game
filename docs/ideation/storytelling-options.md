# 발표 스토리텔링 아이데이션

`slides/main.typ`, `docs/DEVLOG.md`, `docs/script.md`를 바탕으로
검토용 스토리텔링 방향 3개를 정리했습니다.

이번 검토에서 가장 중요한 기준은 하나입니다.
`AI로 만들었다`가 아니라 `Claude Code의 여러 테크닉을 적절히 써서 프로젝트를 완성시켰다`가 발표의 중심에 있어야 합니다.

## 1안. 무경험자의 2일 생존기

- 파일: [storytelling-idea-01.md](/Users/imgeunseog/Documents/Github/fruit-game/docs/storytelling-idea-01.md)
- 핵심: `게임 개발 경험 0`인 웹 개발자가 Claude Code의 기획, 위임, 리뷰, 검증 테크닉으로 끝까지 완주한 이야기
- 장점: 감정선이 가장 분명하고, 발표 전체가 한 편의 도전기로 묶인다.
- 추천 상황: 청중의 몰입과 공감을 가장 우선할 때

## 2안. 디버깅 스릴러

- 파일: [storytelling-idea-02.md](/Users/imgeunseog/Documents/Github/fruit-game/docs/storytelling-idea-02.md)
- 핵심: 버그 재현, 추적, 반전, 해결을 통해 Claude Code의 디버깅 역량을 보여주는 수사극 구조
- 장점: 가장 드라마틱하고, 기술 청중에게 강하게 남는다.
- 추천 상황: `AI와 함께 문제를 푼다`는 메시지를 강조할 때

## 3안. 한 줄 프롬프트에서 제품까지

- 파일: [storytelling-idea-03.md](/Users/imgeunseog/Documents/Github/fruit-game/docs/storytelling-idea-03.md)
- 핵심: 모호한 요청이 Claude Code의 반복, 리뷰, 검증 루프를 거쳐 제품 수준으로 다듬어지는 이야기
- 장점: 현실적인 제품 개발 프로세스로 들려서 개발자 청중 설득력이 높다.
- 추천 상황: 실무 적용성과 재현 가능한 방법론을 강조할 때

## 빠른 추천

- 가장 발표답게 재미를 살리려면: 1안
- 가장 긴장감 있고 인상적으로 만들려면: 2안
- 가장 실무적이고 재사용 가능한 메시지를 주려면: 3안

## 현재 추천

가장 안전한 방향은 `1안 + 3안 혼합`입니다.

- 겉으로는 `무경험자의 도전기`로 끌고 간다.
- 안쪽 메시지는 `Claude Code 테크닉을 잘 써서 완성했다`로 잡는다.
- 디버깅 사례는 2안의 장면을 가져와 중간 피크로 사용한다.

이렇게 가면 발표는 재미를 유지하면서도, 청중이 `그래서 Claude Code를 어떻게 써야 하는가`를 분명하게 가져갈 수 있습니다.

## Harness Engineering 추가 방향

이번 발표에서는 `harness engineering`을 별도 이론처럼 길게 설명하기보다,
`Claude Code를 잘 쓰는 상위 개념`으로 넣는 것이 좋습니다.

- 참고 문서: [harness-engineering.md](/Users/imgeunseog/Documents/Github/fruit-game/docs/harness-engineering.md)
- 시각화 초안: [harness-engineering-visuals.md](/Users/imgeunseog/Documents/Github/fruit-game/docs/harness-engineering-visuals.md)

권장 메시지는 이 문장입니다.

`이 프로젝트는 Claude Code에 한 번에 맡겨서 완성한 것이 아니라, 계획-위임-리뷰-검증이 돌아가도록 harness를 설계했기 때문에 완성할 수 있었다.`
