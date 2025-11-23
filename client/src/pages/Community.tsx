import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { MessageSquare, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-blue-500',
  questions: 'bg-green-500',
  tips: 'bg-purple-500',
  alumni: 'bg-orange-500',
};

export default function Community() {
  const { data: discussions = [] } = useQuery({
    queryKey: ['discussions'],
    queryFn: async () => {
      const res = await fetch('/api/discussions');
      return res.json();
    },
  });

  const DiscussionCard = ({ discussion }: { discussion: any }) => (
    <Link href={`/community/${discussion.id}`}>
      <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge className={CATEGORY_COLORS[discussion.category]}>
              {discussion.category}
            </Badge>
            {discussion.hasHelpfulAnswer && (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Answered
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl hover:text-primary transition-colors">
            {discussion.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {discussion.content}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatDate(discussion.createdAt)}</span>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>Discussion</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {discussion.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Community Discussions
        </h1>
        <p className="text-lg text-gray-600">
          Connect with peers, ask questions, and share knowledge
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Discussions</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          <TabsTrigger value="alumni">Alumni Network</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {discussions.map((discussion: any) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </div>
        </TabsContent>

        {['questions', 'tips', 'alumni'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {discussions
                .filter((d: any) => d.category === category)
                .map((discussion: any) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
