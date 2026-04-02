using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Catelyn Stark (01143) — 5 cost, 4 STR, Intrigue + Power icons.
/// Reaction: After Catelyn Stark wins a challenge, draw 1 card.
/// </summary>
[CardDefinition("01143")]
public sealed class CatelynStark : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("catelyn-draw")
            .Describe("Reaction: After Catelyn wins a challenge, draw 1 card.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, _) => e.WinnerId != null)
            .When(ctx => CommonEffects.SourceIsParticipating(ctx) &&
                         CommonEffects.ControllerWonChallenge(ctx,
                             (ChallengeResultDeterminedEvent)ctx.TriggeringEvent!))
            .Do(ctx => CommonEffects.DrawCards(ctx, 1))
            .Build();
    }
}
