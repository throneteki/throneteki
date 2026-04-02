using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Eddard Stark (01144) — 6 cost, 5 STR, Military + Power icons. Stark, Lord.
/// Renown keyword.
/// Reaction: After a challenge is initiated against you, if Eddard is kneeled, stand him.
/// Ported from: server/game/cards/01-Core/EddardStark.js
/// </summary>
[CardDefinition("01144")]
public sealed class EddardStark : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("eddard-stand")
            .Describe("Reaction: After a challenge is initiated against you, stand Eddard.")
            .OnEvent<ChallengeInitiatedEvent>((e, _) => true)
            .When(ctx =>
            {
                var trigger = (ChallengeInitiatedEvent)ctx.TriggeringEvent!;
                return trigger.DefendingPlayerId == ctx.ControllingPlayerId &&
                       ctx.Source.Kneeled;
            })
            .Do(ctx => new GameEvent[] { CommonEffects.Stand(ctx.Source.InstanceId) })
            .Build();
    }
}
