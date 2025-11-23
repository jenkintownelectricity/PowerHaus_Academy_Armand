import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Zap,
  Eye,
  Smartphone,
  Users,
  TrendingUp,
  Database,
  Globe,
  Crown,
  Sparkles,
} from 'lucide-react';

interface FeatureToggle {
  id: number;
  name: string;
  enabled: boolean;
  description: string;
  category: string;
  tier: string;
  impact: string;
}

interface SubscriptionTier {
  id: number;
  name: string;
  displayName: string;
  price: number;
  features: string[];
  maxUsers: number;
  maxClasses: number;
  supportLevel: string;
}

export default function DeveloperDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch feature toggles
  const { data: features = [], isLoading: featuresLoading } = useQuery<FeatureToggle[]>({
    queryKey: ['feature-toggles'],
    queryFn: async () => {
      const res = await fetch('/api/admin/features');
      if (!res.ok) throw new Error('Failed to fetch features');
      return res.json();
    },
  });

  // Fetch subscription tiers
  const { data: tiers = [], isLoading: tiersLoading } = useQuery<SubscriptionTier[]>({
    queryKey: ['subscription-tiers'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tiers');
      if (!res.ok) throw new Error('Failed to fetch tiers');
      return res.json();
    },
  });

  // Toggle feature mutation
  const toggleFeature = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      const res = await fetch(`/api/admin/features/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error('Failed to toggle feature');
      return res.json();
    },
    onMutate: async ({ id, enabled }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['feature-toggles'] });

      // Snapshot previous value
      const previousFeatures = queryClient.getQueryData<FeatureToggle[]>(['feature-toggles']);

      // Optimistically update
      queryClient.setQueryData<FeatureToggle[]>(['feature-toggles'], (old) =>
        old?.map((feature) =>
          feature.id === id ? { ...feature, enabled } : feature
        ) || []
      );

      // Return context for rollback
      return { previousFeatures };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-toggles'] });
      toast({
        title: 'Feature Updated',
        description: 'Feature toggle updated successfully',
      });
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousFeatures) {
        queryClient.setQueryData(['feature-toggles'], context.previousFeatures);
      }
      toast({
        title: 'Error',
        description: 'Failed to update feature toggle',
        variant: 'destructive',
      });
    },
  });

  // Group features by category
  const featuresByCategory = features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, FeatureToggle[]>);

  const categoryIcons: Record<string, any> = {
    learning: Sparkles,
    immersive: Eye,
    enterprise: Database,
    core: Zap,
  };

  const categoryColors: Record<string, string> = {
    learning: 'text-purple-500',
    immersive: 'text-blue-500',
    enterprise: 'text-green-500',
    core: 'text-orange-500',
  };

  const tierColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    pro: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700',
  };

  if (featuresLoading || tiersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading Developer Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Developer Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage features, tiers, and platform configuration</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Settings className="w-5 h-5 mr-2" />
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
          <TabsTrigger value="tiers">Subscription Tiers</TabsTrigger>
        </TabsList>

        {/* Feature Toggles Tab */}
        <TabsContent value="features" className="space-y-6">
          {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => {
            const Icon = categoryIcons[category] || Zap;
            const colorClass = categoryColors[category] || 'text-gray-500';

            return (
              <Card key={category} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-8 h-8 ${colorClass}`} />
                    <div>
                      <CardTitle className="capitalize text-2xl">{category} Features</CardTitle>
                      <CardDescription>
                        {categoryFeatures.length} features in this category
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Label htmlFor={`feature-${feature.id}`} className="text-lg font-semibold">
                            {feature.description}
                          </Label>
                          <Badge className={tierColors[feature.tier]}>
                            {feature.tier}
                          </Badge>
                        </div>
                        {feature.impact && (
                          <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {feature.impact}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">ID: {feature.name}</p>
                      </div>
                      <Switch
                        id={`feature-${feature.id}`}
                        checked={feature.enabled}
                        onCheckedChange={(checked) =>
                          toggleFeature.mutate({ id: feature.id, enabled: checked })
                        }
                        disabled={toggleFeature.isPending}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          {features.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No features configured yet</p>
                <p className="text-gray-400 text-sm mt-2">Add features to the database to see them here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Subscription Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={`shadow-lg hover:shadow-xl transition-shadow ${
                  tier.name === 'enterprise' ? 'border-purple-500 border-2' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{tier.displayName}</CardTitle>
                    {tier.name === 'enterprise' && (
                      <Crown className="w-8 h-8 text-purple-500" />
                    )}
                  </div>
                  <CardDescription className="text-3xl font-bold mt-2">
                    ${tier.price / 100}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Users:</span>
                      <Badge variant="outline">{tier.maxUsers}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Classes:</span>
                      <Badge variant="outline">{tier.maxClasses}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Support:</span>
                      <Badge variant="outline" className="capitalize">{tier.supportLevel}</Badge>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">Features:</p>
                    <ul className="text-sm space-y-1 text-gray-600">
                      {tier.features.length > 0 ? (
                        tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No features listed</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tiers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No subscription tiers configured yet</p>
                <p className="text-gray-400 text-sm mt-2">Add tiers to the database to see them here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
