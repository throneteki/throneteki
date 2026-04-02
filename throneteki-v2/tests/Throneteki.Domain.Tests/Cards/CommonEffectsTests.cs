using System.Collections.Immutable;
using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.Domain.Tests.Helpers;
using Xunit;

namespace Throneteki.Domain.Tests.Cards;

public class CommonEffectsTests
{
    private AbilityContext MakeContext(GameState state, CardInstance? source = null, Guid? controllerId = null)
    {
        var p1 = state.Players[0];
        return new AbilityContext
        {
            State = state,
            Source = source ?? new CardInstance
            {
                InstanceId = Guid.NewGuid(),
                CardCode = "test",
                OwnerId = p1.PlayerId,
                ControllerId = p1.PlayerId,
                Location = CardLocation.PlayArea,
            },
            ControllingPlayerId = controllerId ?? p1.PlayerId,
        };
    }

    [Fact]
    public void DrawCards_EmitsCorrectNumberOfEvents()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithDrawDeck("c1", "c2", "c3"))
            .Build();

        var ctx = MakeContext(state);
        var events = CommonEffects.DrawCards(ctx, 2);

        Assert.Equal(2, events.Count);
        Assert.All(events, e => Assert.IsType<CardDrawnEvent>(e));
    }

    [Fact]
    public void DrawCards_CapsAtDeckSize()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithDrawDeck("c1"))
            .Build();

        var ctx = MakeContext(state);
        var events = CommonEffects.DrawCards(ctx, 5);

        Assert.Single(events);
    }

    [Fact]
    public void DiscardRandom_EmitsDiscardEvents()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithHand("c1", "c2"))
            .Build();

        var events = CommonEffects.DiscardRandom(state, state.Players[0].PlayerId, 1);

        Assert.Single(events);
        Assert.IsType<CardDiscardedEvent>(events[0]);
    }

    [Fact]
    public void GainFactionPower_EmitsCorrectEvent()
    {
        var state = new GameStateBuilder().WithPlayer("p1").Build();
        var ctx = MakeContext(state);

        var evt = CommonEffects.GainFactionPower(ctx, 2, "test");

        var power = Assert.IsType<PowerGainedEvent>(evt);
        Assert.Equal(2, power.Amount);
        Assert.Equal(PowerTargetType.Player, power.TargetType);
    }

    [Fact]
    public void KneelSelfThen_PrependsSelfKneel()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141"))
            .Build();

        var source = state.Players[0].CardsInPlay[0];
        var ctx = MakeContext(state, source);

        var events = CommonEffects.KneelSelfThen(ctx,
            CommonEffects.GainGold(ctx, 2, "test"));

        Assert.Equal(2, events.Count);
        Assert.IsType<CardKneeledEvent>(events[0]);
        Assert.IsType<GoldGainedEvent>(events[1]);
        Assert.Equal(source.InstanceId, ((CardKneeledEvent)events[0]).CardInstanceId);
    }

    [Fact]
    public void SourceIsStanding_ReturnsTrueForStandingCard()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141"))
            .Build();

        var source = state.Players[0].CardsInPlay[0];
        var ctx = MakeContext(state, source);

        Assert.True(CommonEffects.SourceIsStanding(ctx));
    }

    [Fact]
    public void SourceIsStanding_ReturnsFalseForKneeledCard()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141", c => c.Kneeled()))
            .Build();

        var source = state.Players[0].CardsInPlay[0];
        var ctx = MakeContext(state, source);

        Assert.False(CommonEffects.SourceIsStanding(ctx));
    }

    [Fact]
    public void HasGold_ChecksPlayerGold()
    {
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.WithGold(3))
            .Build();

        var ctx = MakeContext(state);

        Assert.True(CommonEffects.HasGold(ctx, 3));
        Assert.False(CommonEffects.HasGold(ctx, 4));
    }
}
