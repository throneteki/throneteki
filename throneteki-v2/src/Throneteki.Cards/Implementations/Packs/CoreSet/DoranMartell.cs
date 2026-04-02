using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Doran Martell (01105) — 6 cost, 3 STR, Intrigue + Power icons. Martell, Lord.
/// Persistent: Each other Martell Lord and Lady character you control gets +X STR,
/// where X is the number of plots in your used pile.
/// Ported from: server/game/cards/01-Core/DoranMartell.js
/// </summary>
[CardDefinition("01105")]
public sealed class DoranMartell : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: dynamic STR buff based on used plot count
        // Handled by EffectEngine: StrengthModifierEffect with dynamic calculation
        yield return AbilityBuilder.Persistent("doran-str-buff")
            .Describe("Each other Martell Lord/Lady you control gets +X STR where X = your used plots.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
