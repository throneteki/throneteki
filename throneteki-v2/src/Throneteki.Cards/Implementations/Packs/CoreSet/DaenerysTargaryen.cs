using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Daenerys Targaryen (01160) — 7 cost, 5 STR, Intrigue + Power icons.
/// Targaryen, Lady, Queen.
/// Persistent: While Daenerys is standing, each participating opponent character
/// gets -1 STR.
/// Ported from: server/game/cards/01-Core/DaenerysTargaryen.js
/// </summary>
[CardDefinition("01160")]
public sealed class DaenerysTargaryen : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: while standing, opponent's participating characters get -1 STR
        // Handled by EffectEngine: StrengthModifierEffect applied to opponent participating characters
        yield return AbilityBuilder.Persistent("daenerys-str-debuff")
            .Describe("While Daenerys is standing, each opponent's participating character gets -1 STR.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
