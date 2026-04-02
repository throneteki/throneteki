using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// The Hand's Judgment (01045) — Neutral event.
/// Interrupt: When an opponent initiates an event card ability, cancel it.
/// Ported from: server/game/cards/01-Core/TheHandsJudgment.js
/// </summary>
[CardDefinition("01045")]
public sealed class TheHandsJudgment : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Interrupt("hands-judgment-cancel")
            .Describe("Interrupt: When an opponent plays an event, cancel its effects.")
            .OnEvent<AbilityInitiatedEvent>((e, state) =>
            {
                // Trigger when an opponent initiates an event-card ability
                var card = state.FindCard(e.SourceCardId);
                return card != null && card.OwnerId != e.PlayerId;
            })
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
