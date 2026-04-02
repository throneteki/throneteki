using System.Collections.Immutable;
using System.Linq;
using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.Domain.Tests.Helpers;
using Xunit;

namespace Throneteki.Domain.Tests.Cards;

public class CardAbilityDslTests
{
    // ── AbilityBuilder ────────────────────────────────────────────────────────

    [Fact]
    public void AbilityBuilder_Action_BuildsCorrectType()
    {
        var ability = AbilityBuilder.Action("test-action")
            .Do(_ => Array.Empty<GameEvent>())
            .Build();

        Assert.Equal("test-action", ability.AbilityId);
        Assert.Equal(AbilityType.Action, ability.Type);
    }

    [Fact]
    public void AbilityBuilder_ThrowsIfNoEffect()
    {
        Assert.Throws<InvalidOperationException>(() =>
            AbilityBuilder.Action("no-effect").Build());
    }

    [Fact]
    public void AbilityBuilder_Costs_SetsCost()
    {
        var ability = AbilityBuilder.Action("gold-test")
            .Costs(3)
            .Do(_ => Array.Empty<GameEvent>())
            .Build();

        Assert.Equal(3, ability.GoldCost);
    }

    [Fact]
    public void AbilityBuilder_When_FiltersCondition()
    {
        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Marshalling)
            .WithPlayer("p1")
            .Build();

        var source = new CardInstance { InstanceId = Guid.NewGuid(), CardCode = "test", OwnerId = state.Players[0].PlayerId, ControllerId = state.Players[0].PlayerId, Location = CardLocation.PlayArea };
        var ctx = new AbilityContext
        {
            State = state,
            Source = source,
            ControllingPlayerId = state.Players[0].PlayerId,
        };

        var ability = AbilityBuilder.Action("phase-locked")
            .DuringPhase(GamePhase.Challenges) // NOT Marshalling
            .Do(_ => Array.Empty<GameEvent>())
            .Build();

        Assert.NotNull(ability.Condition);
        Assert.False(ability.Condition!(ctx)); // Should be false — wrong phase
    }

    [Fact]
    public void AbilityBuilder_OnEvent_AddsFilter()
    {
        var ability = AbilityBuilder.Reaction("reaction-test")
            .OnEvent<CardKilledEvent>()
            .Do(_ => Array.Empty<GameEvent>())
            .Build();

        Assert.Single(ability.TriggerFilters);

        var state = new GameStateBuilder().WithPlayer("p1").Build();
        var killedEvent = new CardKilledEvent(Guid.NewGuid(), Guid.NewGuid());
        var notKilledEvent = new CardDrawnEvent(Guid.NewGuid(), Guid.NewGuid());

        Assert.True(ability.TriggerFilters[0](killedEvent, state));
        Assert.False(ability.TriggerFilters[0](notKilledEvent, state));
    }

    [Fact]
    public void AbilityBuilder_Do_InvokesEffect()
    {
        var state = new GameStateBuilder().WithPlayer("p1").Build();
        var source = new CardInstance { InstanceId = Guid.NewGuid(), CardCode = "test", OwnerId = state.Players[0].PlayerId, ControllerId = state.Players[0].PlayerId, Location = CardLocation.PlayArea };
        var ctx = new AbilityContext
        {
            State = state,
            Source = source,
            ControllingPlayerId = state.Players[0].PlayerId,
        };

        var ability = AbilityBuilder.Action("effect-test")
            .Do(_ => new GameEvent[] { new GameMessageEvent("hello") })
            .Build();

        var events = ability.Effect(ctx);
        Assert.Single(events);
        Assert.IsType<GameMessageEvent>(events[0]);
    }

    // ── CardScriptRegistry ────────────────────────────────────────────────────

    [Fact]
    public void Registry_BuildDefault_FindsKnownCards()
    {
        var registry = CardScriptRegistry.BuildDefault();

        // Known card codes registered in Implementations
        Assert.True(registry.HasScript("01141")); // Arya Stark
        Assert.True(registry.HasScript("01089")); // Tyrion Lannister
        Assert.True(registry.HasScript("01001")); // A Game of Thrones (vanilla)
    }

    [Fact]
    public void Registry_TryGet_ReturnsNullForUnknown()
    {
        var registry = CardScriptRegistry.BuildDefault();
        Assert.Null(registry.TryGet("99999"));
    }

    [Fact]
    public void Registry_UnknownCard_ReturnsNull()
    {
        var registry = CardScriptRegistry.BuildDefault();
        Assert.Null(registry.TryGet("99999"));
    }

    [Fact]
    public void Registry_AryaStark_HasAbilities()
    {
        var registry = CardScriptRegistry.BuildDefault();
        var script = registry.Get("01141");
        Assert.NotEmpty(script.Abilities);
    }
}
