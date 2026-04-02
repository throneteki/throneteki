using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Keywords;

/// <summary>
/// Resolves claim effects after a challenge is won by the attacker.
/// Military claim: defender must kill N characters.
/// Intrigue claim: defender must discard N random cards from hand.
/// Power claim: N power moves from defender's faction to attacker's faction.
/// </summary>
public static class ClaimResolver
{
    public static IReadOnlyList<GameEvent> ResolveClaim(
        GameState state, ChallengeIcon challengeType, int claimValue)
    {
        var challenge = state.ActiveChallenge;
        if (challenge == null) return Array.Empty<GameEvent>();

        var defenderId = challenge.DefendingPlayerId;
        var attackerId = challenge.AttackingPlayerId;
        var defender = state.GetPlayer(defenderId);
        var events = new List<GameEvent>();

        switch (challengeType)
        {
            case ChallengeIcon.Military:
                // Defender chooses N characters to kill (simplified: kill first N)
                var toKill = defender.CardsInPlay
                    .Take(claimValue);
                foreach (var card in toKill)
                    events.Add(new CardKilledEvent(card.InstanceId, card.OwnerId));
                break;

            case ChallengeIcon.Intrigue:
                // Discard N random cards from defender's hand
                var toDiscard = Math.Min(claimValue, defender.Hand.Count);
                for (int i = 0; i < toDiscard; i++)
                    events.Add(new CardDiscardedEvent(defender.Hand[i].InstanceId, defenderId, CardLocation.Hand));
                break;

            case ChallengeIcon.Power:
                // Move N power from defender's faction to attacker's faction
                var toMove = Math.Min(claimValue, defender.FactionPower);
                if (toMove > 0)
                {
                    events.Add(new PowerLostEvent(defenderId, PowerTargetType.Player, toMove));
                    events.Add(new PowerGainedEvent(attackerId, PowerTargetType.Player, toMove, "Claim"));
                }
                break;
        }

        if (events.Count > 0)
            events.Insert(0, new ClaimAppliedEvent(challengeType, claimValue, defenderId));

        return events;
    }
}
