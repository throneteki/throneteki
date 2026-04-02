using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// A Noble Cause (01004) — Plot. Income 3, Initiative 6, Claim 1, Reserve 6.
/// Persistent: Reduce the cost of the first Lord or Lady character you marshal
/// each round by 2.
/// Ported from: server/game/cards/01-Core/ANobleCause.js
/// </summary>
[CardDefinition("01004")]
public sealed class ANobleCause : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: cost reduction for first Lord/Lady marshalled each round
        // Handled by EffectEngine: CostReducerEffect for Lord/Lady traits
        yield return AbilityBuilder.Persistent("noble-cause-reduction")
            .Describe("Reduce the cost of the first Lord or Lady you marshal each round by 2.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
