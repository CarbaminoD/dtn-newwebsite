# CLAUDE.md — DTN New Website

---

## โปรเจกต์นี้คืออะไร

พัฒนาเว็บไซต์กรมเจรจาการค้าระหว่างประเทศ (DTN) ปีงบประมาณ 2570 ประกอบด้วย 4 ระบบ:

| ระบบ | Domain | สถานะ |
|------|--------|--------|
| เว็บไซต์กรมฯ | www.dtn.go.th | ภาคผนวก ก |
| Intranet | intranet.dtn.go.th | ภาคผนวก ข |
| e-Learning | — | ภาคผนวก ค |
| e-Library | — | ภาคผนวก ง |

**Tech stack:** Next.js (frontend) + .NET Core 10 (API) · Chart library: ECharts (`echarts-for-react`)

---

## Commit Messages

ใช้ **Conventional Commits**:

```
<type>(<scope>): <short description>
```

### Types

| Type | ใช้เมื่อ |
|------|----------|
| `feat` | เพิ่ม feature ใหม่ |
| `fix` | แก้ bug |
| `refactor` | ปรับโค้ดโดยไม่เปลี่ยน behavior |
| `perf` | ปรับปรุง performance |
| `style` | แก้ formatting, whitespace (ไม่เปลี่ยน logic) |
| `docs` | แก้เอกสาร / scope of works |
| `test` | เพิ่ม/แก้ test |
| `chore` | งาน maintenance เช่น config, dependencies |

### Scope

| Scope | ใช้กับ |
|-------|--------|
| `scope-of-works` | ไฟล์ใน `scope-of-works/` |
| `demo-charts` | ไฟล์ใน `demo-charts/` |
| `website` | ระบบเว็บไซต์หลัก www.dtn.go.th |
| `intranet` | ระบบ intranet.dtn.go.th |
| `km` | ระบบ KM |
| `e-learning` | ระบบ e-Learning |
| `e-library` | ระบบ e-Library |
| `brain` | ไฟล์ใน `_brain_DTN-newwebsite/` |

### Examples

```
docs(scope-of-works): add RBAC section to ภาคผนวก ก

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

```
feat(demo-charts): add ECharts bar chart for trade statistics

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

### Rules

- Subject line ไม่เกิน 72 ตัวอักษร
- ใช้ **imperative mood** — "add" ไม่ใช่ "added"
- ไม่ต้องจบด้วยจุด (.)
- Body อธิบาย **why** ไม่ใช่ **what**
- **REQUIRED**: footer `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` ทุก commit

---

## Version Bump (`demo-charts`)

เมื่อ bump version ให้อัปเดตพร้อมกัน:

| ไฟล์ | จุดที่ต้องแก้ |
|------|--------------|
| `demo-charts/package.json` | `"version": "x.x.x"` |
| `demo-charts/package-lock.json` | `"version": "x.x.x"` (2 จุด) |

```
chore(demo-charts): bump version to x.x.x
```

---

## AI Behavior Rules

### 1. NO MAGIC — ห้ามเดา
```
All assumptions must be explicit.
If context is missing, state assumptions before proceeding.
Do not hallucinate infra, invent unspecified services,
or assume file paths / API contracts that have not been shown.
```

### 2. VERIFY BEFORE DONE — ห้ามบอกว่าเสร็จถ้ายังไม่เช็ค
```
Never claim a change is complete without running verification.
"I edited the file" is not done.
"I edited the file and here is the output" is done.
No "should work now." Evidence before assertions, always.
```

### 3. DISSENT — ต้องแสดงความเห็นค้านก่อน major change
```
Before any major change, surface concerns:
- What is the blast radius if this goes wrong?
- What assumptions are we making?
- What is the reversibility path?
- What are we NOT seeing because of momentum?
```

### 4. SCOPE DRIFT — จับ scope creep
```
Track stated goals vs actual execution.
Flag when:
- "Just one more thing" accumulates
- Nice-to-haves get treated as must-haves
- The ask was "fix bug X" but execution is "refactor the module"
```

### 5. R0 / R1 / R2 — ระดับ reversibility
```
R0 (irreversible)      — STOP. Ask before proceeding.
R1 (costly to reverse) — Do it, but explain why.
R2 (easily reversed)   — Just do it. No permission needed.
```
ตัวอย่าง: push ขึ้น production = R0 / เปลี่ยน API contract = R1 / แก้ UI สี = R2

### 6. DECISION REQUIRED — แจ้งก่อน implement ทุกครั้ง
```
After analyzing documents, requirements, or data:
If a design decision must be made before implementation can proceed —
FLAG IT explicitly. Do not assume. Do not pick silently.

Format:
"⚠️ ต้อง decide ก่อน: [ประเด็น]
  ตัวเลือก A: [อธิบาย + trade-off]
  ตัวเลือก B: [อธิบาย + trade-off]"

Do NOT implement until the user has chosen.
```
