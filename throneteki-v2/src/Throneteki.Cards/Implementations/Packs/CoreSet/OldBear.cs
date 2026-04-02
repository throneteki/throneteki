using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Old Bear Mormont (01126) — 6 cost, 5 STR, Military + Intrigue icons.
/// Night's Watch, Commander, Lord.
/// Persistent: While you control The Wall, Old Bear does not kneel as a defender.
/// Interrupt: When the challenges phase ends, if you did not lose a challenge as the
///            defending player this phase, choose a Night's Watch character in your hand
///            and put it into play.
/// Ported from: server/game/cards/01-Core/OldBearMormont.js
///
/// JS persistent: condition=controller has card named 'The Wall' in play, doesNotKneelAsDefender
/// JS interrupt: when=onPhaseEnded(challenge), condition=ChallengeTracker confirms no losses
///               as defender, target=hand + controller + isFaction('thenightswatch') + canPutIntoPlay
///
/// Known gaps:
/// - Persistent: no condition check for The Wall being in play (needs EffectEngine)
/// - Interrupt: no "did not lose as defender" condition check (needs ChallengeTracker)
/// - Target: missing Night's Watch faction filter (needs ICardCatalog)
/// - Target: missing canPutIntoPlay validation
/// </summary>
[CardDefinition("01126")]
public sealed class OldBear : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Persistent("old-bear-no-kneel")
            .Describe("While you control The Wall, Old Bear does not kneel as a defender.")
            .Do(_ => Array.Empty<GameEvent>())
            // TODO: Condition: controller.anyCardsInPlay(card => card.name === 'The Wall')
            .Build();

        yield return AbilityBuilder.Interrupt("old-bear-put-into-play")
            .Describe("Interrupt: At end of challenges, if you didn't lose defending, put a NW character into play.")
            .OnEvent<PhaseEndedEvent>((e, _) => e.Phase == GamePhase.Challenges)
            // TODO: Add When condition checking ChallengeTracker for no losses as defender
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.Hand &&
                target.ControllerId == source.ControllerId)
                // TODO: Filter to isFaction('thenightswatch') via ICardCatalog
                // TODO: Check canPutIntoPlay
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
