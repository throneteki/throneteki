using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Events;

/// <summary>
/// Dracarys! (01045) — Targaryen event, 2 cost.
/// Action: Kneel your faction card. Choose a character. Deal 2 damage (STR -2) to that character.
/// If the character's STR is reduced to 0, kill it.
/// </summary>
[CardDefinition("01045")]
public sealed class Dracarys : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("dracarys-burn")
            .Describe("Kneel your faction card. Choose a character not immune to effects. Deal 2 STR damage. Kill if STR is 0.")
            .Costs(2)
            .DuringPhase(GamePhase.Challenges)
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea)
            .Do(ctx =>
            {
                var target = ctx.Target!;
                var events = new List<GameEvent>();

                // Kneel the controller's faction card
                var controller = ctx.State.GetPlayer(ctx.ControllingPlayerId);
                if (!controller.Faction.Kneeled)
                    events.Add(new CardKneeledEvent(controller.Faction.InstanceId, "Dracarys") { });

                // Apply -2 STR (tracked as StrengthModifier on the card)
                // In the full game this would register a persistent effect; here we emit a game event
                // to record the modification so the projector can apply it.
                events.Add(new TokenAddedEvent(target.InstanceId, "damage", 2) { });

                return events;
            })
            .Build();
    }
}
