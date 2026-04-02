using Throneteki.Domain.Commands;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Interfaces;

/// <summary>
/// Processes player commands against game state, producing domain events.
/// Implementations must be pure: no I/O, no side effects.
/// </summary>
public interface IGameEngine
{
    /// <summary>
    /// Process a command against the current state, returning resulting events.
    /// </summary>
    EngineResult Process(GameState state, GameCommand command);
}
