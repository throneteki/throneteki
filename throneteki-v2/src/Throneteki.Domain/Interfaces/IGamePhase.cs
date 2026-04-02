using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Interfaces;

/// <summary>
/// Encapsulates the logic for a single game phase.
/// Each phase knows how to enter, handle commands, detect completion, and exit.
/// </summary>
public interface IGamePhase
{
    GamePhase Phase { get; }

    /// <summary>
    /// Called when the phase begins. Returns the initial events (e.g., PhaseStartedEvent,
    /// any automatic draws, prompts, etc.)
    /// </summary>
    IReadOnlyList<GameEvent> Enter(GameState state);

    /// <summary>
    /// Process a player command within this phase.
    /// Returns resulting events. Returns empty if command is not applicable.
    /// </summary>
    IReadOnlyList<GameEvent> ProcessCommand(GameState state, GameCommand command);

    /// <summary>True when the phase has completed and the engine should advance to the next phase.</summary>
    bool IsComplete(GameState state);

    /// <summary>The phase to transition to when this phase completes. Null to end the round.</summary>
    GamePhase? NextPhase(GameState state);

    /// <summary>
    /// Called when exiting the phase. Returns any cleanup events.
    /// Defaults to empty.
    /// </summary>
    IReadOnlyList<GameEvent> Exit(GameState state) => Array.Empty<GameEvent>();
}
