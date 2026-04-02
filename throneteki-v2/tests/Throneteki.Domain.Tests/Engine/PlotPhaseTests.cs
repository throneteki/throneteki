using System.Linq;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.GameEngine;
using Xunit;

namespace Throneteki.Domain.Tests.Engine;

public class PlotPhaseTests
{
    private readonly IGameEngine _engine = new GameEngine.GameEngine();
    private readonly IGameStateProjector _projector = new GameStateProjector();

    // ── Entering the phase ────────────────────────────────────────────────────

    [Fact]
    public void PlotPhase_Enter_EmitsPromptToBothPlayers()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Plot)
            .WithPlayer("p1", p => p.WithPlotDeck("01001", "01002"))
            .WithPlayer("p2", p => p.WithPlotDeck("01003", "01004"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        var prompts = result.Events.OfType<PromptIssuedEvent>().ToList();
        // Both players need to select a plot
        Assert.Equal(2, prompts.Count);
        Assert.Contains(prompts, p => p.PlayerId == state.Players[0].PlayerId);
        Assert.Contains(prompts, p => p.PlayerId == state.Players[1].PlayerId);
    }

    // ── Selecting a plot ──────────────────────────────────────────────────────

    [Fact]
    public void PlotPhase_SelectPlot_RecordsSelection()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Plot)
            .WithPlayer("p1", p => p.WithPlotDeck("01001", "01002"))
            .WithPlayer("p2", p => p.WithPlotDeck("01003", "01004"))
            .Build();

        // Enter phase to issue prompts
        var enterResult = _engine.Process(state, new SystemAdvanceCommand());
        var stateAfterEnter = _projector.Rebuild(state, enterResult.Events);

        var p1 = stateAfterEnter.Players[0];
        var selectedPlotId = p1.PlotDeck[0].InstanceId;

        var selectResult = _engine.Process(stateAfterEnter, new SelectPlotCommand(selectedPlotId)
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.True(selectResult.IsValid);
        Assert.Contains(selectResult.Events, e => e is PlotSelectedEvent s && s.PlayerId == p1.PlayerId);
    }

    [Fact]
    public void PlotPhase_BothPlayersSelect_RevealsPlots()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Plot)
            .WithPlayer("p1", p => p.WithPlotDeck("01001", "01002"))
            .WithPlayer("p2", p => p.WithPlotDeck("01003", "01004"))
            .Build();

        var p1 = state.Players[0];
        var p2 = state.Players[1];

        // Enter phase
        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);

        // p1 selects
        var r1 = _engine.Process(s1, new SelectPlotCommand(s1.GetPlayer(p1.PlayerId).PlotDeck[0].InstanceId)
            { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);

        // p2 selects -- this should trigger revelation
        var r2 = _engine.Process(s2, new SelectPlotCommand(s2.GetPlayer(p2.PlayerId).PlotDeck[0].InstanceId)
            { GameId = state.GameId, PlayerId = p2.PlayerId });

        Assert.Contains(r2.Events, e => e is PlotRevealedEvent rv && rv.PlayerId == p1.PlayerId);
        Assert.Contains(r2.Events, e => e is PlotRevealedEvent rv && rv.PlayerId == p2.PlayerId);
    }

    [Fact]
    public void PlotPhase_AfterReveal_ActivePlotSetOnPlayers()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Plot)
            .WithPlayer("p1", p => p.WithPlotDeck("01001", "01002"))
            .WithPlayer("p2", p => p.WithPlotDeck("01003", "01004"))
            .Build();

        var p1 = state.Players[0];
        var p2 = state.Players[1];

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1PlotId = s1.GetPlayer(p1.PlayerId).PlotDeck[0].InstanceId;
        var p2PlotId = s1.GetPlayer(p2.PlayerId).PlotDeck[0].InstanceId;

        var r1 = _engine.Process(s1, new SelectPlotCommand(p1PlotId) { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);
        var r2 = _engine.Process(s2, new SelectPlotCommand(p2PlotId) { GameId = state.GameId, PlayerId = p2.PlayerId });
        var finalState = _projector.Rebuild(s2, r2.Events);

        Assert.NotNull(finalState.GetPlayer(p1.PlayerId).ActivePlot);
        Assert.Equal(p1PlotId, finalState.GetPlayer(p1.PlayerId).ActivePlot!.InstanceId);
        Assert.NotNull(finalState.GetPlayer(p2.PlayerId).ActivePlot);
    }

    [Fact]
    public void PlotPhase_AfterReveal_AdvancesToDrawPhase()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Plot)
            .WithPlayer("p1", p => p.WithPlotDeck("01001", "01002"))
            .WithPlayer("p2", p => p.WithPlotDeck("01003", "01004"))
            .Build();

        var p1 = state.Players[0];
        var p2 = state.Players[1];

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1PlotId = s1.GetPlayer(p1.PlayerId).PlotDeck[0].InstanceId;
        var p2PlotId = s1.GetPlayer(p2.PlayerId).PlotDeck[0].InstanceId;

        var r1 = _engine.Process(s1, new SelectPlotCommand(p1PlotId) { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);
        var r2 = _engine.Process(s2, new SelectPlotCommand(p2PlotId) { GameId = state.GameId, PlayerId = p2.PlayerId });

        Assert.Contains(r2.Events, e => e is PhaseStartedEvent { Phase: GamePhase.Draw });
    }

    [Fact]
    public void PlotPhase_CannotSelectCardNotInPlotDeck()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Plot)
            .WithPlayer("p1", p => p.WithPlotDeck("01001").WithHand("01141"))
            .WithPlayer("p2", p => p.WithPlotDeck("01003"))
            .Build();

        var p1 = state.Players[0];
        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var handCardId = s1.GetPlayer(p1.PlayerId).Hand[0].InstanceId;

        var result = _engine.Process(s1, new SelectPlotCommand(handCardId)
            { GameId = state.GameId, PlayerId = p1.PlayerId });

        Assert.False(result.IsValid);
    }
}
