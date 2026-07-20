# Reference architecture

## Runtime layers

The reference architecture separates meaning from projection:

```text
Canonical objects and links
        ↓ addressed views
Shared session: spaces, groups, portals, shared placements
        ↓ personal projection
Personal view: camera, focus, open frames, lens, performance controls
        ↓ rendered output
DOM/CSS core ── optional Canvas/WebGL projection loaded on intent
        ↑ transactions and receipts
AI proposals, previews, approvals, commits, undo, audit
```

Canonical objects are not duplicated when they appear in more than one place. A placement is a view of an object in a spatial context. A frame is a personal viewport onto a placement. This distinction is what makes close, minimize, duplicate view, collaboration, undo, and AI action safe to reason about.

## Fast browser path

The default renderer should use semantic HTML, CSS perspective and transforms, opacity, and event-driven JavaScript. Move one stage or group transform when possible instead of independently animating many descendants. Write transforms and opacity during motion; delay expensive blur and glass changes until settlement. Keep readable text in the DOM.

The room has no permanent render loop. Pointer, wheel, keyboard, resize, model, and presence events invalidate the scene; a short animation owns frames only until it settles. Hidden, recessed, virtualized, or minimized frames stop media, observers, polling, and optional effects.

Canvas is appropriate for dense relationship fields, minimaps, or background diagrams when DOM node count becomes the bottleneck. WebGL is appropriate for genuinely volumetric content. Both remain bounded projections of the same model and load only after explicit intent or a qualified idle condition.

## Capacity policy

Opening a frame first checks the active-frame budget. If capacity exists, open it. Otherwise cool or virtualize the least-recently-used unprotected frame, preserving its model identity and resumable state. If every frame is protected, pause and offer a visible capacity decision—never silently close or delete work.

Loading follows semantic attention rather than raw distance. The current focus and current group are hot; current-space shells are warm; likely neighbors may be prefetched; distant spaces keep only metadata until requested. Abort obsolete loads when attention changes.

## Space versus session

Rotate or travel within one session while the user retains the same collaboration membership, authority boundary, persistence contract, task continuity, and bounded working set. Start or load another session when one of those meanings changes materially. A loading boundary is therefore a semantic boundary, not an arbitrary Y-axis distance.

## Accessibility projection

Reduced motion removes travel, bokeh animation, tilt, and ambient loops while retaining the same addressable objects and navigation meanings. Flat mode renders spaces as tabs or sections and depth stops as explicit focus states. Accessibility is an equivalent projection of the same information architecture, not a fallback missing half the system.
