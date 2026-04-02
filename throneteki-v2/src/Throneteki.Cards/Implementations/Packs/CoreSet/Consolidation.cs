using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Consolidation of Power (01062) — 0 cost event.
/// Action (Marshalling): Kneel any number of characters you control with total
///                       STR 4 or less. Then choose one of those characters to gain 1 power.
/// Ported from: server/game/cards/01-Core/ConsolidationOfPower.js
///
/// JS: phase=marshal. Target: multi-select with maxStat=4 (total STR), cardStat=getStrength,
///     singleController=true, play area, character, not kneeled, gameAction: 'kneel'.
///     Kneels all selected, then second prompt to pick one for gainPower(1).
///
/// Known gaps:
/// - Should be multi-target with combined STR cap of 4 (needs multi-select)
/// - Should filter to character type only via ICardCatalog
/// - Should have second prompt for power gain target
/// - Controller filter should allow any player's characters (singleController=true)
/// - Missing gameAction checks for kneel and gainPower
/// </summary>
[CardDefinition("01062")]
public sealed class ConsolidationOfPower : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // TODO: Should be multi-target (up to 4 total STR), then second prompt for power
        yield return AbilityBuilder.Action("consolidation-kneel-gain")
            .Describe("Action: Kneel characters with total STR ≤ 4. One of them gains 1 power.")
            .DuringPhase(GamePhase.Marshalling)
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea &&
                !target.Kneeled)
                // TODO: Filter to character type via ICardCatalog
                // TODO: Multi-select with maxStat=4 based on getStrength()
            .Do(ctx =>
            {
                return new GameEvent[]
                {
                    CommonEffects.Kneel(ctx.Target!.InstanceId, "Consolidation of Power"),
                    // TODO: Second prompt to choose which kneeled character gains power
                    CommonEffects.GainCardPower(ctx.Target.InstanceId, 1, "Consolidation of Power"),
                };
            })
            .Build();
    }
}
