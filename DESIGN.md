---
version: alpha
name: Browser Spatial Computing
description: A restrained, legible visual profile for spatial information work on ordinary browser displays.
profile: into_visual_profile
motion:
  easing-default: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration-min: "150ms"
  duration-max: "650ms"
depth-calibration:
  perspective: "1200px"
  z0: "0px"
  z1: "-160px"
  z2: "-420px"
  z3: "-900px"
  focus-core: "32px"
  clarity-falloff: "96px"
interaction:
  touch-target-min: "44px"
  active-world-ring: z0
performance:
  default-preset: balanced
  efficient-active-frame-capacity: 4
  balanced-active-frame-capacity: 8
  cinematic-active-frame-capacity: 6
---

# Design system

## Overview

This file defines the Layer C INTO visual and motion profile for examples and implementations built from the Browser Spatial Computing foundation. It is not the universal constitution. An implementation may adopt another visual profile while preserving the same model, spatial grammar, accessibility projection, and conformance behavior.

The profile should feel precise, calm, operational, and atmospheric only at the edge of perception. Translate those qualities into restrained guide geometry, consistent lighting, limited materials, readable focal content, explicit state, and motion that explains causality. The environment is a working instrument, not a cinematic prop.

Confirmed sources:

- `docs/principles.md`, especially P31, P41–P43, P50–P58, P61–P63, and Part VII.
- `foundation/spatial-environments-ai-foundation-v3.1.json`.

Unknown by design:

- Literal color hex values and state palette.
- Font families and a complete type scale.
- Spacing and radius scales.
- Final optics for each supported viewport and baseline device.

Host products must define those tokens, route them through themes, and validate them. Agents must not invent them from the words “petrol,” “blueprint,” or “glass.”

## Colors

The confirmed palette roles are black, white, petrol, and rationed semantic state color. Blueprint Dark and Cool Light invert the visual environment without changing information meaning.

Rules:

- Define literal palette values in host-product tokens before implementation.
- Use color only for a declared status, actor, category, selection, or controlled accent role.
- Preserve WCAG AA contrast across both theme extremes.
- Pair every state color with text, iconography, shape, or another non-color cue.
- Reserve emissive treatment for genuinely active or live state.
- Use luminance and detail reduction to communicate recession; do not turn depth into glow.

Avoid warm ivory, decorative neon, uncontrolled hue drift between spaces, or arbitrary per-card colors.

## Typography

No font family or complete type scale is canonical yet. Host products must supply named typography tokens before shipping.

Confirmed usage rules:

- Keep readable body content in the focal z0 representation.
- Use concise labels and mono-style blueprint markers only when the host type system provides a verified legible face.
- Reflow readable content when a frame resizes; never bitmap-scale text.
- Preserve browser zoom, text zoom, logical reading order, and flat-mode readability.
- Recessed groups show identity, state, owner, exception, or summary—not unreadable miniaturized body copy.

## Layout

Groups are the primary compositional and depth unit. Choose and declare a layout mode: tile, stack, canvas, graph, or sequence. Each mode must meet the requirements recorded in the foundation; unsupported modes fail visibly rather than falling back to arbitrary placement.

Layout rules:

- Align related placements into a coherent group silhouette.
- Use containment for group membership and typed edges for explicit relationships.
- Keep x and y as local projection/composition; neither defines canonical topology.
- Preserve stable object and placement addresses across responsive projections.
- Keep the lens in a stable camera-fixed region, independent of world transforms.
- On narrow/touch layouts, show one focal group with explicit travel controls and 44px minimum touch targets.
- Flat mode converts spatial organization into a coherent linear hierarchy with equivalent entities, relationships, and actions.

Exact spacing, grid, and breakpoint tokens remain host-product decisions.

## Elevation & Depth

Depth communicates attention and interaction availability:

| Ring | Meaning | Representation | Interaction |
|---|---|---|---|
| z0 | Work now | Full working content | Full interaction |
| z1 | Available next | Identity, state, owner, exception | One-action promotion |
| z2 | Relevant context | Group summary, count, trend, landmark | Travel/select target |
| z3 | Orientation | Silhouette, occupancy, environmental health | Inert until promoted |
| +detail | Tethered inspection | One record, trace, or decision | Close restores exact context |

The frontmatter depth values are monitor calibration seeds, not universal geometry. Tune them against viewport, type size, browser behavior, and baseline hardware. Preserve the invariant: the snapped target is sharp and actionable, adjacent states are distinguishable, and no stable camera position leaves all useful content unavailable.

Use size, clarity, luminance, occlusion, level of detail, and motion together. Blur is optional optics. Apply filter and backdrop effects to isolated surfaces or wrappers outside preserved 3D subtrees; never blur the world root and assume nested depth will survive.

Use one off-screen light direction, restrained downward shadows, a matte floor, controlled haze, dissolving guide lines, and sparse landmarks. Glass has a strict budget: frames, lens, and tethered detail only. Inner cards do not receive another glass layer.

## Shapes

No radius scale is canonical. Host products must declare one before generating components.

Shape rules:

- Prefer restrained frame geometry and stable silhouettes over novelty shapes.
- Use outlines and empty slots to preserve group structure when a frame is parked or minimized.
- Keep handles and slivers graspable and visibly connected to their frame state.
- Avoid pills as a default container language.
- Avoid decorative bevels, unbounded texture, and shape changes that imply state without another cue.

## Components

### Spatial stage

