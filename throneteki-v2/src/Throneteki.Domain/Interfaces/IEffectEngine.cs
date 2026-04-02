using Throneteki.Domain.Enums;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Interfaces;

/// <summary>
/// Computes derived card properties by evaluating all active persistent effects.
/// Computed on demand (not mutated onto cards) -- eliminates apply/unapply bugs.
/// </summary>
public interface IEffectEngine
{
    /// <summary>Effective strength of a card (base + modifiers from all active effects).</summary>
    int GetStrength(GameState state, CardInstance card);

    /// <summary>Effective challenge icons (printed + added by effects - removed by effects).</summary>
    IReadOnlySet<ChallengeIcon> GetIcons(GameState state, CardInstance card);

    /// <summary>Effective keywords.</summary>
    IReadOnlySet<Keyword> GetKeywords(GameState state, CardInstance card);

    /// <summary>Effective traits.</summary>
    IReadOnlySet<string> GetTraits(GameState state, CardInstance card);

    /// <summary>Whether a card or player currently has a specific restriction active.</summary>
    bool HasRestriction(GameState state, Guid targetId, RestrictionType restriction);

    /// <summary>Effective cost to play a card (after any reducers).</summary>
    int GetPlayCost(GameState state, CardInstance card, Guid playingPlayerId);

    /// <summary>Whether a card is immune to a given effect source.</summary>
    bool IsImmune(GameState state, CardInstance card, CardInstance? effectSource);
}
