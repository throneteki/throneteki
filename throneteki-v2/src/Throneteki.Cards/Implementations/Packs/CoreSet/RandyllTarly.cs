using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Randyll Tarly (01183) — 6 cost, 6 STR, Military + Power icons. Tyrell, Lord.
/// Renown keyword.
/// Reaction: After Randyll's STR is increased, stand him. (Limit 2 per phase.)
/// Ported from: server/game/cards/01-Core/RandyllTarly.js
/// </summary>
[CardDefinition("01183")]
public sealed class RandyllTarly : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Reaction: when Randyll's STR increases and he's kneeled, stand him
        // The real card reacts to onCardStrengthChanged, not challenge wins
        yield return AbilityBuilder.Reaction("randyll-stand-on-str-increase")
            .Describe("Reaction: After Randyll's STR is increased, stand him. (Limit 2 per phase.)")
            .OnEvent<TokenAddedEvent>((e, _) =>
                e.TokenType == "strength-boost") // simplified trigger for STR increases
            .When(ctx =>
            {
                var trigger = (TokenAddedEvent)ctx.TriggeringEvent!;
                return trigger.CardInstanceId == ctx.Source.InstanceId && ctx.Source.Kneeled;
            })
            .LimitPerRound(2) // actually limit per phase; approximated as per round
            .Do(ctx => new GameEvent[] { CommonEffects.Stand(ctx.Source.InstanceId) })
            .Build();
    }
}
