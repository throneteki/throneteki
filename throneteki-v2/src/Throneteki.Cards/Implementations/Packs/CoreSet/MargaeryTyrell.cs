using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Margaery Tyrell (01181) — 3 cost, 3 STR, Intrigue + Power icons. Tyrell, Lady.
/// Action (Challenges phase): Kneel Margaery to choose a character. That character
/// gets +3 STR until end of phase.
/// Ported from: server/game/cards/01-Core/MargaeryTyrell.js
///
/// JS: cost=kneelSelf, target=play area + character type, effect=untilEndOfPhase modifyStrength(3)
/// TODO: Target needs character type filter via ICardCatalog
/// TODO: STR boost should expire at end of phase (needs duration-scoped effect system)
/// </summary>
[CardDefinition("01181")]
public sealed class MargaeryTyrell : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("margaery-str-boost")
            .Describe("Action: Kneel Margaery to give a character +3 STR until end of phase.")
            .DuringPhase(GamePhase.Challenges)
            .When(CommonEffects.SourceIsStanding)
            .TargetCard((state, source, target) =>
                target.Location == CardLocation.PlayArea)
                // TODO: Filter to character type via ICardCatalog
            .Do(ctx => CommonEffects.KneelSelfThen(ctx,
                CommonEffects.AddToken(ctx.Target!.InstanceId, "strength-boost", 3),
                CommonEffects.Log($"Margaery Tyrell gives {ctx.Target.CardCode} +3 STR until end of phase")))
            .Build();
    }
}
