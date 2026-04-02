using System.Collections.Immutable;
using Throneteki.Domain.Enums;

namespace Throneteki.Domain.Cards;

/// <summary>
/// Immutable card reference data loaded from JSON.
/// This is static data -- it never changes during a game.
/// </summary>
public sealed record CardDefinition
{
    public required string Code { get; init; }
    public required string Name { get; init; }
    public required CardType Type { get; init; }
    public required Faction Faction { get; init; }
    public bool Loyal { get; init; }
    public int? Cost { get; init; }
    public int? PrintedStrength { get; init; }
    public ImmutableHashSet<ChallengeIcon> PrintedIcons { get; init; } = ImmutableHashSet<ChallengeIcon>.Empty;
    public ImmutableList<string> Traits { get; init; } = ImmutableList<string>.Empty;
    public ImmutableList<Keyword> Keywords { get; init; } = ImmutableList<Keyword>.Empty;
    public string Text { get; init; } = "";
    public int DeckLimit { get; init; } = 3;
    public bool Unique { get; init; }
    public string? PackCode { get; init; }

    // Plot-specific
    public int? Income { get; init; }
    public int? Initiative { get; init; }
    public int? Claim { get; init; }
    public int? Reserve { get; init; }

    // Agenda-specific
    public bool IsAgenda => Type == CardType.Agenda;
    public bool IsFaction => Type == CardType.Faction;
    public bool IsPlot => Type == CardType.Plot;
    public bool IsCharacter => Type == CardType.Character;
    public bool IsLocation => Type == CardType.Location;
    public bool IsAttachment => Type == CardType.Attachment;
    public bool IsEvent => Type == CardType.Event;
}

/// <summary>
/// Attribute that links a C# card ability class to a card code.
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public sealed class CardDefinitionAttribute(string code) : Attribute
{
    public string Code { get; } = code;
}
