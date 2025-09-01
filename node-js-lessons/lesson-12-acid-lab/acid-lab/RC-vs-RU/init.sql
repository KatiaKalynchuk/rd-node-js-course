DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    draft BOOLEAN DEFAULT false,
    CHECK (title <> '')
);

INSERT INTO posts (id, title, draft)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Original', false);