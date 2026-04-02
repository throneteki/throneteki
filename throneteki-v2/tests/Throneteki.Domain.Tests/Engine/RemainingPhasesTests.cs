using System.Linq;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.GameEngine;
using Xunit;

namespace Throneteki.Domain.Tests.Engine;

/// <summary>
/// Tests for Dominance, Standing, and Taxation phases.
/// All three are automated (no player decisions) and feed into the next phase/round.
/// </summary>
public class RemainingPhasesTests
{
    private readonly IGameEngine _engine = new GameEngine.GameEngine(TestCardCatalog.Standard());
    private readonly IGameStateProjector _projector = new GameStateProjector();

    // ── Dominance ─────────────────────────────────────────────────────────────

    [Fact]
    public void DominancePhase_HigherGoldWins_EmitsDominanceWonEvent()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Dominance)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithGold(3))
            .WithPlayer("p2", p => p.WithGold(1))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        var p1 = state.Players[0];
        Assert.Contains(result.Events, e => e is DominanceWonEvent dw && dw.PlayerId == p1.PlayerId);
    }

    [Fact]
    public void DominancePhase_EqualGold_EmitsDominanceTiedEvent()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Dominance)
            .WithPlayer("p1", p => p.WithGold(2))
            .WithPlayer("p2", p => p.WithGold(2))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        Assert.Contains(result.Events, e => e is DominanceTiedEvent);
    }

    [Fact]
    public void DominancePhase_Winner_GainsOnePower()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Dominance)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithGold(5))
            .WithPlayer("p2", p => p.WithGold(1))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        var p1 = state.Players[0];
        Assert.Contains(result.Events, e =>
            e is PowerGainedEvent pg && pg.TargetId == p1.PlayerId && pg.Amount == 1);
    }

    [Fact]
    public void DominancePhase_AdvancesToStanding()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Dominance)
            .WithPlayer("p1", p => p.WithGold(2))
            .WithPlayer("p2", p => p.WithGold(1))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.Contains(result.Events, e => e is PhaseStartedEvent { Phase: GamePhase.Standing });
    }

    // ── Standing ──────────────────────────────────────────────────────────────

    [Fact]
    public void StandingPhase_KneelAllCards()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Standing)
            .WithPlayer("p1", p => p.InPlay("01141", c => c.Kneeled()))
            .WithPlayer("p2", p => p.InPlay("01089", c => c.Kneeled()))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        // Both kneeled characters should be stood
        Assert.True(result.Events.OfType<CardStoodEvent>().Count() >= 2);
    }

    [Fact]
    public void StandingPhase_AdvancesToTaxation()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Standing)
            .WithPlayer("p1")
            .WithPlayer("p2")
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.Contains(result.Events, e => e is PhaseStartedEvent { Phase: GamePhase.Taxation });
    }

    // ── Taxation ──────────────────────────────────────────────────────────────

    [Fact]
    public void TaxationPhase_ClearsGold()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Taxation)
            .WithPlayer("p1", p => p.WithGold(4))
            .WithPlayer("p2", p => p.WithGold(2))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());
        var finalState = _projector.Rebuild(state, result.Events);

        Assert.True(result.IsValid);
        Assert.All(finalState.Players, p => Assert.Equal(0, p.Gold));
    }

    [Fact]
    public void TaxationPhase_AdvancesToPlotPhaseNextRound()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Taxation)
            .WithPlayer("p1")
            .WithPlayer("p2")
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.Contains(result.Events, e => e is PhaseStartedEvent { Phase: GamePhase.Plot });
    }
}
