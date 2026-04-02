using System.Linq;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.Domain.Interfaces;
using Throneteki.GameEngine;
using Xunit;

namespace Throneteki.Domain.Tests.Engine;

public class DrawPhaseTests
{
    private readonly IGameEngine _engine = new GameEngine.GameEngine();
    private readonly IGameStateProjector _projector = new GameStateProjector();

    [Fact]
    public void DrawPhase_BothPlayersDrawTwoCards_FromNonEmptyDeck()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Draw)
            .WithPlayer("p1", p => p.WithDrawDeck("01001", "01002", "01003", "01004"))
            .WithPlayer("p2", p => p.WithDrawDeck("01005", "01006", "01007", "01008"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.True(result.IsValid);
        var drawEvents = result.Events.OfType<CardDrawnEvent>().ToList();
        Assert.Equal(4, drawEvents.Count);

        var p1 = state.Players[0];
        var p2 = state.Players[1];
        Assert.Equal(2, drawEvents.Count(e => e.PlayerId == p1.PlayerId));
        Assert.Equal(2, drawEvents.Count(e => e.PlayerId == p2.PlayerId));
    }

    [Fact]
    public void DrawPhase_DrawCards_TakenFromTopOfDeck()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Draw)
            .WithPlayer("p1", p => p.WithDrawDeck("card-top", "card-2", "card-3"))
            .WithPlayer("p2", p => p.WithDrawDeck("card-A", "card-B", "card-C"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        var p1 = state.Players[0];
        var topTwo = p1.DrawDeck.Take(2).Select(c => c.InstanceId).ToHashSet();
        var drawnCardIds = result.Events.OfType<CardDrawnEvent>()
            .Where(e => e.PlayerId == p1.PlayerId)
            .Select(e => e.CardInstanceId)
            .ToHashSet();

        Assert.Equal(topTwo, drawnCardIds);
    }

    [Fact]
    public void DrawPhase_WhenDeckHasOnlyOneCard_DrawsOne()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Draw)
            .WithPlayer("p1", p => p.WithDrawDeck("01001"))   // Only 1 card
            .WithPlayer("p2", p => p.WithDrawDeck("01005", "01006"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        var p1 = state.Players[0];
        var p1Draws = result.Events.OfType<CardDrawnEvent>().Count(e => e.PlayerId == p1.PlayerId);
        Assert.Equal(1, p1Draws);  // Can only draw 1 (empty deck)
    }

    [Fact]
    public void DrawPhase_WhenDeckIsEmpty_DrawsZero()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Draw)
            .WithPlayer("p1")  // No draw deck
            .WithPlayer("p2", p => p.WithDrawDeck("01005", "01006"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        var p1 = state.Players[0];
        var p1Draws = result.Events.OfType<CardDrawnEvent>().Count(e => e.PlayerId == p1.PlayerId);
        Assert.Equal(0, p1Draws);
    }

    [Fact]
    public void DrawPhase_AdvancesToMarshallingPhase()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Draw)
            .WithPlayer("p1", p => p.WithDrawDeck("01001", "01002"))
            .WithPlayer("p2", p => p.WithDrawDeck("01005", "01006"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());

        Assert.Contains(result.Events, e => e is PhaseStartedEvent { Phase: GamePhase.Marshalling });
    }

    [Fact]
    public void DrawPhase_AfterApplyingEvents_PlayerHand_IncreasesBy2()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Draw)
            .WithPlayer("p1", p => p
                .WithHand("01100", "01101")  // 2 cards already in hand
                .WithDrawDeck("01001", "01002", "01003"))
            .WithPlayer("p2", p => p.WithDrawDeck("01005", "01006"))
            .Build();

        var result = _engine.Process(state, new SystemAdvanceCommand());
        var finalState = _projector.Rebuild(state, result.Events);

        var p1 = finalState.GetPlayer(state.Players[0].PlayerId);
        Assert.Equal(4, p1.Hand.Count);  // 2 original + 2 drawn
    }
}
