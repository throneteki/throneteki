using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Marching Orders (01016) — Plot. Income 0, Initiative 0, Claim 2, Reserve 4.
/// Persistent: You cannot marshal locations or attachments. You cannot play events.
/// Ported from: server/game/cards/01-Core/MarchingOrders.js
/// </summary>
[CardDefinition("01016")]
public sealed class MarchingOrders : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: cannot marshal locations/attachments, cannot play events
        // Handled by EffectEngine: RestrictionEffect on card types
        yield return AbilityBuilder.Persistent("marching-orders-restriction")
            .Describe("You cannot marshal locations or attachments. You cannot play events.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
