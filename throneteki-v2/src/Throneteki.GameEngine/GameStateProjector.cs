using Throneteki.Domain.Enums;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine;

/// <summary>
/// Rebuilds <see cref="GameState"/> by applying domain events one at a time.
/// This is a pure function: Apply(state, event) -> newState.
/// No I/O, no side effects.
/// </summary>
public sealed class GameStateProjector : IGameStateProjector
{
    /// <summary>Apply a single event to produce the next state.</summary>
    public GameState Apply(GameState state, GameEvent @event) => @event switch
    {
        // ── Card movement ─────────────────────────────────────────────────────
        CardDrawnEvent e => ApplyCardDrawn(state, e),
        CardMarshalledEvent e => ApplyCardMarshalled(state, e),
        CardKilledEvent e => ApplyCardKilled(state, e),
        CardDiscardedEvent e => ApplyCardDiscarded(state, e),
        CardReturnedToHandEvent e => ApplyCardReturnedToHand(state, e),
        CardEnteredPlayEvent e => state, // The actual movement is via CardMarshalledEvent or similar
        CardLeftPlayEvent e => state,

        // ── Card state ────────────────────────────────────────────────────────
        CardKneeledEvent e => state.UpdateCard(e.CardInstanceId, c => c.Kneel()),
        CardStoodEvent e => state.UpdateCard(e.CardInstanceId, c => c.Stand()),
        CardAttachedEvent e => ApplyCardAttached(state, e),
        DuplicatePlacedEvent e => ApplyDuplicatePlaced(state, e),

        // ── Resources ─────────────────────────────────────────────────────────
        GoldGainedEvent e => state.UpdatePlayer(e.PlayerId, p => p with { Gold = p.Gold + e.Amount }),
        GoldSpentEvent e => state.UpdatePlayer(e.PlayerId, p => p with { Gold = p.Gold - e.Amount }),
        PowerGainedEvent e => ApplyPowerGained(state, e),
        PowerLostEvent e => ApplyPowerLost(state, e),

        // ── Plot phase ────────────────────────────────────────────────────────
        PlotSelectedEvent e => state.UpdatePlayer(e.PlayerId, p =>
        {
            var plot = p.FindCard(e.CardInstanceId);
            return p with { SelectedPlot = plot };
        }),
        PlotRevealedEvent e => ApplyPlotRevealed(state, e),
        InitiativeWonEvent e => state.UpdatePlayer(e.PlayerId, p => p with { IsFirstPlayer = true }),
        FirstPlayerDeterminedEvent e => state with { FirstPlayerId = e.PlayerId },

        // ── Phase / round ─────────────────────────────────────────────────────
        PhaseStartedEvent e => state with { Phase = e.Phase },
        PhaseEndedEvent => state,
        RoundStartedEvent e => state with { RoundNumber = e.RoundNumber },
        PhaseContextUpdatedEvent e => state with
        {
            PhaseContext = new PhaseContext
            {
                Phase = state.Phase,
                StepId = e.StepId,
                Data = e.Data ?? System.Collections.Immutable.ImmutableDictionary<string, string>.Empty,
            }
        },

        // ── Challenges ────────────────────────────────────────────────────────
        ChallengeInitiatedEvent e => state with
        {
            ActiveChallenge = new ChallengeState
            {
                Type = e.ChallengeType,
                AttackingPlayerId = e.AttackingPlayerId,
                DefendingPlayerId = e.DefendingPlayerId,
                ChallengeNumber = e.ChallengeNumber,
            }
        },
        AttackersDeclaredEvent e when state.ActiveChallenge != null =>
            state with { ActiveChallenge = state.ActiveChallenge with { Attackers = e.AttackerCardIds, AttackersDeclared = true } },
        DefendersDeclaredEvent e when state.ActiveChallenge != null =>
            state with { ActiveChallenge = state.ActiveChallenge with { Defenders = e.DefenderCardIds, DefendersDeclared = true } },
        ChallengeResultDeterminedEvent e when state.ActiveChallenge != null =>
            state with
            {
                ActiveChallenge = state.ActiveChallenge with
                {
                    WinnerId = e.WinnerId,
                    IsUnopposed = e.Unopposed,
                    AttackerStrength = e.WinnerId == state.ActiveChallenge.AttackingPlayerId ? e.WinnerStrength : e.LoserStrength,
                    DefenderStrength = e.WinnerId == state.ActiveChallenge.DefendingPlayerId ? e.WinnerStrength : e.LoserStrength,
                    IsResolved = true,
                }
            },

        // ── Prompts ───────────────────────────────────────────────────────────
        PromptIssuedEvent e => state with { ActivePrompt = e.Prompt },
        PromptResolvedEvent => state with { ActivePrompt = null },

        // ── Game log ──────────────────────────────────────────────────────────
        GameMessageEvent e => state.AddLogEntry(e.Message),
        GameEndedEvent e => state with
        {
            Status = GameStatus.Completed,
            WinnerId = e.WinnerId,
            WinReason = e.Reason,
        },

        // Unknown events are ignored (forward compatibility)
        _ => state
    };

    /// <summary>Rebuild state by applying a sequence of events to an initial state.</summary>
    public GameState Rebuild(GameState initial, IReadOnlyList<GameEvent> events) =>
        events.Aggregate(initial, Apply);

    // ── Private helpers ───────────────────────────────────────────────────────

