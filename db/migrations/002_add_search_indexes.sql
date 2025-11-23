-- Add full-text search indexes for global search functionality
-- PostgreSQL has excellent built-in full-text search capabilities

-- Materials search (title, description, tags)
CREATE INDEX IF NOT EXISTS idx_materials_search ON materials
USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || array_to_string(tags, ' ')));

-- Classes search (title, description)
CREATE INDEX IF NOT EXISTS idx_classes_search ON classes
USING GIN (to_tsvector('english', title || ' ' || description));

-- Discussions search (title, content, tags)
CREATE INDEX IF NOT EXISTS idx_discussions_search ON discussions
USING GIN (to_tsvector('english', title || ' ' || content || ' ' || array_to_string(tags, ' ')));

-- Blog posts search (title, content)
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts
USING GIN (to_tsvector('english', title || ' ' || content));

-- Hands-on stations search (name, description)
CREATE INDEX IF NOT EXISTS idx_hands_on_stations_search ON hands_on_stations
USING GIN (to_tsvector('english', name || ' ' || description));

-- Add a composite index for frequently accessed queries
CREATE INDEX IF NOT EXISTS idx_materials_category_tags ON materials (category, tags);
CREATE INDEX IF NOT EXISTS idx_discussions_category_tags ON discussions (category, tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts (category, is_approved);

-- Record this migration
INSERT INTO migrations (name) VALUES ('002_add_search_indexes.sql')
ON CONFLICT (name) DO NOTHING;
