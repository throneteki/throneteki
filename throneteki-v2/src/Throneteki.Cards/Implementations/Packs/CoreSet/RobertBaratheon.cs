using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Robert Baratheon (01048) — 7 cost, 6 STR, Military + Power icons.
/// Renown keyword.
/// Reaction: After Robert Baratheon wins a Power challenge, kneel the losing player's
/// faction card and gain 1 power for your faction.
/// </summary>
[CardDefinition("01048")]
public sealed class RobertBaratheon : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("robert-power-win")
            .Describe("Reaction: After Robert wins a Power challenge, kneel losing faction card and gain 1 power.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
                state.ActiveChallenge?.Type == ChallengeIcon.Power && e.WinnerId != null)
            .When(ctx => CommonEffects.ControllerIsAttacker(ctx) && CommonEffects.SourceIsParticipating(ctx))
            .Do(ctx =>
            {
                var challenge = ctx.State.ActiveChallenge!;
                var loser = ctx.State.GetPlayer(challenge.DefendingPlayerId);
                return new GameEvent[]
                {
                    CommonEffects.Kneel(loser.Faction.InstanceId, "Robert Baratheon"),
                    CommonEffects.GainFactionPower(ctx, 1, "Robert Baratheon"),
                };
            })
            .Build();
    }
}
