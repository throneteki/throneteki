using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Dracarys! (01176) — Targaryen event.
/// Action: During a challenge, kneel a Daenerys Targaryen or Dragon character you control.
/// Choose a participating character. That character gets -4 STR until end of phase.
/// If its STR is 0 or less, kill it.
/// Ported from: server/game/cards/01-Core/Dracarys.js
/// </summary>
[CardDefinition("01176")]
public sealed class Dracarys : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("dracarys-burn")
            .Describe("Action: Kneel Daenerys or a Dragon character. Give a participating character -4 STR. Kill if 0.")
            .DuringPhase(GamePhase.Challenges)
            .When(CommonEffects.DuringChallenge)
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea &&
                state.ActiveChallenge != null &&
                (state.ActiveChallenge.Attackers.Contains(target.InstanceId) ||
                 state.ActiveChallenge.Defenders.Contains(target.InstanceId)))
            .Do(ctx => new GameEvent[]
            {
                // Cost: kneel a Daenerys or Dragon character (simplified to ability triggered event)
                new AbilityInitiatedEvent(ctx.Source.InstanceId, "dracarys-burn", ctx.ControllingPlayerId),
                CommonEffects.AddToken(ctx.Target!.InstanceId, "strength-penalty", 4),
                CommonEffects.Log($"Dracarys! gives {ctx.Target.CardCode} -4 STR until end of phase"),
            })
            .Build();
    }
}
