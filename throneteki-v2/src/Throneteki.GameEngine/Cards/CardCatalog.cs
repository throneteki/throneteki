using System.Collections.Immutable;
using System.Text.Json;
using System.Text.Json.Serialization;
using Throneteki.Domain.Cards;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Interfaces;

namespace Throneteki.GameEngine.Cards;

/// <summary>
/// Loads and indexes card definitions from JSON.
/// Implements <see cref="ICardCatalog"/>.
/// </summary>
public sealed class CardCatalog : ICardCatalog
{
    private readonly Dictionary<string, CardDefinition> _byCode;

    private CardCatalog(Dictionary<string, CardDefinition> byCode) => _byCode = byCode;

    public CardDefinition Get(string cardCode) =>
        _byCode.TryGetValue(cardCode, out var def)
            ? def
            : throw new KeyNotFoundException($"Card '{cardCode}' not found in catalog.");

    public CardDefinition? TryGet(string cardCode) =>
        _byCode.TryGetValue(cardCode, out var def) ? def : null;

    public IReadOnlyCollection<CardDefinition> All => _byCode.Values;

    /// <summary>Load catalog from a JSON string.</summary>
    public static CardCatalog LoadFromJson(string json)
    {
        var root = JsonSerializer.Deserialize<CardDataRoot>(json, JsonOptions)
            ?? throw new InvalidOperationException("Failed to parse card data JSON.");

        var defs = root.Cards.Select(MapToDefinition).ToDictionary(c => c.Code);
        return new CardCatalog(defs);
    }

    /// <summary>Load catalog from a file path.</summary>
    public static CardCatalog LoadFromFile(string filePath) =>
        LoadFromJson(File.ReadAllText(filePath));

    private static CardDefinition MapToDefinition(CardDto dto) => new()
    {
        Code = dto.Code,
        Name = dto.Name,
        Type = ParseType(dto.Type),
        Faction = ParseFaction(dto.Faction ?? "neutral"),
        Loyal = dto.Loyal,
        Cost = dto.Cost,
        PrintedStrength = dto.Strength,
        PrintedIcons = ParseIcons(dto.Icons),
        Traits = (dto.Traits ?? []).ToImmutableList(),
        Keywords = ParseKeywords(dto.Keywords ?? []),
        Text = dto.Text ?? "",
        DeckLimit = dto.DeckLimit ?? 3,
        Unique = dto.Unique,
        PackCode = dto.PackCode,
        Income = dto.Income,
        Initiative = dto.Initiative,
        Claim = dto.Claim,
        Reserve = dto.Reserve,
    };

    private static CardType ParseType(string? type) => (type?.ToLowerInvariant()) switch
    {
        "character" => CardType.Character,
        "location" => CardType.Location,
        "attachment" => CardType.Attachment,
        "event" => CardType.Event,
        "plot" => CardType.Plot,
        "faction" => CardType.Faction,
        "agenda" => CardType.Agenda,
        "title" => CardType.Title,
        _ => throw new ArgumentOutOfRangeException(nameof(type), $"Unknown card type: {type}")
    };

    private static Faction ParseFaction(string faction) => faction.ToLowerInvariant() switch
    {
        "stark" => Faction.Stark,
        "lannister" => Faction.Lannister,
        "baratheon" => Faction.Baratheon,
        "targaryen" => Faction.Targaryen,
        "greyjoy" => Faction.Greyjoy,
        "martell" => Faction.Martell,
        "tyrell" => Faction.Tyrell,
        "thenightswatch" or "nightswatch" or "nights-watch" or "the-nights-watch" => Faction.NightsWatch,
        "neutral" => Faction.Neutral,
        _ => Faction.Neutral  // graceful fallback for new factions
    };

    private static ImmutableHashSet<ChallengeIcon> ParseIcons(IconsDto? icons)
    {
        if (icons == null) return ImmutableHashSet<ChallengeIcon>.Empty;
        var result = new HashSet<ChallengeIcon>();
        if (icons.Military) result.Add(ChallengeIcon.Military);
        if (icons.Intrigue) result.Add(ChallengeIcon.Intrigue);
        if (icons.Power) result.Add(ChallengeIcon.Power);
        return result.ToImmutableHashSet();
    }

    private static ImmutableList<Keyword> ParseKeywords(string[] keywords) =>
        keywords
            .Select(k => k.ToLowerInvariant() switch
            {
                "stealth" => Keyword.Stealth,
                "insight" => Keyword.Insight,
                "renown" => Keyword.Renown,
                "ambush" => Keyword.Ambush,
                "shadow" => Keyword.Shadow,
                "pillage" => Keyword.Pillage,
                "intimidate" => Keyword.Intimidate,
                "bestow" => Keyword.Bestow,
                "limited" => Keyword.Limited,
                "terminal" => Keyword.Terminal,
                "immune" => Keyword.Immune,
                "no attachments" => Keyword.NoAttachments,
                _ => (Keyword?)null
            })
            .Where(k => k.HasValue)
            .Select(k => k!.Value)
            .ToImmutableList();

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        AllowTrailingCommas = true,
    };

    // ── JSON DTOs ─────────────────────────────────────────────────────────────

    private sealed class CardDataRoot
    {
        [JsonPropertyName("cards")]
        public List<CardDto> Cards { get; set; } = new();
    }

    private sealed class CardDto
    {
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string? Type { get; set; }
        public string? Faction { get; set; }
        public bool Loyal { get; set; }
        public int? Cost { get; set; }
        public int? Strength { get; set; }
        public IconsDto? Icons { get; set; }
        public string[]? Traits { get; set; }
        public string[]? Keywords { get; set; }
        public string? Text { get; set; }
        public int? DeckLimit { get; set; }
        public bool Unique { get; set; }
        public string? PackCode { get; set; }
        public int? Income { get; set; }
        public int? Initiative { get; set; }
        public int? Claim { get; set; }
        public int? Reserve { get; set; }
    }

    private sealed class IconsDto
    {
        public bool Military { get; set; }
        public bool Intrigue { get; set; }
        public bool Power { get; set; }
    }
}
