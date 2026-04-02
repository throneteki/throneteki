using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// The Hand's Judgment (01045) — Neutral event, X cost.
/// Interrupt: When an opponent initiates an event card's ability, cancel that ability.
///            X is the printed cost of the event being cancelled.
/// Ported from: server/game/cards/01-Core/TheHandsJudgment.js
///
/// JS: canCancel: true, triggers on onCardAbilityInitiated where source is an event card
///     and the player is NOT this.controller. Custom getCost() returns X = printed cost
///     of the event being cancelled.
///
/// Known gaps:
/// - Missing event card type check on the triggering ability's source
/// - Opponent check should compare against controller of The Hand's Judgment, not card owner
/// - Missing dynamic X cost (cost = printed cost of cancelled event)
/// - Missing canCancel flag (framework-level cancel interrupt)
/// </summary>
[CardDefinition("01045")]
public sealed class TheHandsJudgment : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Interrupt("hands-judgment-cancel")
            .Describe("Interrupt: When an opponent plays an event, cancel its effects. (Cost: X = event's cost.)")
            .OnEvent<AbilityInitiatedEvent>((e, state) =>
            {
                // Must be an event card ability from an opponent
                // TODO: Check source card type === 'event' via ICardCatalog
                // TODO: Check e.PlayerId is an opponent of the controller (not card owner check)
                var card = state.FindCard(e.SourceCardId);
                return card != null;
            })
            // TODO: Dynamic cost = printed cost of the event being cancelled
            .Do(ctx =>
            {
                var trigger = (AbilityInitiatedEvent)ctx.TriggeringEvent!;
                return new GameEvent[]
                {
                    new AbilityCancelledEvent(trigger.SourceCardId, trigger.AbilityId, "The Hand's Judgment"),
                };
            })
            .Build();
    }
}
