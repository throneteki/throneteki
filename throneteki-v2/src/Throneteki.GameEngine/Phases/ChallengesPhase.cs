using System.Collections.Immutable;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.GameEngine.Keywords;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Challenges Phase:
///   1. Enter: prompt first player to initiate a challenge or pass.
///   2. InitiateChallenge: creates ChallengeState; prompts attacker to declare attackers.
///   3. DeclareAttackers: records attackers; prompts defender to declare defenders.
///   4. DeclareDefenders: records defenders; automatically resolves the challenge.
///   5. Resolve: determines winner, applies unopposed power, emits ClaimApplied.
///   6. PassChallenges: player ends their challenge turn; once both pass → Dominance.
/// </summary>
public sealed class ChallengesPhase
{
    private readonly ICardCatalog? _catalog;

    public ChallengesPhase(ICardCatalog? catalog = null) => _catalog = catalog;

    // ── Enter ─────────────────────────────────────────────────────────────────

    public IReadOnlyList<GameEvent> Enter(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Challenges) { SequenceNumber = seq++ });

        var first = state.Players.FirstOrDefault(p => p.IsFirstPlayer) ?? state.Players[0];
        events.Add(ChallengePrompt(first, seq++));

        return events;
    }

    // ── Initiate a challenge ──────────────────────────────────────────────────

    public (bool IsValid, string? Error, IReadOnlyList<GameEvent> Events) InitiateChallenge(
        GameState state, InitiateChallengeCommand command)
    {
        var attacker = state.GetPlayer(command.PlayerId);
        if (!attacker.Challenges.CanInitiate(command.ChallengeType))
            return (false, $"Cannot initiate another {command.ChallengeType} challenge.", Array.Empty<GameEvent>());

        var events = new List<GameEvent>();
        int seq = state.Version + 1;
        int challengeNumber = ChallengesCompletedThisRound(state) + 1;

        events.Add(new ChallengeInitiatedEvent(command.ChallengeType, command.PlayerId, command.DefendingPlayerId, challengeNumber)
            { SequenceNumber = seq++ });

        // Prompt the attacker to declare attackers
        events.Add(new PromptIssuedEvent(command.PlayerId, new PromptState
        {
            PromptId = Guid.NewGuid().ToString(),
            ActivePlayerId = command.PlayerId,
            Title = $"Declare {command.ChallengeType} attackers",
            PromptType = PromptType.MultiSelectCard,
            SelectableCardIds = attacker.CardsInPlay
                .Where(c => !c.Kneeled)
                .Select(c => c.InstanceId)
                .ToImmutableList(),
        })
        { SequenceNumber = seq++ });

        return (true, null, events);
    }

    // ── Declare attackers ─────────────────────────────────────────────────────

    public (bool IsValid, string? Error, IReadOnlyList<GameEvent> Events) DeclareAttackers(
        GameState state, DeclareAttackersCommand command)
    {
        if (state.ActiveChallenge == null)
            return (false, "No active challenge.", Array.Empty<GameEvent>());

        var defender = state.GetPlayer(state.ActiveChallenge.DefendingPlayerId);
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new AttackersDeclaredEvent(command.AttackerIds) { SequenceNumber = seq++ });

        // Prompt the defender to declare defenders
        events.Add(new PromptIssuedEvent(state.ActiveChallenge.DefendingPlayerId, new PromptState
        {
            PromptId = Guid.NewGuid().ToString(),
            ActivePlayerId = state.ActiveChallenge.DefendingPlayerId,
            Title = $"Declare {state.ActiveChallenge.Type} defenders",
            PromptType = PromptType.MultiSelectCard,
            SelectableCardIds = defender.CardsInPlay
                .Where(c => !c.Kneeled)
                .Select(c => c.InstanceId)
                .ToImmutableList(),
        })
        { SequenceNumber = seq++ });

        return (true, null, events);
    }

    // ── Declare defenders ─────────────────────────────────────────────────────

    public (bool IsValid, string? Error, IReadOnlyList<GameEvent> Events) DeclareDefenders(
        GameState state, DeclareDefendersCommand command)
    {
        if (state.ActiveChallenge == null)
            return (false, "No active challenge.", Array.Empty<GameEvent>());

        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new DefendersDeclaredEvent(command.DefenderIds) { SequenceNumber = seq++ });

        // Prompt the attacker to resolve (DoneCommand will trigger resolution)
        var attacker = state.GetPlayer(state.ActiveChallenge.AttackingPlayerId);
        events.Add(new PromptIssuedEvent(attacker.PlayerId, new PromptState
        {
            PromptId = Guid.NewGuid().ToString(),
            ActivePlayerId = attacker.PlayerId,
            Title = "Resolve challenge",
            PromptType = PromptType.MenuChoice,
            Buttons = ImmutableList.Create(new PromptButton("resolve", "Resolve")),
        })
        { SequenceNumber = seq++ });

        return (true, null, events);
    }

    // ── Resolve (DoneCommand from attacker) ───────────────────────────────────

    public (bool IsValid, string? Error, IReadOnlyList<GameEvent> Events) Resolve(
        GameState state, DoneCommand command)
    {
        if (state.ActiveChallenge == null)
            return (false, "No active challenge to resolve.", Array.Empty<GameEvent>());

        var challenge = state.ActiveChallenge;
        if (command.PlayerId != challenge.AttackingPlayerId)
            return (false, "Only the attacker may resolve.", Array.Empty<GameEvent>());

        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        // Compute strengths
        int attackStr = ComputeStrength(state, challenge.Attackers, challenge.Type);
        int defStr = ComputeStrength(state, challenge.Defenders, challenge.Type);

        // Rules: Attacker wins ties (attacker STR >= defender STR).
        // Exception: if attacker STR is 0, there is no winner.
        bool unopposed = challenge.Defenders.Count == 0;
        bool attackerWins = attackStr > 0 && attackStr >= defStr;
        bool defenderWins = !attackerWins && defStr > attackStr;
        Guid? winnerId = attackerWins ? challenge.AttackingPlayerId
            : defenderWins ? challenge.DefendingPlayerId
            : (Guid?)null;
        int winStr = attackerWins ? attackStr : defStr;
        int loseStr = attackerWins ? defStr : attackStr;

        events.Add(new ChallengeResultDeterminedEvent(winnerId, unopposed, winStr, loseStr)
            { SequenceNumber = seq++ });

        if (attackerWins && unopposed)
        {
            events.Add(new PowerGainedEvent(challenge.AttackingPlayerId, PowerTargetType.Player, 1, "Unopposed challenge")
                { SequenceNumber = seq++ });
        }

        // Resolve keywords (Renown, Insight, Intimidate, Pillage)
        var resultEvent = new ChallengeResultDeterminedEvent(winnerId, unopposed, winStr, loseStr);
        var attackerKw = GatherKeywords(state, challenge.Attackers);
        var defenderKw = GatherKeywords(state, challenge.Defenders);
        var keywordEvents = KeywordResolver.ResolvePostChallenge(state, resultEvent, attackerKw, defenderKw);
        events.AddRange(keywordEvents);

        // Resolve claim (Military kills, Intrigue discards, Power moves)
        if (attackerWins)
        {
            int claimValue = GetClaimValue(state, challenge.AttackingPlayerId);
            var claimEvents = ClaimResolver.ResolveClaim(state, challenge.Type, claimValue);
            events.AddRange(claimEvents);
        }

        // Kneel attackers
        foreach (var cardId in challenge.Attackers)
            events.Add(new CardKneeledEvent(cardId, "Attacked") { SequenceNumber = seq++ });

        var attacker = state.GetPlayer(challenge.AttackingPlayerId);
        events.Add(ChallengePrompt(attacker, seq++));

        return (true, null, events);
    }

    // ── Pass challenges ───────────────────────────────────────────────────────

    public IReadOnlyList<GameEvent> Pass(GameState state, PassChallengesCommand command)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new ChallengePassedEvent(command.PlayerId) { SequenceNumber = seq++ });

        var otherPlayer = state.Players.FirstOrDefault(p => p.PlayerId != command.PlayerId);
        bool otherPassed = otherPlayer?.PassedChallenges == true;

        if (otherPassed)
        {
            events.Add(new PhaseStartedEvent(GamePhase.Dominance) { SequenceNumber = seq++ });
        }
        else if (otherPlayer != null)
        {
            // Prompt the other player to initiate or pass
            events.Add(ChallengePrompt(otherPlayer, seq++));
        }

        return events;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private int ComputeStrength(GameState state, ImmutableList<Guid> cardIds, ChallengeIcon type)
    {
        int total = 0;
        foreach (var id in cardIds)
        {
            var card = state.FindCard(id);
            if (card == null) continue;
            var def = _catalog?.TryGet(card.CardCode);
            total += def?.PrintedStrength ?? 0;
        }
        return total;
    }

    private static int ChallengesCompletedThisRound(GameState state) =>
        state.ActiveChallenge?.ChallengeNumber ?? 0;

    private ImmutableHashSet<Keyword> GatherKeywords(GameState state, ImmutableList<Guid> cardIds)
    {
        var keywords = ImmutableHashSet.CreateBuilder<Keyword>();
        foreach (var id in cardIds)
        {
            var card = state.FindCard(id);
            if (card == null) continue;
            var def = _catalog?.TryGet(card.CardCode);
            if (def?.Keywords != null)
                foreach (var kw in def.Keywords)
                    keywords.Add(kw);
        }
        return keywords.ToImmutable();
    }

    private int GetClaimValue(GameState state, Guid attackerId)
    {
        var attacker = state.GetPlayer(attackerId);
        if (attacker.ActivePlot == null) return 1;
        var plotDef = _catalog?.TryGet(attacker.ActivePlot.CardCode);
        return plotDef?.Claim ?? 1;
    }

    private static PromptIssuedEvent ChallengePrompt(PlayerState player, int seq) =>
        new PromptIssuedEvent(player.PlayerId, new PromptState
        {
            PromptId = Guid.NewGuid().ToString(),
            ActivePlayerId = player.PlayerId,
            Title = "Initiate a challenge",
            PromptType = PromptType.MenuChoice,
            Buttons = ImmutableList.Create(
                new PromptButton("military", "Military"),
                new PromptButton("intrigue", "Intrigue"),
                new PromptButton("power", "Power"),
                new PromptButton("pass", "Pass")),
        })
        { SequenceNumber = seq };
}
