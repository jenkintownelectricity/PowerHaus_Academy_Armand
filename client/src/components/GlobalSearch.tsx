import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Search, X, BookOpen, Calendar, MessageSquare, FileText, FlaskConical, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface SearchResult {
  materials: any[];
  classes: any[];
  discussions: any[];
  blogPosts: any[];
  stations: any[];
  totalResults: number;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setResults(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setResults(null);
  };

  return (
    <>
      {/* Search trigger button */}
      <Button
        variant="outline"
        className="relative w-64 justify-start text-sm text-muted-foreground"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
          <div ref={searchRef} className="w-full max-w-2xl mx-4">
            <Card className="shadow-2xl">
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search materials, classes, discussions, blog posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-0 focus-visible:ring-0 text-lg"
                    autoFocus
                  />
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      setResults(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Search results */}
              {results && results.totalResults > 0 && (
                <CardContent className="max-h-[60vh] overflow-y-auto space-y-4">
                  {/* Materials */}
                  {results.materials.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Materials</h3>
                        <Badge variant="secondary" className="text-xs">{results.materials.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {results.materials.map((material: any) => (
                          <Link key={material.id} href="/materials">
                            <a
                              onClick={handleResultClick}
                              className="block p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="font-medium">{material.title}</div>
                              {material.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {material.description}
                                </div>
                              )}
                              {material.tags && material.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {material.tags.slice(0, 3).map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Classes */}
                  {results.classes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Classes</h3>
                        <Badge variant="secondary" className="text-xs">{results.classes.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {results.classes.map((cls: any) => (
                          <Link key={cls.id} href="/classes">
                            <a
                              onClick={handleResultClick}
                              className="block p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="font-medium">{cls.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {cls.description}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {cls.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {cls.enrolled}/{cls.capacity} enrolled
                                </span>
                              </div>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discussions */}
                  {results.discussions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Discussions</h3>
                        <Badge variant="secondary" className="text-xs">{results.discussions.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {results.discussions.map((discussion: any) => (
                          <Link key={discussion.id} href={`/community/${discussion.id}`}>
                            <a
                              onClick={handleResultClick}
                              className="block p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="font-medium">{discussion.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {discussion.content}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {discussion.category}
                                </Badge>
                                {discussion.has_helpful_answer && (
                                  <Badge variant="secondary" className="text-xs">Answered</Badge>
                                )}
                              </div>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog Posts */}
                  {results.blogPosts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Blog Posts</h3>
                        <Badge variant="secondary" className="text-xs">{results.blogPosts.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {results.blogPosts.map((post: any) => (
                          <Link key={post.id} href={`/blog/${post.id}`}>
                            <a
                              onClick={handleResultClick}
                              className="block p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="font-medium">{post.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {post.content.substring(0, 150)}...
                              </div>
                              <Badge variant="outline" className="text-xs capitalize mt-1">
                                {post.category}
                              </Badge>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hands-On Stations */}
                  {results.stations.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FlaskConical className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Hands-On Stations</h3>
                        <Badge variant="secondary" className="text-xs">{results.stations.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {results.stations.map((station: any) => (
                          <Link key={station.id} href="/stations">
                            <a
                              onClick={handleResultClick}
                              className="block p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="font-medium">{station.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {station.description}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Target: {station.target_time}min
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Pass: {station.passing_score}%
                                </span>
                              </div>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}

              {/* No results */}
              {results && results.totalResults === 0 && query.length >= 2 && (
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No results found for "{query}"</p>
                    <p className="text-sm mt-1">Try different keywords or check your spelling</p>
                  </div>
                </CardContent>
              )}

              {/* Search tips */}
              {!results && query.length < 2 && (
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">Search Tips:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Search across materials, classes, discussions, and blog posts</li>
                      <li>Use multiple keywords for better results</li>
                      <li>Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">ESC</kbd> to close</li>
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