    private static GameState ApplyCardDrawn(GameState state, CardDrawnEvent e)
    {
        return state.UpdatePlayer(e.PlayerId, player =>
        {
            var card = player.DrawDeck.FirstOrDefault(c => c.InstanceId == e.CardInstanceId);
            if (card == null) return player;

            return player with
            {
                DrawDeck = player.DrawDeck.Remove(card),
                Hand = player.Hand.Add(card with { Location = CardLocation.Hand }),
            };
        });
    }

    private static GameState ApplyCardMarshalled(GameState state, CardMarshalledEvent e)
    {
        return state.UpdatePlayer(e.PlayerId, player =>
        {
            var card = player.Hand.FirstOrDefault(c => c.InstanceId == e.CardInstanceId);
            if (card == null) return player;

            return player with
            {
                Hand = player.Hand.Remove(card),
                CardsInPlay = player.CardsInPlay.Add(card with { Location = CardLocation.PlayArea }),
                Gold = player.Gold - e.GoldSpent,
            };
        });
    }

    private static GameState ApplyCardKilled(GameState state, CardKilledEvent e)
    {
        return state.UpdatePlayer(e.OwnerId, player =>
        {
            var card = player.CardsInPlay.FirstOrDefault(c => c.InstanceId == e.CardInstanceId);
            if (card == null) return player;

            return player with
            {
                CardsInPlay = player.CardsInPlay.Remove(card),
                DeadPile = player.DeadPile.Add(card with { Location = CardLocation.DeadPile }),
            };
        });
    }

    private static GameState ApplyCardDiscarded(GameState state, CardDiscardedEvent e)
    {
        return state.UpdatePlayer(e.OwnerId, player =>
        {
            CardInstance? card = null;
            System.Collections.Immutable.ImmutableList<CardInstance> newPile;

            if (e.FromLocation == CardLocation.Hand)
            {
                card = player.Hand.FirstOrDefault(c => c.InstanceId == e.CardInstanceId);
                newPile = player.Hand.Remove(card!);
                return card == null ? player : player with
                {
                    Hand = newPile,
                    DiscardPile = player.DiscardPile.Add(card with { Location = CardLocation.DiscardPile }),
                };
            }
            else if (e.FromLocation == CardLocation.PlayArea)
            {
                card = player.CardsInPlay.FirstOrDefault(c => c.InstanceId == e.CardInstanceId);
                newPile = player.CardsInPlay.Remove(card!);
                return card == null ? player : player with
                {
                    CardsInPlay = newPile,
                    DiscardPile = player.DiscardPile.Add(card with { Location = CardLocation.DiscardPile }),
                };
            }

            return player;
        });
    }

    private static GameState ApplyCardReturnedToHand(GameState state, CardReturnedToHandEvent e)
    {
        return state.UpdatePlayer(e.OwnerId, player =>
        {
            var card = player.CardsInPlay.FirstOrDefault(c => c.InstanceId == e.CardInstanceId);
            if (card == null) return player;

            return player with
            {
                CardsInPlay = player.CardsInPlay.Remove(card),
                Hand = player.Hand.Add(card with { Location = CardLocation.Hand }),
            };
        });
    }

    private static GameState ApplyCardAttached(GameState state, CardAttachedEvent e)
    {
        // Move attachment from hand to play area and link to parent
        var state2 = state;
        foreach (var player in state.Players)
        {
            var attachment = player.Hand.FirstOrDefault(c => c.InstanceId == e.AttachmentId);
            if (attachment != null)
            {
                state2 = state2.UpdatePlayer(player.PlayerId, p => p with
                {
                    Hand = p.Hand.Remove(attachment),
                    CardsInPlay = p.CardsInPlay.Add(attachment with
                    {
                        Location = CardLocation.Attachment,
                        ParentId = e.ParentCardId
                    }),
                });
                break;
            }
        }
        // Add attachment reference to parent
        return state2.UpdateCard(e.ParentCardId, c => c.AddAttachment(e.AttachmentId));
    }

    private static GameState ApplyDuplicatePlaced(GameState state, DuplicatePlacedEvent e)
    {
        return state.UpdateCard(e.ParentCardId, c => c.AddDuplicate(e.DuplicateCardId));
    }

    private static GameState ApplyPowerGained(GameState state, PowerGainedEvent e)
    {
        if (e.TargetType == PowerTargetType.Card)
            return state.UpdateCard(e.TargetId, c => c.AddPower(e.Amount));

        // Player faction power
        return state.UpdatePlayer(e.TargetId, p => p with { FactionPower = p.FactionPower + e.Amount });
    }

    private static GameState ApplyPowerLost(GameState state, PowerLostEvent e)
    {
        if (e.TargetType == PowerTargetType.Card)
            return state.UpdateCard(e.TargetId, c => c with { Power = Math.Max(0, c.Power - e.Amount) });

        return state.UpdatePlayer(e.TargetId, p => p with { FactionPower = Math.Max(0, p.FactionPower - e.Amount) });
    }

    private static GameState ApplyPlotRevealed(GameState state, PlotRevealedEvent e)
    {
        return state.UpdatePlayer(e.PlayerId, player =>
        {
            var plot = player.SelectedPlot ?? player.PlotDeck.FirstOrDefault(c => c.InstanceId == e.CardInstanceId);
            if (plot == null) return player;

            var revealedPlot = plot with { Location = CardLocation.ActivePlot, FaceDown = false };
            return player with
            {
                PlotDeck = player.PlotDeck.RemoveAll(c => c.InstanceId == e.CardInstanceId),
                ActivePlot = revealedPlot,
                SelectedPlot = null,
            };
        });
    }
}
