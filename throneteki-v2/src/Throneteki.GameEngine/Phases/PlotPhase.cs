using System.Collections.Immutable;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Plot Phase (rules step 1, Joust format):
/// 1.1 Round begins. Plot phase begins.
/// 1.2 Choose plots (simultaneous, secret selection).
/// 1.3 Reveal plots:
///     I.   Compare initiative values.
///     II.  Higher initiative player chooses first player.
///     III. Resolve "When Revealed" abilities (first player first).
/// (1.4 Melee only — skipped for Joust.)
/// ACTION WINDOW
/// 1.5 Plot phase ends. Advance to Draw phase.
/// </summary>
public sealed class PlotPhase
{
    private readonly ICardCatalog? _catalog;

    public PlotPhase(ICardCatalog? catalog = null) => _catalog = catalog;

    /// <summary>
    /// Step 1.1-1.2: Enter plot phase and prompt both players to select plots.
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
    /// Step 1.2 (continued): Player selects a plot.
    /// When both have selected → Step 1.3: reveal, initiative, first player, when-revealed.
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

        var otherPlayer = state.Players.FirstOrDefault(p => p.PlayerId != command.PlayerId);
        bool otherHasSelected = otherPlayer?.SelectedPlot != null;

        if (otherHasSelected)
        {
            // Step 1.3: Both selected — reveal plots simultaneously
            foreach (var p in state.Players)
            {
                Guid revealedId = p.PlayerId == command.PlayerId
                    ? command.CardInstanceId
                    : p.SelectedPlot!.InstanceId;
                events.Add(new PlotRevealedEvent(p.PlayerId, revealedId) { SequenceNumber = seq++ });
            }

            // Step 1.3.I: Compare initiative
            int p1Initiative = GetInitiative(state.Players[0], command);
            int p2Initiative = GetInitiative(state.Players[1], command);

            // Step 1.3.II: Higher initiative chooses first player.
            // Tiebreak: player with lowest total power wins initiative.
            // If still tied: random (simplified to player order).
            Guid initiativeWinnerId;
            if (p1Initiative > p2Initiative)
                initiativeWinnerId = state.Players[0].PlayerId;
            else if (p2Initiative > p1Initiative)
                initiativeWinnerId = state.Players[1].PlayerId;
            else
            {
                // Tiebreak: lowest total power
                int p1Power = state.Players[0].TotalPower;
                int p2Power = state.Players[1].TotalPower;
                if (p1Power < p2Power)
                    initiativeWinnerId = state.Players[0].PlayerId;
                else if (p2Power < p1Power)
                    initiativeWinnerId = state.Players[1].PlayerId;
                else
                    initiativeWinnerId = state.Players[0].PlayerId; // True tie: first in list
            }

            events.Add(new InitiativeWonEvent(initiativeWinnerId) { SequenceNumber = seq++ });
            events.Add(new FirstPlayerDeterminedEvent(initiativeWinnerId) { SequenceNumber = seq++ });

            // Step 1.3.III: "When Revealed" abilities would be resolved here
            // (handled by the ability resolver in the full engine)

            // Step 1.5 → Advance to Draw phase
            events.Add(new PhaseStartedEvent(GamePhase.Draw) { SequenceNumber = seq++ });
        }

        return (true, null, events);
    }

    private int GetInitiative(PlayerState player, SelectPlotCommand currentCommand)
    {
        // Get the plot card that this player selected (may be SelectedPlot or the one being selected now)
        var plotCard = player.SelectedPlot;
        if (plotCard == null && player.PlayerId == currentCommand.PlayerId)
            plotCard = player.PlotDeck.FirstOrDefault(c => c.InstanceId == currentCommand.CardInstanceId);

        if (plotCard == null) return 0;
        var def = _catalog?.TryGet(plotCard.CardCode);
        return def?.Initiative ?? 0;
    }
}
