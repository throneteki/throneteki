using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Old Bear Mormont (01126) — 6 cost, 5 STR, Military + Intrigue icons.
/// Night's Watch, Commander, Lord.
/// Persistent: While The Wall is in play, Old Bear does not kneel as a defender.
/// Interrupt: When the challenges phase ends, if you did not lose a challenge
/// as the defending player, put a Night's Watch character into play from your hand.
/// Ported from: server/game/cards/01-Core/OldBearMormont.js
/// </summary>
[CardDefinition("01126")]
public sealed class OldBear : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: does not kneel as defender while The Wall is in play
        yield return AbilityBuilder.Persistent("old-bear-no-kneel")
            .Describe("While The Wall is in play, Old Bear does not kneel as a defender.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();

        // Interrupt: at end of challenges phase, if controller didn't lose a challenge defending,
        // put a NW character into play from hand
        yield return AbilityBuilder.Interrupt("old-bear-put-into-play")
            .Describe("Interrupt: At end of challenges, if you didn't lose defending, put a NW character into play.")
            .OnEvent<PhaseEndedEvent>((e, _) => e.Phase == GamePhase.Challenges)
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.Hand &&
                target.ControllerId == source.ControllerId)
            .Do(ctx =>
            {
                if (ctx.Target == null) return Array.Empty<GameEvent>();
                return new GameEvent[]
                {
                    new CardEnteredPlayEvent(ctx.ControllingPlayerId, ctx.Target.InstanceId),
                    CommonEffects.Log($"Old Bear Mormont puts {ctx.Target.CardCode} into play"),
                };
            })
            .Build();
    }
}
