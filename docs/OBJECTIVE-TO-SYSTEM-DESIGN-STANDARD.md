# Objective-to-System Design Standard

**Status: mandatory for Iteration 13 product work and all new or materially redesigned Admin Hub portfolio projects.** This standard connects business intent to human experience, interface design, implementation and verification. It complements the Visual Direction, Interaction Clarity, Operational Transparency, Accessibility and Change Safety standards; it does not replace them.

## Design intelligence is part of the objective-to-interface chain

The [Design Intelligence & Experience Quality Standard](./DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md) is mandatory whenever the objective map leads to substantial visual design or redesign. It governs visual-genre selection, task-based product research, psychology checks, design-system consistency, rendered showcases and visual regression. A visual choice must be traceable to the audience, business positioning, user task or information hierarchy; do not introduce a style merely because it is fashionable.

The screen-by-screen QA already required by this document must therefore ask not only whether a screen works, but whether its chosen visual language makes the task understandable, whether its surfaces/components belong to one coherent system, and whether the rendered experience has been inspected across relevant viewports and states. The design standard supplements this traceability; it does not replace business understanding or functional verification.

## 1. Why this exists

A product can be visually polished and technically functional yet still be confusing or irrelevant if its screens, labels and workflows do not communicate the business purpose. Conversely, a sophisticated system can feel simple when its complexity is organised around the user's actual task.

The governing principle is:

**Reduce the complexity the user must understand without reducing the sophistication of the system doing the work.**

Do not begin with a list of screens, features, components or technologies. Begin with the business outcome and the human problem. Keep that objective traceable all the way to the interface, data operation and acceptance test.

## 2. Mandatory understanding ladder

Move from plain language to technical detail without losing the original purpose. Use the number of layers appropriate to the project; these seven levels are the default.

1. **Business objective — why:** state each objective in approximately three or four plain-language words (for example, "Get customers booked"). Define what success means and what is outside scope.
2. **Human problem — who and what hurts:** identify the people affected, their current task, friction, cost, risk, workarounds and context. Separate observed facts from assumptions that need validation.
3. **Desired experience — what people should accomplish:** describe the customer, staff and owner journeys in user language. State the next action, expected outcome and responsibilities at each handoff.
4. **Functional system — what must exist:** derive capabilities, records, workflows, decisions, states, permissions and exception paths from those journeys. Distinguish essential requirements from optional enhancements.
5. **Interaction and visual design — how it is understood:** define information hierarchy, navigation, action affordances, content, feedback, responsive composition, progressive disclosure, accessibility and meaningful empty/loading/error/pending/success/offline states. The visual treatment must clarify the task, not merely decorate it.
6. **Technical architecture — how it works:** map routes, components, state, data entities/relationships, persistence, APIs, integrations, authentication, authorization, validation, background work, offline boundaries, observability and failure recovery. Explain why each significant technical choice is needed.
7. **Verification — how we know:** derive acceptance criteria and tests from the original objective. Verify the customer/staff/owner journey end to end, including permissions, state consistency, errors, retries and relevant device conditions.

A small change may use a short objective-to-screen-to-test trace rather than a full architecture pack. Do not create paperwork for its own sake. A substantial product or redesign must have a complete enough map for another developer or reviewer to understand the intent and its consequences.

## 3. Turning discovery questions and answers into a project direction

Questions and responses collected during Iteration 13 discovery, setup, workshops or project conversations are product evidence. Their value is not simply that they provide copy for a brief: they help an implementation team understand what kind of business is being built, who it serves, what people need to accomplish, and which operating realities the system must support. Use the answers to guide the project from business understanding through genre, user flows, functionality, interface and technical design.

Do not jump from an answer directly to a screen or feature. Interpret the response in context, connect it to other answers, and follow the sequence below.

### 3.1 Read responses as evidence, not a feature wishlist

For each meaningful answer, capture:

