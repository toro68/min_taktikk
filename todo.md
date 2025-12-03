• Outstanding Work from README & AGENTS

  ## Completed ✅
  - [x] Port 3050 konfigurert for dev server
  - [x] Console.log støy ryddet - DEBUG_MODE flag i `lib/debug.ts`
  - [x] Animasjon stopper på siste frame (ikke loop)
  - [x] regex-analyze.js og config sync script

  ## In Progress 🔄
  - [ ] Test animasjonsfix (retning keyframe 1→2)

  ## Backlog

  - README.md: "Bruk" and "Feilsøking" show the
    baseline UX (draw → keyframe → traces → export),
    but several advanced flows listed there are
    still aspirational: keyboard shortcuts (V/P/
    O/B/C/L/X/A), formation templates, undo/redo,
    zoom/pan, context menus, snap-to-grid, offside
    line, freehand drawing, richer exports (MP4/
    GIF reliability). These form the feature backlog
    needed for a “finished” coaching app.
  - README.md’s troubleshooting implies stability
    gaps: line tool still flaky, animation playback
    issues, deletion UX, and need for zoom/pan
    controls. Each bullet should map to tickets/
    tests before calling the app production-ready.
  - AGENTS.md adds engineering to-dos: enforce
    coach-centric QA (traces, exports), add e2e
    smoke tests, telemetry around config load/export
    errors, modular .aigenrc schema + validation,
    preset workflows (set-piece templates), config
    sync script (done) and regex tool (done) but
    also JSON schema validation, sequence diagrams,
    and config migrations documentation.

  What’s Needed to “Finish”

  1. Core UX polish
      - Stabilize line drawing
        (ContextualLineToolbar logs show ongoing
        debugging) and ensure keyboard shortcuts +
        deletion flow are implemented/tested.
      - Add zoom/pan, undo/redo, and context menus
        for coach workflows.
      - Implement formation templates and snap-to-
        grid/offside tools for tactical prep.
  2. Animation & Export Reliability
      - Fix playback blocking cases noted in README
        ("🔥 KRITISK" items).
      - Harden GIF/MP4 export (monitor exportUtils
        logs), add telemetry on failures.
      - ✅ console.log noise guarded with DEBUG_MODE
  3. Config & Tooling
      - Deliver modular .aigenrc schemas plus JSON
        Schema validation referenced in AGENTS.
      - Document animation architecture diagrams
        (AGENTS “From-Scratch”).
      - Integrate regex-analyze.js into docs (done)
        and consider ignoring public/.aigenrc.
  4. Testing & Observability
      - Add Playwright/Cypress smoke tests covering
        draw → animate → export.
      - Instrument config loader/export pipeline to
        detect production issues early.