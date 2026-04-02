using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Interfaces;

/// <summary>
/// Applies domain events to produce a new game state.
/// Implementations must be pure: Apply(state, event) -> newState.
/// </summary>
public interface IGameStateProjector
{
    /// <summary>Apply a single event to produce the next state.</summary>
    GameState Apply(GameState state, GameEvent @event);

    /// <summary>Rebuild state by replaying a sequence of events over an initial state.</summary>
    GameState Rebuild(GameState initial, IReadOnlyList<GameEvent> events);
}
