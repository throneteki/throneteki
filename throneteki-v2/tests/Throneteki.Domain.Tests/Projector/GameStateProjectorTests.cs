using System.Collections.Immutable;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.Domain.Interfaces;
using Throneteki.GameEngine;
using Xunit;

namespace Throneteki.Domain.Tests.Projector;

public class GameStateProjectorTests
{
    private readonly IGameStateProjector _projector = new GameStateProjector();

    // ── CardDrawnEvent ────────────────────────────────────────────────────────

    [Fact]
    public void CardDrawnEvent_MovesCardFromDrawDeckToHand()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithDrawDeck("01141", "01089"))
            .Build();

        var player = state.Players[0];
        var topCard = player.DrawDeck[0];

        var @event = new CardDrawnEvent(player.PlayerId, topCard.InstanceId);
        var newState = _projector.Apply(state, @event);

        var newPlayer = newState.GetPlayer(player.PlayerId);
        Assert.DoesNotContain(newPlayer.DrawDeck, c => c.InstanceId == topCard.InstanceId);
        Assert.Contains(newPlayer.Hand, c => c.InstanceId == topCard.InstanceId);
        Assert.Equal(CardLocation.Hand, newPlayer.Hand.First(c => c.InstanceId == topCard.InstanceId).Location);
    }

    [Fact]
    public void CardDrawnEvent_DrawDeckSizeDecreasesByOne()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithDrawDeck("01141", "01089", "01048"))
            .Build();

        var player = state.Players[0];
        var topCard = player.DrawDeck[0];

        var newState = _projector.Apply(state, new CardDrawnEvent(player.PlayerId, topCard.InstanceId));

        Assert.Equal(2, newState.GetPlayer(player.PlayerId).DrawDeck.Count);
        Assert.Equal(1, newState.GetPlayer(player.PlayerId).Hand.Count);
    }

    // ── CardKneeledEvent ──────────────────────────────────────────────────────

    [Fact]
    public void CardKneeledEvent_SetsCardKneeled()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141"))
            .Build();

        var card = state.Players[0].CardsInPlay[0];
        Assert.False(card.Kneeled);

        var newState = _projector.Apply(state, new CardKneeledEvent(card.InstanceId));

        Assert.True(newState.GetPlayer(state.Players[0].PlayerId).CardsInPlay[0].Kneeled);
    }

    // ── CardStoodEvent ────────────────────────────────────────────────────────

    [Fact]
    public void CardStoodEvent_ClearsKneeled()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141", c => c.Kneeled()))
            .Build();

        var card = state.Players[0].CardsInPlay[0];
        Assert.True(card.Kneeled);

        var newState = _projector.Apply(state, new CardStoodEvent(card.InstanceId));

        Assert.False(newState.GetPlayer(state.Players[0].PlayerId).CardsInPlay[0].Kneeled);
    }

    // ── GoldGainedEvent ───────────────────────────────────────────────────────

    [Fact]
    public void GoldGainedEvent_IncreasesPlayerGold()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithGold(3))
            .Build();

        var player = state.Players[0];
        var newState = _projector.Apply(state, new GoldGainedEvent(player.PlayerId, 5));

        Assert.Equal(8, newState.GetPlayer(player.PlayerId).Gold);
    }

    // ── GoldSpentEvent ────────────────────────────────────────────────────────

    [Fact]
    public void GoldSpentEvent_DecreasesPlayerGold()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithGold(7))
            .Build();

        var player = state.Players[0];
        var newState = _projector.Apply(state, new GoldSpentEvent(player.PlayerId, 3));

        Assert.Equal(4, newState.GetPlayer(player.PlayerId).Gold);
    }

    // ── PowerGainedEvent (card) ───────────────────────────────────────────────

    [Fact]
    public void PowerGainedEvent_OnCard_IncreasesCardPower()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141", c => c.WithPower(0)))
            .Build();

        var card = state.Players[0].CardsInPlay[0];
        var newState = _projector.Apply(state, new PowerGainedEvent(card.InstanceId, PowerTargetType.Card, 2));

        Assert.Equal(2, newState.GetPlayer(state.Players[0].PlayerId).CardsInPlay[0].Power);
    }

    // ── PowerGainedEvent (player/faction) ────────────────────────────────────

    [Fact]
    public void PowerGainedEvent_OnPlayer_IncreasesFactionPower()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1")
            .Build();

        var player = state.Players[0];
        var newState = _projector.Apply(state, new PowerGainedEvent(player.PlayerId, PowerTargetType.Player, 3));

        Assert.Equal(3, newState.GetPlayer(player.PlayerId).FactionPower);
    }

    // ── PhaseStartedEvent ─────────────────────────────────────────────────────

    [Fact]
    public void PhaseStartedEvent_UpdatesCurrentPhase()
    {
        var state = new GameStateBuilder().WithPhase(GamePhase.Setup).Build();

        var newState = _projector.Apply(state, new PhaseStartedEvent(GamePhase.Draw));

        Assert.Equal(GamePhase.Draw, newState.Phase);
    }

    // ── RoundStartedEvent ─────────────────────────────────────────────────────

    [Fact]
    public void RoundStartedEvent_IncrementsRoundNumber()
    {
        var state = new GameStateBuilder().WithRound(1).Build();

        var newState = _projector.Apply(state, new RoundStartedEvent(2));

        Assert.Equal(2, newState.RoundNumber);
    }

    // ── Rebuild from empty list ───────────────────────────────────────────────

    [Fact]
    public void Rebuild_EmptyEventList_ReturnsInitialState()
    {
        var initial = GameState.CreateNew(Guid.NewGuid(), GameFormat.Joust);
        var rebuilt = _projector.Rebuild(initial, []);
        Assert.Equal(initial, rebuilt);
    }

    // ── Rebuild is deterministic ──────────────────────────────────────────────

    [Fact]
    public void Rebuild_SameEvents_ProducesSameObservableState()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithDrawDeck("01141", "01089"))
            .Build();

        var player = state.Players[0];
        var topCard = player.DrawDeck[0];
        var events = new List<GameEvent>
        {
            new CardDrawnEvent(player.PlayerId, topCard.InstanceId) { SequenceNumber = 1 },
            new GoldGainedEvent(player.PlayerId, 5) { SequenceNumber = 2 },
        };

        var result1 = _projector.Rebuild(state, events);
        var result2 = _projector.Rebuild(state, events);

        // Verify the observable state is identical between both runs
        Assert.Equal(result1.Phase, result2.Phase);
        Assert.Equal(result1.RoundNumber, result2.RoundNumber);
        Assert.Equal(result1.GetPlayer(player.PlayerId).Gold, result2.GetPlayer(player.PlayerId).Gold);
        Assert.Equal(result1.GetPlayer(player.PlayerId).Hand.Count, result2.GetPlayer(player.PlayerId).Hand.Count);
        Assert.Equal(result1.GetPlayer(player.PlayerId).DrawDeck.Count, result2.GetPlayer(player.PlayerId).DrawDeck.Count);
    }
}
