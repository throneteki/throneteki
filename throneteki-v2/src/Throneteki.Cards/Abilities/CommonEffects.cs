using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Abilities;

/// <summary>
/// Reusable effect building blocks that many cards share.
/// Cards compose these helpers in their <see cref="CardScript.DeclareAbilities"/>.
/// This minimizes per-card code — most cards only need to declare trigger conditions
/// and call into these shared helpers.
/// </summary>
public static class CommonEffects
{
    // ── Draw / discard ────────────────────────────────────────────────────────

    /// <summary>Draw N cards for the controlling player.</summary>
    public static IReadOnlyList<GameEvent> DrawCards(AbilityContext ctx, int count)
    {
        var player = ctx.State.GetPlayer(ctx.ControllingPlayerId);
        int toDraw = Math.Min(count, player.DrawDeck.Count);
        var events = new List<GameEvent>(toDraw);
        for (int i = 0; i < toDraw; i++)
            events.Add(new CardDrawnEvent(ctx.ControllingPlayerId, player.DrawDeck[i].InstanceId));
        return events;
    }

    /// <summary>Discard N random cards from a player's hand.</summary>
    public static IReadOnlyList<GameEvent> DiscardRandom(GameState state, Guid playerId, int count)
    {
        var player = state.GetPlayer(playerId);
        int toDiscard = Math.Min(count, player.Hand.Count);
        var events = new List<GameEvent>(toDiscard);
        for (int i = 0; i < toDiscard; i++)
            events.Add(new CardDiscardedEvent(player.Hand[i].InstanceId, playerId, CardLocation.Hand));
        return events;
    }

    /// <summary>Discard a specific card from a player's hand.</summary>
    public static GameEvent DiscardFromHand(Guid cardInstanceId, Guid ownerId) =>
        new CardDiscardedEvent(cardInstanceId, ownerId, CardLocation.Hand);

    // ── Power ─────────────────────────────────────────────────────────────────

    /// <summary>Gain N power on the controlling player's faction card.</summary>
    public static GameEvent GainFactionPower(AbilityContext ctx, int amount, string reason = "") =>
        new PowerGainedEvent(ctx.ControllingPlayerId, PowerTargetType.Player, amount, reason);

    /// <summary>Gain N power on a specific card.</summary>
    public static GameEvent GainCardPower(Guid cardInstanceId, int amount, string reason = "") =>
        new PowerGainedEvent(cardInstanceId, PowerTargetType.Card, amount, reason);

    /// <summary>Move power from one card to another.</summary>
    public static GameEvent MovePower(Guid fromCardId, Guid toCardId, int amount) =>
        new PowerMovedEvent(fromCardId, toCardId, amount);

    // ── Card state ────────────────────────────────────────────────────────────

    /// <summary>Kneel a card.</summary>
    public static GameEvent Kneel(Guid cardInstanceId, string reason = "") =>
        new CardKneeledEvent(cardInstanceId, reason);

    /// <summary>Kneel the controlling player's faction card.</summary>
    public static GameEvent KneelFaction(AbilityContext ctx, string reason = "")
    {
        var player = ctx.State.GetPlayer(ctx.ControllingPlayerId);
        return new CardKneeledEvent(player.Faction.InstanceId, reason);
    }

    /// <summary>Stand a card.</summary>
    public static GameEvent Stand(Guid cardInstanceId) =>
        new CardStoodEvent(cardInstanceId);

    /// <summary>Kill a character.</summary>
    public static GameEvent Kill(Guid cardInstanceId, Guid ownerId) =>
        new CardKilledEvent(cardInstanceId, ownerId);

    /// <summary>Return a card from play to its owner's hand.</summary>
    public static GameEvent ReturnToHand(Guid cardInstanceId, Guid ownerId) =>
        new CardReturnedToHandEvent(cardInstanceId, ownerId);

    // ── Gold ──────────────────────────────────────────────────────────────────

    /// <summary>Gain gold.</summary>
    public static GameEvent GainGold(Guid playerId, int amount, string reason = "") =>
        new GoldGainedEvent(playerId, amount, reason);

    /// <summary>Gain gold for the controlling player.</summary>
    public static GameEvent GainGold(AbilityContext ctx, int amount, string reason = "") =>
        new GoldGainedEvent(ctx.ControllingPlayerId, amount, reason);

