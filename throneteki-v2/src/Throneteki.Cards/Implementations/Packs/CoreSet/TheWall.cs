using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// The Wall (01137) — 4 cost, Night's Watch location.
/// Forced Reaction: After you lose an unopposed challenge, kneel The Wall.
/// Interrupt: When the challenges phase ends, kneel The Wall to gain 2 power.
/// Persistent: Each NW character gets +1 STR.
/// Ported from: server/game/cards/01-Core/TheWall.js
/// </summary>
[CardDefinition("01137")]
public sealed class TheWall : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Forced Reaction: after losing unopposed, kneel The Wall
        yield return AbilityBuilder.Reaction("wall-forced-kneel")
            .Describe("Forced Reaction: After you lose an unopposed challenge, kneel The Wall.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, _) => e.Unopposed && e.WinnerId != null)
            .When(ctx =>
            {
                var result = (ChallengeResultDeterminedEvent)ctx.TriggeringEvent!;
                return CommonEffects.ControllerIsDefender(ctx) &&
                       result.WinnerId != ctx.ControllingPlayerId &&
                       CommonEffects.SourceIsStanding(ctx);
            })
            .Do(ctx => new GameEvent[] { CommonEffects.Kneel(ctx.Source.InstanceId, "The Wall (forced)") })
            .Build();

        // Interrupt: at end of challenges phase, kneel The Wall to gain 2 power for faction
        yield return AbilityBuilder.Interrupt("wall-gain-power")
            .Describe("Interrupt: When challenges phase ends, kneel The Wall to gain 2 power.")
            .OnEvent<PhaseEndedEvent>((e, _) => e.Phase == GamePhase.Challenges)
            .When(CommonEffects.SourceIsStanding)
            .Do(ctx => new GameEvent[]
            {
                CommonEffects.Kneel(ctx.Source.InstanceId, "The Wall"),
                CommonEffects.GainFactionPower(ctx, 2, "The Wall"),
            })
            .Build();

        // Persistent: each NW character gets +1 STR
        yield return AbilityBuilder.Persistent("wall-str-buff")
            .Describe("Each Night's Watch character you control gets +1 STR.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
