# Architecture Overview

W-AI Platform is designed as a modular, agent-friendly architecture that connects business requirements with automated code generation.

## High-Level Architecture

1. **Idea & Requirement Layer**: Captures business ideas, target audience, and desired features (often through non-developer interfaces).
2. **AI Agent Layer (`/agents`)**: Utilizes models like OpenAI Codex to translate requirements into actionable code, UI components, or backend logic.
3. **Workflow Automation (`/workflows`)**: Orchestrates the agents, tests generated code, and manages CI/CD pipelines (e.g., via GitHub Actions).
4. **Template Engine (`/templates`)**: Provides pre-built, robust MVP skeletons that the AI agents can customize rather than building from scratch.
5. **Execution Environment**: Deploys the generated MVP to hosting providers (e.g., Vercel, Netlify) seamlessly.
