using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Wildfire Assault (01026) — Plot. Income 4, Initiative 7, Claim 1, Reserve 6.
/// When Revealed: Each player chooses up to 3 characters they control.
///                Kill each character not chosen (allowSave: false).
/// Ported from: server/game/cards/01-Core/WildfireAssault.js
///
/// JS: choosingPlayer='each', numCards=3, optional=true, ifAble=true.
///     Target: play area, character type, controlled by choosing player.
///     Kills all non-chosen characters with allowSave: false.
///
/// Known gaps:
/// - Should prompt each player to choose (not auto-select)
/// - Should filter to character type only via ICardCatalog
/// - Should use allowSave: false on kill events
/// </summary>
[CardDefinition("01026")]
public sealed class WildfireAssault : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.WhenRevealed("wildfire-kill")
            .Describe("When Revealed: Each player keeps up to 3 characters; kill the rest (no saves).")
            .Do(ctx =>
            {
                var events = new List<GameEvent>();

                foreach (var player in ctx.State.Players)
                {
                    // TODO: Should prompt each player to choose up to 3 characters
                    // TODO: Filter to character type only via ICardCatalog
                    var characters = player.CardsInPlay
                        .Where(c => c.Location == CardLocation.PlayArea)
                        .ToList();

                    // Simplified: keep first 3, kill rest (should be player choice)
                    var toKill = characters.Skip(3);
                    foreach (var card in toKill)
                        events.Add(CommonEffects.Kill(card.InstanceId, card.OwnerId));
                        // TODO: allowSave: false
                }

                return events;
            })
            .Build();
    }
}
