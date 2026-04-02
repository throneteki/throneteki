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
    private readonly PlotPhase _plotPhase = new();
    private readonly MarshallingPhase _marshallingPhase;
    private readonly ChallengesPhase _challengesPhase;
    private readonly DominancePhase _dominancePhase = new();
    private readonly StandingPhase _standingPhase = new();
    private readonly TaxationPhase _taxationPhase = new();

    public GameEngine(ICardCatalog? catalog = null)
    {
        _marshallingPhase = new MarshallingPhase(catalog);
        _challengesPhase = new ChallengesPhase(catalog);
    }

    /// <summary>Process a command against the current game state.</summary>
    public EngineResult Process(GameState state, GameCommand command)
    {
        if (state.Status == GameStatus.Completed)
            return EngineResult.Invalid("Game is already over.");

        return (state.Phase, command) switch
        {
            // Auto-advance commands route to the current phase
            (GamePhase.Plot, SystemAdvanceCommand) => EngineResult.Success(_plotPhase.Enter(state)),
            (GamePhase.Draw, SystemAdvanceCommand) => ProcessDrawPhase(state),
            (GamePhase.Marshalling, SystemAdvanceCommand) => EngineResult.Success(_marshallingPhase.Enter(state)),

            // Plot phase player commands
            (GamePhase.Plot, SelectPlotCommand c) => ProcessSelectPlot(state, c),

            // Marshalling phase player commands
            (GamePhase.Marshalling, MarshalCardCommand c) => ProcessMarshalCard(state, c),
            (GamePhase.Marshalling, ClaimMarshallingDoneCommand c) => ProcessMarshallingDone(state, c),

            // Challenges phase
            (GamePhase.Challenges, SystemAdvanceCommand) => EngineResult.Success(_challengesPhase.Enter(state)),
            (GamePhase.Challenges, InitiateChallengeCommand c) => ProcessInitiateChallenge(state, c),
            (GamePhase.Challenges, DeclareAttackersCommand c) => ProcessDeclareAttackers(state, c),
            (GamePhase.Challenges, DeclareDefendersCommand c) => ProcessDeclareDefenders(state, c),
            (GamePhase.Challenges, DoneCommand c) => ProcessResolveChallenge(state, c),
            (GamePhase.Challenges, PassChallengesCommand c) => EngineResult.Success(_challengesPhase.Pass(state, c)),

            // Dominance / Standing / Taxation phases (fully automated)
            (GamePhase.Dominance, SystemAdvanceCommand) => EngineResult.Success(_dominancePhase.Execute(state)),
            (GamePhase.Standing, SystemAdvanceCommand) => EngineResult.Success(_standingPhase.Execute(state)),
            (GamePhase.Taxation, SystemAdvanceCommand) => EngineResult.Success(_taxationPhase.Execute(state)),

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

    private EngineResult ProcessSelectPlot(GameState state, SelectPlotCommand command)
    {
        var (isValid, error, events) = _plotPhase.SelectPlot(state, command);
        return isValid ? EngineResult.Success(events) : EngineResult.Invalid(error!);
    }

    private EngineResult ProcessMarshalCard(GameState state, MarshalCardCommand command)
    {
        var (isValid, error, events) = _marshallingPhase.MarshalCard(state, command);
        return isValid ? EngineResult.Success(events) : EngineResult.Invalid(error!);
    }

    private EngineResult ProcessMarshallingDone(GameState state, ClaimMarshallingDoneCommand command)
    {
        var events = _marshallingPhase.Done(state, command);
        return EngineResult.Success(events);
    }

    private EngineResult ProcessInitiateChallenge(GameState state, InitiateChallengeCommand command)
    {
        var (isValid, error, events) = _challengesPhase.InitiateChallenge(state, command);
        return isValid ? EngineResult.Success(events) : EngineResult.Invalid(error!);
    }

    private EngineResult ProcessDeclareAttackers(GameState state, DeclareAttackersCommand command)
    {
        var (isValid, error, events) = _challengesPhase.DeclareAttackers(state, command);
        return isValid ? EngineResult.Success(events) : EngineResult.Invalid(error!);
    }

    private EngineResult ProcessDeclareDefenders(GameState state, DeclareDefendersCommand command)
    {
        var (isValid, error, events) = _challengesPhase.DeclareDefenders(state, command);
        return isValid ? EngineResult.Success(events) : EngineResult.Invalid(error!);
    }

    private EngineResult ProcessResolveChallenge(GameState state, DoneCommand command)
    {
        var (isValid, error, events) = _challengesPhase.Resolve(state, command);
        return isValid ? EngineResult.Success(events) : EngineResult.Invalid(error!);
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
