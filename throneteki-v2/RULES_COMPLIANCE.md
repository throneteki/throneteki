# Rules Compliance Tracker
## A Game of Thrones LCG 2.0 — Joust Format Only

### Phase Timing (vs Official Timing Sequence Chart)

| Step | Rule | Status |
|------|------|--------|
| **1. Plot Phase** | | |
| 1.1 | Round begins, Plot phase begins | ✅ Implemented |
| 1.2 | Choose plots (simultaneous, secret) | ✅ Implemented |
| 1.3.I | Compare initiative values | ✅ Implemented |
| 1.3.I | Initiative tiebreak: lowest total power | ✅ Implemented |
| 1.3.II | Winner chooses first player | ✅ Simplified (winner becomes first player) |
| 1.3.III | Resolve "When Revealed" abilities | ⬜ Not yet — needs AbilityResolver integration |
| 1.4 | Select titles (Melee only) | ➖ Skipped (Joust only) |
| — | Action window | ⬜ Not yet — action windows not implemented |
| 1.5 | Plot phase ends | ⬜ Missing PhaseEndedEvent |
| **2. Draw Phase** | | |
| 2.1 | Draw phase begins | ✅ Implemented |
| 2.2 | Each player draws 2 cards | ✅ Implemented |
| — | Action window | ⬜ Not yet |
| 2.3 | Draw phase ends | ⬜ Missing PhaseEndedEvent |
| **3. Marshalling Phase** | | |
| 3.1 | Marshalling phase begins | ✅ Implemented |
| 3.2 | Active player collects income | ✅ Implemented (but both collect simultaneously) |
| 3.2 | Income per-player (first player first) | ⬜ Should be sequential |
| — | Special action window (only active player marshals) | ⬜ Not yet |
| 3.3 | Next player becomes active | ✅ Turn-based via ClaimMarshallingDoneCommand |
| 3.4 | Marshalling phase ends | ✅ Advances to Challenges |
| **4. Challenges Phase** | | |
| 4.1 | Challenges phase begins | ✅ Implemented |
| — | Action window | ⬜ Not yet |
| 4.2 | Initiate challenge | ✅ Implemented |
| — | Stealth keyword (initiating) | ⬜ Not yet |
| — | Action window after attackers declared | ⬜ Not yet |
| 4.2.1 | Declare defenders | ✅ Implemented |
| — | Action window after defenders declared | ⬜ Not yet |
| 4.2.2 | D — Determine winner (attacker wins ties) | ✅ Implemented |
| 4.2.2 | 0 STR attacker = no winner | ✅ Implemented |
| 4.2.3 | U — Unopposed bonus (+1 power) | ✅ Implemented |
| 4.2.4 | C — Claim (Military/Intrigue/Power) | ✅ Implemented |
| 4.2.5 | K — Keywords (Renown/Insight/Intimidate/Pillage) | ✅ Implemented |
| 4.2.6 | Challenge ends, return to action window | ✅ Prompts next challenge |
| 4.3-4.4 | Alternating player turns | ✅ Via PassChallengesCommand |
| **5. Dominance Phase** | | |
| 5.1 | Dominance phase begins | ✅ Implemented |
| 5.2 | Count standing STR + unspent gold | ✅ Implemented |
| 5.2.1 | Winner gains 1 power on faction | ✅ Implemented |
| — | Action window | ⬜ Not yet |
| 5.3 | Dominance phase ends | ✅ Advances to Standing |
| **6. Standing Phase** | | |
| 6.1 | Standing phase begins | ✅ Implemented |
| 6.2 | Stand each kneeling card | ✅ Implemented |
| — | Action window | ⬜ Not yet |
| 6.3 | Standing phase ends | ✅ Advances to Taxation |
| **7. Taxation Phase** | | |
| 7.1 | Taxation phase begins | ✅ Implemented |
| 7.2 | Return unspent gold to treasury | ✅ Implemented |
| 7.3 | Discard down to reserve value | ✅ Implemented |
| 7.4 | Return titles (Melee only) | ➖ Skipped |
| — | Action window | ⬜ Not yet |
| 7.5 | Taxation phase ends, round ends | ✅ Implemented |

### Core Rules

| Rule | Status |
|------|--------|
| Win condition: 15 power | ✅ CheckWinCondition() implemented |
| Loss: empty draw deck | ⬜ Not yet |
| Unique card duplication | ⬜ Not yet — auto-duplicate on marshal |
| Duplicate save (auto-save) | ⬜ Not yet — save before interrupts |
| Dead pile restriction (1.3) | ⬜ Not yet — can't marshal unique if copy in dead pile |
| Limited keyword (1 per round) | ⬜ Not yet |
| Terminal conditions (2.6) | ⬜ Not yet — kill if STR is 0 |
| Playing events (1.5) | ⬜ Not yet — events leave hand during resolution |
| Simultaneous resolution (1.6) | ⬜ Not yet — first player chooses order |
| "Choose" = targeting | ⬜ Not yet |
| Saving from cost (3.2) | ⬜ Not yet — can't save from cost |

### Keywords

| Keyword | Status |
|---------|--------|
| Renown | ✅ Implemented in KeywordResolver |
| Insight | ✅ Implemented in KeywordResolver |
| Intimidate | ✅ Implemented in KeywordResolver |
| Pillage | ✅ Implemented in KeywordResolver |
| Stealth | ⬜ Not yet — initiating keyword |
| Ambush | ⬜ Not yet |
| Shadow | ⬜ Not yet |
| Limited | ⬜ Not yet — tracking only |
| Terminal | ⬜ Not yet |
| Bestow | ⬜ Not yet |
| Assault | ⬜ Not yet — initiating keyword |

### End of Phase Timing (W.U.A.)

| Step | Status |
|------|--------|
| Interrupts to phase end | ⬜ Not yet |
| "Until end of phase" effects expire | ⬜ Not yet |
| "At end of phase" delayed effects resolve | ⬜ Not yet |
| Reactions to phase end | ⬜ Not yet |

### Card Implementations (Core Set)

See verification report — 20 cards implemented from pack 01-Core, verified against
original JS source files at `server/game/cards/01-Core/`.
