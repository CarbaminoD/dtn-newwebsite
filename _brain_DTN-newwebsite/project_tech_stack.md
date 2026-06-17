---
name: project-tech-stack
description: DTN website redesign tech stack decisions — Next.js frontend, .NET Core 10 API
metadata:
  type: project
---

Frontend: **Next.js** (React-based, modern SSR/SSG)
Styling: **Tailwind CSS**
Backend/API: **.NET Core 10**

Deliberately moving away from MVC + Razor (.cshtml) — full decoupled frontend/backend architecture.

**Why:** Legacy MVC stack is being replaced; committee wants a modern web presence.
**How to apply:** Suggest Next.js patterns for frontend work, .NET Core 10 for any API/backend work. Do not recommend Razor Pages or MVC patterns.

Related: [[chart-library-echarts]]
