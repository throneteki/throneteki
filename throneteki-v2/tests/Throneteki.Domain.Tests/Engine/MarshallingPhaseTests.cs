using System.Linq;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.GameEngine;
using Xunit;

namespace Throneteki.Domain.Tests.Engine;

public class MarshallingPhaseTests
{
    private readonly IGameEngine _engine = new GameEngine.GameEngine(TestCardCatalog.Standard());
    private readonly IGameStateProjector _projector = new GameStateProjector();

    // ── Entering the phase ────────────────────────────────────────────────────

    [Fact]
    public void MarshallingPhase_Enter_CollectsIncome()
    {
        // plot 01001 has income 5; use a card with a known income value
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1", p => p.WithActivePlot("01001"))  // income = 5
            .WithPlayer("p2", p => p.WithActivePlot("01002"))  // income = 3
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        // Each player should gain gold from their plot's income
        Assert.Contains(result.Events, e => e is GoldGainedEvent g && g.PlayerId == state.Players[0].PlayerId);
        Assert.Contains(result.Events, e => e is GoldGainedEvent g && g.PlayerId == state.Players[1].PlayerId);
    }

    [Fact]
    public void MarshallingPhase_Enter_EmitsPromptToFirstPlayer()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithActivePlot("01001"))
            .WithPlayer("p2", p => p.WithActivePlot("01002"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        var prompts = result.Events.OfType<PromptIssuedEvent>().ToList();
        // First player gets the active marshal prompt
        var p1 = state.Players.First(p => p.IsFirstPlayer);
        Assert.Contains(prompts, pr => pr.PlayerId == p1.PlayerId);
    }

    // ── Marshalling a card ────────────────────────────────────────────────────

    [Fact]
    public void MarshallingPhase_MarshalCard_MovesCardToPlay()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithGold(5).WithHand("01141").WithActivePlot("01001"))
            .WithPlayer("p2", p => p.WithActivePlot("01002"))
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.GetPlayer(state.Players[0].PlayerId);
        var cardId = p1.Hand[0].InstanceId;

        var result = _engine.Process(s1, new MarshalCardCommand(cardId)
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.True(result.IsValid);
        Assert.Contains(result.Events, e => e is CardMarshalledEvent m && m.CardInstanceId == cardId);
    }

    [Fact]
    public void MarshallingPhase_MarshalCard_DeductsGoldCost()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithGold(5).WithHand("01141").WithActivePlot("01001"))
            .WithPlayer("p2", p => p.WithActivePlot("01002"))
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.GetPlayer(state.Players[0].PlayerId);
        var cardId = p1.Hand[0].InstanceId;

        var r1 = _engine.Process(s1, new MarshalCardCommand(cardId)
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.Contains(r1.Events, e => e is GoldSpentEvent gs && gs.PlayerId == p1.PlayerId && gs.Amount > 0);
    }

    [Fact]
    public void MarshallingPhase_CannotMarshalCardWithoutGold()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithGold(0).WithHand("01141").WithActivePlot("01001"))
            .WithPlayer("p2", p => p.WithActivePlot("01002"))
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.GetPlayer(state.Players[0].PlayerId);
        var cardId = p1.Hand[0].InstanceId;

        // Override gold to 0 post-income; use state where gold is truly 0
        var poorState = s1.UpdatePlayer(p1.PlayerId, p => p with { Gold = 0 });

        var result = _engine.Process(poorState, new MarshalCardCommand(cardId)
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.False(result.IsValid);
    }

    // ── Done marshalling ──────────────────────────────────────────────────────

    [Fact]
    public void MarshallingPhase_FirstPlayerDone_PromptSecondPlayer()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithActivePlot("01001"))
            .WithPlayer("p2", p => p.WithActivePlot("01002"))
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);

        var doneResult = _engine.Process(s1, new ClaimMarshallingDoneCommand
        {
            GameId = state.GameId,
            PlayerId = p1.PlayerId,
        });

        Assert.True(doneResult.IsValid);
        Assert.Contains(doneResult.Events.OfType<PromptIssuedEvent>(), pr => pr.PlayerId == p2.PlayerId);
    }

    [Fact]
    public void MarshallingPhase_BothPlayersDone_AdvancesToChallengesPhase()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1", p => p.AsFirstPlayer().WithActivePlot("01001"))
            .WithPlayer("p2", p => p.WithActivePlot("01002"))
            .Build();

        var s1 = _projector.Rebuild(state, _engine.Process(state, new SystemAdvanceCommand()).Events);
        var p1 = s1.Players.First(p => p.IsFirstPlayer);
        var p2 = s1.Players.First(p => !p.IsFirstPlayer);

        var r1 = _engine.Process(s1, new ClaimMarshallingDoneCommand { GameId = state.GameId, PlayerId = p1.PlayerId });
        var s2 = _projector.Rebuild(s1, r1.Events);

        var r2 = _engine.Process(s2, new ClaimMarshallingDoneCommand { GameId = state.GameId, PlayerId = p2.PlayerId });

        Assert.True(r2.IsValid);
        Assert.Contains(r2.Events, e => e is PhaseStartedEvent { Phase: GamePhase.Challenges });
    }
}
