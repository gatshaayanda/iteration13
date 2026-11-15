# Design Intelligence & Experience Quality Standard

**Status: mandatory for Iteration 13 visual work and all new or materially redesigned Admin Hub portfolio projects.** Read this alongside the Objective-to-System Design, Visual Direction, Interaction Clarity & Feedback, Operational Transparency, Accessibility and Change Safety standards. It adds a repeatable method for selecting visual direction, researching real products, maintaining a coherent design system and verifying visual quality. It does not prescribe one universal aesthetic or replace a project's proven design system.

## 1. Purpose

The goal is not to make every app look like a design showcase. The goal is to make every app feel intentional, recognisable, coherent, commercially credible and easy to understand while remaining faithful to its business, audience and real operational needs.

A screen can be functional and still feel cheap, generic or confusing. Common causes include an unchosen visual direction, generic card-on-card layouts, arbitrary spacing, inconsistent components, decorative effects competing with the task, weak typography, unclear surface hierarchy and design decisions that are not tested on real content or devices.

**Design quality is a system, not a collection of attractive screens.** Every visual decision must support the objective, user task, product identity, information hierarchy or feedback.

## 2. Choose a visual genre deliberately

Before substantial visual implementation or redesign, identify the product's dominant visual genre and any deliberate secondary expressions. The five labels below are practical art-direction lenses adapted from the BuilderCult material supplied by the product owner. They are not a scientifically validated or exhaustive UX taxonomy, fixed templates, or mutually exclusive design systems.

| Genre | Visual language | Good candidates | Risks to avoid |
| --- | --- | --- | --- |
| **Quiet** | Restrained, calm, legible, confident; strong typography, subtle separators, purposeful whitespace and low visual noise. | Customer accounts, booking details, receipts, settings, onboarding and confirmations. | Becoming bland, under-signposted or so minimal that actions disappear. |
| **Character** | Distinctive personality, warmth, expressive details, playful interaction and meaningful rewards. | Games, loyalty, customer engagement and selected brand experiences. | Letting novelty, animation or decoration obstruct essential tasks. |
| **Atmosphere** | Immersive art direction using considered imagery, lighting, depth, colour and composition. | Premium storefronts, agency portfolios, campaigns and launches. | Heavy backgrounds, low contrast, slow loading or oversized hero sections hiding the next action. |
| **Data** | Operational precision, information density, numerical hierarchy, clear grouping and visible status. | Owner Briefcases, queues, job tracking, finance, analytics and staff workspaces. | Turning every screen into a spreadsheet or making dense information difficult to scan. |
| **Loud** | High-impact colour, confident type, strong promotional hierarchy and expressive visual moments. | Launches, announcements, events, offers and campaign moments. | Making every element compete for attention or weakening trust and readability. |

### Genre selection rules

- Choose the dominant genre for the product or experience before choosing decorative treatments. Record a short reason tied to audience, business positioning and primary task.
- Use secondary genres selectively where the journey changes. For example, a car-wash product may use Quiet for customer accounts, Data for the staff queue, and Loud for a seasonal offer.
- Do not force every screen into the same treatment when its purpose differs. Equally, do not make adjacent screens feel like unrelated products: preserve shared identity, tokens, typography, component behavior and navigation conventions.
- A genre is an art-direction lens, not permission to violate accessibility, readability, performance, business truth or the product owner's brief.
- Revisit the choice when the audience, product positioning or primary use changes. Do not change genre merely to chase a trend.

### Portfolio examples (starting hypotheses, not mandatory themes)

- **Admin Hub / Business OS:** Data + Quiet. The owner workspace should feel like a clear, capable control centre; the customer Store can express the business's own identity.
- **Dira Creative:** Atmosphere + Quiet. Editorial confidence and strong project imagery can coexist with clear, calm enquiry and client workflows.
- **Car wash and service businesses:** Quiet + Character for customer journeys, Data for queues and operations, Loud for selected promotions.
- **Vulas Racing:** Character + Data. Racing personality and immersive presentation must coexist with legible telemetry, controls and feedback.

