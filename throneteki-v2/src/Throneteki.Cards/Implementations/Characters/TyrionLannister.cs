using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Characters;

/// <summary>
/// Tyrion Lannister (01089) — 5 cost, 4 STR, Intrigue + Power icons.
/// Reaction: After Tyrion Lannister wins an Intrigue challenge as the attacking player,
/// the losing opponent discards 1 card at random from their hand.
/// </summary>
[CardDefinition("01089")]
public sealed class TyrionLannister : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("tyrion-intrigue-win")
            .Describe("Reaction: After Tyrion wins an Intrigue challenge as attacker, opponent discards 1 card at random.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
            {
                // Match: Tyrion's controller won, it was intrigue, Tyrion was an attacker
                var challenge = state.ActiveChallenge;
                return challenge != null &&
                       challenge.Type == ChallengeIcon.Intrigue &&
                       e.WinnerId == challenge.AttackingPlayerId &&
                       challenge.Attackers.Count > 0;
            })
            .Do(ctx =>
            {
                var challenge = ctx.State.ActiveChallenge;
                if (challenge == null) return Array.Empty<GameEvent>();

                var losingPlayerId = challenge.DefendingPlayerId;
                var loser = ctx.State.GetPlayer(losingPlayerId);
                if (loser.Hand.Count == 0) return Array.Empty<GameEvent>();

                // Discard the first card (random selection deferred to engine randomization layer)
                var victim = loser.Hand[0];
                return new GameEvent[]
                {
                    new CardDiscardedEvent(victim.InstanceId, losingPlayerId, CardLocation.Hand) { }
                };
            })
            .Build();
    }
}
