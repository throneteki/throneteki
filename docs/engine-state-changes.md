# Engine state changes

Audit date: 24 October 2026. Card conversion is complete. This inventory concerns framework
and compatibility helpers outside `server/game/cards`. The changes below are committed and the
full suite passes.

## Converted

| Area                        | Action path                                                                                                                                                                                                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gold                        | `Game.spendGold`, `transferGold`, and `returnGoldToTreasury` delegate to their actions. Payments preserve playing type and active player. Zero payments queue the completion callback without an event.                                                                                                   |
| Power                       | `Game.addPower` explicitly delegates to `gainPower`; `BaseCard.modifyPower` already delegated to gain/discard actions.                                                                                                                                                                                    |
| Saves                       | Internal `RecordSave` owns `markAsSaved` and `onCardSaved`. `SaveCard` delegates to it with the pending event. Automatic duplicate saves consume the duplicate through an action and retain cancellation before the would-interrupt window. `Event` and `GroupedCardEvent` use the compatibility wrapper. |
| Card entry                  | `Player.putIntoPlay` delegates to `PutIntoPlay`, preserving the existing manual-force path. `PutIntoPlayCost` uses actions. Entry retains setup, duplicates, bestow, play type, and shadows X values.                                                                                                     |
| Attachments                 | `Player.attach` delegates to `Attach`; the entry action queues the attachment prompt directly. The prompt carries play type, kneeling, and shadows X value.                                                                                                                                               |
| Event-card staging          | Playing, restoring after prevented costs, and disposing of events use placement actions. Disposal is placement rather than a discard effect. Underneath restoration records the original parent and facedown state.                                                                                       |
| Plot recycling              | `RecyclePlots` moves used plots in the `onPlotsRecycled` handler and respects recycling restrictions.                                                                                                                                                                                                     |
| Setup                       | `RevealSetupCards` reveals and announces setup cards. `FinishSetup` consolidates duplicates inside `onSetupFinished`.                                                                                                                                                                                     |
| Round resets                | `ResetRound` owns the plot-phase reset, preserving the previous first player for dependent plot selection.                                                                                                                                                                                                |
| First player                | The compatibility helper delegates to `SetFirstPlayer`.                                                                                                                                                                                                                                                   |
| Melee titles                | `SelectTitles` places all selected titles together; `ReturnTitles` returns all assigned titles together.                                                                                                                                                                                                  |
| Remaining gameplay movement | Effect-expiry restoration and top-to-bottom deck movement use placement actions. Attachment removal uses the shared leave-play event generator.                                                                                                                                                           |

## Remaining effect-model work

Take-control and icon effects register on the card as they apply and queue nothing. Once the
effects settle, `TakeControl.applyControlChange` moves each card whose controller actually changed
and raises one `onCardTakenControl`, and each icon gained or lost on balance raises one
`onIconGained` or `onIconLost`. After each event window `EffectEngine.settle` recalculates until
nothing changes, so these events report net changes only
([SettleEffects.spec.js](../test/server/effects/SettleEffects.spec.js)).

## Operations below the action boundary

- `BaseCard.modifyPower`, `DiscardPowerCost`, and `PowerAsGoldSource` already reach actions.
- Gold-source selection mutates its chosen source inside `PayGold` or `TransferGold` resolution.
- `placeCardInPile`, `moveTo`, property setters, setup consolidation, and title-pool helpers are
  low-level operations used by action handlers. They must not recursively queue their own actions.
- Production callers of `Player.moveCard` and `synchronousMoveCard` are now manual commands and
  drag/drop compatibility code, rather than ordinary card effects.
- Deck construction, dummy-player initialization, prompt selections, snapshots, ability counters,
  and the pipeline's current-phase marker are bookkeeping. Audit callers before adding rules events.
- Manual corrections remain corrections. `/power`, `/token`, and `changeStat` must not gain
  gameplay events as a side effect of this migration.
