-- Up Migration

CREATE TABLE IF NOT EXISTS problem_reports (
    id uuid PRIMARY KEY,
    report jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS problem_reports_expires_at_idx ON problem_reports (expires_at);

-- Down Migration

DROP TABLE problem_reports;
