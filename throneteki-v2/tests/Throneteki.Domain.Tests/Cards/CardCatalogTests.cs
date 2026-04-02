using Throneteki.Domain.Cards;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Interfaces;
using Throneteki.GameEngine.Cards;
using Xunit;

namespace Throneteki.Domain.Tests.Cards;

public class CardCatalogTests
{
    private static ICardCatalog BuildCatalogFromJson(string json)
        => CardCatalog.LoadFromJson(json);

    private const string SampleJson = """
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
              "text": "If Arya Stark has a duplicate...",
              "deckLimit": 3,
              "unique": true
            },
            {
              "code": "01089",
              "name": "Tyrion Lannister",
              "type": "character",
              "faction": "lannister",
              "loyal": true,
              "cost": 5,
              "strength": 4,
              "icons": { "military": false, "intrigue": true, "power": true },
              "traits": ["Lord", "Lannister"],
              "keywords": [],
              "text": "",
              "deckLimit": 1,
              "unique": true
            },
            {
              "code": "01013",
              "name": "Heads on Spikes",
              "type": "plot",
              "faction": "neutral",
              "loyal": false,
              "income": 4,
              "initiative": 1,
              "claim": 1,
              "reserve": 6,
              "text": "When Revealed: ...",
              "deckLimit": 2,
              "unique": false
            }
          ]
        }
        """;

    // ── Get by code ───────────────────────────────────────────────────────────

    [Fact]
    public void Get_KnownCode_ReturnsDefinition()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        var card = catalog.Get("01141");

        Assert.Equal("01141", card.Code);
        Assert.Equal("Arya Stark", card.Name);
    }

    [Fact]
    public void Get_UnknownCode_Throws()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Throws<KeyNotFoundException>(() => catalog.Get("99999"));
    }

    [Fact]
    public void TryGet_UnknownCode_ReturnsNull()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        var result = catalog.TryGet("99999");

        Assert.Null(result);
    }

    // ── Type parsing ──────────────────────────────────────────────────────────

    [Fact]
    public void Load_ParsesCardType_Character()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(CardType.Character, catalog.Get("01141").Type);
        Assert.True(catalog.Get("01141").IsCharacter);
    }

    [Fact]
    public void Load_ParsesCardType_Plot()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(CardType.Plot, catalog.Get("01013").Type);
        Assert.True(catalog.Get("01013").IsPlot);
    }

    // ── Faction parsing ───────────────────────────────────────────────────────

    [Fact]
    public void Load_ParsesFaction_Stark()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(Faction.Stark, catalog.Get("01141").Faction);
    }

    [Fact]
    public void Load_ParsesFaction_Neutral()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(Faction.Neutral, catalog.Get("01013").Faction);
    }

    // ── Icons ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Load_ParsesIcons_AryaHasIntrigueOnly()
    {
        var catalog = BuildCatalogFromJson(SampleJson);
        var arya = catalog.Get("01141");

        Assert.Contains(ChallengeIcon.Intrigue, arya.PrintedIcons);
        Assert.DoesNotContain(ChallengeIcon.Military, arya.PrintedIcons);
        Assert.DoesNotContain(ChallengeIcon.Power, arya.PrintedIcons);
    }

    [Fact]
    public void Load_ParsesIcons_TyrionHasIntrigueAndPower()
    {
        var catalog = BuildCatalogFromJson(SampleJson);
        var tyrion = catalog.Get("01089");

        Assert.Contains(ChallengeIcon.Intrigue, tyrion.PrintedIcons);
        Assert.Contains(ChallengeIcon.Power, tyrion.PrintedIcons);
        Assert.DoesNotContain(ChallengeIcon.Military, tyrion.PrintedIcons);
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Load_ParsesStrength()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(4, catalog.Get("01089").PrintedStrength);
    }

    [Fact]
    public void Load_ParsesCost()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(5, catalog.Get("01089").Cost);
    }

    [Fact]
    public void Load_ParsesPlotStats()
    {
        var catalog = BuildCatalogFromJson(SampleJson);
        var plot = catalog.Get("01013");

        Assert.Equal(4, plot.Income);
        Assert.Equal(1, plot.Initiative);
        Assert.Equal(1, plot.Claim);
        Assert.Equal(6, plot.Reserve);
    }

    // ── Traits ────────────────────────────────────────────────────────────────

    [Fact]
    public void Load_ParsesTraits()
    {
        var catalog = BuildCatalogFromJson(SampleJson);
        var arya = catalog.Get("01141");

        Assert.Contains("Lady", arya.Traits);
        Assert.Contains("Stark", arya.Traits);
    }

    // ── DeckLimit ─────────────────────────────────────────────────────────────

    [Fact]
    public void Load_ParsesDeckLimit()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(1, catalog.Get("01089").DeckLimit);
        Assert.Equal(3, catalog.Get("01141").DeckLimit);
    }

    // ── All ───────────────────────────────────────────────────────────────────

    [Fact]
    public void All_ReturnsAllLoadedCards()
    {
        var catalog = BuildCatalogFromJson(SampleJson);

        Assert.Equal(3, catalog.All.Count);
    }
}
