namespace Throneteki.Domain.Interfaces;

/// <summary>
/// Sends notifications to players (e.g., "it's your turn" for async games).
/// </summary>
public interface INotificationService
{
    Task NotifyTurnAsync(Guid gameId, Guid playerId, string message, CancellationToken ct = default);
    Task NotifyGameOverAsync(Guid gameId, Guid? winnerId, string reason, CancellationToken ct = default);
    Task SendReminderAsync(Guid gameId, Guid playerId, CancellationToken ct = default);
}
