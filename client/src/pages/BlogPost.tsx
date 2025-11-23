import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { formatDate } from '@/lib/utils';

export default function BlogPost() {
  const { id } = useParams();

  const { data: post } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const res = await fetch(`/api/blog-posts/${id}`);
      return res.json();
    },
  });

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link href="/blog">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <Badge className="w-fit mb-2">{post.category.replace('_', ' ')}</Badge>
          <CardTitle className="text-4xl">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Published on {formatDate(post.publishedAt || post.createdAt)}
          </p>
          {post.extraCreditAwarded > 0 && (
            <Badge variant="outline" className="w-fit">
              Extra Credit: {post.extraCreditAwarded} points
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments ({post.comments?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {post.comments?.length === 0 && (
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          )}
          {post.comments?.map((comment: any) => (
            <div key={comment.id} className="border-b last:border-0 py-4">
              <p>{comment.content}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
