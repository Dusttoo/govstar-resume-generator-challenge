# GovStar Resume Generator — Frontend Prototype

A high‑fidelity **Next.js (Pages Router) + TypeScript** prototype that showcases how a user could upload a resume, provide guidance, and preview a **GovStar‑styled** PDF. This challenge version focuses on UX, theming, and reliability; it intentionally avoids a backend and heavy parsing to keep the scope tight for a 48‑hour build.

> ⚠️ **Architectural note (production preference)**
>
> In a real deployment I would generate resumes **server‑side** (e.g., serverless function/worker) and return a **durable URL** for the frontend to render/download. That keeps PII off the client, ensures consistent rendering (fonts/engines), enables caching, and reduces bundle size. Because this challenge is **frontend‑only**, I embedded a client‑side generation/preview path (with a static sample) so reviewers can experience the full end‑to‑end flow. See [PDF preview & worker setup](#pdf-preview--worker-setup).

> **What it does today**
> - Presents a polished, on‑brand flow with three screens: **Upload**, **Generate (animated)**, and **Preview + Refine**.
> - Renders/preview a **sample GovStar PDF** (local asset) to demonstrate the target output.
> - Lets users refine instructions (tone, role, keywords, notes) and **re‑render** the same sample with their refinements as a prompt preview (no server calls).

---

## Table of contents
- [GovStar Resume Generator — Frontend Prototype](#govstar-resume-generator--frontend-prototype)
  - [Table of contents](#table-of-contents)
  - [Screens \& UX](#screens--ux)
    - [1) Upload (Home `/`)](#1-upload-home-)
    - [2) Generate (`/generate`)](#2-generate-generate)
    - [3) Preview \& Refine (`/preview`)](#3-preview--refine-preview)
  - [Key features](#key-features)
  - [Tech stack](#tech-stack)
  - [Project structure](#project-structure)
  - [State \& data model](#state--data-model)
  - [PDF preview \& worker setup](#pdf-preview--worker-setup)
  - [Run locally](#run-locally)
    - [Prereqs](#prereqs)
    - [Install \& dev](#install--dev)
    - [Build \& start](#build--start)
  - [Testing](#testing)
  - [AI Usage](#ai-usage)

---

## Screens & UX

### 1) Upload (Home `/`)
- **Title/Instructions** describe how to use the generator.
- **ResumeUploader** accepts a PDF (not required in the simplified flow).
- **Prompt Editor** captures high‑level intent.
- Primary button advances to **/generate**.

### 2) Generate (`/generate`)
- Professional, on‑brand **loading indicator** with a triangle‑edge tracer animation in GovStar colors.
- **Timed minimum display** (`~9s` with slight jitter) so reviewers can see the thought/effort.
- In this challenge build, I shortcut to a **local sample PDF** (see below).

### 3) Preview & Refine (`/preview`)
- Left: **PDF viewer** with paging/zoom/open/download.
- Right: **Refinement Panel** with fields:
  - Tone, Target Role, Target Company, Keywords (chips), Additional Notes.
  - **Original instructions** (read‑only, collapsible; copy to clipboard).
  - **Effective prompt (preview)** shows exactly what will be sent if this were wired to a backend (read‑only; idempotent composition).
- Footer buttons: **Download PDF** (left) and **Start over** (right). Start over clears state and storage.

---

## Key features
- **Material UI + custom theme** for a sleek, consistent look.
- **GovStar brand tokens**
  - Colors: `antique-white #e7ddd0`, `brown #262525`, `tomato #ef5937`, `steel-blue #198daa`.
  - Font family: `Work Sans` (open alternative to `FS Industrie`).
- **Zustand** for minimal, predictable state with session persistence.
- **React‑PDF (viewer)** using a **locally bundled pdfjs worker** (no CORS).
- **Sample output**: the preview uses `/public/samples/govstar-sample.pdf` so the demo works offline and on refresh.
- **Error toasts** and route guards (kept simple for this prototype).

---

## Tech stack
- **React 18 + Next.js (Pages Router)**
- **TypeScript**
- **MUI v5** and a custom theme
- **Zustand** for state management
- **react-pdf** for PDF viewing (and optional `@react-pdf/renderer` for generation)

---

## Project structure

```
/public
  /fonts                # Work Sans font files
  /samples
    govstar-sample.pdf  # sample output used by the preview

/src
  /components
    /Header
    /LoadingIndicator   # triangle edge-trace animation
    /PdfPreview         # react-pdf viewer + toolbar
    /RefinementPanel    # tone/keywords/etc, original & effective prompt
    /Toast
    /UploadForm
    /ui                 # shared button/textfield wrappers, etc
  /hooks
    useRequireResult.ts # light guard for preview (can be bypassed)
  /lib
    generator.ts        # sample-only pipeline (STATIC_SAMPLE_URL)
  /pages
    index.tsx           # upload + prompt editor
    generate.tsx        # timed loading screen → preview
    preview.tsx         # pdf viewer + refinements
  /pdf
    ResumeDoc.tsx       # (optional) @react-pdf/renderer template
  /sample
    parsed.example.ts   # sample ParsedResume data
  /store
    resume.store.ts     # Zustand store (status, prompt, refinements, result)
  /types
    pdfjs-worker.d.ts   # TS shims for pdfjs worker imports
```

---


## State & data model
Key store slices (`src/store/resume.store.ts`):
- `status: 'idle' | 'uploading' | 'generating' | 'ready' | 'error'`.
- `prompt: string` — the user’s **original** instructions (immutable in RefinementPanel).
- `refinements: { tone?, keywords?, targetRole?, targetCompany?, additionalNotes? }`.
- `result: { pdfUrl: string } | null` — used by the viewer.

**RefinementPanel** builds an **effective prompt** at the moment of “Regenerate” by composing the original prompt + a fresh `Refinements:` block (idempotent, so it never duplicates refines).

---

## PDF preview & worker setup
The preview uses **react‑pdf** and a **locally bundled worker** to avoid CORS and CDN version drift:

- `next.config.ts` emits the worker as an asset:
```ts
config.module.rules.push({
  test: /pdf\.worker\.(min\.)?m?js$/,
  type: 'asset/resource',
});
```
- `src/types/pdfjs-worker.d.ts` declares the module types for TS.
- `PdfPreview.tsx` sets the worker:
```ts
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs';
import { pdfjs } from 'react-pdf';
if (typeof window !== 'undefined') {
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
}
```
- **Version pinning:** `pdfjs-dist` must match the version expected by `react-pdf`. Pin to the version in your lockfile to avoid `UnknownErrorException: API version X != Worker version Y`.

**Generation path in this prototype**
- `generateFromSample()` in `src/lib/generator.ts` returns a static URL: `/samples/govstar-sample.pdf`.
- You can switch to full rendering with `@react-pdf/renderer` by calling `renderResumeBlobUrl(SAMPLE_PARSED, refinements)` instead.

---

## Run locally

### Prereqs
- **Node 18+** (or the version you use for Next 14)
- pnpm/npm/yarn (examples use npm)
- Clone the repository `https://github.com/Dusttoo/govstar-resume-generator-challenge.git`

### Install & dev
```bash
npm install
npm run dev
# open http://localhost:3000
```

### Build & start
```bash
npm run build
npm start
```

---

## Testing
This repo includes a lean, high‑signal test suite to demonstrate quality without heavy overhead.

**Tools**
- **Jest** + **@testing-library/react** on **jsdom**
- `next/jest` integration, `identity-obj-proxy` for CSS modules
- `next-router-mock` for routing, `whatwg-fetch` for `fetch`

**Run tests**
```bash
npm test
npm run test:watch    # watch mode (optional)
```

**What’s covered**
- **Logic** — idempotent prompt composition (no duplication of the `Refinements:` block)
- **Store (Zustand)** — state transitions, object URL creation/revocation, reset behavior
- **Components**
  - `LoadingIndicator` — step highlighting, triangle props, reduced‑motion behavior
  - `PdfPreview` — skeleton vs. document, zoom/fit, open/download (with `react-pdf` mocked)
  - `RefinementPanel` — read‑only original instructions, effective prompt preview, primary action calls without mutating original prompt
- **Pages** — `/generate` orchestration with fake timers → routes to `/preview`

**File layout** (excerpt)
```
src/__tests__/
  components/
    LoadingIndicator.spec.tsx
    PdfPreview.spec.tsx
    RefinementPanel.spec.tsx
  pages/
    generate.spec.tsx
  store/
    resume.store.spec.ts
```

**Key mocks & polyfills** (see `setupTests.ts`)
- `react-pdf` mocked to inert `<Document/>` and `<Page/>` components (no worker/canvas)
- `next/router` mocked with `next-router-mock`
- `window.matchMedia`, `ResizeObserver`
- `URL.createObjectURL` / `URL.revokeObjectURL`
- `fetch` via `whatwg-fetch`


---

## AI Usage
AI was used minimally throughout this project, mostly as a soundboard to troubleshoot small issues. Below are the use cases and prompts I used. All prompts were given to ChatGPT 5
- Create a README template for a Nextjs Typescript project that covers the implementation details and how to run an application for a coding challenge. The challenge was to create a frontend high fidelity prototype of an ai powered resume generator.
- My application has 3 views, index, generate, and preview. The functionality it covers is uploading a pdf, entering an ai prompt, displaying a loading indicator while it 'generates' a tailored pdf and displays the pdf giving the option to refine the prompt and regenerate. Given the time frame of 48 hours, what is a minimal set of test cases to cover the basic functionality. Only list file names, NO CODE.
- What is a similar font to FS Industrie that would give the same look and feel.
- I have 3 triangle svg files and I want to combine them so that they are stacked biggest on bottom and smallest on top, how can I combine them.
- I want to create a sleek loading indicator with my triangle svg, what is an animation I can use to achieve this without being overwhelming.
- I have a pdfViewer component that should display a preview of the generated resume. I am using a locally bundled worker. What are some issues that might prevent the preview from displaying.


**Note**: This code is intentionally frontend‑only for the challenge. It is not wired to an LLM or any backend services.
