# 🤖 AI Automation Pipeline

[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)
[![SULAB](https://img.shields.io/badge/Organization-SULAB-orange)]()

## 📖 About the Project
이 프로젝트는 SULAB(수랩)에서 디지털 마케팅 콘텐츠와 수익형 블로그 파이프라인을 자동화하기 위해 구축한 통합 AI 에이전트 저장소입니다. 

최신 대형 언어 모델(LLM) API들을 유기적으로 결합하여, 아이디어 기획부터 대량의 원고 작성, 그리고 여러 플랫폼으로의 자동 배포까지 전 과정을 자동화함으로써 실무 업무 리소스를 혁신적으로 단축하는 것을 목표로 합니다.

## ✨ Key Features
- **🧠 다중 LLM 통합 파이프라인:** ChatGPT, Claude, Gemini, Manus 등 다양한 AI API를 목적과 톤앤매너에 맞게 스위칭 및 연동
- **📝 멀티 플랫폼 자동 포스팅:** 네이버 블로그, 구글 블로거, 워드프레스 등 주요 플랫폼 대상 SEO 최적화 및 자동 발행 (Python 스크립트 기반)
- **🎥 숏폼 및 마케팅 콘텐츠 생성:** 트렌드 기반의 유튜브 숏폼 대본 기획 및 마케팅 카피라이팅 에이전트 구축
- **⚡ Serverless Deployment:** Vercel 및 GitHub 웹훅을 활용한 클라우드 기반의 24/7 지속적 콘텐츠 발행 시스템

## 🛠 Tech Stack
- **Language:** Python
- **AI / LLM APIs:** OpenAI API, Anthropic API, Google Gemini API
- **Deployment & DevOps:** Vercel, GitHub Actions
- **Tools:** VSCode, GitHub Copilot

## 🚀 Getting Started

### Prerequisites
프로젝트를 실행하기 위해 다음 환경 변수가 필요합니다. `.env` 파일을 최상위 디렉토리에 생성하고 각 API 키를 입력해주세요.

```bash
OPENAI_API_KEY="your_openai_api_key"
ANTHROPIC_API_KEY="your_claude_api_key"
GEMINI_API_KEY="your_gemini_api_key"
