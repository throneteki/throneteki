using System.Collections.Immutable;
using System.Linq;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.GameEngine;
using Throneteki.GameEngine.Keywords;
using Xunit;

namespace Throneteki.Domain.Tests.Engine;

public class KeywordResolutionTests
{
    private readonly IGameStateProjector _projector = new GameStateProjector();

    // ── Renown ────────────────────────────────────────────────────────────────

    [Fact]
    public void Renown_WinningAttacker_GainsPowerOnCard()
    {
        var state = CreateChallengeWon(ChallengeIcon.Military, attackerWins: true, unopposed: false);
        var attacker = state.ActiveChallenge!.Attackers[0];

        var events = KeywordResolver.ResolvePostChallenge(state,
            new ChallengeResultDeterminedEvent(state.ActiveChallenge.AttackingPlayerId, false, 5, 2),
            ImmutableHashSet.Create(Keyword.Renown),
            ImmutableHashSet<Keyword>.Empty);

        Assert.Contains(events, e => e is PowerGainedEvent pg
            && pg.TargetId == attacker
            && pg.TargetType == PowerTargetType.Card
            && pg.Amount == 1);
    }

    [Fact]
    public void Renown_LosingAttacker_GainsNoPower()
    {
        var state = CreateChallengeWon(ChallengeIcon.Military, attackerWins: false, unopposed: false);

        var events = KeywordResolver.ResolvePostChallenge(state,
            new ChallengeResultDeterminedEvent(state.ActiveChallenge!.DefendingPlayerId, false, 5, 2),
            ImmutableHashSet.Create(Keyword.Renown),
            ImmutableHashSet<Keyword>.Empty);

        Assert.DoesNotContain(events, e => e is PowerGainedEvent pg
            && pg.TargetType == PowerTargetType.Card);
    }

    // ── Insight ───────────────────────────────────────────────────────────────

    [Fact]
    public void Insight_WinningAttacker_DrawsCard()
    {
        var state = CreateChallengeWon(ChallengeIcon.Intrigue, attackerWins: true, unopposed: false);

        var events = KeywordResolver.ResolvePostChallenge(state,
            new ChallengeResultDeterminedEvent(state.ActiveChallenge!.AttackingPlayerId, false, 4, 2),
            ImmutableHashSet.Create(Keyword.Insight),
            ImmutableHashSet<Keyword>.Empty);

        Assert.Contains(events, e => e is CardDrawnEvent cd
            && cd.PlayerId == state.ActiveChallenge.AttackingPlayerId);
    }

    // ── Intimidate ────────────────────────────────────────────────────────────

    [Fact]
    public void Intimidate_WinningAttacker_KneelsDefenderCard()
    {
        var state = CreateChallengeWon(ChallengeIcon.Power, attackerWins: true, unopposed: false);
        var defender = state.Players.First(p => !p.IsFirstPlayer);
        var defenderCard = defender.CardsInPlay.FirstOrDefault();

        // Only triggers if there's a standing character to kneel
        if (defenderCard == null) return;

        var events = KeywordResolver.ResolvePostChallenge(state,
            new ChallengeResultDeterminedEvent(state.ActiveChallenge!.AttackingPlayerId, false, 4, 2),
            ImmutableHashSet.Create(Keyword.Intimidate),
            ImmutableHashSet<Keyword>.Empty);

        Assert.Contains(events, e => e is CardKneeledEvent);
    }

    // ── Pillage ───────────────────────────────────────────────────────────────

    [Fact]
    public void Pillage_WinningAttacker_DiscardFromOpponentDeck()
    {
        var state = CreateChallengeWon(ChallengeIcon.Military, attackerWins: true, unopposed: false);

        var events = KeywordResolver.ResolvePostChallenge(state,
            new ChallengeResultDeterminedEvent(state.ActiveChallenge!.AttackingPlayerId, false, 4, 2),
            ImmutableHashSet.Create(Keyword.Pillage),
            ImmutableHashSet<Keyword>.Empty);

        Assert.Contains(events, e => e is CardDiscardedEvent);
    }

    // ── Claim resolution ──────────────────────────────────────────────────────

    [Fact]
    public void MilitaryClaim_KillsDefenderCharacters()
    {
        var state = CreateChallengeWon(ChallengeIcon.Military, attackerWins: true, unopposed: false);

        var events = ClaimResolver.ResolveClaim(state, ChallengeIcon.Military, claimValue: 1);

        Assert.Contains(events, e => e is CardKilledEvent);
    }

    [Fact]
    public void IntrigueClaim_DiscardsFromDefenderHand()
    {
        var state = CreateChallengeWon(ChallengeIcon.Intrigue, attackerWins: true, unopposed: false);

        var events = ClaimResolver.ResolveClaim(state, ChallengeIcon.Intrigue, claimValue: 1);

        Assert.Contains(events, e => e is CardDiscardedEvent cd
            && cd.FromLocation == CardLocation.Hand);
    }

    [Fact]
    public void PowerClaim_MovesPowerFromDefender()
    {
        var state = CreateChallengeWon(ChallengeIcon.Power, attackerWins: true, unopposed: false);

        var events = ClaimResolver.ResolveClaim(state, ChallengeIcon.Power, claimValue: 1);

        // Power claim: lose 1 power on faction, attacker gains 1
        Assert.Contains(events, e => e is PowerLostEvent);
        Assert.Contains(events, e => e is PowerGainedEvent);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private static GameState CreateChallengeWon(ChallengeIcon type, bool attackerWins, bool unopposed)
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p
                .AsFirstPlayer()
                .WithGold(3)
                .WithFactionPower(2)
                .WithDrawDeck("d1", "d2")
                .InPlay("01141")) // Arya
            .WithPlayer("p2", p => p
                .WithGold(2)
                .WithFactionPower(3)
                .WithHand("h1", "h2")
                .WithDrawDeck("d3", "d4")
                .InPlay("01089")) // Tyrion
            .Build();

        var p1 = state.Players[0];
        var p2 = state.Players[1];
        var attackerId = attackerWins ? p1.PlayerId : p2.PlayerId;
        var defenderId = attackerWins ? p2.PlayerId : p1.PlayerId;
        var attacker = attackerWins ? p1 : p2;
        var defender = attackerWins ? p2 : p1;

        return state with
        {
            ActiveChallenge = new ChallengeState
            {
                Type = type,
                AttackingPlayerId = attackerId,
                DefendingPlayerId = defenderId,
                Attackers = attacker.CardsInPlay.Select(c => c.InstanceId).ToImmutableList(),
                Defenders = unopposed
                    ? ImmutableList<Guid>.Empty
                    : defender.CardsInPlay.Select(c => c.InstanceId).ToImmutableList(),
                AttackersDeclared = true,
                DefendersDeclared = true,
            }
        };
    }
}