    // ── Tokens ────────────────────────────────────────────────────────────────

    /// <summary>Add tokens of a given type to a card.</summary>
    public static GameEvent AddToken(Guid cardInstanceId, string tokenType, int amount = 1) =>
        new TokenAddedEvent(cardInstanceId, tokenType, amount);

    /// <summary>Remove tokens from a card.</summary>
    public static GameEvent RemoveToken(Guid cardInstanceId, string tokenType, int amount = 1) =>
        new TokenRemovedEvent(cardInstanceId, tokenType, amount);

    // ── Cancel ────────────────────────────────────────────────────────────────

    /// <summary>Cancel an ability (for interrupts).</summary>
    public static GameEvent Cancel(Guid sourceCardId, string abilityId, string reason = "") =>
        new AbilityCancelledEvent(sourceCardId, abilityId, reason);

    // ── Log ───────────────────────────────────────────────────────────────────

    /// <summary>Emit a log message.</summary>
    public static GameEvent Log(string message) => new GameMessageEvent(message);

    // ── Composite patterns ────────────────────────────────────────────────────

    /// <summary>
    /// "Kneel self to do something" — the most common action pattern.
    /// Returns a list starting with the kneel event, followed by the inner effects.
    /// </summary>
    public static IReadOnlyList<GameEvent> KneelSelfThen(AbilityContext ctx, params GameEvent[] innerEffects)
    {
        var events = new List<GameEvent>(innerEffects.Length + 1);
        events.Add(Kneel(ctx.Source.InstanceId, ctx.Source.CardCode));
        events.AddRange(innerEffects);
        return events;
    }

    /// <summary>
    /// "Kneel faction card to do something" — common Targaryen pattern.
    /// </summary>
    public static IReadOnlyList<GameEvent> KneelFactionThen(AbilityContext ctx, params GameEvent[] innerEffects)
    {
        var events = new List<GameEvent>(innerEffects.Length + 1);
        events.Add(KneelFaction(ctx));
        events.AddRange(innerEffects);
        return events;
    }

    // ── Condition helpers ─────────────────────────────────────────────────────

    /// <summary>True if the source card is not kneeled (for "kneel self" actions).</summary>
    public static bool SourceIsStanding(AbilityContext ctx) => !ctx.Source.Kneeled;

    /// <summary>True if the controlling player's faction card is not kneeled.</summary>
    public static bool FactionIsStanding(AbilityContext ctx)
    {
        var player = ctx.State.GetPlayer(ctx.ControllingPlayerId);
        return !player.Faction.Kneeled;
    }

    /// <summary>True if the controlling player has at least N gold.</summary>
    public static bool HasGold(AbilityContext ctx, int amount)
    {
        var player = ctx.State.GetPlayer(ctx.ControllingPlayerId);
        return player.Gold >= amount;
    }

    /// <summary>True if the current phase is Challenges and a challenge is active.</summary>
    public static bool DuringChallenge(AbilityContext ctx) =>
        ctx.State.Phase == GamePhase.Challenges && ctx.State.ActiveChallenge != null;

    /// <summary>True if the source card is participating in the current challenge (as attacker or defender).</summary>
    public static bool SourceIsParticipating(AbilityContext ctx)
    {
        var challenge = ctx.State.ActiveChallenge;
        if (challenge == null) return false;
        return challenge.Attackers.Contains(ctx.Source.InstanceId) ||
               challenge.Defenders.Contains(ctx.Source.InstanceId);
    }

    /// <summary>True if the controlling player is the attacker in the current challenge.</summary>
    public static bool ControllerIsAttacker(AbilityContext ctx) =>
        ctx.State.ActiveChallenge?.AttackingPlayerId == ctx.ControllingPlayerId;

    /// <summary>True if the controlling player is the defender in the current challenge.</summary>
    public static bool ControllerIsDefender(AbilityContext ctx) =>
        ctx.State.ActiveChallenge?.DefendingPlayerId == ctx.ControllingPlayerId;

    /// <summary>True if the controlling player won the most recent challenge.</summary>
    public static bool ControllerWonChallenge(AbilityContext ctx, ChallengeResultDeterminedEvent result) =>
        result.WinnerId == ctx.ControllingPlayerId;
}
