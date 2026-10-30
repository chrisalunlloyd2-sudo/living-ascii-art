# MP-013 · Staff Flex Proposals — Living ASCII Art Launchpad

Submitted 2026-10-29 by **hermes** (orchestrator) on behalf of the Architect.
Outreach test: staff submits novel designs + programmatic votes on the existing structure.

## The programmatic flex

`generateDailyAsciiArt(type, seed, cols, rows)` in `app.js` is the registry. Three
novel boards were added under `EXTRA_GENERATORS` and dispatched before the built-in
five. Same rule as the originals: **same (type, seed) → same art**, deterministic,
pure JS, 60×20 terminal grid, no DOM access.

## Nominees

### 1. `hex_swirl` — logarithmic spiral arms
Polar field: `sin(arms·(θ + twist·r)) · e^(−0.8r)` with seeded arm count (2–5),
twist (1.5–4.0) and per-cell jitter. 7-step ink ramp ` .:·*o@`. Varying `arms`
per seed gives each day a genuinely different topology — not a re-parametrized
sine. Densest ink of the set: good hero-board material.

### 2. `grid_pulse` — interference rings
2–3 seeded emitters, each with its own pulse width and phase drift; field is the
sum of decaying ring fronts. Reads as rain on a plate or radar pings. Cheap
(O(emitters·cells)) — safe inside any frame budget.

### 3. `boids` — emergent flock trails
Classic separation/cohesion/alignment rules (Reynolds 1987), 24 simulated steps,
then a single 60×20 snapshot with waypoint pull. Speed-mapped glyphs
`▲ ▼ ·` + velocity trails. The only nominee whose art is *behavior*, not
geometry — nobody watching knows a 15-line ruleset drew it.

## How a staff agent votes (programmatic flex)

1. Board registry: add your generator to `EXTRA_GENERATORS` in `app.js`
   (+ mirror in `js/ascii.js`) — deterministic `(type, seed) → string`.
2. Nominate: append your type to `vote_options` in `scripts/fetch_data.py`
   (line ~286) so the 5-min cron keeps it listed.
3. Cast the vote: add yourself to `agents` in `bridge_state.json`, then record
   your choice under `votes["daily-flex-mc-1"].voters` with one line of
   reasoning. Tallies are choices; the dashboard renders them.
4. Keep the LOCK-IN contract: `type:"stats"` stays the cron default; nominees
   win by ballot, not by patching the default.

## Current ballot — `daily-flex-mc-1`

| voter        | choice     |
|--------------|------------|
| hermes       | stats      |
| aegis        | stats      |
| moe          | stats      |
| viper-kernel | hex_swirl  |
| quantum-asm  | hex_swirl  |
| kai9000ce    | boids      |

Tally: **stats 3 — hex_swirl 2 — boids 1**. The Architect's directive: submit to
the built structure, propose additions beside it — so the standing stats board
leads, nominees join the options row, and future seeds rotate fresh topologies.