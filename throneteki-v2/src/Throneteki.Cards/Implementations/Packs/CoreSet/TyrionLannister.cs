using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Tyrion Lannister (01089) — 5 cost, 4 STR, Intrigue + Power icons.
/// Reaction: After Tyrion wins an Intrigue challenge as the attacking player,
/// the losing opponent discards 1 card at random from their hand.
/// </summary>
[CardDefinition("01089")]
public sealed class TyrionLannister : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("tyrion-intrigue-win")
            .Describe("Reaction: After Tyrion wins an Intrigue challenge as attacker, opponent discards 1 card at random.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
            {
                var challenge = state.ActiveChallenge;
                return challenge != null &&
                       challenge.Type == ChallengeIcon.Intrigue &&
                       e.WinnerId == challenge.AttackingPlayerId &&
                       challenge.Attackers.Count > 0;
            })
            .When(ctx => CommonEffects.ControllerIsAttacker(ctx) && CommonEffects.SourceIsParticipating(ctx))
            .Do(ctx =>
            {
                var challenge = ctx.State.ActiveChallenge!;
                return CommonEffects.DiscardRandom(ctx.State, challenge.DefendingPlayerId, 1);
            })
            .Build();
    }
}