- **What was said:** preserve the respondent's actual meaning; do not silently rewrite uncertainty as fact.
- **Who it concerns:** owner, staff member, customer, supplier, household member or another affected person.
- **What it reveals:** a goal, problem, audience, business model, constraint, preference, risk, existing workaround or desired outcome.
- **Evidence level:** observed/current fact, respondent-reported experience, preference, assumption, proposal or unanswered question.
- **Design consequence:** what this may change about the business model, journey, information, capability, interaction, visual direction or technical boundary.
- **Confidence and follow-up:** confirmed, plausible but unverified, conflicting or still unknown. Ask another question only when the missing answer would materially change the solution.

One answer may reveal several needs; several answers may describe the same underlying need. Consolidate related responses instead of creating one feature for every sentence. A preference is not automatically a requirement, and a requested feature is not automatically the best solution to the underlying problem.

### 3.2 Use the answers to establish business context before choosing a genre

Synthesize the responses into a short **Business Understanding Brief**:

1. What does this business or service actually do?
2. Who are its primary audiences and what brings each of them here?
3. What outcomes matter to the owner, customers and staff?
4. How does value move through the business (for example, discovery, enquiry, booking, sale, delivery, payment, repeat use)?
5. What makes this business or audience different from a generic example?
6. What operating constraints matter (people, time, location, capacity, devices, connectivity, privacy, regulation, budget or existing tools)?
7. What is already working and must be preserved?
8. What is explicitly not being built now?

State the main business objectives in plain language, ideally three or four words each. Define success in observable terms where possible. Separate confirmed facts from assumptions and open questions.

Only after this understanding should the team select a dominant visual genre. Choose Quiet, Character, Atmosphere, Data or Loud because it supports the business positioning, audience expectations and actual tasks—not because a respondent selected a colour, mentioned a competitor or used an aesthetic adjective. Record secondary expressions by surface or journey where useful. Genre is an expression of the understood product, not a substitute for understanding it.

### 3.3 Translate business understanding into role-based user flows

For every relevant role, map the real journey from trigger to outcome. A role may be a visitor, prospective customer, returning customer, staff member, owner or external participant; do not assume every project needs all of them.

Use this pattern:

**Trigger → user intention → information needed → action → system response → next person or state → successful outcome**

For each step, establish:

- What starts the journey, and where does the person enter?
- What are they trying to decide or accomplish?
- What information must they provide, see or confirm?
- What is the simplest clear action available?
- What does the system do, and what feedback is shown?
- Does another person need to review, approve, assign, fulfil or respond?
- What record/status changes, and who can see it?
- What happens if information is missing, the action is rejected, the process is delayed, duplicated or abandoned?
- How does the person return, continue or understand the next step?

Map handoffs explicitly. For example, a public enquiry may become a customer record, a reviewed requirement, a quotation, an approved job, a delivery workflow and a financial record. That is a possible pattern, not a mandatory workflow for every business. A different business may need walk-in service, recurring appointments, inventory, household permissions, event attendance or another flow. Derive the flow from the answers and validate it against the actual operating model.

### 3.4 Derive capabilities and screens from the flows

Once the journeys are clear, identify the capabilities required to make each step real. Group related capabilities into coherent areas; do not start by deciding that every project needs the same menu or dashboard.

For each proposed capability, record:

- The objective and user need it serves.
- The role that uses it and the point in the journey.
- The input, decision or action it supports.
- The record or state it creates or changes.
- The output, handoff or next action.
- Required permissions and privacy boundary.
- Essential loading, empty, validation, pending, success, failure and recovery behavior.
- Whether it is necessary now, useful later, unverified or out of scope.

Then derive the screens and navigation. A screen exists to support a task, decision or useful overview—not merely because a feature category exists. Give each screen a clear audience, purpose, primary action and relationship to the wider flow. Combine steps when that reduces friction; separate them when a distinct decision, permission or handoff requires it.

### 3.5 Let the user flow shape the interface and the genre expression

Apply the chosen genre to make the task easier to understand:

- Public discovery and first contact may need a strong brand expression, but the next useful action must remain obvious.
- Customer details, requests and confirmations often benefit from calm, focused presentation.
- Operational queues, work allocation and financial oversight may need denser, data-led hierarchy.
- Campaigns and announcements may use stronger promotional expression without turning the whole product into a promotion.
- Distinct screen treatments must still share the same identity, design tokens, interaction conventions and accessible contrast.

These are starting hypotheses, not universal rules. The discovery answers and actual task flow decide the final treatment. Do not let genre selection dictate an unsuitable workflow, and do not let a homepage aesthetic determine every internal screen.

### 3.6 Derive architecture only after the required behavior is understood

Map the real records, relationships, state transitions, permissions, persistence, integrations and failure boundaries needed by the journeys. For every technical component, explain which user-visible capability or system guarantee requires it. Keep implementation choices proportional:

- Do not add an integration because a response merely mentions a tool or platform; confirm the business need and feasibility.
- Do not introduce accounts, roles, dashboards, databases or automation without a journey or security/data requirement that justifies them.
- Do not mistake a prototype/local demonstration for secure, shared or production persistence.
- Preserve working foundation behavior unless a verified requirement and approved change justify modifying it.
- Record deferred opportunities without making them dependencies of the first useful release.

Finally, derive acceptance tests from the original answers and agreed outcomes. A discovery response is not fully translated until the team can demonstrate the relevant journey and verify its resulting state.

### 3.7 Maintain a response-to-delivery trace

For substantial projects, keep a compact table or linked map such as:

| Discovery evidence | Interpreted need/objective | User flow | Required capability | Screen/interaction | Data or technical consequence | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Respondent-reported problem or goal | What must improve | Trigger-to-outcome journey | What the system must enable | Where/how the person acts | What must be stored, protected or integrated | How the outcome will be demonstrated |

Use stable identifiers where they help connect the maps. If answers conflict, record the conflict and the decision made; do not silently choose whichever answer is easiest to implement. If evidence changes, update the affected objective, flow and design decision rather than patching only the screen.

**The governing sequence is:**

**Questions and responses → evidence and business understanding → objectives → people and needs → role-based user flows → capabilities and handoffs → screens and interactions → visual genre expression → technical architecture → acceptance tests.**

The genre decision is deliberately downstream of business and user understanding, while still happening early enough to guide substantial design. The technical architecture is downstream of the behavior it must support. This prevents attractive but irrelevant screens, generic workflows and unnecessary complexity.

## 4. Traceability is the control

Every significant requirement must be traceable in both directions:

- Forward: **objective → human need → journey → capability → screen/action → implementation → acceptance test**.
- Backward: **component/data operation → capability → human need → objective**.

Give objectives and important requirements stable, simple identifiers where useful (for example, OBJ-01, NEED-01, FLOW-01, REQ-01, UI-01, DATA-01, TEST-01). Keep links or a small traceability table; do not create identifiers for every trivial styling detail.

For each important capability, be able to answer:
- Which objective does it serve?
- Which person needs it, and in what situation?
- What happens before and after it?
- What does the person see and understand?
- What authoritative state or data changes?
- Who is allowed to perform or see it?
- What happens when it fails, is delayed, repeated or used offline?
- Which test proves the intended outcome?

If a feature has no defensible objective or user need, challenge its inclusion. If an objective has no supporting journey, capability or test, the design is incomplete.

## 5. Screen-by-screen design and QA contract

Apply this during the current Iteration 13 Store/Briefcase redesign and every later screen review. Do not wait until all screens are designed.

For each screen or meaningful screen state, record or explicitly check:

1. **Purpose:** the objective and user task this screen serves.
2. **Audience and context:** customer, staff or owner; first visit or returning use; mobile/desktop; online/offline where relevant.
3. **Orientation:** can a first-time user tell where they are, what this area is for and what changed?
4. **Hierarchy:** is the most important information visible before secondary detail? Is there one clear primary action for the current decision?
5. **Affordance:** can the user recognise every action before hover and predict its outcome? Are labels and icons unambiguous?
6. **Content:** is the necessary information complete, accurate and understandable at the point of decision? Do not hide essential price, status, date, consent or next-step information.
7. **State and feedback:** what do initial, loading, empty, selected, validation, pending, success, failure, retry and offline states look like? Is feedback truthful and persistent enough for its importance?
8. **Flow and recovery:** where does each action lead? Can the user go back, correct an error, retry safely or understand that another person must act?
9. **Accessibility and responsive behavior:** readable type/contrast, semantic controls, keyboard/focus, screen-reader names/status, touch targets, reduced motion and narrow-screen behavior.
10. **System truth:** does the displayed state reflect real data and authorization, or is it only a prototype/local preview? Is the persistence and sync boundary clear?
11. **Objective check:** if this screen disappeared or changed, would the original objective become harder to achieve? Is every prominent element earning its space?
12. **Evidence:** what was actually inspected or tested, on which route/state/device/browser, and what remains unverified?

Use the existing [Visual Direction Standard](./VISUAL-DIRECTION-STANDARD.md) for craft and composition and the [Interaction Clarity & Feedback Standard](./INTERACTION-CLARITY-AND-FEEDBACK-STANDARD.md) for interaction acceptance. Do not confuse visual novelty with usability. A screen is not accepted because it looks attractive in one screenshot; its purpose, behavior, responsive states and relationship to the rest of the journey must also be clear.

For Iteration 13 specifically, keep the Store as the customer entry and the Briefcase as the owner operating workspace. Review each screen against the real customer-to-owner journey and the product's current implemented capabilities. Do not let a generic design pattern, promotion, decorative card or experimental control displace the next useful customer or owner action.

## 6. Progressive complexity, not feature dumping

Use progressive disclosure to manage complexity, not to conceal essential information.

- Present the minimum information and choices needed for the current decision.
- Reveal advanced configuration, history, technical detail and infrequent actions when the user needs them.
- Keep essential price, availability, eligibility, consent, status, consequences and confirmation visible before commitment.
- Use familiar business language in customer and staff surfaces. Reserve technical vocabulary for technical documentation and diagnostics.
- Keep advanced capability available to authorised operators without making every customer learn the underlying system.
- Prefer recognition, clear signifiers and predictable outcomes over instructions users must remember.
- Do not split a simple task into unnecessary steps or add an onboarding interstitial that blocks the customer's real destination.
- Reduce decorative competition and redundant explanation before shrinking text, clipping content or hiding useful actions.

A simple surface must not mean a simplistic system: validation, permissions, audit history, idempotency, retries and data integrity can remain sophisticated behind a calm interface.

## 7. Complexity and decision discipline

For every significant feature or architecture choice, distinguish:
- **Necessary now:** required to achieve the agreed objective safely.
- **Useful later:** valuable, but not needed to validate or deliver the current outcome.
- **Unverified:** based on an assumption, analogy or technology claim that has not been tested.
- **Out of scope:** explicitly not part of this release.

Record important trade-offs in plain language. Avoid premature abstraction, speculative integrations and technology adoption merely because a tool is interesting. Preserve proven foundations unless a verified requirement justifies change.

## 8. Agent-native inspection and verification: lessons from Expo Exact