These are initial hypotheses to test against each project's actual brief and existing strengths, not assumptions to copy blindly.

## 3. Research real products before inventing patterns

For a substantial screen or journey, research the actual product category and task. Research is intended to reveal proven interaction patterns, information priorities, terminology and edge cases—not to collect screenshots for imitation.

Useful sources include:

- [Mobbin](https://mobbin.com/) — real product screens and flows; use it to study how comparable products organise a complete task.
- [Page Flows](https://pageflows.com/) — end-to-end user-flow references and interaction sequences.
- [Refero](https://refero.design/) — interface and website examples for visual and interaction research.
- [Laws of UX](https://lawsofux.com/) — a reference for human factors and design principles; use principles as prompts to test, not as magic formulas.
- Official products, documentation, help centres and accessible live examples in the target industry — primary evidence for terminology, policies and expected operations.

Research protocol:

1. Search by **task and context**, not just industry or visual style (for example, "reschedule a service appointment" rather than only "salon app").
2. Inspect a full flow when possible: entry, choice, form, confirmation, history/status, correction and failure paths.
3. Record the useful pattern and the problem it solves. Note the source and any access/paywall limitation.
4. Compare more than one example when a consequential interaction or business rule is involved.
5. Adapt the pattern to the target's actual users, language, brand, data and operational capacity. Never copy another product's identity, assets, proprietary copy or assumptions.
6. Separate observed evidence, design interpretation and unverified hypothesis. Research does not replace direct user feedback or testing.

Do not spend time browsing inspiration when the task is a small, well-understood correction and existing product evidence is sufficient.

## 4. Apply psychology as a design check, not decoration

Use relevant human-factors principles to explain and test design decisions:

- **Cognitive load:** reduce simultaneous competing information and unnecessary memory demands. Keep the underlying system capable; simplify what the user must understand at each step.
- **Progressive disclosure:** expose the information and controls needed for the current task, then reveal advanced or infrequent options when relevant. Never hide essential price, status, eligibility, consent, risk or consequences.
- **Recognition rather than recall:** use visible labels, familiar patterns, meaningful icons and persistent context rather than requiring users to remember instructions.
- **Hick–Hyman law:** reduce unnecessary choices and group complex choices meaningfully; do not remove options users genuinely need.
- **Fitts's law:** make frequent and consequential actions easy to reach and operate, with appropriate touch-target size and spacing.
- **Jakob's law:** respect familiar conventions unless a deliberate, tested improvement justifies departing from them.
- **Gestalt grouping:** use proximity, alignment, similarity and clear boundaries to show which information belongs together.
- **Von Restorff effect:** reserve strong emphasis for the truly important action or exception; if everything is highlighted, nothing stands out.
- **Aesthetic-usability effect:** visual polish influences perceived usability, but attractive presentation is not proof of actual usability. Test the task.
- **Peak-end rule:** give particular care to consequential completion moments such as a confirmed booking, successful payment, completed request or resolved issue.

Do not cite a principle as proof that a design is correct. State the expected effect, identify the screen decision it informs and verify whether users can complete the task.

## 5. Establish one coherent design system

Before adding or changing components, inspect the existing codebase and identify its actual styling system, tokens, component library and conventions.

- Extend the established system in its own idiom. Do not introduce a second token system, duplicate component library or competing icon family.
- If no coherent system exists, derive a small system from the approved brand direction and real screen needs before broad implementation.
- Define semantic colour roles and readable foreground/background pairs; typography roles and hierarchy; spacing scale; radius; borders/elevation; icon family; motion rules; and component variants/states.
- Keep repeated values centralised in the existing theme mechanism (CSS variables, Tailwind theme, design tokens, or equivalent). A repeated visual value should not drift independently across screens.
- Use a consistent spacing rhythm. A 4-point base grid is a useful starting convention, not a requirement to force every layout into arbitrary numbers.
- Define component variants by intent (for example, primary, secondary, quiet, destructive), size and state. Do not invent a new style for every screen.
- Promote a component when it has a stable, nameable role and is genuinely reused or clearly about to be reused. Two or more real screen uses is a useful signal; avoid speculative abstractions with huge prop lists.
- Prefer composition and children over components with many content-specific props. Keep one-off screen compositions local until a real reusable pattern emerges.
- Use one icon family consistently (Lucide is the current general web default where the project has no established choice). Choose icons for meaning, pair ambiguous icons with labels and do not mix emoji, unrelated icon packs and bespoke glyphs as competing interface systems.
- Preserve the project's platform and framework conventions. Native platform guidance is not automatically applicable to a web PWA, and web component recipes are not automatically suitable for React Native.

### Expo design-system lessons (portable principles)

The [Expo Skills design-system guide](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md) is a useful engineering reference even when the target is not an Expo app. Transfer its general principles:

- one source of truth for tokens and shared components;
- audit for existing systems before creating new ones;
- consistent variant, size, state and accessibility contracts;
- centralised repeated values and incremental drift audits;
- screenshot-based self-critique followed by actual interaction testing;
- avoid premature component extraction and competing design systems.

Its React Native implementation details, platform semantic colours, native controls and file paths are platform-specific. Translate the principles into the target stack; do not copy Expo code or dependencies into a Next.js PWA by default.

### shadcn/ui and DESIGN.md lessons (when relevant)

The [shadcn design-system workflow](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/design-system.md) and [design-system page guidance](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/design-system-page.md) provide a useful pattern for turning a written visual contract into tokens, component variants, a rendered showcase and verification.

Adopt the workflow idea, not an unconditional library migration:

- A project's concise `DESIGN.md` (or equivalent) should describe its visual identity, design intent, semantic colour roles, typography, spacing, geometry, elevation, motion, component rules, responsive behavior, do/don't examples and known gaps.
- Map that contract into the project's existing styling system.
- Use shadcn/ui when it fits the project's stack, accessibility needs, design direction and existing dependencies. Do not install it merely because it is popular or replace proven components without a reason.
- For other stacks, build the equivalent showcase with the components already in use.

## 6. Build a rendered design-system showcase

For Iteration 13 and substantial portfolio products, maintain an actual internal/development-only showcase when the architecture makes this practical. It must be protected from ordinary customer navigation and must not expose private data or admin operations.

The showcase is a review and regression tool, not a public product screen. It should demonstrate:

1. **Foundations:** semantic colour roles shown as foreground/background pairs with measured contrast; brand palette; typography specimens; spacing; radius; borders/elevation; icons; motion and focus treatment.
2. **Primitives:** buttons, links, fields, labels, badges, selection controls and navigation.
3. **States:** default, hover where applicable, focus, pressed, selected, disabled, loading, validation error, success, empty and offline/pending where relevant.
4. **Compositions:** realistic cards/rows, grouped forms, dialogs/sheets, data tables, feedback and responsive navigation.
5. **Real content:** actual brand voice, realistic long names, multi-line descriptions, full prices, awkward content lengths and representative empty/error/loading cases—not lorem ipsum alone.
6. **Recipes:** at least one representative customer composition and one operational/admin composition for products that have both.
7. **Do/don't pairs:** show the project's own important rules, such as purposeful grouping versus indiscriminate cards, readable surfaces versus low contrast, or useful density versus cramped layout.
8. **Known gaps:** clearly list components, states or platform conditions not yet implemented or verified.

Do not build an elaborate showcase for a tiny change. A compact token/component reference or screenshot sheet is sufficient when proportional. The showcase must use the same tokens and components as the product; a parallel mockup that can drift is not useful.

## 7. Avoid common AI-generated design failures

Use these as diagnostic prompts, not blanket bans. Identify the observed problem and fix its cause:

- **Everything is a card:** rows, labels and every section become separate rounded white boxes. Use meaningful grouping, surface changes, alignment, dividers and hierarchy; cards are for content that benefits from containment.
- **Cut-out collage:** unrelated white cards appear pasted onto a background without shared alignment, spacing, tonal or depth logic. Design a coherent surface hierarchy and composition.
- **Generic SaaS template:** default dashboard patterns, gradients, pill badges and cards appear without a reason tied to the business.
- **Decorative hero takeover:** a gradient/image hero consumes the first viewport while the user's primary task is pushed away.
- **Everything is highlighted:** multiple competing accents, shadows, badges and oversized buttons destroy hierarchy.
- **Arbitrary geometry:** inconsistent corner radii, card padding, button heights, icon sizes and spacing make the interface feel assembled rather than designed.
- **Typography without roles:** too many sizes/weights, all-caps labels everywhere, tiny metadata carrying essential meaning or display fonts used for operational data.
- **Icon soup:** emoji, multiple icon libraries and inconsistent stroke weights compete.
- **Fake depth:** shadows and borders are applied to every surface instead of expressing meaningful layering.
- **Motion for its own sake:** animation delays tasks, hides state, harms performance or ignores reduced-motion preferences.
- **Desktop-first compression:** desktop layouts are squeezed onto mobile instead of composed for narrow screens and real touch use.
- **Screenshot-only acceptance:** a static image looks good while overflow, keyboard focus, tap targets, loading, errors or actual task behavior fail.

Do not ban cards, gradients, dark themes, rounded geometry, animations or expressive typography categorically. Use them when they serve the chosen direction and task.

## 8. Motion and expressive assets

- Motion must communicate state, cause-and-effect, spatial continuity or meaningful personality.
- Use restrained, consistent duration/easing and avoid animation that delays the user's next action.
- Respect reduced-motion settings and provide non-animated equivalents for essential information.
- Test performance on representative lower-end Android devices; avoid large compositing effects, excessive blur, continuous animation and unnecessary video.
- Rive is an optional tool for state-driven interactive animation when its authoring and runtime cost are justified. It is not a default dependency.
- 60FPS and similar motion galleries can inspire timing and transitions; they are reference libraries, not implementation standards.
- Keep motion optional and scoped. A business dashboard usually needs subtle state feedback, not a game-like animation system.

## 9. Visual QA and design regression

A design is not accepted because it looks better in one screenshot. Review the rendered application and the actual journey.

For each substantial screen refinement:

1. Confirm the screen's objective, audience, dominant genre and primary task.
2. Inspect the established design tokens and components before making local overrides.
3. Capture the real rendered screen at relevant narrow mobile widths (include approximately 360–390 CSS px where supported) and a desktop width (approximately 1280 CSS px). Add tablet or installed-app viewports when the journey requires them.
4. Inspect the first viewport and the full scroll; check clipping, horizontal overflow, awkward wrapping, touch-target collisions, fixed navigation overlap and content hidden behind sticky surfaces.
5. Compare related screens side by side for typography, alignment, spacing, icon treatment, surfaces, buttons and selected/disabled states.
6. Exercise real interactions: tap/click, type, navigate, submit, back, retry and keyboard interaction. Inspect focus, accessibility names, layout and state where the available tools permit.
7. Verify empty, loading, pending, success, validation, error, offline and long-content states relevant to the screen. Do not invent a state merely to fill a showcase.
8. Check text contrast and meaningful non-text contrast against WCAG 2.2 AA; verify real rendered colour pairs, not just token names.
9. Check reduced motion and representative device performance when animation or large media is present.
10. Revisit neighboring screens after shared tokens/components change. A global improvement on one page can cause regressions elsewhere.

Use the available browser automation, screenshot, accessibility, DOM/layout, state and log inspection tools in the target environment. If tooling supports deterministic time control, use it for timed transitions, retries and asynchronous states. Record the exact commit/build and route/state associated with evidence. A screenshot alone cannot prove functionality, accessibility or data correctness.

Maintain visual regression baselines only when the capture environment is stable. Review diffs rather than blindly updating snapshots; dynamic data, fonts, browser rendering and animations can create noise. Prefer stable test data, disabled/reduced motion for captures, explicit viewport sizes and intentional baseline approval. Never treat an automated pixel diff as a substitute for human design review.

## 10. Five-step design execution loop

Use this sequence for substantial visual work:

1. **One job per screen:** state its purpose, user, primary task and next action. Secondary actions remain discoverable but do not compete.
2. **One visual system:** define or inspect tokens, type, spacing, surfaces, iconography and component variants before styling individual screens.
3. **Motion that settles:** add only transitions that clarify state or improve continuity; respect performance and reduced motion.
4. **Copy like a person:** use concise, contextual, human language that matches the business and accurately describes the actual system state.
5. **Design beyond the screen:** consider install, launch identity, share links, notifications, receipts, email/WhatsApp handoffs and other off-screen moments where the product actually supports them. Do not imply integrations that are not implemented.

This is an execution checklist, not a rigid order that overrides the Objective-to-System Design or PWA Installation Lock.

## 11. Resource and technology policy

These resources inform research and implementation; they are not mandatory dependencies:

- [Expo Skills — design system](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md): tokens, component contracts, design-system drift and self-critique.
- [shadcn/ui — design system workflow](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/design-system.md): DESIGN.md mapping, component variants, showcase and browser verification.
- [shadcn/ui — design-system page](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/design-system-page.md): foundations, state matrices, realistic compositions and do/don't examples.
- [Mobbin](https://mobbin.com/), [Page Flows](https://pageflows.com/) and [Refero](https://refero.design/): product and journey research.
- [Laws of UX](https://lawsofux.com/): human-factors reference.
- [Lucide](https://lucide.dev/) or [Phosphor](https://phosphoricons.com/): choose one consistent icon family where the project has no established choice; do not mix packs casually.
- [Tremor](https://www.tremor.so/): optional dashboard/chart patterns when compatible with the target stack; use only where data visualisation helps a real decision.
- [Godly](https://godly.website/): optional high-quality web art-direction inspiration, not a source for copying layouts or brand assets.
- [Rive](https://rive.app/) and [60FPS](https://60fps.design/): optional motion authoring and interaction inspiration.

Do not add a dependency, migrate a component library, adopt a new runtime or pay for a research tool solely because it appears in this list. Check current project stack, licence, cost, platform support, bundle/runtime impact, accessibility and maintenance first. Preserve working foundations and use the smallest tool that improves the outcome.

## 12. Acceptance gate

Before approving a substantial visual redesign, confirm:

- [ ] The business objective and screen purpose are explicit.
- [ ] A dominant visual genre is chosen with a reason; any secondary genre is deliberate.
- [ ] Relevant product/task research informed important patterns, or existing evidence was sufficient.
- [ ] One coherent design system governs colours, typography, spacing, geometry, icons and states.
- [ ] The interface avoids generic AI-generated patterns unless they genuinely serve the task.
- [ ] Primary actions, content hierarchy and full essential information are clear.
- [ ] Customer and operational compositions feel related without being forced into identical layouts.
- [ ] Responsive screenshots and real interactions have been reviewed.
- [ ] Accessibility, contrast, reduced motion and performance have been considered.
- [ ] Relevant state and error paths are verified; no screenshot-only acceptance.
- [ ] Shared changes have been checked across neighboring screens.
- [ ] Remaining limitations and unverified device conditions are stated honestly.

A design may be expressive, restrained, immersive or dense. It must always be intentional, understandable, consistent and true to the product.
