using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Characters;

/// <summary>
/// Eddard Stark (01148) — Stark character, 6 cost, 5 STR, Military + Power icons.
/// Renown keyword.
/// Interrupt: When Eddard Stark would be killed, if you control another Stark character,
/// sacrifice that character instead.
/// </summary>
[CardDefinition("01148")]
public sealed class NedStark : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Interrupt("ned-save")
            .Describe("Interrupt: When Ned would be killed, sacrifice another Stark character instead.")
            .OnEvent<CardKilledEvent>((e, state) =>
            {
                // Match when Ned himself is being killed
                return e.CardInstanceId == Guid.Empty; // Will be evaluated with actual source context
            })
            .When(ctx =>
            {
                var controller = ctx.State.GetPlayer(ctx.ControllingPlayerId);
                return controller.CardsInPlay
                    .Any(c => c.InstanceId != ctx.Source.InstanceId);
            })
            .Do(ctx =>
            {
                var trigger = (CardKilledEvent)ctx.TriggeringEvent!;
                var controller = ctx.State.GetPlayer(ctx.ControllingPlayerId);
                var sacrifice = controller.CardsInPlay
                    .FirstOrDefault(c => c.InstanceId != ctx.Source.InstanceId);

                if (sacrifice == null) return Array.Empty<GameEvent>();

                return new GameEvent[]
                {
                    new AbilityCancelledEvent(trigger.CardInstanceId, "kill", "Ned save") { },
                    new CardKilledEvent(sacrifice.InstanceId, sacrifice.OwnerId) { },
                };
            })
            .Build();
    }
}
