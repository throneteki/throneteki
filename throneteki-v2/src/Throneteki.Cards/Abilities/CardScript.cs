using System.Collections.Immutable;

namespace Throneteki.Cards.Abilities;

/// <summary>
/// Base class for all card scripts.  Each card code maps to exactly one CardScript subclass
/// (discovered via reflection from the <see cref="CardDefinitionAttribute"/>).
/// Card scripts declare their abilities using the <see cref="AbilityBuilder"/> DSL.
/// </summary>
public abstract class CardScript
{
    private ImmutableList<CardAbilityDefinition>? _abilities;

    /// <summary>All abilities declared on this card.</summary>
    public IReadOnlyList<CardAbilityDefinition> Abilities =>
        _abilities ??= DeclareAbilities().ToImmutableList();

    /// <summary>
    /// Override to declare this card's abilities using <see cref="AbilityBuilder"/>.
    /// Return an empty enumerable for vanilla cards (no abilities).
    /// </summary>
    protected virtual IEnumerable<CardAbilityDefinition> DeclareAbilities() =>
        Enumerable.Empty<CardAbilityDefinition>();
}

/// <summary>
/// Marks a <see cref="CardScript"/> subclass as the implementation for a specific card code.
/// The card code must match exactly the code in the card catalog (e.g. "01141").
/// </summary>
[AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
public sealed class CardDefinitionAttribute : Attribute
{
    public string CardCode { get; }
    public CardDefinitionAttribute(string cardCode) => CardCode = cardCode;
}
