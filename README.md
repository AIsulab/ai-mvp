# W-AI Platform: 오픈소스 AI 개발 플랫폼

> "AI를 활용해 아이디어 검증부터 MVP 제작, 개발 자동화까지 완벽하게 지원하는 오픈소스 AI 개발 플랫폼"

---

## 🚀 1. 프로젝트 한 줄 소개
W-AI Platform은 복잡한 코딩 없이 비즈니스 아이디어만으로 즉각적인 MVP(최소 기능 제품)를 제작하고, OpenAI Codex 등 코딩 에이전트를 통해 실무 개발을 자동화하는 모듈형 오픈소스 플랫폼입니다.

## 🤔 2. 해결하려는 문제
- **초기 창업자의 장벽**: 코딩 지식이 없는 창업자나 소상공인이 자신의 아이디어를 구체화하고 프로토타입을 만드는 데 막대한 시간과 비용이 듭니다.
- **AI 에이전트의 한계**: 기존의 AI 코딩 어시스턴트는 단순한 코드 스니펫만 제공할 뿐, 보안과 아키텍처가 고려된 전체 서비스를 한 번에 구축하기 어렵습니다.
- **반복적인 보일러플레이트 작업**: 개발자들조차도 프로젝트 초기 세팅과 반복되는 기능(인증, 대시보드 UI 등) 구현에 많은 시간을 낭비합니다.

## 💡 3. 왜 이 프로젝트가 필요한지
W-AI Platform은 OpenAI Codex와 같은 강력한 AI 에이전트가 **"가장 잘 일할 수 있는 구조(Template & Workflow)"**를 제공합니다. 
단순한 텍스트 프롬프팅을 넘어, 검증된 오픈소스 템플릿 위에서 AI가 비즈니스 로직만 주입하여 완성도 높은 MVP를 생성하도록 돕기 때문에 오픈소스 생태계와 AI 개발 패러다임의 혁신을 가져옵니다.

## ✨ 4. 주요 기능
- **AI Agent 연동 아키텍처**: OpenAI Codex를 비롯한 LLM 에이전트와 완벽하게 연동되는 프롬프트 및 스크립트 구조 지원
- **Zero-to-MVP 워크플로우**: 아이디어 입력만으로 즉시 작동하는 대시보드 및 서비스 백엔드 생성 자동화
- **재사용 가능한 템플릿 엔진**: 보안과 성능이 검증된 UI/UX 및 백엔드 템플릿 제공 (`/templates` 참고)
- **비개발자 친화적 인터페이스**: 코딩을 전혀 몰라도 브라우저에서 직관적으로 MVP를 구성하고 Vercel 등에 배포 가능

## 🔄 5. 실제 사용 흐름 (User Flow)
1. **Idea Input**: 사용자가 플랫폼에 비즈니스 아이디어와 타겟 고객을 자연어로 입력합니다.
2. **Template Selection**: AI 에이전트가 아이디어에 가장 적합한 뼈대(Template)를 `/templates`에서 자동 선택합니다.
3. **Agent Generation**: OpenAI Codex가 템플릿 위에서 필요한 맞춤형 기능(API 연동, UI 수정) 코드를 `/agents` 프롬프트를 통해 생성합니다.
4. **Automated Testing**: `/workflows`에 정의된 CI 파이프라인이 생성된 코드를 검증합니다.
5. **Instant Deployment**: 완성된 코드가 Vercel 등의 클라우드 환경에 원클릭으로 자동 배포됩니다.

## 🏗 6. 아키텍처 설명
프로젝트는 크게 4개의 핵심 모듈로 구성되어 AI 에이전트와의 협업을 극대화합니다.
자세한 구조는 [docs/architecture.md](./docs/architecture.md)를 참고하세요.
- **`agents/`**: AI 코딩 에이전트를 위한 프롬프트 및 시스템 인스트럭션 모음
- **`templates/`**: AI가 코드를 주입할 견고한 오픈소스 보일러플레이트
- **`workflows/`**: 코드 검증 및 배포를 담당하는 자동화 파이프라인 (GitHub Actions)
- **`examples/`**: 본 플랫폼을 통해 생성된 실제 MVP 결과물 사례

## 🛠 7. 설치 방법
```bash
# 1. 저장소 클론
git clone https://github.com/AIsulab/ai-mvp.git
cd ai-mvp

# 2. (향후 제공 예정) 필수 의존성 설치
npm install
```
*(상세 가이드는 [docs/getting-started.md](./docs/getting-started.md) 참고)*

## 🏃 8. 실행 방법
현재는 프로토타입 예제를 바로 실행해 볼 수 있습니다.
```bash
# 브라우저에서 직접 열기
start examples/dashboard-prototype/index.html
```

## 📖 9. 사용 예제
현재 `examples/dashboard-prototype/` 디렉토리에 이 플랫폼을 활용하여 비개발자가 기상청 API 연동형 **"소상공인 AI 마케팅 대시보드"**를 생성한 실제 프로토타입 사례가 포함되어 있습니다.
해당 폴더의 `index.html`을 열어 결과물을 직접 확인할 수 있습니다.

## 🖼 10. 데모 (Demo)
![W-AI Dashboard Demo](https://via.placeholder.com/800x400?text=W-AI+Platform+Dashboard+Demo)
*(MVP 생성 후 제공되는 대시보드 인터페이스 예시입니다. Vercel 배포 후 실제 라이브 데모 링크가 제공될 예정입니다.)*

## 🗺 11. 로드맵 (Roadmap)
W-AI Platform은 완전 자동화된 MVP 팩토리로 나아갑니다.
자세한 단기 및 장기 계획은 [ROADMAP.md](./ROADMAP.md) 파일에서 확인하실 수 있습니다.

## 🤝 12. 기여 방법 (Contributing)
오픈소스 생태계는 여러분의 참여로 완성됩니다! 버그 리포트, 기능 제안, 코드 기여 등 모든 형태의 참여를 환영합니다.
기여를 시작하시려면 반드시 [CONTRIBUTING.md](./CONTRIBUTING.md)와 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)를 먼저 읽어주세요.

## 📄 13. 라이선스 (License)
이 프로젝트는 **MIT License**에 따라 배포됩니다. 자유롭게 사용, 수정, 배포할 수 있습니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 확인하세요.
