# Business Identity & Restrained Colour Standard

**Status:** Mandatory portfolio-wide product and visual standard  
**Applies to:** Iteration 13, new Admin Hub / Business OS projects, and existing projects where the product owner has not approved a different established onboarding journey.

## 1. The first interaction is identity

The first guided action should help a business owner recognise their own business in the product. Do not make the first action browsing a generic catalogue, reading a long explanation or opening a feature menu.

1. **Business name.** Ask for a real or fictional name. Example: **Metsi Wellness**.
2. **Brand colours.** Let the owner select one, two or three colours maximum. One or two is a complete choice; never imply that three are required.
3. **Coupled preview.** Show **Store · Account · Briefcase** together and update the business name and selected palette across all three immediately.
4. **Explore.** Once identity is established, invite the owner to explore the Store, customer journey and owner workspace.

Shared proposition: **“Your business in your pocket.”**

Suggested helper copy: “Example: Metsi Wellness. Use a real or fictional name. Your Store, Account and Briefcase rebrand together instantly.”

The preview must show all three destinations as one coherent product, not three independent theme pickers. The business name, logo/monogram and palette should be visibly consistent. Persist according to the actual product's data boundary; if it is a local prototype, explicitly say that the changes are saved only in this browser.

## 2. Owner Briefcase introduction

The private owner area should be immediately recognisable:

- Eyebrow: **ADMIN HUB / PRIVATE BRIEFCASE**
- Proposition: **Your business in your pocket.**
- Greeting: context-aware “Good morning”, “Good afternoon” or “Good evening”, calculated from the owner's local time. Handle locale/time correctly; do not hard-code a greeting or use a server UTC hour as local time.
- Operational descriptor: **Owner operations · customer requests · money**
- Then show real, actionable priorities and the next useful actions.

The greeting is a human welcome, not a substitute for operational content. Do not fabricate a daily summary, customer activity, urgency or task completion to make the workspace feel alive. When no work exists, use a useful empty state and a clear next action. Keep the owner workspace concise, with clear separation between Today, customer work, money and supporting modules.

## 3. Three brand colours maximum

A business palette has no more than three intentional brand hues:

| Role | Purpose | Rule |
|---|---|---|
| Primary | Recognition, main CTA, active navigation, key links | Most frequently used brand colour |
| Secondary | Supporting emphasis, selected chips, secondary actions | Use less often than primary |
| Highlight (optional) | A small amount of emphasis, illustration or campaign detail | Optional; never required |

One-colour and two-colour palettes are first-class options. Do not add extra saturated colours for decoration. Use tints/shades derived from the selected hues where they retain a clear role; do not turn every component into a different colour.

**System neutrals are not additional brand colours.** The interface still needs dependable foreground, background, surface, border, muted text and disabled tokens. Semantic success, warning, error and information states may use separate functional tokens, but must be restrained, consistently applied and paired with text/icon/shape. They are not an invitation to add decorative rainbow colours.

Do not assign equal visual weight to every brand colour. A useful default is primary for the main action, secondary for supporting emphasis, and highlight only for small moments. Colour should reinforce hierarchy rather than become the hierarchy.

## 4. Readability is independent of brand choice

A selected brand colour must never automatically become body text, muted text or a background behind text without checking the actual pair.

- Normal text: WCAG 2.2 AA contrast at least **4.5:1**.
- Qualifying large text: at least **3:1**.
- Essential controls, boundaries and focus indicators must remain visible and usable.
- If a brand hue cannot support readable text, use a neutral foreground on that colour or reserve the hue for a border, icon, accent, illustration or other decorative detail.
- Automatically choose black/white or a carefully derived accessible foreground only after calculating contrast. Do not assume that a dark-looking colour always needs white text.
- Test the real combinations used by buttons, labels, links, badges, cards, forms, receipts, charts and admin navigation—not just the palette swatches.
- Never communicate meaning through colour alone. Pair status with a word, icon, shape or other visible cue.
- Preserve the existing minimum type sizes, complete content, touch targets and focus visibility. Do not solve a palette problem by fading, shrinking or hiding text.

The business palette must be applied consistently to Store, Account, Briefcase, receipts, customer messages, navigation, charts and preview states. Customer and owner areas should feel like different workspaces in the same business product, not unrelated apps.

