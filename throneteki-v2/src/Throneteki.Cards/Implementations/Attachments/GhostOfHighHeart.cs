using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.GameEngine.Effects;

namespace Throneteki.Cards.Implementations.Attachments;

/// <summary>
/// Ghost of High Heart (01046) — Attachment, 2 cost.
/// Attached character gains the Stealth keyword.
/// Constant effect.
/// </summary>
[CardDefinition("01046")]
public sealed class GhostOfHighHeart : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Constant("ghost-stealth")
            .Describe("Attached character gains Stealth.")
            .Do(ctx =>
            {
                // The constant effect engine picks this up and applies AddKeywordEffect.
                // The effect registration is handled externally; this ability signals intent.
                var attached = ctx.Source.ParentId.HasValue
                    ? ctx.State.FindCard(ctx.Source.ParentId.Value)
                    : null;

                if (attached == null) return Array.Empty<GameEvent>();

                // Emit an ability triggered event for the effect engine to register
                return new GameEvent[]
                {
                    new AbilityInitiatedEvent(ctx.Source.InstanceId, "ghost-stealth", ctx.ControllingPlayerId) { }
                };
            })
            .Build();
    }
}
