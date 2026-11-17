# Design: CutoverProof

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape of the first page: app screen
- Theme: Cobalt
- Axes: light/grotesk-sans/cool · posture: restrained

## Tokens
`frontend/src/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(98.6% 0.005 250);  --color-paper-2: oklch(96.2% 0.008 252);  --color-paper-3: oklch(93% 0.011 252);
  --color-canvas: oklch(96.6% 0.010 252);
  --color-ink: oklch(21% 0.028 262);  --color-ink-2: oklch(36% 0.022 260);  --color-muted: oklch(50% 0.018 258);
  --color-rule: oklch(90% 0.009 252);  --color-rule-2: oklch(83% 0.012 252);
  --color-accent: oklch(52% 0.19 258);  --color-accent-ink: oklch(98.6% 0.005 250);  --color-focus: oklch(52% 0.19 258);
  --font-display: "Familjen Grotesk", system-ui, sans-serif;  --font-body: "IBM Plex Sans", system-ui, sans-serif;
  --font-outlier: "JetBrains Mono", ui-monospace, monospace;
  --radius-card: 8px;  --radius-pill: 999px;  --rule-hair: 1px;  --shadow-card: 0 1px 2px oklch(21% 0.028 262 / 0.06);
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`.
The app canvas is `--color-canvas`; panels sit on it in `--color-paper`. Graphite is the one dark material: `--color-graphite`, `--color-graphite-2`, `--color-graphite-ink`, `--color-graphite-muted`. Semantic signals are `--color-success` (safe), `--color-error` (unsafe), `--color-warning` (attack paths and planning), `--color-info` (configuration and simulation), and `--color-verify` (Z3 verification). Each used at low footprint with a matching wash.

## Controls
- Primary: solid cobalt keycap (`--color-accent`) · 6px radius · 36px height · 3px bottom edge
- Secondary: key face on `--color-key-face` · same radius and height · one-line label
- Disabled: `--color-paper-3` face, `--color-ink-2` label, no shadow, `cursor: not-allowed`

## Motion
- Character: still. Only keycap press/hover and colour transitions over `--dur-micro`; no reveal on load, no looping decoration, reduced motion ends everything at once.

## Chrome
- Top bar: wordmark left, six destinations beside it, health and mode right. Under 60rem the destinations collapse into a native disclosure menu that closes on navigation.
- Footer: one rule and the model-scope disclaimer, no link columns.

## Screen patterns
- Overview: graphite evidence band with a four-segment status scale, four-figure metric ledger with semantic signal rules, latest analysis, API health, five-stage ruler trace.
- Inner screens: one ruled inventory or condition panel, an annotated phase note on a signal-coloured top rule, and a width-capped detail panel.
- Tables: sentence-case heads, 1px row rules, no outer card border, restacked with labels under 52rem.
- Empty states: what is empty, why it matters, one action; never a dashed card.
- Colour mapping: cobalt for primary actions and scenarios, green for safe evidence, red for unsafe evidence, amber for attack paths and planning, teal for configuration and simulation, plum for Z3 verification.

## Exports
`tokens.css` in this project; Tailwind maps the semantic roles in `frontend/tailwind.config.js`. DTCG or shadcn blocks are added here on request.
