using Throneteki.Domain.Cards;

namespace Throneteki.Domain.Interfaces;

/// <summary>
/// Provides access to static card definition data (loaded from JSON).
/// </summary>
public interface ICardCatalog
{
    /// <summary>Get card definition by card code. Throws if not found.</summary>
    CardDefinition Get(string cardCode);

    /// <summary>Try to get a card definition. Returns null if not found.</summary>
    CardDefinition? TryGet(string cardCode);

    /// <summary>All known card definitions.</summary>
    IReadOnlyCollection<CardDefinition> All { get; }
}
