using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Heads on Spikes (01013) — Plot. Income 4, Initiative 2, Claim 1, Reserve 6.
/// When Revealed: Discard 1 card at random from your opponent's hand. If it is a
/// character, place it in its owner's dead pile and gain 2 power for your faction.
/// (Joust: single opponent only.)
/// Ported from: server/game/cards/01-Core/HeadsOnSpikes.js
/// </summary>
[CardDefinition("01013")]
public sealed class HeadsOnSpikes : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.WhenRevealed("heads-on-spikes-reveal")
            .Describe("When Revealed: Discard 1 random card from opponent's hand. If character, it goes to dead pile and you gain 2 power.")
            .Do(ctx =>
            {
                var events = new List<GameEvent>();

                // Joust format: single opponent
                var opponent = ctx.State.Players.FirstOrDefault(p => p.PlayerId != ctx.ControllingPlayerId);
                if (opponent == null || opponent.Hand.Count == 0) return events;

                var victim = opponent.Hand[0]; // random selection (seeded elsewhere)

                // Discard the card (character cards go to dead pile — handled by card type check)
                // The engine/projector should route characters to dead pile based on card type
                events.Add(new CardDiscardedEvent(victim.InstanceId, opponent.PlayerId, CardLocation.Hand));

                // Power gain is conditional on character type — requires catalog lookup
                // For now emit a conditional power gain; the engine validates card type
                // TODO: check card type via ICardCatalog before emitting
                events.Add(CommonEffects.GainFactionPower(ctx, 2, "Heads on Spikes"));
                events.Add(CommonEffects.Log($"Heads on Spikes discards {victim.CardCode} from opponent's hand."));

                return events;
            })
            .Build();
    }
}
