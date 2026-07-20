# Spatial Environments — Browser Computing Principles

**Reference-model revision · V3.1 · 19 July 2026**
**Purpose:** a reusable grammar for spatial working environments that run in an ordinary browser on an ordinary display.
**Applies to:** operational consoles, approval rooms, agent theatres, investigations, planning environments, and collaborative decision surfaces.
**Does not apply to:** articles, reports, settings, long-form reading, routine forms, or any surface that is clearer as a page.

> A spatial interface is not a page with perspective. It is a persistent information model that can be viewed, navigated, manipulated, shared, and flattened without changing what the information means.

---

## Executive conclusion

The original INTO Spatial draft has an unusually strong core. Its best decisions are constitutional, not cosmetic:

- the separation of **world** from **HUD**;
- depth as a meaningful state rather than ornament;
- discrete depth rings;
- topic groups as units of movement;
- object permanence and exact restoration;
- the opened-on-top pattern for tethered detail;
- a flat equivalent for reduced motion and accessibility; and
- restraint around glass, glow, motion, and readable text.

The draft also crosses an important boundary. The current INTO Spatial V1 contract uses depth temporarily: one item steps forward, related context recedes, then the surface returns to flat. This framework describes a persistent world with connected spaces, depth travel, parked objects, landmarks, collaboration, and AI presence. That is a new interaction system, not a styling extension.

