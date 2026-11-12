-- Up Migration

ALTER TABLE problem_reports
    ADD COLUMN reporter text,
    ADD COLUMN source text,
    ADD COLUMN game_name text,
    ADD COLUMN round integer,
    ADD COLUMN phase text,
    ADD COLUMN players text[] NOT NULL DEFAULT '{}';

UPDATE problem_reports
SET reporter = CASE WHEN jsonb_typeof(report->'reporter') = 'string' THEN report->>'reporter' END,
    source = CASE WHEN jsonb_typeof(report->'source') = 'string' THEN report->>'source' END,
    game_name = CASE
        WHEN jsonb_typeof(report->'game'->'name') = 'string' THEN report->'game'->>'name'
    END,
    round = CASE
        WHEN jsonb_typeof(report->'game'->'round') = 'number'
            AND report->'game'->>'round' ~ '^[0-9]{1,9}$'
        THEN (report->'game'->>'round')::integer
    END,
    phase = CASE
        WHEN jsonb_typeof(report->'game'->'phase') = 'string' THEN report->'game'->>'phase'
    END,
    players = CASE
        WHEN jsonb_typeof(report->'players') = 'array' THEN ARRAY(
            SELECT player->>'name'
            FROM jsonb_array_elements(report->'players') AS player
            WHERE jsonb_typeof(player->'name') = 'string'
        )
        ELSE '{}'
    END;

CREATE INDEX problem_reports_created_at_idx ON problem_reports (created_at DESC);

-- Down Migration

DROP INDEX problem_reports_created_at_idx;

ALTER TABLE problem_reports
    DROP COLUMN reporter,
    DROP COLUMN source,
    DROP COLUMN game_name,
    DROP COLUMN round,
    DROP COLUMN phase,
    DROP COLUMN players;
