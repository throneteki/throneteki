using Throneteki.Domain.Enums;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Effects;

/// <summary>
/// Computes derived card properties by evaluating all active persistent effects.
/// Effects are computed on demand (not mutated onto cards), which eliminates the
/// fragile apply/unapply pattern from the original system.
/// Implements <see cref="IEffectEngine"/>.
/// </summary>
public sealed class EffectEngine : IEffectEngine
{
    private readonly ICardCatalog _catalog;
    private readonly Dictionary<Guid, PersistentEffect> _effects = new();

    public EffectEngine(ICardCatalog catalog) => _catalog = catalog;

    // ── Registration ─────────────────────────────────────────────────────────

    public void RegisterPersistentEffect(PersistentEffect effect) =>
        _effects[effect.EffectId] = effect;

    public void RemovePersistentEffect(Guid effectId) =>
        _effects.Remove(effectId);

    public void RemoveEffectsFromSource(Guid sourceId)
    {
        var toRemove = _effects.Values
            .Where(e => e.SourceId == sourceId)
            .Select(e => e.EffectId)
            .ToList();
        foreach (var id in toRemove) _effects.Remove(id);
    }

    // ── IEffectEngine ─────────────────────────────────────────────────────────

    public int GetStrength(GameState state, CardInstance card)
    {
        var def = _catalog.TryGet(card.CardCode);
        if (def == null) return 0;

        int strength = (def.PrintedStrength ?? 0) + card.StrengthModifier;

        foreach (var effect in ActiveEffects<StrengthModifierEffect>(state))
            if (effect.TargetCardId == card.InstanceId)
                strength += effect.Amount;

        return Math.Max(0, strength);
    }

    public IReadOnlySet<ChallengeIcon> GetIcons(GameState state, CardInstance card)
    {
        var def = _catalog.TryGet(card.CardCode);
        var icons = new HashSet<ChallengeIcon>(def?.PrintedIcons ?? []);

        foreach (var effect in ActiveEffects<AddIconEffect>(state))
            if (effect.TargetCardId == card.InstanceId)
                icons.Add(effect.Icon);

        foreach (var effect in ActiveEffects<RemoveIconEffect>(state))
            if (effect.TargetCardId == card.InstanceId)
                icons.Remove(effect.Icon);

        return icons;
    }

    public IReadOnlySet<Keyword> GetKeywords(GameState state, CardInstance card)
    {
        var def = _catalog.TryGet(card.CardCode);
        var keywords = new HashSet<Keyword>(def?.Keywords ?? []);

        foreach (var effect in ActiveEffects<AddKeywordEffect>(state))
            if (effect.TargetCardId == card.InstanceId)
                keywords.Add(effect.Keyword);

        return keywords;
    }

    public IReadOnlySet<string> GetTraits(GameState state, CardInstance card)
    {
        var def = _catalog.TryGet(card.CardCode);
        return def?.Traits.ToHashSet() ?? new HashSet<string>();
    }

    public bool HasRestriction(GameState state, Guid targetId, RestrictionType restriction) =>
        ActiveEffects<RestrictionEffect>(state)
            .Any(e => e.TargetCardId == targetId && e.Restriction == restriction);

    public int GetPlayCost(GameState state, CardInstance card, Guid playingPlayerId)
    {
        var def = _catalog.TryGet(card.CardCode);
        int cost = def?.Cost ?? 0;

        foreach (var effect in ActiveEffects<CostReducerEffect>(state))
        {
            if (effect.PlayerId != playingPlayerId) continue;
            if (effect.Condition != null && !effect.Condition(state, card)) continue;
            cost -= effect.Reduction;
        }

        return Math.Max(0, cost);
    }

    public bool IsImmune(GameState state, CardInstance card, CardInstance? effectSource) =>
        HasRestriction(state, card.InstanceId, RestrictionType.CannotBeTargeted);

    // ── Helpers ───────────────────────────────────────────────────────────────

    private IEnumerable<T> ActiveEffects<T>(GameState state) where T : PersistentEffect =>
        _effects.Values.OfType<T>().Where(e => e.IsActive(state));
}
