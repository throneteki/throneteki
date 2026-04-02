using Throneteki.Domain.Cards;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.Domain.Tests.Helpers;
using Throneteki.GameEngine.Cards;
using Throneteki.GameEngine.Effects;
using Xunit;

namespace Throneteki.Domain.Tests.Effects;

public class EffectEngineTests
{
    // A minimal catalog for testing
    private static ICardCatalog BuildTestCatalog() => CardCatalog.LoadFromJson("""
        {
          "cards": [
            {
              "code": "01141",
              "name": "Arya Stark",
              "type": "character",
              "faction": "stark",
              "loyal": true,
              "cost": 2,
              "strength": 1,
              "icons": { "military": false, "intrigue": true, "power": false },
              "traits": ["Lady", "Stark"],
              "keywords": [],
              "deckLimit": 3,
              "unique": true
            },
            {
              "code": "01048",
              "name": "Robert Baratheon",
              "type": "character",
              "faction": "baratheon",
              "loyal": true,
              "cost": 8,
              "strength": 5,
              "icons": { "military": true, "intrigue": false, "power": true },
              "traits": ["King", "Lord", "Baratheon"],
              "keywords": [],
              "deckLimit": 1,
              "unique": true
            },
            {
              "code": "99001",
              "name": "Buff Aura",
              "type": "location",
              "faction": "neutral",
              "cost": 2,
              "icons": { "military": false, "intrigue": false, "power": false },
              "traits": [],
              "keywords": [],
              "deckLimit": 3
            }
          ]
        }
        """);

    // ── Strength ──────────────────────────────────────────────────────────────

    [Fact]
    public void GetStrength_NoEffects_ReturnsPrintedStrength()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141"))
            .Build();

        var arya = state.Players[0].CardsInPlay[0];
        Assert.Equal(1, engine.GetStrength(state, arya));
    }

    [Fact]
    public void GetStrength_WithPositiveModifier_ReturnsBoostedStrength()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141", c => c.WithStrengthModifier(2)))
            .Build();

        var arya = state.Players[0].CardsInPlay[0];
        Assert.Equal(3, engine.GetStrength(state, arya));
    }

    [Fact]
    public void GetStrength_CannotGoBelowZero()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141", c => c.WithStrengthModifier(-10)))
            .Build();

        var arya = state.Players[0].CardsInPlay[0];
        Assert.Equal(0, engine.GetStrength(state, arya));
    }

    // ── Icons ─────────────────────────────────────────────────────────────────

    [Fact]
    public void GetIcons_NoEffects_ReturnsPrintedIcons()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141"))
            .Build();

        var arya = state.Players[0].CardsInPlay[0];
        var icons = engine.GetIcons(state, arya);

        Assert.Contains(ChallengeIcon.Intrigue, icons);
        Assert.DoesNotContain(ChallengeIcon.Military, icons);
        Assert.DoesNotContain(ChallengeIcon.Power, icons);
    }

    [Fact]
    public void GetIcons_WithRegisteredAddIconEffect_IncludesAddedIcon()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);

        // Register: add Military icon to Arya
        var arya = new CardInstanceBuilder("01141", CardLocation.PlayArea, Guid.NewGuid())
            .Build();
        engine.RegisterPersistentEffect(new AddIconEffect(
            sourceId: Guid.NewGuid(),
            targetCardId: arya.InstanceId,
            icon: ChallengeIcon.Military));

        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlayExact(arya))
            .Build();

        var icons = engine.GetIcons(state, arya);

        Assert.Contains(ChallengeIcon.Military, icons);
        Assert.Contains(ChallengeIcon.Intrigue, icons); // printed
    }

    [Fact]
    public void GetIcons_EffectRemovedAfterDeregistration_NoLongerApplied()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);

        var arya = new CardInstanceBuilder("01141", CardLocation.PlayArea, Guid.NewGuid()).Build();
        var effectId = Guid.NewGuid();
        engine.RegisterPersistentEffect(new AddIconEffect(effectId, arya.InstanceId, ChallengeIcon.Military));

        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlayExact(arya))
            .Build();

        // Verify effect is active
        Assert.Contains(ChallengeIcon.Military, engine.GetIcons(state, arya));

        // Deregister
        engine.RemovePersistentEffect(effectId);

        // Effect should no longer apply
        Assert.DoesNotContain(ChallengeIcon.Military, engine.GetIcons(state, arya));
    }

    // ── Restrictions ─────────────────────────────────────────────────────────

    [Fact]
    public void HasRestriction_NoRestrictions_ReturnsFalse()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlay("01141"))
            .Build();
        var arya = state.Players[0].CardsInPlay[0];

        Assert.False(engine.HasRestriction(state, arya.InstanceId, RestrictionType.CannotBeKilled));
    }

    [Fact]
    public void HasRestriction_WithActiveRestriction_ReturnsTrue()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var arya = new CardInstanceBuilder("01141", CardLocation.PlayArea, Guid.NewGuid()).Build();

        engine.RegisterPersistentEffect(new RestrictionEffect(
            sourceId: Guid.NewGuid(),
            targetCardId: arya.InstanceId,
            restriction: RestrictionType.CannotBeKilled));

        var state = new GameStateBuilder()
            .WithPlayer("p1", p => p.InPlayExact(arya))
            .Build();

        Assert.True(engine.HasRestriction(state, arya.InstanceId, RestrictionType.CannotBeKilled));
    }

    // ── Play cost ─────────────────────────────────────────────────────────────

    [Fact]
    public void GetPlayCost_NoReducers_ReturnsPrintedCost()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder().WithPlayer("p1").Build();
        var arya = new CardInstanceBuilder("01141", CardLocation.Hand, state.Players[0].PlayerId).Build();

        var cost = engine.GetPlayCost(state, arya, state.Players[0].PlayerId);

        Assert.Equal(2, cost);  // Arya's printed cost
    }

    [Fact]
    public void GetPlayCost_WithCostReducer_ReducesCost()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder().WithPlayer("p1").Build();
        var arya = new CardInstanceBuilder("01141", CardLocation.Hand, state.Players[0].PlayerId).Build();
        var playerId = state.Players[0].PlayerId;

        engine.RegisterPersistentEffect(new CostReducerEffect(
            sourceId: Guid.NewGuid(),
            playerId: playerId,
            reduction: 1,
            condition: null));

        var cost = engine.GetPlayCost(state, arya, playerId);

        Assert.Equal(1, cost);  // 2 - 1 = 1
    }

    [Fact]
    public void GetPlayCost_CannotGoBelowZero()
    {
        var catalog = BuildTestCatalog();
        var engine = new EffectEngine(catalog);
        var state = new GameStateBuilder().WithPlayer("p1").Build();
        var arya = new CardInstanceBuilder("01141", CardLocation.Hand, state.Players[0].PlayerId).Build();
        var playerId = state.Players[0].PlayerId;

        engine.RegisterPersistentEffect(new CostReducerEffect(
            sourceId: Guid.NewGuid(),
            playerId: playerId,
            reduction: 10,
            condition: null));

        var cost = engine.GetPlayCost(state, arya, playerId);

        Assert.Equal(0, cost);
    }
}
