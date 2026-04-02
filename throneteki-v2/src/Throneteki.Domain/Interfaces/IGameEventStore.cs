using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Interfaces;

/// <summary>
/// Persists and retrieves game events (the event store).
/// This is the system of record for all game state.
/// </summary>
public interface IGameEventStore
{
    /// <summary>
    /// Append new events for a game.
    /// Throws <see cref="OptimisticConcurrencyException"/> if expectedVersion doesn't match.
    /// </summary>
    Task AppendEventsAsync(
        Guid gameId,
        IReadOnlyList<GameEvent> events,
        int expectedVersion,
        CancellationToken cancellationToken = default);

    /// <summary>Load all events for a game, optionally starting from a specific sequence number.</summary>
    Task<IReadOnlyList<GameEvent>> LoadEventsAsync(
        Guid gameId,
        int fromSequenceNumber = 0,
        CancellationToken cancellationToken = default);

    /// <summary>Load the latest snapshot for a game, if any.</summary>
    Task<GameStateSnapshot?> LoadLatestSnapshotAsync(
        Guid gameId,
        CancellationToken cancellationToken = default);

    /// <summary>Save a snapshot at the given sequence number.</summary>
    Task SaveSnapshotAsync(
        Guid gameId,
        GameStateSnapshot snapshot,
        CancellationToken cancellationToken = default);

    /// <summary>Get the current event count (version) for a game.</summary>
    Task<int> GetVersionAsync(Guid gameId, CancellationToken cancellationToken = default);
}

public sealed record GameStateSnapshot(
    Guid GameId,
    int AtSequenceNumber,
    string StateJson,
    DateTimeOffset CreatedAt);

public sealed class OptimisticConcurrencyException(Guid gameId, int expected, int actual)
    : Exception($"Concurrency conflict for game {gameId}: expected version {expected}, found {actual}.")
{
    public Guid GameId { get; } = gameId;
    public int ExpectedVersion { get; } = expected;
    public int ActualVersion { get; } = actual;
}
