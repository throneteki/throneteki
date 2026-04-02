using System.Collections.Immutable;
using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.Domain.Tests.Helpers;
using Xunit;

namespace Throneteki.Domain.Tests.Cards;

public class AbilityResolverTests
{
    private readonly CardScriptRegistry _registry = CardScriptRegistry.BuildDefault();

    [Fact]
    public void FindTriggeredAbilities_ReturnsMatchingReactions()
    {
        // Tyrion Lannister (01089) reacts to ChallengeInitiatedEvent (intrigue)
        var resolver = new AbilityResolver(_registry);

        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01089")) // Tyrion
            .WithPlayer("p2")
            .Build();

        var tyrion = state.Players[0].CardsInPlay[0];
        var triggerEvent = new ChallengeInitiatedEvent(
            ChallengeIcon.Intrigue,
            state.Players[0].PlayerId,
            state.Players[1].PlayerId,
            1);

        var matches = resolver.FindTriggeredAbilities(state, triggerEvent, AbilityType.Reaction);

        Assert.NotEmpty(matches);
        Assert.Contains(matches, m => m.CardInstanceId == tyrion.InstanceId);
    }

    [Fact]
    public void FindTriggeredAbilities_ExcludesWrongEventType()
    {
        // Tyrion only reacts to Intrigue challenges, not Military
        var resolver = new AbilityResolver(_registry);

        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01089")) // Tyrion
            .WithPlayer("p2")
            .Build();

        var triggerEvent = new ChallengeInitiatedEvent(
            ChallengeIcon.Military, // Not intrigue — Tyrion should NOT trigger
            state.Players[0].PlayerId,
            state.Players[1].PlayerId,
            1);

        var matches = resolver.FindTriggeredAbilities(state, triggerEvent, AbilityType.Reaction);

        Assert.Empty(matches);
    }

    [Fact]
    public void ResolveAbility_ProducesGameEvents()
    {
        var resolver = new AbilityResolver(_registry);

        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01089")) // Tyrion
            .WithPlayer("p2")
            .Build();

        var tyrion = state.Players[0].CardsInPlay[0];
        var triggerEvent = new ChallengeInitiatedEvent(
            ChallengeIcon.Intrigue,
            state.Players[0].PlayerId,
            state.Players[1].PlayerId,
            1);

        var matches = resolver.FindTriggeredAbilities(state, triggerEvent, AbilityType.Reaction);
        Assert.NotEmpty(matches);

        var events = resolver.ResolveAbility(matches[0]);
        Assert.NotEmpty(events);
        Assert.IsType<GoldGainedEvent>(events[0]); // Tyrion gains 2 gold
    }

    [Fact]
    public void Registry_DiscoversCoreSetCards()
    {
        Assert.True(_registry.HasScript("01001")); // A Clash of Kings
        Assert.True(_registry.HasScript("01003")); // A Game of Thrones
        Assert.True(_registry.HasScript("01013")); // Heads on Spikes
        Assert.True(_registry.HasScript("01038")); // The Iron Throne
        Assert.True(_registry.HasScript("01041")); // Put to the Sword
        Assert.True(_registry.HasScript("01048")); // Robert Baratheon
        Assert.True(_registry.HasScript("01087")); // Jaime Lannister
        Assert.True(_registry.HasScript("01089")); // Tyrion Lannister
        Assert.True(_registry.HasScript("01137")); // The Wall
        Assert.True(_registry.HasScript("01141")); // Arya Stark
        Assert.True(_registry.HasScript("01143")); // Catelyn Stark
        Assert.True(_registry.HasScript("01144")); // Eddard Stark
        Assert.True(_registry.HasScript("01160")); // Daenerys Targaryen
    }
}
