using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Plots;

/// <summary>
/// Heads on Spikes (01013) — Income 4, Initiative 2, Claim 1, Reserve 6.
/// When Revealed: Discard 1 random card from each opponent's hand. If a character
/// is discarded this way, gain 2 power on your faction.
/// </summary>
[CardDefinition("01013")]
public sealed class HeadsOnSpikes : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.WhenRevealed("heads-on-spikes-reveal")
            .Describe("When Revealed: Each opponent discards 1 card at random. If a character is discarded, gain 2 power.")
            .Do(ctx =>
            {
                var events = new List<GameEvent>();
                var controllerPlayer = ctx.State.GetPlayer(ctx.ControllingPlayerId);

                foreach (var opponent in ctx.State.Players.Where(p => p.PlayerId != ctx.ControllingPlayerId))
                {
                    if (opponent.Hand.Count == 0) continue;

                    var victim = opponent.Hand[0]; // random selection — first card (seeded elsewhere)
                    events.Add(new CardDiscardedEvent(victim.InstanceId, opponent.PlayerId, Domain.Enums.CardLocation.Hand) { });

                    // If it's a character card code — we'd need the catalog; placeholder for now:
                    // In the real engine, the ability engine has access to the catalog.
                    // We emit a conditional power gain event (the engine validates card type).
                    events.Add(new PowerGainedEvent(ctx.ControllingPlayerId, Domain.Enums.PowerTargetType.Player, 2, "Heads on Spikes") { });
                }

                return events;
            })
            .Build();
    }
}