Reference reviewed: [expo/exact](https://github.com/expo/exact), its [README](https://github.com/expo/exact/blob/main/README.md), [website start guide](https://github.com/expo/exact/blob/main/docs/start-here-site.md), [agent/app start guide](https://github.com/expo/exact/blob/main/docs/start-here.md) and [testing guide](https://github.com/expo/exact/blob/main/docs/testing.md). Exact describes an agent-native workflow in which an agent can build, run, inspect, operate and test an application. Its documented driver exposes a small, consistent set of operations: tree, screenshot, tap, type, state, layout, logs, clock, prefer and perf. It also describes scripted interaction tests, controllable time and accessibility/layout verification.

**Adopt these engineering principles in our existing PWA workflow:**

- **Inspect the rendered product, not just source code.** For important screens, use actual browser screenshots and responsive viewports; inspect the accessibility/DOM tree, visible controls, layout geometry, runtime console/logs and relevant application state when the available browser tools support them.
- **Drive real user actions.** Test with taps/clicks, typing, navigation, selection and submission. Assert the visible outcome and the underlying persisted state where accessible. Do not treat a source-code review or a screenshot alone as an end-to-end test.
- **Make journeys repeatable.** Convert important acceptance journeys into automated browser tests where the existing stack supports them. Use stable selectors/accessible names and assert meaningful outcomes, not brittle implementation details.
- **Control time and asynchronous state where practical.** Prefer deterministic clocks, mocked timers and controlled fixtures for expiry, schedules, retries, delayed operations and time-sensitive states. Avoid arbitrary sleeps; wait for observable conditions.
- **Inspect state and logs to diagnose.** Use runtime state and logs to locate the first failure, while keeping private data, secrets and internal implementation details out of customer-facing UI.
- **Verify accessibility and layout at meaningful states.** Inspect names/roles, focus, keyboard operation, text scaling, responsive widths, overlays, empty/error states and content that may overflow.
- **Tie evidence to the build.** Record which commit/build, browser/device, route, viewport and test produced the evidence. A stale screenshot or a test run against a different build is not proof for the current change.
- **Keep tests proportional and trustworthy.** Test behavior at the lowest level that proves it; use end-to-end tests for critical cross-component journeys. Avoid duplicate, vacuous or timing-flaky tests.

**Do not transplant Exact into the current foundation by default.** Exact is a separate cross-platform runtime and declarative application toolchain, not a drop-in QA library for our existing Next.js/React PWA. Its own README states that it is pre-1.0, changes daily and offers no API stability or backwards compatibility; its README describes Android and Windows as early/in progress. It should therefore be treated as a monitored technology experiment, not a replacement for our established web/PWA, Firebase, UploadThing, service-worker or installation architecture.

Use the transferable agent-inspection principles with the browser/testing tools already available in the target project. Reconsider an isolated Exact proof of concept only when there is a concrete product requirement for its cross-platform runtime and its platform maturity, maintenance model, accessibility, PWA needs, integrations, security and migration costs have been freshly evaluated. Never introduce it into a production foundation solely because it offers an attractive agent workflow.

## 9. Required project artefacts

For a substantial new product or redesign, maintain a concise set of linked maps. These may be Markdown, Mermaid, diagrams or a combination; choose a format that remains editable and easy to update.

1. **Business Understanding Map:** objectives (three/four words each), people, problems, desired outcomes, success measures, assumptions and non-goals.
2. **Experience & Functional Map:** customer/staff/owner journeys, capabilities, screens, decisions, states, handoffs and exception paths.
3. **Technical & Verification Map:** architecture, data/persistence, permissions, integrations, offline/failure boundaries, acceptance criteria and test coverage.

The three maps must share objective/requirement identifiers or clear links. Keep them in the target project's documentation, not only in chat or an image export. For a small change, a compact traceability checklist is sufficient.

## 10. Definition of done

Before calling a substantial design or implementation complete, confirm:

- The original business objective is still stated plainly.
- Every important screen and capability supports a real user need.
- The primary customer, staff and owner journeys are coherent end to end.
- Essential information and actions are discoverable without guessing.
- Advanced complexity is progressively disclosed rather than dumped on users.
- Loading, empty, error, pending, success, retry and offline behavior is honest where applicable.
- Technical choices have a clear purpose and preserve security/data boundaries.
- Important objectives and requirements map to observable acceptance tests.
- Actual visual/browser/test evidence is tied to the current build; untested devices or environments are clearly identified.
- Deferred ideas and unverified technology experiments are not presented as delivered functionality.

**The final test:** explain the product in one plain sentence, then explain how each major part delivers that sentence. If those explanations do not connect, return to the map before adding more features.
