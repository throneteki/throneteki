using Throneteki.GameEngine.Cards;
using Throneteki.Domain.Interfaces;

namespace Throneteki.Domain.Tests.Helpers;

/// <summary>
/// Provides pre-built card catalogs for tests that need real card definitions.
/// Keeps all test card JSON in one place.
/// </summary>
internal static class TestCardCatalog
{
    /// <summary>Catalog containing common cards used across engine tests.</summary>
    public static ICardCatalog Standard() => CardCatalog.LoadFromJson("""
    {
      "cards": [
        { "code": "01001", "name": "A Game of Thrones", "type": "plot", "faction": "neutral",
          "income": 5, "initiative": 4, "claim": 1, "reserve": 6 },
        { "code": "01002", "name": "A Noble Cause", "type": "plot", "faction": "neutral",
          "income": 3, "initiative": 6, "claim": 1, "reserve": 6 },
        { "code": "01003", "name": "A Storm of Swords", "type": "plot", "faction": "neutral",
          "income": 2, "initiative": 2, "claim": 2, "reserve": 5 },
        { "code": "01004", "name": "Calling the Banners", "type": "plot", "faction": "neutral",
          "income": 0, "initiative": 3, "claim": 1, "reserve": 6 },
        { "code": "01141", "name": "Arya Stark", "type": "character", "faction": "stark",
          "loyal": true, "cost": 2, "strength": 2,
          "icons": { "military": true, "intrigue": true, "power": false },
          "traits": ["Lady", "Stark"], "keywords": [], "unique": true, "deckLimit": 1 },
        { "code": "01089", "name": "Tyrion Lannister", "type": "character", "faction": "lannister",
          "loyal": true, "cost": 5, "strength": 4,
          "icons": { "military": false, "intrigue": true, "power": true },
          "traits": ["Lord", "Lannister"], "keywords": [], "unique": true, "deckLimit": 1 }
      ]
    }
    """);
}
