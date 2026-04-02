using Throneteki.Domain.Commands;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;
using Throneteki.GameEngine.Phases;

namespace Throneteki.GameEngine;

/// <summary>
/// Pure game engine. No I/O, no side effects.
/// Process(state, command) -> EngineResult containing the resulting events.
/// </summary>
public sealed class GameEngine : IGameEngine
{
    private readonly DrawPhase _drawPhase = new();

    /// <summary>Process a command against the current game state.</summary>
    public EngineResult Process(GameState state, GameCommand command)
    {
        if (state.Status == GameStatus.Completed)
            return EngineResult.Invalid("Game is already over.");

        return (state.Phase, command) switch
        {
            // Auto-advance commands route to the current phase
            (GamePhase.Draw, SystemAdvanceCommand) => ProcessDrawPhase(state),

            // Player commands
            (_, ConcedCommand c) => ProcessConcede(state, c),

            // Unknown command for current phase
            _ => EngineResult.Invalid($"Command {command.GetType().Name} is not valid in phase {state.Phase}.")
        };
    }

    private EngineResult ProcessDrawPhase(GameState state)
    {
        var events = _drawPhase.Execute(state);
        return EngineResult.Success(events);
    }

    private static EngineResult ProcessConcede(GameState state, ConcedCommand command)
    {
        var winner = state.Players.FirstOrDefault(p => p.PlayerId != command.PlayerId);
        var events = new List<GameEvent>
        {
            new GameMessageEvent($"{state.GetPlayer(command.PlayerId).Username} conceded."),
            new GameEndedEvent(winner?.PlayerId, $"{state.GetPlayer(command.PlayerId).Username} conceded.")
        };
        return EngineResult.Success(events);
    }
}
