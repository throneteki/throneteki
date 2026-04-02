using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// A Game of Thrones (01003) — Plot. Income 4, Initiative 7, Claim 1, Reserve 6.
/// Persistent: Players cannot initiate Military or Power challenges until they have
/// won an Intrigue challenge that phase.
/// Ported from: server/game/cards/01-Core/AGameOfThrones.js
/// </summary>
[CardDefinition("01003")]
public sealed class AGameOfThrones : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: blocks Military/Power challenges until player wins Intrigue
        // Handled by EffectEngine: RestrictionEffect tracks intrigue wins per phase
        yield return AbilityBuilder.Persistent("agot-challenge-restriction")
            .Describe("Players cannot initiate Military or Power challenges until they win an Intrigue challenge.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
