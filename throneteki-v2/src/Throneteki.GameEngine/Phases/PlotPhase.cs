using System.Collections.Immutable;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Plot Phase: Both players secretly select a plot card, then simultaneously reveal.
/// After revelation the engine advances to the Draw phase.
/// </summary>
public sealed class PlotPhase
{
    /// <summary>
    /// Called when the engine enters the Plot phase (SystemAdvanceCommand).
    /// Emits PhaseStartedEvent and a PromptIssuedEvent for each player.
    /// </summary>
    public IReadOnlyList<GameEvent> Enter(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Plot) { SequenceNumber = seq++ });

        foreach (var player in state.Players)
        {
            events.Add(new PromptIssuedEvent(player.PlayerId, new PromptState
            {
                PromptId = Guid.NewGuid().ToString(),
                ActivePlayerId = player.PlayerId,
                Title = "Select a plot",
                PromptType = PromptType.SelectCard,
                SelectableCardIds = player.PlotDeck.Select(c => c.InstanceId).ToImmutableList(),
            })
            { SequenceNumber = seq++ });
        }

        return events;
    }

    /// <summary>
    /// Called when a player submits a SelectPlotCommand.
    /// Returns invalid if the chosen card is not in the player's plot deck.
    /// If both players have now selected, triggers revelation and advances to Draw.
    /// </summary>
    public (bool IsValid, string? Error, IReadOnlyList<GameEvent> Events) SelectPlot(
        GameState state, SelectPlotCommand command)
    {
        var player = state.GetPlayer(command.PlayerId);

        var chosenPlot = player.PlotDeck.FirstOrDefault(c => c.InstanceId == command.CardInstanceId);
        if (chosenPlot == null)
            return (false, "Selected card is not in the plot deck.", Array.Empty<GameEvent>());

        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PlotSelectedEvent(player.PlayerId, chosenPlot.InstanceId) { SequenceNumber = seq++ });

        // Determine if the other player has already selected
        var otherPlayer = state.Players.FirstOrDefault(p => p.PlayerId != command.PlayerId);
        bool otherHasSelected = otherPlayer?.SelectedPlot != null;

        if (otherHasSelected)
        {
            // Both players have now selected — reveal both plots
            foreach (var p in state.Players)
            {
                Guid revealedId;
                if (p.PlayerId == command.PlayerId)
                    revealedId = command.CardInstanceId;
                else
                    revealedId = p.SelectedPlot!.InstanceId;

                events.Add(new PlotRevealedEvent(p.PlayerId, revealedId) { SequenceNumber = seq++ });
            }

            events.Add(new PhaseStartedEvent(GamePhase.Draw) { SequenceNumber = seq++ });
        }

        return (true, null, events);
    }
}
