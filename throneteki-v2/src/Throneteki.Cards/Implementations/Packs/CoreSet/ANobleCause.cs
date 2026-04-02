using Throneteki.Cards.Abilities;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// A Noble Cause (01004) — Income 3, Initiative 6, Claim 1, Reserve 6.
/// When Revealed: Reduce the cost of the next Lord or Lady you marshal this
/// phase by 2 (simplified: no abilities, cost reduction handled by effect engine).
/// </summary>
[CardDefinition("01004")]
public sealed class ANobleCause : CardScript
{
    // Cost reduction is a persistent effect registered at reveal time
    // by the effect engine. No card script ability needed.
}
