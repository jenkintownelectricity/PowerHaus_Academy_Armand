import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';
import { formatDate } from '@/lib/utils';

export default function DiscussionDetail() {
  const { id } = useParams();

  const { data: discussion } = useQuery({
    queryKey: ['discussion', id],
    queryFn: async () => {
      const res = await fetch(`/api/discussions/${id}`);
      return res.json();
    },
  });

  if (!discussion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link href="/community">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge>{discussion.category}</Badge>
            {discussion.hasHelpfulAnswer && (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Answered
              </Badge>
            )}
          </div>
          <CardTitle className="text-3xl">{discussion.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Posted on {formatDate(discussion.createdAt)}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-base">{discussion.content}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {discussion.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          Replies ({discussion.replies?.length || 0})
        </h3>
        {discussion.replies?.map((reply: any) => (
          <Card key={reply.id} className={reply.isHelpful ? 'border-green-500 bg-green-50' : ''}>
            <CardContent className="pt-6">
              {reply.isHelpful && (
                <Badge className="mb-2 bg-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Helpful Answer
                </Badge>
              )}
              <p>{reply.content}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {formatDate(reply.createdAt)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Your Reply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Share your thoughts..." rows={4} />
          <Button>Post Reply</Button>
        </CardContent>
      </Card>
    </div>
  );
}
