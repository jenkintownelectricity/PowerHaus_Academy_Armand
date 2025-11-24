import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Video,
  Image,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  Eye,
  Tag,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';

export default function PowerHausAdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch pending media submissions
  const { data: pendingSubmissions = [] } = useQuery({
    queryKey: ['pending-submissions'],
    queryFn: async () => {
      const res = await fetch('/api/admin/submissions/pending');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch all media submissions
  const { data: allSubmissions = [] } = useQuery({
    queryKey: ['all-submissions'],
    queryFn: async () => {
      const res = await fetch('/api/admin/submissions');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch discount codes
  const { data: discountCodes = [] } = useQuery({
    queryKey: ['discount-codes'],
    queryFn: async () => {
      const res = await fetch('/api/admin/discount-codes');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch platform stats
  const { data: platformStats } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) return {
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        pendingSubmissions: 0,
      };
      return res.json();
    },
  });

  // Approve submission mutation
  const approveSubmission = useMutation({
    mutationFn: async (submissionId: number) => {
      const res = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Submission Approved',
        description: 'The submission has been approved and made public.',
      });
      queryClient.invalidateQueries({ queryKey: ['pending-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      setSelectedSubmission(null);
    },
  });

  // Reject submission mutation
  const rejectSubmission = useMutation({
    mutationFn: async (submissionId: number) => {
      const res = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to reject');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Submission Rejected',
        description: 'The submission has been rejected.',
      });
      queryClient.invalidateQueries({ queryKey: ['pending-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      setSelectedSubmission(null);
    },
  });

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">PowerHaus Admin Dashboard</h1>
        <p className="text-gray-400">Manage your academy with power and precision</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 powerhaus-card">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 text-purple-500" />
            <Badge className="bg-purple-500/20 text-purple-400">Total</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {platformStats?.totalUsers || 0}
          </div>
          <div className="text-sm text-gray-400">Total Users</div>
          <div className="text-xs text-cyan-400 mt-2">
            +{platformStats?.activeUsers || 0} active this week
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 powerhaus-card">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-10 h-10 text-green-500" />
            <Badge className="bg-green-500/20 text-green-400">Revenue</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            ${((platformStats?.totalRevenue || 0) / 100).toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Total Revenue</div>
          <div className="text-xs text-green-400 mt-2">+12% this month</div>
        </div>

        <div className="glass-card rounded-xl p-6 powerhaus-card">
          <div className="flex items-center justify-between mb-4">
            <Video className="w-10 h-10 text-cyan-500" />
            <Badge className="bg-orange-500/20 text-orange-400">Pending</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {platformStats?.pendingSubmissions || 0}
          </div>
          <div className="text-sm text-gray-400">Pending Reviews</div>
          <div className="text-xs text-orange-400 mt-2">Needs attention</div>
        </div>

        <div className="glass-card rounded-xl p-6 powerhaus-card">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 text-yellow-500" />
            <Badge className="bg-yellow-500/20 text-yellow-400">Badges</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">1,247</div>
          <div className="text-sm text-gray-400">Badges Awarded</div>
          <div className="text-xs text-yellow-400 mt-2">+43 this week</div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="glass-dark p-1">
          <TabsTrigger value="submissions" className="data-[state=active]:bg-purple-500/20">
            <Video className="w-4 h-4 mr-2" />
            Media Submissions
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-purple-500/20">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="discounts" className="data-[state=active]:bg-purple-500/20">
            <Tag className="w-4 h-4 mr-2" />
            Discount Codes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Media Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Video className="w-7 h-7 text-purple-500" />
              Pending Media Submissions ({pendingSubmissions.length})
            </h2>

            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">All caught up! No pending submissions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingSubmissions.map((submission: any) => (
                  <div
                    key={submission.id}
                    className="glass rounded-xl overflow-hidden hover-lift cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    {submission.submissionType === 'video' ? (
                      <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-black">
                        <Video className="absolute inset-0 m-auto w-12 h-12 text-purple-500" />
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-gradient-to-br from-cyan-900/50 to-black">
                        <Image className="absolute inset-0 m-auto w-12 h-12 text-cyan-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{submission.title}</h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                          {submission.submissionType}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-400 hover:text-green-300 h-8 px-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              approveSubmission.mutate(submission.id);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 h-8 px-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectSubmission.mutate(submission.id);
                            }}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Submissions */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              All Submissions ({allSubmissions.length})
            </h2>
            <div className="space-y-2">
              {allSubmissions.slice(0, 10).map((submission: any) => (
                <div
                  key={submission.id}
                  className="glass rounded-lg p-4 flex items-center justify-between hover-lift"
                >
                  <div className="flex items-center gap-4">
                    {submission.submissionType === 'video' ? (
                      <Video className="w-8 h-8 text-purple-500" />
                    ) : (
                      <Image className="w-8 h-8 text-cyan-500" />
                    )}
                    <div>
                      <h3 className="text-white font-semibold">{submission.title}</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Eye className="w-4 h-4" />
                        {submission.viewCount || 0}
                      </div>
                    </div>
                    <Badge
                      className={
                        submission.isApproved
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }
                    >
                      {submission.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              User Management ({users.length})
            </h2>
            <div className="space-y-2">
              {users.slice(0, 20).map((user: any) => (
                <div
                  key={user.id}
                  className="glass rounded-lg p-4 flex items-center justify-between hover-lift"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {user.role}
                    </Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-400">
                      {user.pointsEarned || 0} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Discount Codes Tab */}
        <TabsContent value="discounts">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Discount Codes</h2>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Tag className="w-4 h-4 mr-2" />
                Create New Code
              </Button>
            </div>

            <div className="space-y-3">
              {discountCodes.length > 0 ? (
                discountCodes.map((code: any) => (
                  <div
                    key={code.id}
                    className="glass rounded-lg p-5 flex items-center justify-between hover-lift"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-lg font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded">
                          {code.code}
                        </code>
                        <Badge className={code.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {code.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{code.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        {code.discountType === 'percentage' ? `${code.discountValue}%` : `$${code.discountValue / 100}`}
                      </div>
                      <p className="text-xs text-gray-400">
                        Used {code.usesCount} / {code.maxUses || '∞'} times
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Tag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No discount codes created yet</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Platform Analytics</h2>
            <div className="text-center py-20 text-gray-500">
              <BarChart3 className="w-20 h-20 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Analytics dashboard coming soon...</p>
              <p className="text-sm mt-2">Track user engagement, revenue, and growth metrics</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
