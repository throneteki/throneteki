using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Events;

/// <summary>
/// The Hand's Judgment (01064) — Neutral event.
/// Interrupt: When an opponent plays an event card, cancel its effects.
/// </summary>
[CardDefinition("01064")]
public sealed class TheHandsJudgment : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Interrupt("hands-judgment-cancel")
            .Describe("Interrupt: When an opponent plays an event card, cancel its effects.")
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
                    new AbilityCancelledEvent(trigger.SourceCardId, trigger.AbilityId, "The Hand's Judgment") { }
                };
            })
            .Build();
    }
}
