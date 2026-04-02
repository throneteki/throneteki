using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Randyll Tarly (01183) — 6 cost, 6 STR, Military + Power icons. Tyrell, Lord.
/// Renown keyword.
/// Reaction: After Randyll Tarly's STR is increased, stand him. (Limit 2 per phase.)
/// Ported from: server/game/cards/01-Core/RandyllTarly.js
///
/// JS trigger: onCardStrengthChanged where event.card === this, event.amount > 0,
///             event.applying === true, and this.kneeled === true.
/// JS limit: perPhase(2)
///
/// Known gaps:
/// - Trigger should be onCardStrengthChanged (any STR increase), not just token additions
/// - Limit should be perPhase(2), not perRound(2) — needs AbilityBuilder.LimitPerPhase()
/// - Missing event.applying check (distinguish apply vs unapply)
/// </summary>
[CardDefinition("01183")]
public sealed class RandyllTarly : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // TODO: Trigger should be a CardStrengthChangedEvent (not yet defined)
        //       that fires for ALL strength changes, not just token additions.
        // TODO: Limit should be perPhase(2), not perRound(2).
        yield return AbilityBuilder.Reaction("randyll-stand-on-str-increase")
            .Describe("Reaction: After Randyll's STR is increased, stand him. (Limit 2 per phase.)")
            .OnEvent<TokenAddedEvent>((e, _) =>
                e.TokenType == "strength-boost")
            .When(ctx =>
            {
                var trigger = (TokenAddedEvent)ctx.TriggeringEvent!;
                return trigger.CardInstanceId == ctx.Source.InstanceId && ctx.Source.Kneeled;
            })
            .LimitPerRound(2) // TODO: Should be LimitPerPhase(2)
            .Do(ctx => new GameEvent[] { CommonEffects.Stand(ctx.Source.InstanceId) })
            .Build();
    }
}
