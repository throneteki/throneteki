using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Heads on Spikes (01013) — Plot. Income 4, Initiative 6, Claim 1, Reserve 6.
/// When Revealed: Discard 1 card at random from your opponent's hand. If it is a
///                character, place it in its owner's dead pile (not discard) and gain
///                2 power for your faction.
/// (Joust: single opponent.)
/// Ported from: server/game/cards/01-Core/HeadsOnSpikes.js
///
/// JS: chooseOpponent=true, discardAtRandom(1), if character: placeCard to dead pile
///     + gainPower(2) on faction (checked with allow()). allowSave: false on discard.
///
/// Known gaps:
/// - Random selection not truly random (uses Hand[0])
/// - Character check on discarded card missing (needs ICardCatalog)
/// - Characters should go to dead pile, not discard pile
/// - Power gain should be conditional on character type
/// - Missing allowSave: false (no saves allowed on this discard)
/// - Missing gainPower.allow() check
/// </summary>
[CardDefinition("01013")]
public sealed class HeadsOnSpikes : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.WhenRevealed("heads-on-spikes-reveal")
            .Describe("When Revealed: Discard 1 random card from opponent's hand. If character: dead pile + gain 2 power.")
            .Do(ctx =>
            {
                var events = new List<GameEvent>();

                // Joust: single opponent
                var opponent = ctx.State.Players.FirstOrDefault(p => p.PlayerId != ctx.ControllingPlayerId);
                if (opponent == null || opponent.Hand.Count == 0) return events;

                // TODO: Implement true random selection (seeded by game RandomSeed)
                var victim = opponent.Hand[0];

                // TODO: Check card type via ICardCatalog:
                //   - If character: use CardKilledEvent (dead pile), gain 2 power
                //   - If not character: use CardDiscardedEvent (discard pile), no power
                // TODO: allowSave: false — prevent saves on this discard
                events.Add(new CardDiscardedEvent(victim.InstanceId, opponent.PlayerId, CardLocation.Hand));

                // TODO: Power gain should be conditional on character type
                events.Add(CommonEffects.GainFactionPower(ctx, 2, "Heads on Spikes"));
                events.Add(CommonEffects.Log($"Heads on Spikes discards {victim.CardCode} from opponent's hand."));

                return events;
            })
            .Build();
    }
}
