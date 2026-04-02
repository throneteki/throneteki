using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Interfaces;

public sealed record EngineResult
{
    public bool IsValid { get; init; }
    public string? Error { get; init; }
    public IReadOnlyList<GameEvent> Events { get; init; } = Array.Empty<GameEvent>();
    public PromptState? NextPrompt { get; init; }

    public static EngineResult Success(IReadOnlyList<GameEvent> events, PromptState? nextPrompt = null) =>
        new() { IsValid = true, Events = events, NextPrompt = nextPrompt };

    public static EngineResult Invalid(string error) =>
        new() { IsValid = false, Error = error, Events = Array.Empty<GameEvent>() };
}
