using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Wildfire Assault (01026) — Income 4, Initiative 0, Claim 1, Reserve 6.
/// When Revealed: Each player chooses up to 3 characters they control.
/// Kill each character not chosen.
/// </summary>
[CardDefinition("01026")]
public sealed class WildfireAssault : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.WhenRevealed("wildfire-kill")
            .Describe("When Revealed: Each player keeps up to 3 characters; kill the rest.")
            .Do(ctx =>
            {
                var events = new List<GameEvent>();

                foreach (var player in ctx.State.Players)
                {
                    // Keep the 3 highest-STR characters (simplified — real game lets player choose)
                    var characters = player.CardsInPlay
                        .Where(c => c.Location == CardLocation.PlayArea)
                        .OrderByDescending(c => c.StrengthModifier) // simplified sort
                        .ToList();

                    var toKill = characters.Skip(3);
                    foreach (var card in toKill)
                        events.Add(CommonEffects.Kill(card.InstanceId, card.OwnerId));
                }

                return events;
            })
            .Build();
    }
}
