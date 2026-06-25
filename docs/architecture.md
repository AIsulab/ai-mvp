# AI-MVP 시스템 아키텍처

본 문서는 1인 크리에이터 및 소상공인을 위한 "다중 LLM 기반 마케팅 자동화 파이프라인 (무인 마케팅 에이전트)"의 시스템 구조를 설명합니다.

## 시스템 구성도 (System Architecture)

현재 브라우저 기반의 MVP(Phase 1)에서 향후 완전 자율화된 무인 에이전트(Phase 4)로 발전하는 아키텍처 청사진입니다.

```mermaid
graph TD
    User([사용자 / 소상공인]) -->|상황 및 목적 입력| UI(Frontend UI - Vercel)
    
    subgraph AI-MVP Pipeline [AI-MVP 자동화 파이프라인]
        UI -->|API Request| Router{LLM 라우터}
        
        Router -->|창의적 기획| Claude[Claude 3 API]
        Router -->|논리적 구성/SEO| GPT[ChatGPT API]
        Router -->|정보 검색/트렌드| Gemini[Gemini API]
        
        Claude --> Aggregator[결과물 취합 및 검증]
        GPT --> Aggregator
        Gemini --> Aggregator
    end
    
    subgraph Security Layer [보안 및 검증 계층]
        Aggregator --> Scanner{Codex Security Scanner}
        Scanner -->|프롬프트 인젝션 방어| Validated[검증된 마케팅 콘텐츠]
        Scanner -->|취약점 발견 시| Alert[관리자 경고]
    end
    
    Validated -->|숏폼 대본 / 블로그 원고| UI
    Validated -.->|자동 발행 (Phase 3+)| Platforms[(네이버 블로그 / 워드프레스 / SNS)]
```

## 핵심 컴포넌트 설명

1. **Frontend UI**: 코딩 지식이 없는 사용자도 쉽게 접근할 수 있는 직관적인 웹 인터페이스 (현재 Vercel을 통해 `sulab.store`에 배포됨).
2. **LLM 라우터**: 사용자의 입력 상황을 분석하여 가장 적절한 LLM(또는 다중 LLM 조합)으로 작업을 분배하는 두뇌 역할.
3. **보안 및 검증 계층 (Security Layer)**: 생성된 결과물을 최종 사용자에게 전달하거나 외부 플랫폼에 자동 발행하기 전, `Codex Security` 정책을 기반으로 민감 정보 누출 및 프롬프트 인젝션을 필터링합니다.
4. **자동 발행 연동 (향후 확장)**: 완성된 원고와 대본을 외부 API를 통해 블로그나 SNS에 예약/자동 발행하는 시스템.
