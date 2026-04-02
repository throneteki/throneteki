using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Melisandre (01047) — 6 cost, 4 STR, Intrigue + Power icons. Baratheon, R'hllor, Lady.
/// Reaction: After you marshal a R'hllor card or play a R'hllor event, kneel a character.
/// (Limit once per round.)
/// Ported from: server/game/cards/01-Core/Melisandre.js
/// </summary>
[CardDefinition("01047")]
public sealed class MelisandreCore : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Reaction: when controller marshals a R'hllor card or plays a R'hllor event,
        // kneel a standing character (limit 1/round)
        // Note: R'hllor trait check on the triggering card requires catalog lookup.
        // The trigger filter should verify:
        //   - The marshalled/played card belongs to the controller
        //   - The marshalled/played card has the R'hllor trait
        yield return AbilityBuilder.Reaction("melisandre-kneel")
            .Describe("Reaction: After you marshal/play a R'hllor card, kneel a character. (Limit 1/round.)")
            .OnEvent<CardMarshalledEvent>((e, _) => true)
            .LimitPerRound(1)
            .When(ctx =>
            {
                var trigger = (CardMarshalledEvent)ctx.TriggeringEvent!;
                // Must be controller's card; R'hllor trait check requires catalog
                return trigger.PlayerId == ctx.ControllingPlayerId;
            })
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea &&
                !target.Kneeled)
            .Do(ctx => new GameEvent[] { CommonEffects.Kneel(ctx.Target!.InstanceId, "Melisandre") })
            .Build();
    }
}
