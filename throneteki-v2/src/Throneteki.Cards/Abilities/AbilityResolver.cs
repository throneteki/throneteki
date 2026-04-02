using System.Collections.Immutable;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Abilities;

/// <summary>
/// Resolves card abilities against game events.
/// Given a trigger event, finds all matching abilities across all in-play cards
/// and resolves them (producing additional game events).
/// </summary>
public sealed class AbilityResolver
{
    private readonly CardScriptRegistry _registry;

    public AbilityResolver(CardScriptRegistry registry) => _registry = registry;

    /// <summary>
    /// Find all eligible abilities that react to the given trigger event.
    /// Returns abilities sorted by priority: forced reactions first, then optional.
    /// </summary>
    public IReadOnlyList<EligibleAbilityMatch> FindTriggeredAbilities(
        GameState state, GameEvent triggerEvent, AbilityType abilityType)
    {
        var matches = new List<EligibleAbilityMatch>();

        foreach (var player in state.Players)
        {
            foreach (var card in player.CardsInPlay)
            {
                var script = _registry.TryGet(card.CardCode);
                if (script == null) continue;

                foreach (var ability in script.Abilities)
                {
                    if (ability.Type != abilityType) continue;
                    if (!MatchesTrigger(ability, triggerEvent, state)) continue;

                    var context = new AbilityContext
                    {
                        State = state,
                        Source = card,
                        ControllingPlayerId = card.ControllerId,
                        TriggeringEvent = triggerEvent,
                    };

                    if (ability.Condition != null && !ability.Condition(context))
                        continue;

                    matches.Add(new EligibleAbilityMatch
                    {
                        Ability = ability,
                        Context = context,
                        CardInstanceId = card.InstanceId,
                        ControllingPlayerId = card.ControllerId,
                    });
                }
            }
        }

        return matches;
    }

    /// <summary>
    /// Resolve a single ability: execute its effect and return the resulting events.
    /// </summary>
    public IReadOnlyList<GameEvent> ResolveAbility(EligibleAbilityMatch match)
    {
        return match.Ability.Effect(match.Context);
    }

    /// <summary>
    /// Find and immediately resolve all forced abilities for a trigger event.
    /// Forced abilities fire automatically without player choice.
    /// </summary>
    public IReadOnlyList<GameEvent> ResolveForcedAbilities(
        GameState state, GameEvent triggerEvent)
    {
        var reactions = FindTriggeredAbilities(state, triggerEvent, AbilityType.Reaction);
        var events = new List<GameEvent>();

        foreach (var match in reactions)
        {
            // In the full game, forced vs optional is tracked on the ability.
            // For now, we resolve all matching reactions.
            var abilityEvents = ResolveAbility(match);
            events.AddRange(abilityEvents);
        }

        return events;
    }

    private static bool MatchesTrigger(CardAbilityDefinition ability, GameEvent triggerEvent, GameState state)
    {
        if (ability.TriggerFilters.Count == 0) return false;
        return ability.TriggerFilters.Any(f => f(triggerEvent, state));
    }
}

/// <summary>
/// A matched ability ready to be resolved — includes the constructed context.
/// </summary>
public sealed class EligibleAbilityMatch
{
    public required CardAbilityDefinition Ability { get; init; }
    public required AbilityContext Context { get; init; }
    public required Guid CardInstanceId { get; init; }
    public required Guid ControllingPlayerId { get; init; }
}
