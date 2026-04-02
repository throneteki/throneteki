using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Consolidation of Power (01062) — 0 cost event.
/// Action (Marshalling): Kneel characters you control with total STR 4 or less.
/// Then, choose one of those characters to gain 1 power.
/// Ported from: server/game/cards/01-Core/ConsolidationOfPower.js
/// </summary>
[CardDefinition("01062")]
public sealed class ConsolidationOfPower : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("consolidation-kneel-gain")
            .Describe("Action: Kneel characters with total STR ≤ 4. One of them gains 1 power.")
            .DuringPhase(GamePhase.Marshalling)
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea &&
                target.ControllerId == source.ControllerId &&
                !target.Kneeled)
            .Do(ctx =>
            {
                return new GameEvent[]
                {
                    CommonEffects.Kneel(ctx.Target!.InstanceId, "Consolidation of Power"),
                    CommonEffects.GainCardPower(ctx.Target.InstanceId, 1, "Consolidation of Power"),
                };
            })
            .Build();
    }
}
