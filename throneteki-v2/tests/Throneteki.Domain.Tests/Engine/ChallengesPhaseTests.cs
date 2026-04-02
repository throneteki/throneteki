using System.Collections.Immutable;
using System.Linq;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.GameEngine;
using Xunit;

namespace Throneteki.Domain.Tests.Engine;

public class ChallengesPhaseTests
{
    private readonly IGameEngine _engine = new GameEngine.GameEngine(TestCardCatalog.Standard());
    private readonly IGameStateProjector _projector = new GameStateProjector();

    // ── Entering the phase ────────────────────────────────────────────────────

    [Fact]
    public void ChallengesPhase_Enter_EmitsPromptToFirstPlayer()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer())
            .WithPlayer("p2")
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        var firstPlayerId = state.Players.First(p => p.IsFirstPlayer).PlayerId;
        Assert.Contains(result.Events.OfType<PromptIssuedEvent>(), pr => pr.PlayerId == firstPlayerId);
    }

    // ── Initiating a challenge ────────────────────────────────────────────────

    [Fact]
    public void ChallengesPhase_InitiateChallenge_EmitsChallengeInitiatedEvent()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer()
                .InPlay("01141"))   // Arya Stark
            .WithPlayer("p2")
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);

        var result = _engine.Process(s1, new InitiateChallengeCommand(ChallengeIcon.Military, p2.PlayerId)
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.True(result.IsValid);
        Assert.Contains(result.Events, e => e is ChallengeInitiatedEvent ci &&
            ci.AttackingPlayerId == p1.PlayerId &&
            ci.DefendingPlayerId == p2.PlayerId &&
            ci.ChallengeType == ChallengeIcon.Military);
    }

    [Fact]
    public void ChallengesPhase_DeclareAttackers_EmitsAttackersDeclaredEvent()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01141"))
            .WithPlayer("p2")
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);
        var arya = p1.CardsInPlay[0];

        // Initiate challenge
        var r1 = _engine.Process(s1, new InitiateChallengeCommand(ChallengeIcon.Military, p2.PlayerId)
            { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);

        // Declare attacker
        var r2 = _engine.Process(s2, new DeclareAttackersCommand(ImmutableList.Create(arya.InstanceId))
            { GameId = state.GameId, PlayerId = p1.PlayerId });

        Assert.True(r2.IsValid);
        Assert.Contains(r2.Events, e => e is AttackersDeclaredEvent ad && ad.AttackerCardIds.Contains(arya.InstanceId));
    }

    [Fact]
    public void ChallengesPhase_DeclareDefenders_EmitsDefendersDeclaredEvent()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01141"))
            .WithPlayer("p2", p => p.InPlay("01089"))  // Tyrion
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);
        var arya = p1.CardsInPlay[0];
        var tyrion = p2.CardsInPlay[0];

        var r1 = _engine.Process(s1, new InitiateChallengeCommand(ChallengeIcon.Military, p2.PlayerId)
            { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);

        var r2 = _engine.Process(s2, new DeclareAttackersCommand(ImmutableList.Create(arya.InstanceId))
            { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s3 = _projector.Rebuild(s2, r2.Events);

        var r3 = _engine.Process(s3, new DeclareDefendersCommand(ImmutableList.Create(tyrion.InstanceId))
            { GameId = state.GameId, PlayerId = p2.PlayerId });

        Assert.True(r3.IsValid);
        Assert.Contains(r3.Events, e => e is DefendersDeclaredEvent dd && dd.DefenderCardIds.Contains(tyrion.InstanceId));
    }

    // ── Challenge resolution ──────────────────────────────────────────────────

    [Fact]
    public void ChallengesPhase_Resolve_AttackerWins_EmitsChallengeResultEvent()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01089"))  // Tyrion (str 4)
            .WithPlayer("p2", p => p.InPlay("01141"))                  // Arya (str 2)
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);
        var tyrion = p1.CardsInPlay[0];
        var arya = p2.CardsInPlay[0];

        var s2 = RunToDefenders(s1, p1, p2, tyrion.InstanceId, arya.InstanceId,
            ChallengeIcon.Intrigue);

        // Resolve the challenge (DoneCommand)
        var resolveResult = _engine.Process(s2, new DoneCommand
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.True(resolveResult.IsValid);
        Assert.Contains(resolveResult.Events, e => e is ChallengeResultDeterminedEvent r && r.WinnerId == p1.PlayerId);
    }

    [Fact]
    public void ChallengesPhase_Resolve_Unopposed_AttackerGainsPower()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01141"))  // Arya
            .WithPlayer("p2")
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);
        var arya = p1.CardsInPlay[0];

        // Initiate + declare attacker
        var r1 = _engine.Process(s1, new InitiateChallengeCommand(ChallengeIcon.Military, p2.PlayerId)
            { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);

        var r2 = _engine.Process(s2, new DeclareAttackersCommand(ImmutableList.Create(arya.InstanceId))
            { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s3 = _projector.Rebuild(s2, r2.Events);

        // No defenders declared (p2 passes)
        var r3 = _engine.Process(s3, new DeclareDefendersCommand(ImmutableList<Guid>.Empty)
            { GameId = state.GameId, PlayerId = p2.PlayerId });
        var s4 = _projector.Rebuild(s3, r3.Events);

        // Resolve
        var resolveResult = _engine.Process(s4, new DoneCommand
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.True(resolveResult.IsValid);
        // Attacker wins unopposed — gains 1 power on faction card
        Assert.Contains(resolveResult.Events, e =>
            e is PowerGainedEvent pg && pg.TargetId == p1.PlayerId && pg.Amount == 1);
    }

    // ── Passing challenges ────────────────────────────────────────────────────

    [Fact]
    public void ChallengesPhase_BothPlayersPass_AdvancesToDominance()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer())
            .WithPlayer("p2")
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);

        var r1 = _engine.Process(s1, new PassChallengesCommand { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);

        var r2 = _engine.Process(s2, new PassChallengesCommand { GameId = state.GameId, PlayerId = p2.PlayerId });

        Assert.True(r2.IsValid);
        Assert.Contains(r2.Events, e => e is PhaseStartedEvent { Phase: GamePhase.Dominance });
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private GameState RunToDefenders(
        GameState state, PlayerState attacker, PlayerState defender,
        Guid attackerCardId, Guid defenderCardId, ChallengeIcon type)
    {
        var r1 = _engine.Process(state, new InitiateChallengeCommand(type, defender.PlayerId)
            { GameId = state.GameId, PlayerId = attacker.PlayerId });
        var s2 = _projector.Rebuild(state, r1.Events);

        var r2 = _engine.Process(s2, new DeclareAttackersCommand(ImmutableList.Create(attackerCardId))
            { GameId = state.GameId, PlayerId = attacker.PlayerId });
        var s3 = _projector.Rebuild(s2, r2.Events);

        var r3 = _engine.Process(s3, new DeclareDefendersCommand(ImmutableList.Create(defenderCardId))
            { GameId = state.GameId, PlayerId = defender.PlayerId });
        return _projector.Rebuild(s3, r3.Events);
    }
}
