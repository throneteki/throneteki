-- Up Migration

ALTER TABLE problem_reports ADD COLUMN description text;

UPDATE problem_reports
SET description = CASE
    WHEN jsonb_typeof(report->'description') = 'string' THEN report->>'description'
END;

-- Down Migration

ALTER TABLE problem_reports DROP COLUMN description;
