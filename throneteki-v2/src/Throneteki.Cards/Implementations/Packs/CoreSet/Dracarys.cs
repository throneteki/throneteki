using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Dracarys! (01045) — Targaryen event, 2 cost.
/// Action: During a challenge, kneel your faction card. Choose a participating character.
/// That character gets -4 STR until end of challenge. If its STR is 0 or less, kill it.
/// </summary>
[CardDefinition("01045")]
public sealed class Dracarys : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("dracarys-burn")
            .Describe("Kneel your faction card. Choose a participating character. It gets -4 STR.")
            .DuringPhase(GamePhase.Challenges)
            .When(CommonEffects.FactionIsStanding)
            .When(CommonEffects.DuringChallenge)
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea &&
                state.ActiveChallenge != null &&
                (state.ActiveChallenge.Attackers.Contains(target.InstanceId) ||
                 state.ActiveChallenge.Defenders.Contains(target.InstanceId)))
            .Do(ctx => CommonEffects.KneelFactionThen(ctx,
                CommonEffects.AddToken(ctx.Target!.InstanceId, "strength-penalty", 4)))
            .Build();
    }
}
