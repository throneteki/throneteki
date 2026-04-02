using System.Collections.Immutable;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Keywords;

/// <summary>
/// Resolves keyword effects after a challenge is determined.
/// Keywords are shared mechanics — every card with a given keyword behaves the same way,
/// so this resolver eliminates per-card keyword code entirely.
/// </summary>
public static class KeywordResolver
{
    /// <summary>
    /// Resolve all keyword effects for the winning side after a challenge result.
    /// </summary>
    /// <param name="state">Game state with ActiveChallenge set.</param>
    /// <param name="result">The challenge result event.</param>
    /// <param name="attackerKeywords">Keywords on participating attackers (aggregated).</param>
    /// <param name="defenderKeywords">Keywords on participating defenders (aggregated).</param>
    public static IReadOnlyList<GameEvent> ResolvePostChallenge(
        GameState state,
        ChallengeResultDeterminedEvent result,
        ImmutableHashSet<Keyword> attackerKeywords,
        ImmutableHashSet<Keyword> defenderKeywords)
    {
        var challenge = state.ActiveChallenge;
        if (challenge == null || result.WinnerId == null) return Array.Empty<GameEvent>();

        bool attackerWon = result.WinnerId == challenge.AttackingPlayerId;
        var winnerKeywords = attackerWon ? attackerKeywords : defenderKeywords;
        var winnerId = result.WinnerId.Value;

        var events = new List<GameEvent>();

        // Renown: winning character gains 1 power on themselves
        if (winnerKeywords.Contains(Keyword.Renown))
        {
            var winningCards = attackerWon ? challenge.Attackers : challenge.Defenders;
            foreach (var cardId in winningCards)
                events.Add(new PowerGainedEvent(cardId, PowerTargetType.Card, 1, "Renown"));
        }

        // Insight: winning player draws 1 card
        if (winnerKeywords.Contains(Keyword.Insight))
        {
            var player = state.GetPlayer(winnerId);
            if (player.DrawDeck.Count > 0)
                events.Add(new CardDrawnEvent(winnerId, player.DrawDeck[0].InstanceId));
        }

        // Intimidate: winning attacker kneels a standing character controlled by the loser
        if (attackerWon && winnerKeywords.Contains(Keyword.Intimidate))
        {
            var loserId = challenge.DefendingPlayerId;
            var loser = state.GetPlayer(loserId);
            var target = loser.CardsInPlay.FirstOrDefault(c => !c.Kneeled);
            if (target != null)
                events.Add(new CardKneeledEvent(target.InstanceId, "Intimidate"));
        }

        // Pillage: winning attacker discards top card of loser's deck
        if (attackerWon && winnerKeywords.Contains(Keyword.Pillage))
        {
            var loserId = challenge.DefendingPlayerId;
            var loser = state.GetPlayer(loserId);
            if (loser.DrawDeck.Count > 0)
                events.Add(new CardDiscardedEvent(loser.DrawDeck[0].InstanceId, loserId, CardLocation.DrawDeck));
        }

        return events;
    }
}
