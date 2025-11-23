import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Blog() {
  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog-posts');
      return res.json();
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Blog & Extra Credit
        </h1>
        <p className="text-lg text-gray-600">
          Read industry insights and earn extra credit by contributing
        </p>
      </div>

      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold mb-2">Earn Extra Credit!</h3>
              <p className="text-purple-100">
                Submit your own blog posts about sterile processing and earn 5-10 extra credit points upon approval
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader>
                <Badge className="w-fit mb-2">{post.category.replace('_', ' ')}</Badge>
                <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.publishedAt || post.createdAt)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">{post.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