The research supports making that leap, with one qualification: **spatial organization can help, but three-dimensionality is not the source of the benefit.** Microsoft’s Data Mountain and Task Gallery demonstrated value from persistent placement, task grouping, and spatial recall. A later controlled study found that adding a third dimension did not improve spatial memory over 2D and could perform worse in physical arrangements. The framework must therefore earn every dimension through better context retention, relationship comprehension, or collaboration—not through atmosphere alone. [Data Mountain](https://www.microsoft.com/en-us/research/publication/data-mountain-using-spatial-memory-for-document-management/), [Task Gallery](https://www.microsoft.com/en-us/research/publication/the-task-gallery-a-3d-window-manager/), [Cockburn and McKenzie](https://ir.canterbury.ac.nz/items/6b4acfe3-7fdb-4d43-83af-639ab1972403)

The finished model is **screen-spatial computing**: a browser-native, DOM-accessible, persistently arranged information world viewed through a personal camera. It borrows:

- comfort, legibility, subtle hierarchy, and clear entry/exit from Apple;
- agency, diegetic feedback, local causality, and stateful worlds from games;
- coherent technology language and action choreography from cinematic interfaces;
- persistent task spaces, cross-surface continuity, and shared artifacts from Microsoft; and
- explicit structure, provenance, reversible authority, and personal viewpoints for AI collaboration.

V2.2 closed the desktop-to-room interaction gap: atomic groups, occupied focus stops, session boundaries, a frame lifecycle, and stable lens controls. V3.0 closed the model-to-runtime gap. V3.1 makes that runtime governable on ordinary computers: DOM-first projection, event-driven rendering, bounded live frames, priority loading, and user-controlled performance profiles. Together they add the missing distinctions that make the grammar safe under reuse, collaboration, interruption, AI-generated interface change, and constrained hardware:

- **an object is truth; a placement is an appearance; a frame is a working view;**
- a session is governed by an explicit goal and continuity contract, not by what happens to be loaded;
- spaces form a semantic graph whose local neighborhood may be projected as a room;
- group hierarchy can organize work and receive batch operations without creating recursively nested depth;
- focus is a stack of context, camera, selection, input, and shared-attention states—not one blurry CSS class;
- every property belongs to canonical, shared-session, personal-view, or ephemeral-interaction state;
- every consequential change follows one transaction protocol, whether initiated by a person or AI; and
- interruption and resumption are first-class operations, not accidental reload behavior;
- the user controls visual richness, active-frame capacity, and loading horizon through coherent Efficient, Balanced, and Cinematic presets; and
- the renderer may virtualize or reduce effects to protect the declared frame budget, but it may never silently change truth, authority, focus, or session identity.

The enduring concept is therefore not “a desktop in 3D.” It is a **spatial operating model for information work**. The room is one projection of that model.

## The framework kernel

| Question | Authoritative unit | Rule |
|---|---|---|
| What is true? | Object and link | Identity, provenance, permissions, and history do not live in pixels. |
| Where does it appear? | Placement | One object may have several placements without becoming several objects. |
| What moves together? | Group | Batch layout and depth actions operate on groups and their placements. |
| What can I manipulate now? | Frame | Window-like view state is separate from object lifecycle. |
| What am I standing in? | Space | A named node in the session’s semantic space graph. |
| What work must remain coherent? | Session | Goal, snapshot, authority, collaborators, agents, history, and return contract. |
| What receives attention? | Focus stop and focus stack | Camera clarity, selection, keyboard focus, and shared attention remain distinct. |
| What never leaves reach? | Lens | Safety, navigation, agent, and recovery instruments stay camera-fixed. |
| What changes state? | Transaction | Intent, preview, validation, authority, commit, explanation, record, and recovery. |

This kernel is deliberately more precise than the visual metaphor. A renderer may look like a room, stage, gallery, constellation, shelf, or graph. Conformance depends on the model and verbs, not the scenery.

---

## 0 · Keep four layers separate

A reusable system cannot mix universal principles, interaction semantics, brand art direction, and browser mechanics in one rule list. V3 has four layers.

### Layer A — Constitution

Stable principles that should survive a different brand, visual theme, rendering technology, input device, or screen size.

Examples: stable topology, object permanence, personal camera/shared world, bounded AI authority, semantic equivalence in flat mode.

### Layer B — Spatial grammar

Named primitives, states, relationships, navigation verbs, collaboration rules, and accessibility behavior.

Examples: sessions, space graphs, groups, placements, focus stack, frame states, portals, links, periscope, opened-on-top, and the transaction protocol.

### Layer C — Visual and motion profiles

An art direction that realizes the grammar. INTO’s off-centre vanishing point, petrol canvas, mono markers, glass recipe, edge tilt, and motion curve belong here.

These rules may be strict for INTO without pretending to be universal truths about spatial computing.

### Layer D — Implementation and conformance

Browser architecture, performance budgets, semantic DOM requirements, state serialization, tests, and machine-checkable constraints.

This separation is the difference between a compelling prototype and a framework other products can safely adopt.

---

# Part I — Constitutional principles

## 1 · The person is an operator, not an audience

Games and cinematic interfaces can look similar while serving opposite purposes. A film interface explains a character’s intent to an audience. A working interface must let a person form intent, predict an action, execute it, inspect the result, and recover from error.

Every spatial effect must answer at least one operator question:

- Where am I?
- What is related?
- What changed?
- What can I act on?
- What is the AI doing?
- Who changed this?
- How do I return?

If it answers none of them, it is production design, not interface design.

## 2 · The viewport is a personal camera into a shared world

The founding inversion remains valid, with one refinement: the viewport is not the room and the camera is not shared state.

- The **world** contains objects, relationships, groups, agents, history, and spatial addresses.
- The **camera** contains one participant’s position, orientation, focus plane, zoom, and temporary view preferences.
- The **lens** contains instruments that must remain readable regardless of world movement.

In collaboration, participants normally share the world while keeping independent cameras. “Follow me” or presentation mode is an explicit, reversible choice; one person’s navigation never yanks everyone else through the room.

## 3 · The room must earn itself

Depth is justified only when it improves one of four jobs:

1. preserving context during a detour;
2. making relationships or dependency structure easier to understand;
3. organizing concurrent work without losing object permanence; or
4. establishing shared reference for people and AI.

The system must have a flat baseline for comparison. If users are slower, more lost, or less accurate, simplify or flatten the experience. Spatial is a hypothesis to prove, not a brand entitlement.

## 4 · Topology comes before atmosphere

An empty environment may imply a place, but a useful environment must first have a stable topology.

Topology means:

- named locations;
- persistent object addresses;
- predictable adjacency;
- visible landmarks;
- consistent return paths; and
- a map or equivalent overview.

The horizon, floor, shadows, haze, furniture, and vanishing geometry support that topology. They cannot replace it. W3C’s XR accessibility guidance similarly emphasizes resettable orientation and clear visual or audio landmarks. [XR Accessibility User Requirements](https://www.w3.org/TR/xaur/)

## 5 · One channel, one meaning

Do not encode two unrelated ideas with the same visual channel. The default grammar is:

- **x position:** one local projection of neighboring space or composition—not canonical topology;
- **y position:** composition within a space, not workflow status;
- **z position:** attention and interaction state;
- **containment:** placement membership in a topic or task group;
- **typed edge:** explicit relationship;
- **portal:** semantic adjacency and navigation between spaces or sessions;
- **color:** status, actor, or category according to the active legend;
- **motion:** a change, transfer, or causal consequence; and
- **time:** history, playback, or forecast through a dedicated control—not improvised as depth.

If a product needs a different mapping, it declares the mapping at the environment level and applies it consistently.

Coordinate language must stay precise. Translating on x moves the camera or world laterally between neighboring spaces. Rotating around the y-axis is **yaw**: it changes what the camera faces and may preview an adjacent space, but does not by itself change location, task, or session. Semantic navigation is committed only when the active spatial address changes.

## 6 · Objects carry identity; placements and frames carry presentation

A spatial object is not a rectangle at coordinates. It has a stable identity and an inspectable model:

- `id` and human label;
- type and capabilities;
- source and provenance;
- current state and confidence;
- owner or responsible actor;
- relationships;
- version and history;
- permissions; and
- one or more visual representations by level of detail.

The same record may appear as a distant marker, group summary, focused panel, comparison card, search result, or flat-mode row. Those are projections of one object, not duplicated content.

V3 names the projection explicitly:

- a **placement** is one addressable appearance of an object inside a group or navigation context;
- a **frame** is a manipulable working surface that hosts one object, a composite, or a tool; and
- a **representation** is the level-of-detail form rendered inside that placement or frame.

Placement owns local position, group membership, representation, and visibility. Frame owns open, focused, stacked, sized, parked, minimized, and closed state. The object owns truth. Closing a frame, moving a placement, or publishing a layout therefore cannot accidentally duplicate, delete, or rewrite the underlying entity.

## 7 · Spatial arrangement is meaningful but never secret

Proximity, alignment, containment, and repetition can express emerging structure. Spatial-hypertext research showed that people create interpretable relationships through layout and that systems can help turn implicit structure into explicit links. [Marshall and Shipman](https://people.engr.tamu.edu/shipman/viki/papers/ht93/ht93.html)

V3 therefore allows two kinds of relationship:

- **suggested relation:** inferred from proximity, repeated movement, shared sources, or AI analysis; shown as a tentative edge or grouping proposal;
- **declared relation:** explicitly typed, named, queryable, and preserved independently of layout.

AI may notice a pattern in the arrangement. It may not silently promote that pattern into organizational truth.

## 8 · Depth is attention, not storage

The z-axis answers: *How available is this object to act on now?*

It does not mean chronology, certainty, seniority, file hierarchy, or semantic similarity. Those concepts need their own visible representations.

Default rings:

- **z0 · focal:** sharp, fully legible, interactive;
- **z1 · adjacent:** identity and status legible, body content suppressed, promotable in one action;
- **z2 · context:** group-level summary or silhouette, selectable as a travel target;
- **z3 · ambient:** landmark or environmental context, non-interactive until promoted.

At most three rings sit behind the focal ring. An opened-on-top inspection layer may step toward the camera, but it is a temporary tethered detour, not a fifth storage ring.

## 9 · Semantic zoom accompanies geometric depth

Distance does more than shrink an object. It changes what the object says.

- At z0, show the working representation.
- At z1, show identity, state, owner, and the one fact needed to decide whether to promote it.
- At z2, show group identity, count, trend, or exception signal.
- At z3, show only landmark, occupancy, or ambient health.

This is semantic zoom. It prevents unreadable miniature dashboards and makes the information hierarchy survive low resolution, narrow viewports, and flat mode.

Pad++ framed this more broadly as an “information physics”: useful representations should emerge predictably from interaction rules rather than from a literal desktop metaphor. V3 adopts that principle but snaps to meaningful stops because continuous zoom is not itself an information architecture. [Pad++](https://www.cs.umd.edu/~bederson/images/pubs_pdfs/p17-bederson.pdf)

## 10 · Object and placement permanence are the foundation of trust

An object that moves must leave a comprehensible trace of where it came from and where it went.

- Minimize preserves a dock identity.
- Periscope preserves an edge sliver.
- Moving a group preserves its placement membership and each placement’s object identity.
- Opening detail preserves the source context behind it.
- AI reorganization appears first as a preview.
- Closing or undoing restores the prior arrangement exactly.

Persistent placement—not three-dimensionality by itself—is what enables spatial memory. If the same object appears in more than one place, the system reveals that they are synchronized views of one identity and offers a route between placements.

## 11 · Objects and placements have different addresses; every journey has a return

The minimum **placement address** is:

`environment / session / space / group / placement`

The canonical **object address** is independent of presentation:

`environment / object`

An optional personal view capsule may add camera, focal stop, frame state, and selection to a deep link. Those parameters are never mistaken for the object’s identity or shared truth.

The address must be:

- serializable;
- linkable;
- restorable after refresh;
- represented in browser history where navigation semantics warrant it;
- shareable without exposing unauthorized content; and
- convertible into a flat-mode route and heading hierarchy; and
- able to identify an object, a particular placement, or both without ambiguity.

Search results never strand the user. A search jump carries a visible origin and a single-action return.

Collaboration references `objectId + placementId + version` when location matters. Raw screen coordinates are never sufficient common ground.

## 12 · Navigation is locomotion with instruments

Local movement may feel continuous. Orientation must remain discrete and inspectable.

Required instruments:

- current spatial address;
- space overview or minimap;
- depth rail or ring indicator;
- home/recenter action;
- back/forward history;
- search and command jump;
- visible neighboring destinations; and
- optional breadcrumb or route trail for complex journeys.

Short moves may pan or dolly. Long jumps should cross-fade or use a compressed travel transition rather than forcing the user to fly through irrelevant geometry. A cut is acceptable for reduced motion, urgent state feedback, and user-requested jumps; continuity is preserved by landmarks and history, not by making every transition literal.

## 13 · The result appears where the action happened

Games are exceptionally good at local causality: the switch changes the door, the tool affects the object, and resource state lives close to its source.

Apply the same rule to work:

- an approval changes the object and its dependent edge;
- a filter changes the group it governs;
- an AI proposal appears beside the evidence it used;
- a background agent shows its progress at the task it is executing;
- an error names the failed action and offers recovery at the point of failure.

Global toasts may confirm completion, but they never carry the only explanation.

## 14 · Direct manipulation requires agency and reversibility

Objects may be grabbed, compared, grouped, parked, linked, or opened. Every direct manipulation needs:

- a preview before a consequential drop;
- clear valid and invalid destinations;
- a non-drag alternative;
- deterministic snap behavior;
- undo/redo;
- conflict handling when another participant edits the same object; and
- exact restoration where the verb promises return.

The system must distinguish *moving a view* from *changing the underlying information*. Rearranging a panel is personal unless the user explicitly publishes the arrangement to the shared world.

## 15 · Use a hybrid interface, not a purity test

Game-interface research describes a useful design space rather than a single ideal form. V3 maps it into four semantic roles:

1. **World object** — exists in the information world and can be manipulated: record, group, tool, agent, model.
2. **World annotation** — anchored to an object or location: relationship label, provenance, measurement, collaboration pointer.
3. **Lens instrument** — stable control on the camera: command bar, map, depth rail, theme, accessibility, minimized objects.
4. **Lens incident** — temporary whole-view feedback caused by world state: reconnecting, permission loss, AI listening, critical failure.

The render tree may still have only world and HUD roots. The four roles prevent every signal from becoming either a floating window or permanent chrome. Game research calls attention to diegetic, spatial, meta, and non-diegetic forms and recommends selecting among them according to the experience rather than treating immersion as a HUD-removal contest. [Beyond the HUD](https://odr.chalmers.se/items/d5fe6889-4cc6-49c2-ba56-0d759e2f37eb)

## 16 · AI is present, bounded, and attributable

The Tony Stark fantasy is not floating holograms. It is a tight loop between intent, computation, simulation, manipulation, and explanation.

An AI collaborator therefore needs visible state:

- **listening** — what input it is attending to;
- **working** — which task it is performing and whether it can be stopped;
- **proposing** — what it wants to add, move, connect, summarize, or change;
- **waiting** — the decision or missing authority it needs;
- **committed** — what changed, by whose authority, and from which sources;
- **failed** — what did not complete and what remains unchanged.

AI follows a governed action loop:

`observe → propose → preview → authorize → commit → explain → revert`

Low-risk personal-view changes may be automatic and reversible. Shared topology, source interpretation, business state, external actions, and destructive mutations require an authority appropriate to their consequence.

## 17 · AI may arrange attention; it may not rewrite truth

AI can help by:

- clustering related objects;
- routing relationship edges;
- surfacing anomalies;
- assembling a temporary comparison slab;
- suggesting the next focal object;
- summarizing a distant group;
- recording a decision trail; and
- proposing alternative spatial arrangements.

It cannot silently:

- change a declared relationship;
- convert inference into evidence;
- hide counterevidence;
- move a shared object without a visible event;
- make an approval; or
- erase another participant’s arrangement.

AI-generated layout is a view proposal with provenance, not canonical information architecture until adopted.

## 18 · Shared world, personal camera, explicit floor control

Collaboration synchronizes what must be common and leaves perspective personal.

Shared by default:

- objects and declared relationships;
- published group hierarchy, placements, and portals;
- shared decisions, comments, and action history;
- agent execution state;
- permissions and locks.

Personal by default:

- camera position;
- open detail and comparison state;
- theme, motion, magnification, contrast, and audio preferences;
- uncommitted arrangements;
- search and temporary highlights.

Presentation or follow mode temporarily shares camera choreography. It must show who has the floor, offer an immediate exit, and never seize input silently.

Apple’s spatial collaboration guidance makes the underlying requirement clear: pointing only works when participants share a consistent frame of reference, while each participant may still control how the experience appears locally. [Design spatial SharePlay experiences](https://developer.apple.com/videos/play/wwdc2023/10075/)

## 19 · Presence attaches to attention and action

A useful collaborator is more than an avatar bubble.

Presence indicators attach to:

- the object someone is viewing or editing;
- a pointer, selection, or bounded attention cone;
- the action they are proposing or executing;
- the version of an object they are seeing; and
- the place where a comment or question applies.

Remote attention is advisory, not coercive. The interface may say “Jay is comparing these two objects”; it does not constantly animate Jay’s cursor across everyone’s view.

## 20 · Motion explains causality

Motion is a grammatical device. It answers: what moved, why, from where, to where, and with what consequence?

- One **dominant motion** carries the state change.
- Dependent cues may move with it as one coordinated event.
- Independent ambient motion pauses or quiets during consequential transitions.
- Objects with common cause move as a rigid scene or visibly linked sequence.
- Long or high-amplitude camera movement is avoided.

Apple recommends subtle depth, smooth predictable transitions, and restrained movement to preserve comfort and orientation. [Principles of spatial design](https://developer.apple.com/videos/play/wwdc2023/10072/)

The INTO motion curve and duration ramp remain a valid profile. “Nothing ever cuts” does not. Immediate keyboard focus, critical errors, reduced-motion mode, and deliberate long-distance jumps need prompt, comfortable state changes.

## 21 · Legibility outranks physical realism

The environment may suggest optics; it must not simulate them at the expense of use.

- Body text is readable only at the focal plane.
- Text remains flat within its local object plane.
- Edge tilt never impairs reading.
- Blur, dimming, and shrink do not carry meaning alone.
- Occlusion never hides the only path to an action.
- Labels face the camera or use a readable projected representation.
- Glass is treated as a contrast problem, not a material fetish.

Apple similarly advises against depth on text, recommends subtle depth, and uses hierarchy rather than spectacle as the primary justification. [Spatial layout](https://developer.apple.com/design/human-interface-guidelines/spatial-layout/)

## 22 · Attention is a finite room resource

The room may be infinite; attention is not.

At any moment the environment should have:

- one dominant task;
- one primary action;
- a small number of live signals;
- no more than one tethered overlay;
- no competing camera and object choreography; and
- no ambient animation that resembles an actionable event.

Game HUDs often reveal information only when relevant. Use the same context sensitivity for labels, controls, relationships, and agent state. Dead Space’s interface work is a useful precedent: holographic tools, inventory, selectors, and environmental controls form one world-consistent language rather than separate menus. [EA interview with UI lead Dino Ignacio](https://www.ea.com/news/breaking-into-the-industry-dino-ignacio-ui-lead-at-visceral-games)

## 23 · Accessibility is an equivalent projection

Flat mode is not a visual fallback. It is another complete view of the same model.

It must preserve:

- the environment/session/space/group/placement hierarchy as headings and landmarks, with each placement naming its object identity;
- declared relationships as lists, descriptions, or navigable references;
- every action and state;
- collaboration presence and authorship;
- AI proposals, sources, approvals, and history;
- return paths and browser history;
- deterministic reading and focus order.

Requirements:

- full keyboard operation;
- visible programmatic focus independent of camera focus;
- single-pointer alternatives to all dragging;
- at least 24 × 24 CSS px pointer targets under WCAG 2.2, with 44 × 44 targets preferred for touch and comfortable operation;
- reduced motion, reduced transparency, contrast, zoom, and text reflow support;
- no information communicated only by depth, position, blur, color, motion, or audio;
- polite live announcements for agent progress and collaboration events; and
- a persistent recenter/home command.

WCAG 2.2 explicitly requires non-drag alternatives and a 24 CSS px minimum target in ordinary cases. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## 24 · Performance is part of the illusion and the contract

Dropped frames, delayed focus, and late hit testing make objects feel unreal and controls feel unsafe.

Every implementation defines and tests:

- baseline hardware and browsers;
- frame-time budget during camera travel and direct manipulation;
- input-to-feedback latency;
- maximum live DOM objects and rendered connectors;
- virtualization and level-of-detail thresholds;
- graceful degradation order;
- memory recovery after leaving a space; and
- behavior when collaboration or agent streams lag.

Degrade atmosphere before meaning: reduce haze, shadow, backdrop blur, connector animation, particles, and ambient furniture before reducing labels, focus feedback, or state accuracy.

## 25 · The world is serializable, inspectable, and replayable

The authoritative model cannot live only in transforms.

At minimum, the system can serialize:

- object and relationship state;
- object identities independently from their placements;
- session goal, identity, scope, snapshot, space graph, portals, and loaded neighborhood;
- published group hierarchy and placement topology;
- personal placements and view state separately;
- focused/resting/stacked/periscoped/minimized/closed frame states, bounds, and paint order;
- context, camera, work, input landmark, and shared-attention focus states;
- resume capsule and last-seen versions;
- action history and undo boundaries;
- collaboration authorship;
- AI proposals, evidence, authority, and result;
- schema version and migration history.

This enables deep links, refresh recovery, audit, replay, conflict resolution, testing, and a future renderer that is not CSS 3D.

## 26 · Privacy and authority have spatial representations

A beautiful shared room can accidentally make access boundaries invisible.

- Private, shared, and externally publishable objects are visibly distinct without revealing hidden content.
- A link never leaks the title, thumbnail, existence, or relationship of an unauthorized object.
- Presence does not disclose private attention or activity by default.
- AI scope is visible: which spaces, objects, sources, and tools it can access.
- External actions show their destination and audience before commit.
- Recording, replay, and transcript capture are explicit session states.

The world may be continuous; authority is not.

## 27 · Measure whether spatial actually works

Every new spatial surface ships with a flat comparison or prior baseline. Evaluate:

- task completion time and error rate;
- context-recovery actions after opening detail;
- navigation errors and recenter use;
- ability to recall where an object lives;
- ability to explain why two objects are related;
- collaboration grounding: can another participant identify what is being referenced?
- AI proposal comprehension, override rate, and undo rate;
- unnoticed shared mutations;
- motion discomfort and reduced-motion preference;
- keyboard parity and screen-reader completion;
- frame stability and input latency.

The success condition is not “people said it felt futuristic.” It is “people understood more, lost less context, and collaborated with less translation.”

## 28 · Work survives interruption

Spatial memory matters most when attention leaves and later returns. The framework therefore treats interruption as a normal lifecycle event.

A resumable session stores a **resume capsule** containing:

- the session goal and success condition;
- the last stable space, focal stop, group, placement, frame, and input landmark;
- open, parked, minimized, and unsaved views;
- the participant’s private arrangement plus the published shared arrangement;
- active, paused, completed, and failed agent work;
- the version or snapshot last seen; and
- a bounded record of what changed while the participant was away.

Return offers two explicit verbs:

- **restore my view** — recover the prior personal camera and frames, marking anything stale; and
- **catch me up** — preserve the spatial address while presenting the smallest meaningful sequence of intervening changes.

Neither verb silently accepts conflicts, discards drafts, or rewinds shared truth. Exact visual restoration and current information state are reconciled rather than conflated.

This is the mature lesson from Rooms and Scalable Fabric: spatial organization is valuable when it makes task switching, resumption, and reacquisition of cognitive context cheaper—not when it merely keeps more surfaces visible. [Rooms](https://doi.org/10.1145/24054.24056), [Scalable Fabric](https://www.microsoft.com/en-us/research/publication/scalable-fabric-flexible-representation-task-management/)

---

# Part II — Spatial grammar

## 29 · Core primitives

### Environment

The complete persistent world for one bounded operating context. It owns the global schema, canonical objects and links, permissions, search, and spatial address system.

### Session

The active operational working set inside an environment. A session owns an explicit goal, success condition, working snapshot, space graph, published arrangement, participant and agent roster, authority scope, action timeline, and return contract. It may contain many virtualized spaces. Crossing into a new space or unloading a renderer does not create a new session.

### Space

A named node in the session’s semantic space graph, organized around a workstream, mode, phase, perspective, or bounded problem. A space owns groups and navigation portals, not canonical data. One well-formed space is valid; add another only when the work has a meaningful adjacent context.

### Group

A coherent task or topic working set. It owns a layout policy, depth stop, placement membership, label, compact representation, and group-level actions. It may contain semantic subgroups for batch operations, but nested membership never creates nested z-depth.

### Placement

One addressable appearance of an object inside a group. It owns `placementId`, `objectId`, group membership, local layout coordinates, selected representation, visibility, authorship of the arrangement, and whether the placement is shared or personal. Several placements may reference one object.

### Object

A stable information entity or tool with capabilities, provenance, history, and representations by level of detail.

### Link

A typed, directed or undirected relationship with source, target, label, confidence, provenance, and status. Visual edges are projections of links.

### Portal

A typed navigation edge between spaces or sessions. A portal declares destination, directionality, preview, authority conditions, transition family, and return behavior. It is topology, not an information relationship.

### Frame

A manipulable window-like working view hosted by a placement, a temporary comparison, or the lens. It owns presentation bounds, focus, stack order, and lifecycle state, but not entity truth.

### Plane

A geometric surface used to render a group, frame, or tethered detail. A plane is an implementation primitive, not an addressable semantic object.

### Lens

The camera-fixed instrument layer: command, map, address, presence summary, depth rail, accessibility, theme, and minimized objects.

### Actor

A human or AI participant with identity, principal, scope, capability, state, evidence, authority, and an inspectable action trail. Human and AI actors share the authorship model but not necessarily the same permissions or interaction privileges.

The primitive test is simple: if removing the visual scene would make a concept disappear from the model, that concept was scenery, not a primitive.

## 30 · Every state belongs to one ownership plane

Spatial systems fail when camera preferences, collaborative layout, business truth, and transient gestures share one undifferentiated state object. V3 requires four ownership planes.

| Plane | Contains | Synchronization and authority |
|---|---|---|
| Canonical truth | Objects, declared links, provenance, permissions, domain state | Durable, versioned, domain-authorized |
| Shared session | Goal, snapshot, space graph, published groups and placements, shared selections, agents, action history | Synchronized to participants; attributable and undoable within policy |
| Personal view | Camera, local placement overrides, open frames, stack order, periscope, minimize, theme, motion, private comparison | Private by default; optionally published as an explicit transaction |
| Ephemeral interaction | Hover, drag preview, yaw preview, lasso, temporary highlight, uncommitted AI ghost | Local and disposable; never restored as truth |

Every schema field declares:

- owning plane and actor;
- persistence lifetime;
- synchronization scope;
- version and conflict policy;
- undo boundary; and
- authority required to move it to another plane.

Publishing an arrangement is not “saving coordinates.” It is an explicit transaction that promotes selected personal placements into shared-session state. Adopting an AI-proposed link is a different transaction that promotes a proposal into canonical truth.

This separation also makes personalized and AI-malleable interfaces compatible with collaboration. Microsoft Research identifies the same core tension in dynamic workspaces: people need personalized representations while retaining a consistent shared mental model of the underlying work. [AI-powered Collaborative Dynamic Experiences](https://www.microsoft.com/en-us/research/academic-program/microsoft-research-fellowship/research-challenges/)

## 31 · Depth-state table

| Ring | Meaning | Information level | Interaction |
|---|---|---|---|
| z0 · Focal | Work now | Full working representation | Full interaction |
| z1 · Adjacent | Available next | Identity, state, owner, key exception | One-action promote |
| z2 · Context | Relevant background | Group summary, count, trend, landmark | Travel/select target |
| z3 · Ambient | Orientation only | Silhouette, occupancy, environmental health | Non-interactive until promoted |
| +detail | Temporary tethered inspection | One record, trace, or decision | Close/Esc restores exact prior state |

Depth cues use size, clarity, luminance, occlusion, and motion together, but no single cue is required to perceive the state.

### Focus stops and focal envelope

Depth is navigated as an ordered list of occupied **focus stops**, not as an unbounded zoom range. Each group declares a home stop. The camera may animate between stops, but it rests only where a meaningful group or tethered detail can become focal.

For every frame, the projection engine derives:

- `cameraDepth` — the current animated camera position;
- `targetStop` — the stop that will own focus when travel completes;
- `depthDelta` — the distance from each group to the camera;
- `focusEnvelope` — the narrow range in which the focal group remains optically sharp; and
- `semanticRing` — the z0–z3 representation selected from the snapped state.

During travel, clarity may interpolate to explain motion. Interaction does not drift with the blur: full body content, pointer actions, and programmatic focus activate only for the snapped z0 group. Near and far groups both lose clarity outside the envelope.

The camera clamps before the nearest meaningful stop and after the farthest one. A wheel, trackpad, key, rail, or command gesture advances to the next declared stop with hysteresis; it cannot coast into a dead interval where every group is out of focus. When groups are inserted, removed, or reordered, the stop list is recomputed from stable group identities and the current focal identity is preserved whenever possible.

Blur is optional optics, not the definition of focus. Reduced-transparency, performance, or accessibility profiles may use level of detail, luminance, border treatment, and inertness without blur. The invariant is semantic: one useful target owns the active stop, its working representation is readable, and no stable camera state makes the entire task unavailable.

## 32 · Focus is a stack, not a single state

“Focused” is overloaded in ordinary interface language. A spatial framework must keep five distinct states inspectable.

| Focus layer | Question | Owner |
|---|---|---|
| Context focus | Which session and space am I operating in? | Navigation state |
| Camera focus | Which stop and group are optically and semantically at z0? | Personal camera |
| Work focus | Which frame, placement, object, or relationship is selected for action? | Personal or shared selection |
| Input focus | Which DOM element receives keyboard input? | Browser `document.activeElement` |
| Shared attention | What are collaborators or agents pointing at or acting on? | Presence protocol |

Rules:

- Blur or sharpness never substitutes for selection or keyboard focus.
- Camera travel never silently edits shared attention.
- Pointer or wheel travel may leave input focus on the spatial stage; keyboard travel moves focus to a meaningful destination landmark without entering every control.
- Opening tethered detail moves input focus into it, makes the background inert, and returns focus to the exact trigger or its stable successor.
- Selecting an object may reveal contextual lens controls without moving the camera when the object is already actionable.
- Remote attention is rendered as attribution, not local focus theft.
- A focus transition announces enough identity and position for a keyboard or screen-reader user to remain oriented.

The projection engine derives visual emphasis from this stack. It never attempts to reconstruct the stack from CSS blur, `z-index`, or transformed coordinates.

The DOM and flat projections preserve a logical reading and focus order that reinforces the visible relationships. This is essential when a sighted collaborator, keyboard user, screen-reader user, or magnifier user refers to the same material through different projections. [W3C: Making DOM order match visual order](https://www.w3.org/WAI/WCAG22/Techniques/css/C27)

## 33 · Object-state verbs

The canonical reversible verbs name both action and target:

- **focus** — promote within the current group;
- **travel** — move the camera to a space or depth stop;
- **open** — create one tethered detail layer;
- **compare** — assemble selected objects into a temporary focal slab;
- **place** — create another synchronized placement of an existing object;
- **remove placement** — remove one appearance without deleting its object;
- **park** — periscope at an edge for near-term reuse;
- **minimize** — store as a lens chip for later reuse;
- **restore** — return to the exact stored position and group cell;
- **raise** — change paint/occlusion order inside the focal plane without changing semantic depth;
- **resize view** — change a frame’s personal presentation bounds and reflow its contents;
- **close view** — remove an active representation while preserving the underlying object;
- **move view** — change personal placement;
- **pack / unpack group** — compact a working set and restore its prior internal layout;
- **publish arrangement** — propose or commit shared topology;
- **link** — create a typed relationship;
- **trace** — reveal provenance, dependency, or action path;
- **recenter** — return the camera to a safe home view.

Verbs use consistent names, cursor/focus feedback, keyboard equivalents, and undo semantics everywhere.

User-facing language may remain familiar—window, panel, card—but the action log records whether the target was an object, placement, frame, group, or session. “Close,” “remove,” and “delete” are never synonyms.

### View state is not entity state

A frame behaves like a desktop object, but its window lifecycle must not be confused with the lifecycle of the information it represents.

- **focused:** active in z0, fully legible, and in the semantic focus order;
- **resting:** visible in the focal group but not the active frame;
- **stacked:** partly occluded by a sibling in the same focal plane; its identity and raise target remain available;
- **periscoped:** held at a viewport edge for immediate reuse;
- **minimized:** represented by a lens chip with origin and current state preserved;
- **closed:** no active view exists, but the object remains searchable and reopenable; and
- **deleted:** the underlying entity is removed through a separate authorized, attributable, and normally recoverable data action.

`z-index` controls paint order among overlapping frames. `translateZ` and the ring model control semantic attention depth. They are separate systems and must never be inferred from each other.

Resize changes layout bounds, never the information scale. Inner cards reflow, paginate, collapse to a declared compact representation, or request a larger minimum size. Text and controls are not shrunk as a bitmap to fit a smaller frame.

## 34 · Group rules

- The group—not the card, placement, frame, or inner control—is the atomic depth unit.
- One group corresponds to one meaningful depth stop.
- Placements align into a coherent silhouette according to the group’s declared layout mode.
- Every placement has a stable `groupId` and local cell, stack position, node position, or freeform coordinate inside the group. Its world depth is derived from the group.
- Placements may overlap or stack within the focal plane, but they do not accumulate independent persistent semantic z positions.
- Moving the group does not mutate its placements’ objects or canonical information state.
- Sending a group backward or promoting it forward moves the complete slab. A single placement may step toward the camera only as the one tethered `+detail` inspection.
- Removing a placement may leave a ghost cell when restoration is promised.
- A group exposes a compact z2 representation independent of its z0 layout.
- A group may be AI-proposed, user-created, or system-defined; authorship is visible.
- Placement membership is explicit even when proximity suggests it. Object classification remains a separate domain relationship.
- A group may contain semantic subgroups. Group actions may recurse through that hierarchy, but child groups inherit the parent depth while co-visible. Entering a child may make it the focal group; it never opens a room recursively inside a room.

Grouping must be a first-class action. Selection may create a temporary comparison group; an explicit **group** command creates durable placement membership; **ungroup** restores prior placement addresses where possible. The system previews the resulting slab, collision handling, inherited subgroup behavior, and depth stop before publishing a shared arrangement.

Research on Elastic Windows is especially relevant here: hierarchical window groups supported batch open, close, resize, pack, unpack, save, load, and layout changes, reducing repeated window operations in higher-complexity tasks. V3 borrows the batch-operation model while refusing recursively nested spatial depth. [Elastic Windows](https://www.cs.umd.edu/users/ben/papers/Kandogan1998Elastic.pdf)

## 35 · Every group declares a layout mode

A bento slab is one useful group layout, not the universal shape of work. Each group declares one primary layout mode and the operations it supports.

| Mode | Best for | Required behavior |
|---|---|---|
| Tile | Comparison, monitoring, coordinated forms | Aligned cells, deterministic reflow, visible group boundary |
| Stack | Reference sets and sequential inspection | Exposed identity/raise targets, predictable order, no hidden focus stops |
| Canvas | Synthesis, planning, spatial hypertext | Collision policy, snap/align tools, map, explicit grouping and links |
| Graph | Dependency, provenance, systems reasoning | Stable nodes, routed typed edges, neighborhood filtering, readable selection |
| Sequence | Process, history, scenario, handoff | Declared order, progress, prior/next, and time not encoded as z-depth |

Resize invokes the declared layout policy. Content reflows or changes semantic representation; it is never bitmap-scaled. When the available area falls below the group’s legibility budget, the group compacts, paginates, packs a subgroup, or asks to open a larger working view. It does not create arbitrary overlap or microscopic controls.

A layout mode may change through an explicit, previewed transformation that preserves placement identities. AI may propose the transformation; the user can inspect the mapping, reject it, or publish it.

## 36 · Relationship rules

Connection is the core reason to move beyond pages, so edges cannot be decorative afterthoughts.

- Links are typed and named.
- Hover/focus reveals only the local neighborhood needed for the current question.
- Crossing edges are routed, bundled, or suppressed by relevance.
- Direction, confidence, and status never rely on color alone.
- Selecting an edge explains why it exists, who or what created it, and its source evidence.
- AI-inferred links remain visually and semantically distinct until adopted.
- Hidden unauthorized nodes do not leave dangling clues.
- Flat mode renders the same link as a navigable relationship record.

## 37 · Navigation rules

### Space graph and neighbor reveal

The session topology is a graph of named spaces and typed portals. It may be a sequence, hub-and-spoke, fork, loop, or small network. It is never inferred from pixel coordinates.

The current renderer projects the active node and a small set of relevant neighboring nodes. In the INTO monitor profile, one projected neighbor may be previewed with two coordinated but distinct operations:

- **yaw around y:** temporarily turn the camera or neighboring world surface to reveal one chosen adjacency; and
- **translate on x:** animate a committed move to that neighbor and update the spatial address.

Yaw is an orientation cue, not a destination, and x is a projection convention, not the world schema. The INTO profile keeps the current space near 0°, turns an adjacent preview approximately 6–10°, and clamps free local yaw before the view becomes oblique enough to harm reading. Crossing the travel threshold, clicking the neighbor, or choosing it from the map commits the portal transition; the arriving space settles facing forward again.

Exact angles, gesture distance, portal placement, and velocity thresholds are profile tokens. The constitutional rule is that preview and commit must be distinguishable, interruptible, and available without gesture input. When a space has several neighbors, the map, command system, or visible portal labels disambiguate them; the user is not asked to discover topology by free rotation.

### Loaded neighborhood

A session loads the current space plus the smallest useful one-hop neighborhood—often the most recent origin and the most likely next destination—while farther spaces remain addressable summaries. Virtualization may replace full DOM or graphics for distant spaces, but it cannot change their identities, searchability, permissions, portals, or graph position.

Loading is a performance decision. It must not masquerade as a semantic session boundary.

### Space portals do not imply session changes

Remain in the same session while the user is pursuing the same goal under the same continuity contract—even when traveling through many spaces. A portal may connect nodes inside the current session or explicitly announce a different session. Rendering distance, camera angle, and loaded assets never decide which kind it is.

### Local travel

Pan between adjacent spaces and dolly between group stops. Movement is clamped, interruptible, and reversible.

### Long-distance travel

Search, history, map, and command palette may jump directly. Use a short cross-fade, compressed route, or landmark handoff; do not simulate a long flight.

### Wheel and trackpad

Wheel-to-dolly is allowed only inside an explicitly active spatial stage.

- The stage visibly owns focus.
- The first interaction does not unexpectedly capture ordinary page scroll.
- `Esc` or moving focus outside releases it.
- Trackpad deltas are accumulated into deliberate ring changes rather than one step per event.
- A visible control provides the same navigation without wheel input.

This resolves the contradiction between “scroll is a dolly” and “never scroll-jack.”

### Keyboard default

- `Tab` / `Shift+Tab`: focus interactive objects in semantic order.
- Arrow keys or configured navigation keys: move between declared spatial neighbors when the stage owns focus.
- `Home`: recenter current space.
- `Esc`: close detail, leave follow mode, cancel preview, or release the stage in that priority order.
- Command palette: jump by name without memorizing geometry.

Do not reserve keys while a text field, editable surface, or assistive technology owns them.

## 38 · A session is a continuity contract

A session exists to keep one bounded piece of work coherent across spaces, interruptions, collaborators, agents, and devices. It declares:

- **goal** — the desired outcome, not merely the opened application;
- **success condition** — how people and agents know the work is complete;
- **scope** — environment, case, project, tenant, source set, and working snapshot;
- **authority** — permissions, external destinations, and accountable principal;
- **participants** — humans and AI actors sharing the action timeline;
- **topology** — the space graph, published groups, placements, portals, and home;
- **history root** — undo, audit, replay, and conflict boundary;
- **resume capsule** — personal view plus changes since last presence; and
- **exit contract** — save, handoff, archive, abandon, and return behavior.

Open or restore a different session when that contract changes materially: a different goal, case, snapshot, privacy boundary, accountable team, principal, or history root. Performance pressure may trigger virtualization, compaction, or a recommendation to split the work; it may not silently invent a semantic session boundary.

A session transition is visually and operationally distinct from local travel. The portal names the destination and changed contract, resolves unsaved work, pauses or hands off scoped agents, writes the appropriate history entry, and preserves a return path.

Goals are first-class because they stabilize collaboration while interfaces and agents adapt. Recent Microsoft research similarly argues that explicit goals direct attention, enable coordination, sustain action, and provide evaluation at the point of work. [Goals as First-Class Abstractions in Human–AI Collaboration](https://www.microsoft.com/en-us/research/wp-content/uploads/2026/04/2026-goals-as-first-class-abstractions-in-human-ai-collaboration-AutomationXP26_paper_0982.pdf)

## 39 · Opened-on-top

Use one forward detail layer for a tethered detour:

- list → record;
- queue → item;
- decision → evidence;
- agent → trace;
- model → assumption.

The source context recedes but remains identifiable. Focus moves into the detail. Background interaction becomes inert. Closing restores camera, focus, selection, scroll position inside the source object, and all prior planes exactly.

Use flat navigation for destinations such as settings, reports, administration, or any task where the user will not return immediately to the source context.

## 40 · Periscope and minimize

**Periscope** means “held for seconds.” It remains a z0 object mostly outside the frame, with a graspable sliver, full identity, and no blur.

**Minimize** means “held for minutes.” It becomes a lens chip that preserves identity, state, and origin.

Both are reversible. Neither may silently turn into dismissal or data loss.

Frames may also be moved, raised, stacked, resized, and closed inside z0. Those desktop verbs follow four constraints:

- moving or resizing a view is personal until the participant explicitly publishes the arrangement;
- drag and resize have keyboard and single-pointer alternatives plus declared minimum and maximum bounds;
- raising a frame changes occlusion order only, never its ring or factual importance; and
- closing a view does not delete its object, abandon unsaved work without warning, or erase its provenance.

When a frame belongs to a structured group, resizing it invokes the group layout policy: redistribute cells, collapse secondary representations, or refuse the resize with a visible constraint. It may not silently overlap unrelated placements or push them to arbitrary depths.

A group normally begins with one primary working frame and creates auxiliary frames only when comparison, reference, or context preservation justifies them. Excess windows are not evidence of spatial sophistication. The frame budget is reached when another frame would obscure identity, break focus order, or force illegible sizing; the group then packs, tabs, summarizes, or opens a dedicated comparison mode.

This follows the durable desktop lesson rather than imitating window chrome. Apple’s window guidance treats opening, closing, resizing, relocation, multitasking, and context preservation as familiar behaviors while warning that excessive windows create clutter and confusion. [Apple: Windows](https://developer.apple.com/design/human-interface-guidelines/windows)

## 41 · Lens rules

Use one coherent lens system rather than independent sticky controls. It may contain:

- command/search;
- spatial address and home;
- space switcher and depth rail;
- minimized objects;
- collaboration/presentation state;
- AI state and stop control;
- theme, motion, contrast, and help.

Lens instruments never inherit world blur, tilt, recession, or occlusion. Lens incidents are temporary and disappear when resolved.

### Visibility and focus tiers

“Always visible” means continuously available, not continuously loud.

- **Safety-persistent:** leave/recenter, current session and space identity, active AI identity and stop, permission loss, disconnect, and unreconciled work. These remain visible whenever their condition applies.
- **Navigation-persistent:** command, map, space switcher, depth rail, minimized objects, and collaboration mode. These may collapse to recognizable instruments but remain reachable in one action.
- **Contextual lens:** actions, inspectors, resize handles, and guidance for the selected object. These appear only when the relevant object or mode owns focus.
- **World-attenuated:** groups, frames, annotations, and ambient landmarks. These may dim, blur, simplify, or become inert according to ring and semantic focus.

Lens controls stay in a stable keyboard region independent of camera motion. Only z0 world controls participate in the active world focus order; recessed or occluded views become inert rather than remaining invisible tab stops. Flat mode exposes the equivalent entities and actions through its own coherent reading order.

## 42 · Motion families

The INTO curve `cubic-bezier(0.16, 1, 0.3, 1)` remains the default profile. Durations may retain the established 150–650 ms ramp.

Define motion by semantic family:

- **acknowledge:** hover, focus, selection;
- **promote/recede:** depth-state change;
- **travel:** camera between adjacent locations;
- **tether:** detail opens from and returns to source;
- **park/restore:** periscope or minimize;
- **transfer:** object or responsibility moves between groups or actors;
- **preview/commit:** proposed topology becomes real;
- **incident:** error, permission loss, disconnect, or stop.

One dominant motion communicates the family. Ambient motion never competes with it.

## 43 · The INTO visual profile

The following remain excellent INTO-specific art direction and should live in the visual profile, not the universal constitution:

- off-centre vanishing point and restrained horizon;
- guide lines that dissolve before convergence;
- matte floor and controlled haze;
- one off-screen light source with consistent downward shadows;
- black, white, petrol, and rationed state color;
- one glass recipe and a strict glass budget;
- Blueprint Dark and Cool Light theme inversion;
- mono blueprint markers;
- edge tilt and periscope tilt limits;
- no warm ivory, pills, decorative glow, or unbounded texture;
- sparse ambient furniture.

The profile must still obey the constitution: landmarks over scenery, meaning over realism, and legibility over atmosphere.

The initial monitor profile may use the existing ring offsets as calibration seeds: z0 `0`, z1 `−160px`, z2 `−420px`, and z3 `−900px` at a perspective near `1200px`. Start with a sharp focus core of approximately `±32px` around the target stop and a clarity falloff extending roughly another `96px`; expose both as responsive tokens. The exact optics must be tuned against type size, viewport, and baseline hardware. The invariant is stronger than the numbers: the snapped target is fully sharp, adjacent stops are distinguishable, and no resting camera position leaves all useful content outside the focal envelope.

---

# Part III — AI and collaboration protocol

## 44 · AI interaction states

| State | Spatial expression | Required controls |
|---|---|---|
| Idle | Quiet agent marker or absent | Inspect scope/capabilities |
| Listening | Bounded highlight on attended objects | Stop; inspect inputs |
| Working | Progress attached to target object or task group | Stop; inspect plan/log |
| Proposing | Ghost objects, links, or layout with before/after difference | Accept, edit, reject |
| Waiting | Request anchored to the blocked step | Supply input or cancel |
| Committing | One causal transfer animation | Prevent duplicate commit |
| Complete | Local result plus durable action record | Inspect sources; undo if allowed |
| Failed | Failure at action site; unchanged state explicit | Retry, revise, or dismiss |

The agent never “thinks” through decorative particles. It communicates state, scope, progress, evidence, and controllability.

## 45 · Proposal objects

An AI proposal is a first-class object with:

- proposer identity and model/runtime label where relevant;
- creation time;
- target objects and intended action;
- source set and provenance;
- confidence or uncertainty where meaningful;
- preview representation;
- required authority;
- expiration or staleness condition;
- decision and decision-maker;
- resulting mutation or explicit no-op.

This makes collaboration with AI inspectable and replayable instead of conversationally ephemeral.

## 46 · AI has a locus, principal, and goal

AI is not automatically an avatar in the room or a chat panel on the lens. Its visible locus follows the scope of its work.

| AI locus | Scope | Appropriate expression |
|---|---|---|
| Lens assistant | Personal command, search, explanation, navigation suggestion | Quiet camera-fixed instrument; never shared by implication |
| Object tool | One transformation, analysis, or explanation | Control and result anchored to the target object |
| Group agent | A bounded task across a working set | Identity and progress attached to the group; stop and inspect remain visible |
| Session actor | Longer-running work across spaces | Roster presence, declared goal, scope, plan, checkpoints, and handoff state |
| External service | Action outside the environment | Named destination, credentials/authority boundary, preview, receipt, and failure state |

Every agent names the human or organizational principal on whose behalf it acts. It also names the current goal, allowed spaces and sources, available tools, mutation rights, time or cost budget, and stop condition. An agent may suggest a camera destination; it may not seize the personal camera, enter follow mode, or publish a shared arrangement without the corresponding authority.

Multiple agents do not each earn permanent screen presence. The lens summarizes the roster and exceptions; detailed state appears at the group or object where work occurs. Common ground and workspace awareness must be externalized rather than inferred from anthropomorphic animation. This aligns with Microsoft’s current collaboration-readiness research, which calls for visible common ground, workspace awareness, transparency, and controllability around agents. [From Task Solvers to Teammates](https://www.microsoft.com/en-us/research/project/from-task-solvers-to-teammates-a-theory-grounded-architecture-for-advancing-collaboration-readiness-in-llm-agents/)

## 47 · Shared attention protocol

Participants can:

- point to an object or relationship;
- invite others to a spatial address;
- request follow mode;
- pin a shared comparison;
- hand over control of a shared tool;
- annotate a bounded region;
- ask an AI agent to inspect the same shared selection.

Every action names its scope. “Look here” points to an object identity and version, not merely x/y coordinates that may differ across viewports.

## 48 · Concurrency and conflict

- Personal camera and temporary layout do not conflict.
- Shared object edits use optimistic concurrency or explicit locks according to risk.
- A participant sees when the object they are viewing has changed underneath them.
- Conflicts are resolved at the object or field level, not by overwriting the whole room.
- AI commits participate in the same history and conflict rules as human commits.
- Presentation control and business authority are separate permissions.

## 49 · One transaction protocol governs every actor

Direct manipulation, commands, collaboration, and AI use one state-change protocol:

`intent → preview → validate → authorize → commit → announce → record → recover`

The rigor varies by consequence, not by whether the actor is human or AI.

| Transaction class | Examples | Minimum contract |
|---|---|---|
| View | Move frame, yaw preview, local comparison, theme | Immediate feedback, local undo, no shared mutation |
| Shared arrangement | Publish group, move shared placement, pin comparison | Difference preview, authorship, conflict check, shared undo policy |
| Canonical content | Approve, edit record, adopt link, change status | Domain validation, authority, version, audit, recovery |
| External action | Send, deploy, purchase, publish, notify | Named destination and audience, final preview, explicit authorization, receipt |

A gesture can begin a transaction but never bypass its authority. Dropping a placement into a group may update a personal view immediately; publishing that group is a separate shared transaction. Accepting an AI layout is separate again from adopting any inferred relationships it visualizes.

The local result appears where the action occurred. The lens reports only cross-cutting incidents, durable completion, or recovery that cannot be understood locally.

---

# Part IV — Browser implementation contract

## 50 · Use a model-first architecture

Recommended layers:

1. **Canonical world model** — typed objects, links, permissions, provenance, versions, and domain history.
2. **Session model** — goals, success conditions, snapshots, space graph, portals, published groups and placements, actors, and continuity contract.
3. **Personal view model** — camera, focus stack, local placements, frames, lens, preferences, and resume capsule.
4. **Transaction engine** — intent, preview, validation, authority, commit, conflicts, undo, replay, and receipts for human and AI actions.
5. **Projection engine** — derives spatial, flat, print, compact, and test representations from the same model.
6. **DOM interaction layer** — semantic controls, readable content, input focus, forms, and assistive-technology access.
7. **Scene layer** — CSS 3D transforms for planes and groups; SVG or canvas for projected edges and ambient geometry.
8. **Optional graphics layer** — WebGL/WebGPU for large graphs, particles, volumetric effects, or model previews, never as the only semantic surface.
9. **Action/event log** — durable authorship, undo, replay, audit, collaboration, AI provenance, and session resumption.

Do not make DOM position or transform strings the data model.

## 51 · CSS 3D is a projection, not a 3D world

CSS transforms are well suited to browser-native 2.5D panels: shared perspective, `translateZ`, rotations, and readable DOM content. The standard is explicit that transformed elements remain flat planes, not volumetric objects. [CSS Transforms Level 2](https://www.w3.org/TR/css-transforms-2/)

Implementation consequences:

- Establish one documented perspective context per scene or deliberately coordinated scene family.
- Use `perspective-origin` as a camera parameter, not scattered decoration.
- Do not assume visual z position automatically fixes focus order, hit testing, or accessibility order.
- Keep semantic focus and active state explicit even when visual sharpness is derived from camera position.
- Test interpenetration, backface behavior, and browser-specific compositing.

## 52 · Filters can flatten the scene

The CSS specification requires several grouping properties—including opacity below 1, filters, clipping, masking, and many overflow values—to flatten descendants before compositing, defeating `preserve-3d` on that element. [CSS Transforms grouping properties](https://www.w3.org/TR/css-transforms-2/#grouping-property-values)

Therefore:

- apply blur/dim treatments on a wrapper outside the preserved 3D subtree, on child surfaces, or through carefully tested pseudo-elements;
- do not place `filter: blur(...)` on the world root and expect nested depth sorting to survive;
- separate glass/backdrop effects from transform-preservation boundaries;
- include cross-browser scene-flattening tests in conformance.

## 53 · DOM first for work, graphics first for atmosphere

Use real DOM controls for anything a person must read, focus, edit, submit, copy, or inspect with assistive technology.

Use canvas/WebGL/WebGPU for:

- ambient scene geometry;
- high-volume relationship rendering;
- particles and light;
- non-semantic far-field silhouettes;
- genuine 3D data or object models.

If a canvas element represents an actionable object, pair it with one semantic object in the DOM model and provide equivalent focus, label, state, and action. Avoid duplicate tab stops from visual and semantic mirrors.

## 54 · Responsive behavior is a change of projection

Do not squeeze the room.

- Wide desktop: full spatial composition.
- Compact desktop/tablet: fewer simultaneous groups, shallower tilt, simplified edges, stronger map.
- Narrow/touch: one focal group, swipe or explicit controls between spaces, 44 px targets, limited periscope.
- Reduced motion: discrete state swaps with minimal fades or none.
- Flat mode: linear hierarchy with equivalent relationships and actions.

The canonical object model, session contract, and object/placement addresses stay constant across projections. A projection may choose a different local layout without pretending that personal presentation is shared truth.

## 55 · Persistence and browser history

Persist separately:

- canonical world data;
- object addresses independent of placement addresses;
- session goal, success condition, working snapshot, authority, actors, space graph, portals, and history root;
- published group hierarchy and placements;
- participant-specific placement overrides and private comparisons;
- personal camera and focus stack;
- participant-specific frame bounds, stack order, periscope, minimize, and unsaved state;
- resume capsule and last-seen versions;
- ephemeral previews only while their transaction is active;
- undo history within a bounded session.

Use browser history for meaningful destinations and deep-linked object inspections. Do not create a history entry for every hover, pixel of camera movement, or transient focus change.

## 56 · The default renderer is DOM-first and dependency-light

The core spatial runtime uses the browser's existing strengths:

- semantic HTML and DOM controls for frames, text, forms, approvals, provenance, and inspectable state;
- CSS `perspective`, `translate3d`, and rotation for screen-spatial projection;
- the Web Animations API as the default motion driver;
- SVG for sparse, labeled relationships;
- Canvas 2D for dense relationship fields, atmosphere, and non-semantic scenery when SVG paint cost becomes material; and
- dynamically imported Three.js only for genuine meshes, occlusion, model inspection, shaders, or other volumetric content.

GSAP is an optional motion adapter, not a state dependency. It earns its place when interruption, scrubbing, FLIP layout, or coordinated timelines become materially clearer than the native implementation. The world model, transaction engine, and final styles must not depend on GSAP-specific objects. The native Web Animations API already provides cancellable animation objects and is broadly available; GSAP's value is authoring and sequencing, not permission to animate expensive properties. [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [GSAP CSS transforms](https://gsap.com/docs/v3/GSAP/CorePlugins/CSS/)

Readable interface content never moves into WebGL merely to make the architecture feel more spatial. Three.js enters as one optional graphics surface behind or beside the semantic DOM, loaded only when the requested object or effect requires it.

## 57 · Render on state change, never because time is passing

At rest, the environment requests no animation frames. Rendering begins because input, data, focus, camera, or view state changed; it ends when the transition settles.

- A camera move animates one world root whenever possible.
- A group depth move animates one group plane, not every member independently.
- Pointer and wheel events update desired state; at most one scheduled animation frame applies the newest value.
- Geometry reads happen once at the beginning of an interaction or through an observer, never interleaved repeatedly with style writes.
- Routine motion animates `transform` and `opacity`. Blur, glass, large shadows, and relationship density change discretely at rest or on isolated inner surfaces.
- `will-change` appears immediately before known motion and is removed after settlement; it is not a permanent class on every frame.
- Hidden tabs, frozen spaces, minimized frames, and completed 3D inspections own no live render loop.

This is the largest thermal distinction between a spatial work surface and a game. Three.js explicitly recommends on-demand rendering for editor-like applications because continuous rendering wastes device power. Browser animation guidance likewise recommends transform and opacity as the normal compositor-friendly path and warns against leaving `will-change` everywhere. [Three.js: Rendering on Demand](https://threejs.org/manual/en/rendering-on-demand.html), [web.dev: Animations and performance](https://web.dev/articles/animations-and-performance)

## 58 · The performance console has three user levers

Performance is a personal-view preference exposed through the lens. It never changes canonical truth, shared topology, available actions, or the meaning of depth. The console exposes three independent controls and three coherent presets.

| Lever | Efficient | Balanced — default | Cinematic |
|---|---|---|---|
| **Visual richness** | Transform and opacity motion; static haze; minimal glass and shadow; no ambient loop; no automatic WebGL | Restrained glass; resting blur on isolated surfaces; sparse relationship animation; true 3D only when explicitly opened | Richer atmosphere, lighting, shadow, resting blur, and optional Three.js effects; still no unnecessary permanent loop |
| **Active-frame capacity** | 4 fully live frames | 8 fully live frames | 6 fully live frames, reserving more of the budget for effects |
| **Loading horizon** | Focal group plus current-space shell; everything else is metadata until requested | Current space plus the most likely adjacent space or focus stop | Current space plus visible neighbors; effect and 3D assets begin only on intent or qualified idle time |

The preset is one choice; the controls remain independently adjustable in an Advanced view. Someone may choose Efficient visuals with 12 active frames, or Cinematic visuals with a four-frame cap. Such custom combinations are allowed but are measured against the same interaction budget.

Profile changes:

- take effect without a reload;
- persist per participant and device as personal-view state;
- are announced accessibly and remain reachable in flat mode;
- never override `prefers-reduced-motion`, which is an accessibility requirement rather than a speed preference; and
- never make essential labels, provenance, undo, stop, or safety controls optional.

Cinematic is consent to spend more of the available rendering budget on atmosphere. It is not consent to corrupt interaction, overheat indefinitely, or hide degraded performance.

## 59 · Frame caps protect attention and hardware, not data

The active-frame cap counts fully live DOM frames with readable or interactive contents. It does not count minimized chips, frozen snapshots, or model records that remain searchable and restorable.

Frames occupy one of four runtime tiers:

1. **Active** — mounted, current, readable, and interactive.
2. **Warm** — mounted for imminent promotion, but internally inert and free of media or animation loops.
3. **Frozen** — replaced by a lightweight labeled snapshot or silhouette while exact frame, placement, object, and restore state remain in the model.
4. **Minimized** — represented by a lens chip and persisted state only.

When an opening action would exceed the cap, the runtime proposes or performs the least destructive eligible transition: freeze the least-recently-used clean inactive frame, then minimize it if the selected profile does not retain frozen snapshots. It never silently closes a view, deletes an object, discards unresolved input, or terminates work.

The following frames are protected from automatic reclamation:

- explicitly pinned frames;
- frames with unsaved or invalid input;
- active approvals, transfers, recordings, or external-action previews;
- frames containing the current focus, selection, or opened-on-top source; and
- frames that are the visible locus of a running human or AI transaction.

If every frame is protected, the new opening pauses and the lens asks which eligible frame to park. The choice names the consequence and preserves exact restoration. Capacity policy is a view transaction; it never mutates entity truth.

## 60 · Loading follows attention and remains abortable

Loading priority is derived from semantic intent, not Euclidean distance alone.

1. **Now** — lens, focal group, active overlay, selected object, and required sources load fully.
2. **Next** — the likely adjacent focus stop or named neighboring space loads structure, text, and small previews but no autoplaying media or continuous graphics.
3. **Later** — other spaces load only manifests, counts, labels, topology, and search metadata.
4. **Cold** — other sessions retain stable addresses and resumable metadata until entered.

Every speculative request is cancellable. A response must still match the current object version, session, and intent before it may change the view. Media decoding, relationship drawing, optional motion libraries, and Three.js modules begin only when their projection requires them. Search operates on the model or index rather than depending on every result existing in the live DOM.

`content-visibility`, containment, inert subtrees, frozen snapshots, and module-level dynamic imports are implementation tools for this policy. They are not information architecture. Loading or unloading a space never creates a new session, changes history, or makes an object cease to exist. Browsers can skip substantial layout and paint work for content whose rendering is not currently needed, while the model retains the information required for navigation and search. [CSS `content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility)

## 61 · Adaptive quality protects the selected experience

The selected profile is the target. A small performance governor may temporarily reduce rendering cost when actual interaction misses the certified budget, but it follows a deterministic degradation order:

1. stop ambient motion and background particles;
2. reduce shadow radius, backdrop area, and resting blur;
3. lower Canvas or WebGL drawing-buffer resolution;
4. simplify or freeze non-focal relationship drawing;
5. freeze warm neighbors and shorten the loading horizon; and
6. replace optional volumetric scenery with a static projection.

It never removes readable content, controls, provenance, collaboration presence, agent stop controls, undo, or the flat equivalent. It never changes the user's visual profile permanently without consent.

The governor measures only bounded interaction windows; it does not create a permanent monitoring loop. A profile is certified on baseline hardware only when common camera, focus, drag, minimize, and restore sequences:

- produce no idle animation loop after settlement;
- avoid interaction-time main-thread tasks longer than 50 ms;
- hold the declared frame budget in a recorded performance trace;
- preserve correct focus and input behavior under CPU throttling; and
- return to zero optional rendering work when the page is hidden.

If a temporary downshift occurs, the lens announces it once—for example, “Cinematic effects reduced for this session”—and provides Restore or Keep Efficient. Automatic recovery waits until the next session or explicit request so quality does not oscillate during work. Three.js scenes additionally cap their physical drawing-buffer pixel count rather than blindly multiplying the full viewport by device pixel ratio. [Three.js: Responsive Design](https://threejs.org/manual/en/responsive.html)

## 62 · Conformance classes

### Core spatial

- model-first objects and typed links;
- distinct object, placement, frame, group, space, and session identities;
- four declared state-ownership planes;
- explicit session goal and continuity contract;
- semantic space graph and typed portals independent of projected x/y/z coordinates;
- declared coordinate semantics;
- stable object and placement addresses;
- z0–z3 level-of-detail behavior;
- occupied focus stops with clamped snap travel and no dead depth interval;
- inspectable context, camera, work, input, and shared-attention focus;
- placement, view, and entity-state separation;
- declared group layout modes and batch operations;
- home/map/history/search;
- stable lens visibility and focus tiers;
- session interruption, resume, and catch-up behavior;
- flat equivalent;
- serializable and testable state.

### Collaborative spatial

- shared world/personal camera split;
- anchored presence and pointing;
- authorship and version visibility;
- explicit follow/presentation mode;
- conflict handling.

### Agentic spatial

- visible agent identity, scope, state, and stop control;
- proposal/preview/authority/commit/revert loop;
- source and action provenance;
- no silent shared mutation.
- declared agent principal, goal, locus, scope, budget, and stop condition;
- the same transaction protocol for human- and AI-initiated change.

### INTO visual profile

- canvas, lighting, glass, color, type, motion, ring, tilt, and furniture constraints from the brand profile;
- no visual-profile rule may break a core conformance requirement.

### Runtime performance and capacity

- DOM-first core with Web Animations as the dependency-free motion baseline;
- zero requested animation frames at idle;
- transform/opacity motion for routine travel, focus, drag, minimize, and restore;
- independent visual-richness, active-frame-capacity, and loading-horizon controls;
- Efficient, Balanced, and Cinematic presets with Balanced as the default;
- active, warm, frozen, and minimized runtime tiers;
- protected pinned, dirty, approval, focus-source, and running-transaction frames;
- priority-based cancellable content loading;
- on-demand Canvas and Three.js rendering with bounded drawing-buffer resolution;
- deterministic, announced quality downshift before information loss; and
- trace-based certification on named baseline hardware.

## 63 · Minimum acceptance tests

### Structure

- Every rendered object resolves to one model identity.
- The same object can appear in two placements without duplicated truth, history, or actions.
- Closing or removing one placement leaves the object and its other placements intact.
- Every relationship is either declared or visibly tentative.
- Every card or frame resolves through a placement to one explicit group or to the one temporary detail layer; no placement stores an arbitrary persistent world depth.
- Every field can be attributed to canonical, shared-session, personal-view, or ephemeral-interaction state.
- Group, placement, frame, view, and entity state remain independently inspectable.
- Every object and placement address restores after refresh.
- Back/forward returns to the expected durable states.

### Navigation

- Keyboard-only users can enter, navigate, operate, and leave the stage.
- Recenter is always available.
- Long jumps preserve origin and return.
- Wheel capture never traps the page or browser.
- Yaw preview does not silently commit space travel, and a committed neighboring space settles facing forward.
- The semantic space graph remains correct when the renderer projects different neighbors or coordinates.
- Loading and unloading a virtualized neighbor does not change session identity.
- A session transition names the changed continuity contract, resolves scoped work and agents, and offers return.
- Restoring a session distinguishes the prior personal view from shared changes that happened while away.

### Depth and focus

- Only z0 contains readable body text.
- Recessed surfaces are not accidentally focusable or clickable.
- Every dolly input snaps to an occupied focus stop and clamps at both ends; no stable state leaves every group blurred.
- Changing group depth preserves the focal group identity or announces the new focal target.
- Opened-on-top restores camera, focus, selection, and source state exactly.
- Programmatic focus is correct even when camera focus changes.
- Context, camera, work, input, and shared-attention focus can be inspected independently and never steal one another implicitly.

### Frames and lens

- Move, raise, stack, resize, periscope, minimize, restore, and close produce the declared view states without changing entity truth.
- Resize reflows or changes semantic representation; it never bitmap-scales readable UI.
- Close view and delete entity are distinct verbs with distinct authority and recovery.
- Tile, stack, canvas, graph, and sequence groups either obey their declared layout policy or are rejected as unsupported; no silent fallback corrupts placement.
- Safety-persistent lens controls remain reachable throughout camera motion and world focus changes.
- Only z0 world controls enter the active world focus order; occluded and recessed views are inert.

### Collaboration

- Two participants can point to the same object despite different cameras.
- Personal view changes do not mutate shared topology.
- Follow mode is explicit and escapable.
- Concurrent edits produce a visible resolution path.

### AI

- The agent’s target, source scope, and current state are inspectable.
- Consequential shared changes require the correct authority.
- Proposal rejection leaves no mutation.
- Commit creates an attributable history event.
- Stop, failure, and retry states are deterministic.
- Each agent reveals principal, goal, locus, scope, budget, and stop condition.
- A layout proposal, shared-arrangement publication, canonical link adoption, and external action remain separate transactions.

### Transactions and recovery

- View, shared-arrangement, canonical-content, and external transactions enforce different authority without changing the interaction vocabulary.
- Cancel before commit leaves no durable mutation.
- Commit produces a local causal result, version, authorship, and recoverable record.
- Interrupted drag, camera travel, session portal, and agent commit settle into one deterministic state.
- Resume after refresh, disconnect, or device handoff does not duplicate actions or discard unreconciled work.

### Accessibility

- Flat mode contains every entity, relationship, state, and action.
- All drag actions have single-pointer and keyboard alternatives.
- Pointer targets meet the selected WCAG level.
- Reduced motion removes travel, blur animation, tilt, and ambient loops.
- Screen-reader output does not duplicate visual mirror content.

### Performance

- Camera and drag interactions meet the declared frame budget on baseline hardware.
- The settled environment owns no active animation frame, Canvas loop, WebGL loop, autoplaying media, or ambient timer.
- Efficient, Balanced, and Cinematic can be selected without reload, state loss, or change to canonical or shared-session truth.
- Each of the three performance controls can be adjusted independently and restored to its preset value.
- Opening beyond the active-frame cap freezes or minimizes only an eligible clean inactive frame and restores it exactly later.
- Pinned, dirty, approval, focus-source, and running-transaction frames are never reclaimed automatically.
- If every frame is protected, opening pauses for an explicit capacity choice rather than closing or deleting anything.
- `Now`, `Next`, `Later`, and `Cold` content priorities load only their declared representation and cancel stale speculative work.
- Optional GSAP and Three.js modules are absent from the initial core path and load only when a requested projection requires them.
- Optional Three.js rendering stops after settlement and caps its physical drawing-buffer resolution.
- A performance downshift is visible, deterministic, reversible, and never removes semantic content, provenance, safety, or recovery controls.
- Far spaces and hidden groups virtualize without breaking addresses or search.
- The loaded neighborhood may change without resetting the session, collaboration context, or undo timeline.
- Losing connection does not corrupt local or shared state.
- Visual degradation removes atmosphere before information.

---

# Part V — What to borrow, and what not to borrow

## 64 · From Apple spatial design

Borrow:

- familiar controls before novel ones;
- centered primary attention;
- subtle depth for hierarchy;
- flat readable text;
- predictable, comfortable movement;
- one meaningful spatial moment rather than depth everywhere;
- clear entry, exit, and recentering;
- shared context for collaboration.

Translate for a monitor:

- the viewport replaces the field of view;
- mouse/trackpad/keyboard replace gaze and pinch;
- geometric scaling does not guarantee legibility, so semantic zoom is required;
- the browser, not the operating system, must provide orientation, history, flat mode, and input escape.

Do not copy:

- gaze-sized targets or headset ergonomics as desktop values;
- physical-world lighting assumptions;
- automatic head-parallax cues the monitor does not have;
- the belief that “infinite canvas” removes attention limits.

Apple’s five high-level principles—familiar, human-centered, dimensional, immersive, and authentic—are a helpful evaluation lens, not a browser component specification. [Apple: Principles of spatial design](https://developer.apple.com/videos/play/wwdc2023/10072/)

## 65 · From games

Borrow:

- the player/operator has a role, verbs, tools, goals, and consequences;
- local, diegetic feedback reduces translation;
- context-sensitive information beats an always-on dashboard;
- a persistent world makes state changes feel consequential;
- stable landmarks and safe hubs teach navigation;
- interface, environment, sound, and motion share one language;
- hybrid world/HUD systems are stronger than ideological purity.

Do not copy:

- challenge created by hiding necessary information;
- slow “immersive” interactions repeated hundreds of times;
- gamepad-only navigation;
- camera motion designed for excitement;
- world-building that obscures throughput or auditability.

## 66 · From cinematic interfaces

Borrow:

- coherent visual language across devices and contexts;
- visible causality: intent → manipulation → system response → outcome;
- information choreography that reveals hierarchy over time;
- the AI as a conversational and visual collaborator, not a chat box attached to a dashboard;
- high-quality transition design as part of system meaning.

Perception’s Stark-technology case studies explicitly describe interface systems as a coherent technological lineage and J.A.R.V.I.S. as a visual manifestation of Stark’s thinking. That is valuable as design fiction: the interface expresses a model of mind and machine working together. [Iron Man 2 technology design](https://www.experienceperception.com/work/iron-man-2/), [Spider-Man technology design](https://www.experienceperception.com/work/spider-man-no-way-home-tech/)

Do not copy:

- decorative telemetry that no operator can parse;
- tiny type readable only in a close-up;
- constant movement used to make a shot feel alive;
- gesture vocabularies designed for actors and viewers rather than fatigue, precision, and repetition;
- fake latency and gratuitous assembly animations.

The practical lesson from Minority Report is not “wave your arms.” Its interface designer created a domain-specific gesture language, documented it, trained its users, and tied it to a coherent spatial model. Real products need the same rigor with far less physical effort. [John Underkoffler’s g-speak demonstration](https://www.ted.com/talks/john_underkoffler_pointing_to_the_future_of_ui), [MIT Luminous Room](https://tangible.media.mit.edu/project/io-bulb-and-luminous-room/)

## 67 · From Microsoft’s future visions and research

Borrow:

- information follows the person and task rather than belonging to one device;
- surfaces are portals into one information fabric;
- handoff preserves context;
- collaboration happens around a shared artifact;
- AI captures intent and helps direct attention;
- rooms and displays can provide focus-plus-context beyond one rectangle.

Microsoft described its future-productivity concepts as tools for focusing attention, managing time, and fostering connection, built partly from real technologies such as speech, collaboration, and data visualization. Its research line then made several pieces concrete: Data Mountain, Task Gallery, IllumiRoom, and RoomAlive. [Microsoft Future Vision](https://blogs.microsoft.com/blog/2011/10/27/microsoft-offers-a-glimpse-into-the-future-of-productivity/), [IllumiRoom](https://blogs.microsoft.com/ai/microsoft-research-at-ces-illumiroom/), [RoomAlive](https://www.microsoft.com/en-us/research/project/roomalive/)

Do not copy:

- “every surface is a screen” as an end in itself;
- invisible data transfer with unclear privacy or authority;
- ambient assistance that cannot be inspected or stopped;
- concept-video transitions that skip error, latency, permissions, conflict, and recovery.

## 68 · From Rooms, Elastic Windows, Scalable Fabric, and Pad++

The strongest lineage is not visual futurism. It is four decades of attempts to make large information spaces manageable.

Borrow:

- **working sets and resumable contexts** from Rooms: separate task workspaces, overview, doors, and rapid reacquisition after switching;
- **hierarchical batch operations** from Elastic Windows: group, pack, unpack, resize, save, load, and change layouts as coherent actions;
- **focus plus context and task peripheries** from Microsoft Scalable Fabric: active work remains central while named task groups stay spatially available;
- **information physics** from Pad++: consistent behavioral rules matter more than literal desktop or room metaphors;
- semantic representation changes across scale rather than miniature full interfaces; and
- experimental comparison against ordinary window management rather than assuming novelty creates value.

Do not copy:

- unrestricted continuous zoom as the only navigation model;
- deep visual nesting that turns hierarchy into a tunnel;
- periphery so dense that “still visible” becomes “always distracting”;
- group operations that silently mutate underlying content; or
- spatial memory claims without interruption, resumption, and flat-baseline testing.

The combined lesson is decisive: the reusable unit is the **task working set**, supported by persistent placement, group operations, focus-plus-context, and fast resumption. Three-dimensional scenery is optional. [Rooms](https://doi.org/10.1145/24054.24056), [Elastic Windows](https://www.cs.umd.edu/users/ben/papers/Kandogan1998Elastic.pdf), [Scalable Fabric](https://www.microsoft.com/en-us/research/publication/scalable-fabric-flexible-representation-task-management/), [Pad++](https://www.cs.umd.edu/~bederson/images/pubs_pdfs/p17-bederson.pdf)

---

# Part VI — Recommended reference slice

## 69 · Build one session that proves the model

The first reusable reference implementation should be an **Evidence and Decision Session**, not a generic 3D demo.

It contains:

- **Space A · Question** — the decision, constraints, and open assumptions;
- **Space B · Evidence** — source groups, claims, counterevidence, and provenance links;
- **Space C · Action** — options, approval, owner, dependencies, and next proofs;
- one explicit session goal, success condition, snapshot, authority scope, actor roster, and exit contract;
- a three-node space graph with labeled portals and only the useful one-hop neighborhood fully rendered;
- at least three groups using two different layout modes at distinct occupied focus stops;
- one object deliberately shown in two placements, proving synchronized identity without duplicated truth;
- one named portal to a second session with a return path;
- one human collaborator and one bounded AI researcher;
- separate context, camera, work, input, and shared-attention focus instrumentation;
- one opened-on-top evidence inspection;
- one temporary comparison slab;
- one move, stack, resize, pack, minimize, and exact-restore frame sequence;
- one tentative AI-proposed relationship;
- one view transaction, one shared-arrangement publication, one canonical-content commit, and one mocked external-action preview;
- one interruption, changed-while-away event, restore-view path, and catch-up path;
- one lens performance console exposing visual richness, active-frame capacity, and loading horizon;
- Efficient, Balanced, and Cinematic preset demonstrations plus one custom combination;
- enough frames to exceed the Balanced cap, including pinned, dirty, approval, and running-agent protection cases;
- observable `Now`, `Next`, `Later`, and `Cold` loading transitions with cancelled speculative work;
- an optional dynamically imported Three.js object inspection that renders on demand and disposes cleanly;
- a recorded idle state with zero animation, Canvas, WebGL, media, or ambient loops;
- one flat-mode projection.

This slice forces the system to demonstrate information interconnection, context retention, AI collaboration, authority, and accessibility—the reasons to build spatial computing in the first place.

## 70 · Evaluation scenarios

Test the same tasks in spatial and flat forms:

1. Find the evidence supporting a decision and identify its source.
2. Open a record, inspect it, and return without losing the prior comparison.
3. Explain the relationship between two distant objects.
4. Ask the AI to propose a cluster, reject one link, and publish the rest.
5. Invite a collaborator to the same object while keeping independent cameras.
6. Hand over presentation control and leave follow mode.
7. Complete the workflow using keyboard only and reduced motion.
8. Refresh from a shared link and recover the same durable state.
9. Group several cards, traverse every occupied focus stop, and confirm that no resting state leaves all useful content blurred.
10. Yaw toward a neighboring space, commit travel within the session, then use the portal to enter and return from a different session.
11. Move, stack, resize, minimize, close, and restore frames without changing or deleting their underlying objects.
12. Open the same object in two placements, change canonical state once, and confirm that both views reconcile without duplicate history.
13. Publish one personal placement while leaving another private; verify that a collaborator receives only the published arrangement.
14. Interrupt the session, change shared state from another participant, then test both restore-my-view and catch-me-up.
15. Move through context, camera, work, input, and shared-attention focus independently without an unexplained focus jump.
16. Ask the AI researcher to propose a layout and a relationship, accept only the layout, and verify that canonical truth remains unchanged.
17. Switch Efficient → Balanced → Cinematic → custom while preserving objects, placements, focus, history, and available actions.
18. Exceed the active-frame cap with clean, pinned, dirty, approval, focus-source, and running-agent frames; verify that only an eligible frame freezes or minimizes and every frame restores exactly.
19. Travel toward one neighbor and immediately choose another; verify that stale speculative loading cancels and cannot overwrite the new view.
20. Open and close the optional Three.js inspection, then prove that its module is absent from the initial path, its drawing buffer is capped, its loop stops after settlement, and its resources dispose on close.
21. Record the settled room and confirm zero requested animation frames and zero optional rendering work; record common motion sequences under the named baseline and throttled profiles.

Only after this slice beats or meaningfully complements the flat baseline should the framework expand to free placement, additional space shapes, richer environments, spatial audio, or genuine 3D models.

---

# Part VII — Revised “Never” list

- A page with perspective but no persistent world model.
- A room whose topology exists only in CSS transforms.
- An object duplicated because it appears in two placements.
- A frame, placement, group, or object lifecycle presented as though they were the same state.
- Cards or frames at arbitrary independent persistent depths instead of explicit groups.
- Recursive visual group depth that turns hierarchy into rooms inside rooms.
- Paint order or `z-index` presented as semantic depth.
- Depth with more than one semantic meaning in the same environment.
- Free dolly that can stop where every meaningful object is outside the focal envelope.
- Body text outside the focal plane.
- A relationship shown only by proximity or an unexplained line.
- AI rearrangement without preview, provenance, authority, and revert.
- Shared camera control without explicit follow mode and immediate escape.
- Drag as the only way to perform an action.
- Pointer targets below the declared WCAG conformance level.
- Scroll capture without focus ownership, release, and an alternate control.
- A session boundary inferred from yaw angle, rendering distance, or asset loading alone.
- A performance optimization that silently changes the user’s goal, history, collaborators, or session identity.
- A permanent animation, Canvas, or WebGL loop in a settled working environment.
- Unbounded live frames or a frame cap that silently closes, deletes, or discards work.
- Automatic reclamation of pinned, dirty, approval, focus-source, or running-transaction frames.
- Preloading every space, frame, media asset, model, and effect merely because it belongs to the session.
- A Cinematic profile that multiplies effects, live frames, loading horizon, and pixel density without a bounded budget.
- An adaptive-quality change that is invisible, oscillates during work, or removes semantic information before atmosphere.
- Full device-pixel-ratio WebGL rendering without a physical pixel cap.
- A space topology inferred from screen coordinates instead of named portals.
- Long literal flights through irrelevant space.
- Ambient motion that resembles state change.
- Cinematic telemetry that no operator can interpret.
- Glass, blur, glow, shadow, or parallax with no informational job.
- Canvas-only controls without semantic equivalents.
- Close view that silently deletes the underlying entity or discards unresolved work.
- Always-visible controls that blur, tilt, recede, or disappear with the world they control.
- Recessed or fully occluded controls that remain invisible keyboard stops.
- Camera sharpness, object selection, DOM focus, and remote attention collapsed into one “focused” flag.
- Personal placement changes synchronized as shared truth without an explicit publish transaction.
- An AI avatar whose location, animation, or personality substitutes for principal, goal, scope, authority, and stop.
- A human gesture or AI shortcut that bypasses the common transaction protocol.
- Session restore that recreates old coordinates without reconciling changed shared state.
- Hidden content or relationships leaking through shared topology.
- A reduced-motion mode that simply removes transitions but leaves navigation incomprehensible.
- A flat mode that loses entities, relationships, authorship, or actions.
- A spatial feature shipped without a flat comparison and task evidence.

---

# Research lineage

## Platform and accessibility

- Apple, [Principles of spatial design](https://developer.apple.com/videos/play/wwdc2023/10072/)
- Apple, [Spatial layout](https://developer.apple.com/design/human-interface-guidelines/spatial-layout/)
- Apple, [Design for spatial user interfaces](https://developer.apple.com/videos/play/wwdc2023/10076/)
- Apple, [Design spatial SharePlay experiences](https://developer.apple.com/videos/play/wwdc2023/10075/)
- Apple, [Windows](https://developer.apple.com/design/human-interface-guidelines/windows)
- W3C, [CSS Transforms Module Level 2](https://www.w3.org/TR/css-transforms-2/)
- W3C, [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- W3C, [XR Accessibility User Requirements](https://www.w3.org/TR/xaur/)
- W3C, [Making DOM order match visual order](https://www.w3.org/WAI/WCAG22/Techniques/css/C27)

## Browser runtime and performance

- MDN, [Web Animations API: `Element.animate()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
- MDN, [CSS `content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility)
- web.dev, [Animations and performance](https://web.dev/articles/animations-and-performance)
- GSAP, [CSS transforms](https://gsap.com/docs/v3/GSAP/CorePlugins/CSS/)
- Three.js, [Rendering on Demand](https://threejs.org/manual/en/rendering-on-demand.html)
- Three.js, [Responsive Design and drawing-buffer limits](https://threejs.org/manual/en/responsive.html)

## Spatial information and productivity

- Microsoft Research, [Data Mountain](https://www.microsoft.com/en-us/research/publication/data-mountain-using-spatial-memory-for-document-management/)
- Microsoft Research, [The Task Gallery](https://www.microsoft.com/en-us/research/publication/the-task-gallery-a-3d-window-manager/)
- Henderson and Card, [Rooms](https://doi.org/10.1145/24054.24056)
- Kandogan and Shneiderman, [Elastic Windows](https://www.cs.umd.edu/users/ben/papers/Kandogan1998Elastic.pdf)
- Microsoft Research, [Scalable Fabric](https://www.microsoft.com/en-us/research/publication/scalable-fabric-flexible-representation-task-management/)
- Bederson and Hollan, [Pad++](https://www.cs.umd.edu/~bederson/images/pubs_pdfs/p17-bederson.pdf)
- Cockburn and McKenzie, [Evaluating spatial memory in two and three dimensions](https://ir.canterbury.ac.nz/items/6b4acfe3-7fdb-4d43-83af-639ab1972403)
- Marshall and Shipman, [Searching for the Missing Link](https://people.engr.tamu.edu/shipman/viki/papers/ht93/ht93.html)
- Microsoft, [Productivity Future Vision](https://www.microsoft.com/en-us/research/video/productivity-future-vision/)
- Microsoft Research, [The future of productivity](https://www.microsoft.com/en-us/research/blog/the-future-of-productivity-people-and-tools-that-grow-together/)
- Microsoft Research, [IllumiRoom](https://blogs.microsoft.com/ai/microsoft-research-at-ces-illumiroom/)
- Microsoft Research, [RoomAlive](https://www.microsoft.com/en-us/research/project/roomalive/)

## Human–AI collaboration and dynamic interfaces

- Microsoft Research, [Goals as First-Class Abstractions in Human–AI Collaboration](https://www.microsoft.com/en-us/research/wp-content/uploads/2026/04/2026-goals-as-first-class-abstractions-in-human-ai-collaboration-AutomationXP26_paper_0982.pdf)
- Microsoft Research, [From Task Solvers to Teammates](https://www.microsoft.com/en-us/research/project/from-task-solvers-to-teammates-a-theory-grounded-architecture-for-advancing-collaboration-readiness-in-llm-agents/)
- Microsoft Research, [AI-powered Collaborative Dynamic Experiences](https://www.microsoft.com/en-us/research/academic-program/microsoft-research-fellowship/research-challenges/)

## Games, film, and tangible computing

- Fagerholt and Lorentzon, [Beyond the HUD](https://odr.chalmers.se/items/d5fe6889-4cc6-49c2-ba56-0d759e2f37eb)
- EA, [Dino Ignacio on Dead Space interface design](https://www.ea.com/news/breaking-into-the-industry-dino-ignacio-ui-lead-at-visceral-games)
- Perception, [Iron Man 2 technology design](https://www.experienceperception.com/work/iron-man-2/)
- Perception, [Spider-Man technology design](https://www.experienceperception.com/work/spider-man-no-way-home-tech/)
- MIT Media Lab, [I/O Bulb and Luminous Room](https://tangible.media.mit.edu/project/io-bulb-and-luminous-room/)
- John Underkoffler, [Pointing to the future of UI](https://www.ted.com/talks/john_underkoffler_pointing_to_the_future_of_ui)

---

## Final test

For every spatial decision, ask:

1. What information or state does this placement encode?
2. Can a person discover that meaning without being told?
3. Does the meaning survive flat mode?
4. Can another participant point to it unambiguously?
5. Can AI explain why it placed or connected it?
6. Can the user undo it and return exactly?
7. Is it faster, clearer, or more context-preserving than the flat alternative?
8. Is this truth, placement, frame state, group state, or camera state—and is it stored in the correct ownership plane?
9. Does this placement belong to an explicit group, layout policy, and focal stop?
10. Is a proposed session boundary a change to the continuity contract, or merely a consequence of camera angle, coordinates, or loading?
11. Which layer of focus is changing, and will keyboard and assistive-technology focus remain coherent?
12. If a person leaves now, can they restore their view, understand what changed, and continue without duplicated action?
13. If AI initiated it, are principal, goal, locus, scope, authority, evidence, stop, and recovery visible?
14. Which performance control pays for this rendering cost: visual richness, active-frame capacity, or loading horizon?
15. When the frame cap is reached, what can be frozen or minimized without losing data, focus, authority, or active work?
16. Does the settled state return to zero optional rendering work, and can the experience downshift before information is lost?

If the answer fails at 1, flatten it.
If it fails at 3, redesign the information model.
If it fails at 4 or 5, make the relationship explicit.
If it fails at 6, it is not safe enough for work.
If it fails at 7, it may be beautiful—but it is not yet the future of computing.
If it fails at 8, the model will eventually corrupt collaboration.
If it fails at 9, its layout or depth model is arbitrary.
If it fails at 10, keep the user in the same session and virtualize the rendering instead.
If it fails at 11, separate the focus stack before adding motion.
If it fails at 12, the environment is scenery rather than a working system.
If it fails at 13, the AI is a performance, not an accountable collaborator.
If it fails at 14, the cost is uncontrolled rather than chosen.
If it fails at 15, the capacity policy is a data-loss mechanism rather than a performance control.
If it fails at 16, the room is a perpetual renderer rather than an efficient working environment.
