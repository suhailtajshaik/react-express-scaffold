-- Seed data for development
-- This provides sample data for testing and development

INSERT INTO items (name, description) VALUES
    ('Sample Item 1', 'This is the first sample item for development testing.'),
    ('Sample Item 2', 'Another sample item with a longer description to test text handling.'),
    ('Sample Item 3', NULL)
ON CONFLICT DO NOTHING;
