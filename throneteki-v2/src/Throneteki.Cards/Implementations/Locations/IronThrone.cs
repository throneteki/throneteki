using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Locations;

/// <summary>
/// The Iron Throne (01045-loc) — Baratheon location, 2 cost.
/// Constant: Your faction card gains the Power challenge icon.
/// Action: Kneel The Iron Throne to gain 2 gold.
/// </summary>
[CardDefinition("01163")]
public sealed class IronThrone : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Constant: faction gains Power icon — registered as a persistent effect by the effect engine
        yield return AbilityBuilder.Constant("iron-throne-power-icon")
            .Describe("Constant: Your faction card gains the Power challenge icon.")
            .Do(ctx => Array.Empty<GameEvent>()) // Handled by EffectEngine AddIconEffect
            .Build();

        // Action: kneel to gain 2 gold
        yield return AbilityBuilder.Action("iron-throne-gold")
            .Describe("Action: Kneel The Iron Throne to gain 2 gold.")
            .When(ctx => !ctx.Source.Kneeled)
            .Do(ctx => new GameEvent[]
            {
                new CardKneeledEvent(ctx.Source.InstanceId, "Iron Throne action") { },
                new GoldGainedEvent(ctx.ControllingPlayerId, 2, "The Iron Throne") { },
            })
            .Build();
    }
}
