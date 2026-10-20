# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

A colourful and organised workspace that makes it easier to keep track of progress.

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- Kanban boards 
- Google Keep
- Notion

Anti-references — what we are explicitly **not** trying to look like:

- Overcomplicated dashboards, dark backgrounds and too many unnecessary features.

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | #F6E6A8 | Header, "+" button, focus rings |
| `brand-accent` | #DDD1F3 | Highlights, hover states, links |
| `surface-page` | #FFFDF5 | Page background |
| `surface-card` | #FFFFFF | Card background |
| `text-primary` | #38342F | Body text |
| `text-muted` | #70695F | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | #B9A4E3 | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | #E9A6B6 | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | #A9D6B8 | More than 2 days out |
| `due-warning` | #E7BD62 | Less than 24 hours |
| `due-overdue` | #D97785 | Past due |
| `due-neutral` | #B6B0AA | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Arial | clear and easy to read |
| Body | Arial | Keeps the design consistent |
| Monospace (tags, badges, code) | Consolas | Suitable for code and task tags |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** Square cards with thin borders and a coloured label. (e.g. "Light, almost weightless; the only weight is from a 1px border, no shadow except on hover.")
- **Buttons:** pastel colours with rounded corners. (e.g. "Solid fill, no gradient, generous padding, rounded-md.")
- **Modal:** Centred form with a dimmed background. (e.g. "Centered, max-width-md, slate-900 backdrop at 50% opacity.")
- **Empty states:** A short message inside an empty column. (e.g. "Dashed border, muted text, never sad.")
- **Drag affordance (if used):** A status dropdown to move tasks between columns. (e.g. "None — we use a status dropdown.")

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | + Add task (e.g. "+ Task" or "Add task" or "New") |
| Empty column placeholder | No tasks here yet (e.g. "Nothing here yet — keep going.") |
| Toast after "Copy as Prompt Context" | Copied to clipboard (e.g. "Copied. Now paste it into the AI.") |
| Confirm-delete message | Are you sure you want to delete this task? (e.g. "Delete this task? You can't undo.") |
| Handoff toast (M7 `task-owner`) | Task assigned to {name} (e.g. "Handed off to {name}. They've got it.") |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** VibeTrack (match PRD §11 team identity)
- **Wordmark style:** Bold text using the heading font, without a separate logo. (e.g. "Just the name in the heading font, brand-primary color, no icon.")

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
