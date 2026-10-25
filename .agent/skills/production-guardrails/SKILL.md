---
name: production-guardrails
description: Enforces production-grade architecture, strict structured JSON outputs, anti-hallucination citations, and backend API key security for Google Cloud Run deployments.
---

# Production Guardrails & Anti-Hallucination Rules

Whenever upgrading or refactoring a vibe-coded application for production, you MUST enforce:

1. **Zero Client-Side Secret Exposure**:
   - NEVER expose `GEMINI_API_KEY` in frontend browser bundles (`VITE_*` or client `process.env`).
   - Route all `@google/genai` requests through a server-side Express route (`/api/*`).

2. **Schema-Locked Anti-Hallucination Outputs**:
   - Always configure `responseMimeType: "application/json"` and a strict `responseSchema` (`Type.OBJECT`) so the UI never crashes on malformed LLM output.
   - Include a `confidence` or source verification field on AI predictions.

3. **Google Cloud Run Container Readiness**:
   - Serve both the built Vite static bundle (`dist/`) and `/api/*` endpoints from a single server listening on `process.env.PORT || 8080`.
   - Expose `GET /api/health` returning HTTP 200 `{ "status": "ok" }` for Cloud Run startup probes.