Purpose: owns camera navigation while explicitly focused.

Required states: unfocused, focused, travelling, settled, reduced-motion, flat, disconnected.

Rules: wheel capture requires stage focus, a visible alternative, and an escape path. Settled state owns no optional animation frame, media loop, or ambient timer.

### Group

Purpose: keeps related placements coherent through movement, depth, layout, and batch action.

Required states: focal, adjacent, contextual, ambient, packed, protected, loading, stale, conflict.

Rules: one group maps to one occupied focus stop. Group movement does not silently mutate canonical objects.

### Frame

Purpose: provides a personal working view onto a placement.

Required states: focused, resting, moving, resizing, periscoped, minimized, frozen/virtualized, dirty, protected, loading, error.

Rules: move, resize, raise, park, minimize, restore, and close are view verbs. Closing a frame is never deletion. Resize reflows content. Dirty, pinned, approval, focus-source, or running-transaction frames are not reclaimed automatically.

### Lens

Purpose: keeps safety, navigation, collaboration, AI, performance, and recovery instruments reachable.

Required tiers: safety-persistent, navigation-persistent, contextual, incident.

Rules: the lens never inherits world blur, tilt, recession, or occlusion. Only continuously applicable incidents remain visually loud.

### Tethered detail

Purpose: inspect one record, trace, or decision without losing context.

Required states: opening, active, committing, closing, failed.

Rules: allow only one tethered detail layer. Trap input focus within it, make the background inert, and restore camera, work focus, input focus, and source state exactly on close.

### Performance controls

Purpose: let each participant choose the runtime/visual tradeoff without changing shared meaning.

Required controls: visual richness, active-frame capacity, loading horizon. Required presets: Efficient, Balanced, Cinematic.

Rules: controls remain independent and personal-view owned. Accessibility and measured device pressure take precedence. Downshifts remove atmosphere before information.

## Do's and Don'ts

Do:

- Make each spatial channel answer a declared semantic question.
- Keep one readable, actionable focal target at every settled depth stop.
- Use landmarks, provenance, typed relationships, and restoration to reduce reacquisition cost.
- Keep lens state and world state visually distinct.
- Animate a single dominant semantic motion family at a time.
- Make every action keyboard-operable and recoverable.
- Test both spatial and flat projections against the same model.
- Stop optional rendering work after settlement.

Don't:

- Do not turn a scrolling page into a room with perspective effects.
- Do not scatter unrelated cards across arbitrary z positions.
- Do not use depth, blur, color, motion, position, or audio as the only carrier of meaning.
- Do not leave body copy readable only at recessed rings.
- Do not use a permanent animation loop for an editor-like environment.
- Do not make Three.js, Canvas, or GSAP the source of truth.
- Do not let remote collaborators or AI seize a participant's camera or input focus.
- Do not silently close, delete, publish, approve, or externalize work to protect performance.
- Do not add warm ivory, pills, decorative glow, or unlimited glass to the INTO profile.

## Accessibility

- Target WCAG AA contrast and declare the exact target-size criterion used by the host product.
- Provide visible focus for every control and one stable keyboard region for lens instruments.
- Keep camera focus separate from `document.activeElement`.
- Make occluded, recessed, and background views inert rather than invisible tab stops.
- Provide keyboard and single-pointer alternatives for drag, resize, travel, and relationship actions.
- Reduced motion removes travel, blur animation, tilt, and ambient loops; use discrete state changes with minimal fades or none.
- Reduced transparency replaces glass and blur with opaque or tonal surfaces.
- Flat mode contains every entity, relationship, state, action, authority boundary, and recovery path.
- Avoid duplicate assistive-technology output from visual and semantic mirrors.

## Motion and Interaction

Use the default easing in frontmatter and keep routine duration within the confirmed 150–650ms range. Duration reflects semantic distance, but responsiveness and reduced-motion needs take priority.

Motion families are acknowledge, promote/recede, travel, tether, park/restore, transfer, preview/commit, and incident. One dominant motion communicates the current family. Ambient motion never competes with it.

Animate transform and opacity for routine travel. Change blur, glass, large shadows, and relationship density discretely at rest or on isolated inner surfaces. Motion must be interruptible and settle deterministically; no spring, bounce, or overshoot is part of the confirmed profile.

## Implementation Mapping

| Design concern | Canonical source | Runtime location |
|---|---|---|
| Universal model and grammar | AI foundation layers A and B | Host model, transactions, projections |
| INTO visual/motion profile | `DESIGN.md`, principles P42–P43 | Host tokens and component styles |
| Runtime and capacity | Foundation layer D, principles P50–P63 | Host renderer and performance console |
| Retrieval | `knowledge/` generated artifacts | Build/review tooling only |
| Conformance | Foundation acceptance tests and evaluator | Host tests and evidence manifest |

## Evidence and Maintenance

Last reviewed: 2026-07-20

Confirmed:

- Visual profile roles, depth calibration seeds, easing, duration range, responsive projection, 44px narrow/touch target, and three performance presets come directly from the foundation.
- Literal color, typography, spacing, and radius values are not defined by this repository.

Inferred:

- None promoted to tokens.

Open questions:

- Select literal Blueprint Dark and Cool Light theme tokens.
- Select host typography, spacing, radius, and component density scales.
- Certify optical calibration and capacity presets against named baseline hardware and browsers.

Change log:

- 2026-07-20: Created the first AI-readable INTO visual profile from foundation v3.1.