## 5. Research interpretation

This standard is evidence-led, not a claim that a particular hue universally causes a particular emotion or conversion result.

- Nielsen Norman Group's visual-hierarchy guidance warns that too many similarly saturated colours weaken hierarchy and recommends restrained colour use. Its colour-design guidance recommends limiting a palette to three colours. This supports a three-brand-colour ceiling as a practical design constraint—not a biological law.
- W3C WCAG 2.2 requires at least 4.5:1 contrast for normal text and 3:1 for qualifying large text, and says colour must not be the only way to convey information. These are measurable accessibility criteria, not subjective preferences.
- A 2011 study of website colour found colour choices influenced user interaction and later memory for website information. This supports treating colour as part of the experience, not merely decoration.
- A 2014 *Annual Review of Psychology* review by Elliot and Maier found colour can influence affect, cognition and behaviour, while stressing that findings are conditional and real-world generalisability remains limited. Avoid simplistic claims such as “blue always creates trust” or “red always creates urgency”.
- Website-aesthetics experiments found structural complexity had a larger effect across several aesthetic dimensions than colour factors. Therefore, coherent grouping, hierarchy, spacing and structure remain more important than adding colour.

Practical conclusion: a small coherent brand palette helps maintain recognition and hierarchy, but readable contrast, information architecture, task clarity and appropriate spacing do more of the hard usability work.

## 6. First-run and adaptation rules

- For Iteration 13 and generic new Business OS builds, identity setup is the first guided task; exploration comes second.
- For a close industry match or an existing app with a proven customer entry journey, do not force a generic onboarding gate. Keep its established customer journey and integrate the identity coupling into the appropriate first-run or owner setup moment.
- The chosen name/palette must be editable later from the owner Briefcase and reflected consistently across all three surfaces.
- Do not copy Iteration 13's sample business name, catalogue, sample prices, demo authentication or browser-local architecture into a production client app.
- Keep the distinction between a local demo preview and a published, shared, production identity explicit.
- The identity preview should be interactive and truthful: no dead controls, fake publish success or claim of cross-device sync where none exists.

## 7. QA acceptance checklist

- [ ] First-run experience asks for the business name before inviting exploration.
- [ ] Example name “Metsi Wellness” is available as helper/example copy, not forced demo identity.
- [ ] Owner can choose one, two or three brand colours; the UI prevents a fourth.
- [ ] One-colour and two-colour palettes look complete and intentional.
- [ ] Store, Account and Briefcase update together when name or palette changes.
- [ ] Owner Briefcase is labelled “ADMIN HUB / PRIVATE BRIEFCASE”.
- [ ] Owner proposition is “Your business in your pocket.”
- [ ] Greeting reflects the owner's local time and does not hide operational priorities.
- [ ] Owner overview presents real operations, customer requests and money—not fabricated activity.
- [ ] Every real text/surface/control pairing meets WCAG AA contrast.
- [ ] Colour is never the sole status or action cue.
- [ ] The palette remains coherent in receipts, account, charts, forms and mobile navigation.
- [ ] Mobile layout remains compact, legible and usable.
- [ ] Local-only, saved, published and synced states are accurately distinguished.

## 8. References

- Nielsen Norman Group, [Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/).
- Nielsen Norman Group, [Using Color to Enhance Your Design](https://www.nngroup.com/articles/color-enhance-design/).
- W3C, [WCAG 2.2 — Contrast Minimum (1.4.3)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- W3C, [WCAG 2.2 — Use of Color (1.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
- Elliot, A. J. & Maier, M. A. (2014), [Color Psychology: Effects of Perceiving Color on Psychological Functioning in Humans](https://doi.org/10.1146/annurev-psych-010213-115035), *Annual Review of Psychology*, 65, 95–120.
- Cyr, D., Head, M. & Larios, H. (2010), [The impact of colour on Website appeal and users' cognitive processes](https://doi.org/10.1016/j.ijhcs.2010.04.002), *International Journal of Human-Computer Studies*.
- Moshagen, M. & Thielsch, M. T. (2015), [Linking objective design factors with subjective aesthetics: structure and colour of websites](https://doi.org/10.1016/j.chb.2015.05.038), *Computers in Human Behavior*.
