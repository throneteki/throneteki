using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Melisandre (01047) — 5 cost, 4 STR, Intrigue + Power icons. Baratheon, R'hllor, Lady.
/// Reaction: After you marshal a card with the R'hllor trait, or after you play an event
/// with the R'hllor trait, choose and kneel a character. (Limit once per round.)
/// Ported from: server/game/cards/01-Core/Melisandre.js
///
/// JS triggers: onCardEntersPlay (marshal, R'hllor trait, controller's card)
///              onCardPlayed (R'hllor trait, controller's card)
/// JS target: play area, character, not kneeled, gameAction: 'kneel'
/// </summary>
[CardDefinition("01047")]
public sealed class MelisandreCore : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("melisandre-kneel")
            .Describe("Reaction: After you marshal/play a R'hllor card, kneel a character. (Limit 1/round.)")
            .OnEvent<CardMarshalledEvent>((e, _) => true)
            // TODO: Also trigger on event-played (onCardPlayed) for R'hllor events
            .LimitPerRound(1)
            .When(ctx =>
            {
                var trigger = (CardMarshalledEvent)ctx.TriggeringEvent!;
                return trigger.PlayerId == ctx.ControllingPlayerId;
                // TODO: Check R'hllor trait on trigger card via ICardCatalog
            })
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea &&
                !target.Kneeled)
                // TODO: Filter to character type only via ICardCatalog
            .Do(ctx => new GameEvent[] { CommonEffects.Kneel(ctx.Target!.InstanceId, "Melisandre") })
            .Build();
    }
}
