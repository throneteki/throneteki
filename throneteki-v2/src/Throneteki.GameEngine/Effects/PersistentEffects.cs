using Throneteki.Domain.Enums;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Effects;

/// <summary>Base for all persistent effects registered with the EffectEngine.</summary>
public abstract record PersistentEffect
{
    public Guid EffectId { get; init; } = Guid.NewGuid();
    public Guid SourceId { get; init; }

    protected PersistentEffect(Guid sourceId) => SourceId = sourceId;

    /// <summary>Override to check if this effect currently applies (e.g. conditional effects).</summary>
    public virtual bool IsActive(GameState state) => true;
}

/// <summary>Adds a challenge icon to a specific card.</summary>
public sealed record AddIconEffect : PersistentEffect
{
    public Guid TargetCardId { get; init; }
    public ChallengeIcon Icon { get; init; }

    public AddIconEffect(Guid sourceId, Guid targetCardId, ChallengeIcon icon) : base(sourceId)
    {
        EffectId = sourceId; // reuse sourceId as effectId for registration
        TargetCardId = targetCardId;
        Icon = icon;
    }

    // Allow custom effectId
    public AddIconEffect(Guid effectId, Guid sourceId, Guid targetCardId, ChallengeIcon icon) : base(sourceId)
    {
        EffectId = effectId;
        TargetCardId = targetCardId;
        Icon = icon;
    }
}

/// <summary>Removes a challenge icon from a specific card.</summary>
public sealed record RemoveIconEffect : PersistentEffect
{
    public Guid TargetCardId { get; init; }
    public ChallengeIcon Icon { get; init; }

    public RemoveIconEffect(Guid sourceId, Guid targetCardId, ChallengeIcon icon) : base(sourceId)
    {
        TargetCardId = targetCardId;
        Icon = icon;
    }
}

/// <summary>Modifies the strength of a specific card by a fixed amount.</summary>
public sealed record StrengthModifierEffect : PersistentEffect
{
    public Guid TargetCardId { get; init; }
    public int Amount { get; init; }

    public StrengthModifierEffect(Guid sourceId, Guid targetCardId, int amount) : base(sourceId)
    {
        TargetCardId = targetCardId;
        Amount = amount;
    }
}

/// <summary>Adds a restriction to a specific card or player (e.g. cannot be killed).</summary>
public sealed record RestrictionEffect : PersistentEffect
{
    public Guid TargetCardId { get; init; }
    public RestrictionType Restriction { get; init; }

    public RestrictionEffect(Guid sourceId, Guid targetCardId, RestrictionType restriction) : base(sourceId)
    {
        TargetCardId = targetCardId;
        Restriction = restriction;
    }
}

/// <summary>Reduces play cost for cards played by a specific player.</summary>
public sealed record CostReducerEffect : PersistentEffect
{
    public Guid PlayerId { get; init; }
    public int Reduction { get; init; }
    public Func<GameState, CardInstance, bool>? Condition { get; init; }

    public CostReducerEffect(Guid sourceId, Guid playerId, int reduction, Func<GameState, CardInstance, bool>? condition)
        : base(sourceId)
    {
        PlayerId = playerId;
        Reduction = reduction;
        Condition = condition;
    }
}

/// <summary>Adds a keyword to a specific card.</summary>
public sealed record AddKeywordEffect : PersistentEffect
{
    public Guid TargetCardId { get; init; }
    public Keyword Keyword { get; init; }

    public AddKeywordEffect(Guid sourceId, Guid targetCardId, Keyword keyword) : base(sourceId)
    {
        TargetCardId = targetCardId;
        Keyword = keyword;
    }
}
