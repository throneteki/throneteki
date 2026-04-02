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
        // Catelyn Stark (01143) has a reaction on ChallengeResultDeterminedEvent
        var resolver = new AbilityResolver(_registry);

        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01143")) // Catelyn
            .WithPlayer("p2")
            .Build();

        // Set up active challenge where p1 is attacker with Catelyn participating
        var catelyn = state.Players[0].CardsInPlay[0];
        state = state with
        {
            ActiveChallenge = new ChallengeState
            {
                Type = ChallengeIcon.Intrigue,
                AttackingPlayerId = state.Players[0].PlayerId,
                DefendingPlayerId = state.Players[1].PlayerId,
                Attackers = ImmutableList.Create(catelyn.InstanceId),
            }
        };

        var triggerEvent = new ChallengeResultDeterminedEvent(
            state.Players[0].PlayerId, false, 4, 2);

        var matches = resolver.FindTriggeredAbilities(state, triggerEvent, AbilityType.Reaction);

        Assert.NotEmpty(matches);
        Assert.Contains(matches, m => m.CardInstanceId == catelyn.InstanceId);
    }

    [Fact]
    public void FindTriggeredAbilities_ExcludesWhenConditionFails()
    {
        var resolver = new AbilityResolver(_registry);

        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01143")) // Catelyn
            .WithPlayer("p2")
            .Build();

        // No active challenge — Catelyn's condition should fail
        var triggerEvent = new ChallengeResultDeterminedEvent(
            state.Players[0].PlayerId, false, 4, 2);

        var matches = resolver.FindTriggeredAbilities(state, triggerEvent, AbilityType.Reaction);

        // Should be empty — no challenge means condition fails
        Assert.Empty(matches);
    }

    [Fact]
    public void ResolveAbility_ProducesGameEvents()
    {
        var resolver = new AbilityResolver(_registry);

        var state = new GameStateBuilder()
            .WithPhase(GamePhase.Challenges)
            .WithPlayer("p1", p => p.AsFirstPlayer().InPlay("01143").WithDrawDeck("c1", "c2"))
            .WithPlayer("p2")
            .Build();

        var catelyn = state.Players[0].CardsInPlay[0];
        state = state with
        {
            ActiveChallenge = new ChallengeState
            {
                Type = ChallengeIcon.Intrigue,
                AttackingPlayerId = state.Players[0].PlayerId,
                DefendingPlayerId = state.Players[1].PlayerId,
                Attackers = ImmutableList.Create(catelyn.InstanceId),
            }
        };

        var triggerEvent = new ChallengeResultDeterminedEvent(
            state.Players[0].PlayerId, false, 4, 2);

        var matches = resolver.FindTriggeredAbilities(state, triggerEvent, AbilityType.Reaction);
        Assert.NotEmpty(matches);

        var events = resolver.ResolveAbility(matches[0]);
        Assert.NotEmpty(events);
        Assert.IsType<CardDrawnEvent>(events[0]); // Catelyn draws 1 card
    }

    [Fact]
    public void Registry_DiscoversCoreSetCards()
    {
        // Verify all 20 core set cards are discovered
        Assert.True(_registry.HasScript("01001")); // A Game of Thrones
        Assert.True(_registry.HasScript("01013")); // Heads on Spikes
        Assert.True(_registry.HasScript("01041")); // Put to the Sword
        Assert.True(_registry.HasScript("01048")); // Robert Baratheon
        Assert.True(_registry.HasScript("01087")); // Jaime Lannister
        Assert.True(_registry.HasScript("01089")); // Tyrion Lannister
        Assert.True(_registry.HasScript("01137")); // The Wall
        Assert.True(_registry.HasScript("01141")); // Arya Stark
        Assert.True(_registry.HasScript("01143")); // Catelyn Stark
        Assert.True(_registry.HasScript("01148")); // Ned Stark
        Assert.True(_registry.HasScript("01160")); // Daenerys Targaryen
        Assert.True(_registry.HasScript("01163")); // Iron Throne
    }
}
