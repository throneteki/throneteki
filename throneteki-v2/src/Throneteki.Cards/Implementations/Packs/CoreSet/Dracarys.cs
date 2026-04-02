using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Dracarys! (01176) — Targaryen event.
/// Action: During a challenge, kneel a card you control named Daenerys Targaryen or
///         a Dragon-trait character you control. Choose a participating character.
///         That character gets -4 STR until end of phase. If its STR is 0, kill it.
/// Ported from: server/game/cards/01-Core/Dracarys.js
///
/// JS cost: ability.costs.kneel(card => card.name === 'Daenerys Targaryen' ||
///          (card.hasTrait('Dragon') &amp;&amp; card.getType() === 'character'))
/// JS target: play area, isParticipating()
/// JS effect: untilEndOfPhase with killByStrength(-4) — combines -4 STR and kill-if-0
///
/// Known gaps:
/// - Cost: should kneel a Daenerys or Dragon character (needs cost system with card selection)
/// - Effect: should use duration-scoped -4 STR that auto-expires at end of phase
/// - Effect: should auto-kill if STR reaches 0 (terminal condition / killByStrength)
/// </summary>
[CardDefinition("01176")]
public sealed class Dracarys : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("dracarys-burn")
            .Describe("Action: Kneel Daenerys/Dragon. Participating character gets -4 STR. Kill if 0.")
            .DuringPhase(GamePhase.Challenges)
            .When(CommonEffects.DuringChallenge)
            // TODO: Cost should be kneel(Daenerys or Dragon character), needs cost system
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea &&
                state.ActiveChallenge != null &&
                (state.ActiveChallenge.Attackers.Contains(target.InstanceId) ||
                 state.ActiveChallenge.Defenders.Contains(target.InstanceId)))
            .Do(ctx => new GameEvent[]
            {
                // TODO: Should kneel the cost card (Daenerys/Dragon), not just log
                CommonEffects.AddToken(ctx.Target!.InstanceId, "strength-penalty", 4),
                // TODO: Should use killByStrength(-4) — auto-kill if STR reaches 0
                // TODO: Effect should expire at end of phase
                CommonEffects.Log($"Dracarys! gives {ctx.Target.CardCode} -4 STR until end of phase"),
            })
            .Build();
    }
}
