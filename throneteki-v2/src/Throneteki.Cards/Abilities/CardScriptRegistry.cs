using System.Collections.Immutable;
using System.Reflection;

namespace Throneteki.Cards.Abilities;

/// <summary>
/// Discovers all <see cref="CardScript"/> subclasses in the assembly that are annotated with
/// <see cref="CardDefinitionAttribute"/> and registers them by card code.
/// Thread-safe; built once at startup.
/// </summary>
public sealed class CardScriptRegistry
{
    private readonly ImmutableDictionary<string, Func<CardScript>> _factories;

    private CardScriptRegistry(ImmutableDictionary<string, Func<CardScript>> factories)
        => _factories = factories;

    /// <summary>Build a registry from all assemblies passed in (typically just Throneteki.Cards).</summary>
    public static CardScriptRegistry BuildFromAssemblies(params Assembly[] assemblies)
    {
        var factories = new Dictionary<string, Func<CardScript>>(StringComparer.OrdinalIgnoreCase);

        foreach (var assembly in assemblies)
        {
            foreach (var type in assembly.GetTypes())
            {
                var attr = type.GetCustomAttribute<CardDefinitionAttribute>();
                if (attr == null) continue;
                if (!type.IsSubclassOf(typeof(CardScript))) continue;
                if (type.IsAbstract) continue;

                var captured = type;
                factories[attr.CardCode] = () => (CardScript)Activator.CreateInstance(captured)!;
            }
        }

        return new CardScriptRegistry(factories.ToImmutableDictionary(StringComparer.OrdinalIgnoreCase));
    }

    /// <summary>Build a registry scanning the Throneteki.Cards assembly.</summary>
    public static CardScriptRegistry BuildDefault() =>
        BuildFromAssemblies(typeof(CardScriptRegistry).Assembly);

    /// <summary>Get the script for the given card code, or null if no script is registered.</summary>
    public CardScript? TryGet(string cardCode) =>
        _factories.TryGetValue(cardCode, out var factory) ? factory() : null;

    /// <summary>Get the script for the given card code, throwing if not found.</summary>
    public CardScript Get(string cardCode) =>
        TryGet(cardCode) ?? throw new KeyNotFoundException($"No card script registered for '{cardCode}'.");

    public bool HasScript(string cardCode) => _factories.ContainsKey(cardCode);

    public IReadOnlyCollection<string> RegisteredCodes => (IReadOnlyCollection<string>)_factories.Keys;
}
