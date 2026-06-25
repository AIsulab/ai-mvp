<div align="center">
  <h1>🚀 AI-MVP: 마케팅 자동화 파이프라인</h1>
  <p><b>다중 LLM(ChatGPT, Claude, Gemini) 기반 무인 마케팅 에이전트 생태계</b></p>
  <p>
    <a href="https://github.com/AIsulab/ai-mvp/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" /></a>
    <a href="https://github.com/AIsulab/ai-mvp/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" target="_blank" /></a>
  </p>
</div>

---

## 💡 프로젝트 소개 (About AI-MVP)

**AI-MVP**는 개발 지식이 부족한 1인 크리에이터와 소상공인이 손쉽게 마케팅 자동화 파이프라인을 구축할 수 있도록 돕는 오픈소스 프로젝트입니다.

디자인 및 디지털 마케팅 현장에서 블로그 포스팅이나 숏폼 대본 기획 등에 낭비되는 수작업 리소스를 획기적으로 단축하기 위해 기획되었습니다. 사용자는 다중 LLM을 활용하여 SEO가 최적화된 트렌디한 콘텐츠를 대량으로 자동 생성할 수 있습니다.

## 🤔 해결하려는 문제와 목표

*   **진입 장벽 완화**: 기존 마케팅 자동화 툴은 API 연동이나 프롬프트 엔지니어링 등 기술적 장벽이 높습니다. 본 프로젝트는 누구나 쉽게 다운로드하여 즉시 실무에 도입할 수 있는 오픈소스 접근성을 제공합니다.
*   **무인 마케팅 에이전트 (Unmanned Marketing Agent)**: 현재는 텍스트와 숏폼 대본 위주의 자동화 MVP 단계이지만, 향후 기획부터 플랫폼 발행까지 혼자서 처리하는 자율형 에이전트 생태계로 발전하는 것이 목표입니다.

## ✨ 주요 기능 (Key Features)

*   **다중 LLM 라우팅**: 작업의 특성(창의성, 논리성, 분석)에 따라 ChatGPT, Claude, Gemini 등 최적의 언어 모델을 자동으로 선택하여 파이프라인을 구성합니다.
*   **트렌드 기반 대본 생성**: 최신 트렌드를 반영한 숏폼 대본 및 블로그 원고 자동 작성.
*   **A/B 테스트 최적화**: 다양한 프롬프트 엔지니어링 기법을 적용하여 SEO 퀄리티를 극대화.

---

## 🔒 보안 및 OpenAI Codex Security의 필요성

AI-MVP는 여러 LLM과 외부 블로그 플랫폼의 API 키를 복합적으로 다루는 파이프라인입니다.

주 사용 타겟층이 **코딩 초보자 및 소상공인**이므로, 오픈소스 사용 과정에서 다음과 같은 치명적인 보안 사고가 발생할 위험이 있습니다:
1.  **API 키 유출**: 민감한 데이터(Secret)의 하드코딩 또는 `.env` 설정 오류로 인한 유출.
2.  **프롬프트 인젝션**: 악의적인 입력값을 통한 시스템 프롬프트 우회 및 오작동.

우리는 코딩 초보자도 안심하고 사용할 수 있는 **'신뢰성 높은 마케팅 자동화 생태계'**를 구축하기 위해, **Codex Security**와 취약점 스캐닝 도구를 적극 도입하여 사전에 위험을 차단하고 방어 로직을 강화하는 데 심혈을 기울이고 있습니다. (상세 내용은 [`SECURITY.md`](./SECURITY.md) 참고)

---

## 🏃 시작하기 (Getting Started)

현재 프로젝트는 브라우저에서 즉시 체험 가능한 프론트엔드 프로토타입 단계입니다.

```bash
# 레포지토리 클론
git clone https://github.com/AIsulab/ai-mvp.git
cd ai-mvp

# 브라우저에서 실행 (로컬)
start index.html
```

Vercel을 통해 자동 배포된 라이브 데모는 [sulab.store](https://sulab.store)에서 확인하실 수 있습니다.

---

## 🗺️ 로드맵 (Roadmap)

*   **Phase 1 (Current)**: 브라우저 기반 마케팅 추천 프로토타입 (Zero-cost MVP).
*   **Phase 2**: 다중 LLM(OpenAI API 등) 연동 백엔드 파이프라인 구축 및 API 크레딧을 활용한 프롬프트 고도화.
*   **Phase 3**: 블로그 플랫폼(WordPress, Tistory 등) API 자동 발행 연동.
*   **Phase 4**: 기획부터 발행까지 완전 자율화된 무인 마케팅 에이전트 완성.

---

## 🤝 기여 방법 (Contributing)

이 생태계의 핵심은 메인테이너와 커뮤니티의 협력입니다. 새로운 프롬프트 템플릿 제안, API 라우팅 최적화, 보안 이슈 제보 등 모든 형태의 기여를 환영합니다.
참여를 원하시면 [`CONTRIBUTING.md`](./CONTRIBUTING.md)를 먼저 확인해 주세요.

## 📄 라이선스 (License)

이 프로젝트는 **MIT License**로 배포됩니다. 자유롭게 사용, 수정, 배포할 수 있습니다.
