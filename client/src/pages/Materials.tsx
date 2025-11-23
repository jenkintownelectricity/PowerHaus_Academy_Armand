import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Image, FileSpreadsheet, Video, BookOpen } from 'lucide-react';

const FILE_ICONS: Record<string, any> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  image: Image,
  video: Video,
};

export default function Materials() {
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await fetch('/api/materials');
      return res.json();
    },
  });

  const bookMaterials = materials.filter((m: any) => m.category === 'book_materials');
  const stationMaterials = materials.filter((m: any) => m.category === 'hands_on_station');

  const MaterialCard = ({ material }: { material: any }) => {
    const Icon = FILE_ICONS[material.fileType] || FileText;
    const fileSizeMB = (material.fileSize / 1024 / 1024).toFixed(2);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {material.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{fileSizeMB} MB · {material.fileType.toUpperCase()}</span>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Educational Materials
        </h1>
        <p className="text-lg text-gray-600">
          Access comprehensive learning resources and study materials
        </p>
      </div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList>
          <TabsTrigger value="book" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Book Materials
          </TabsTrigger>
          <TabsTrigger value="station" className="gap-2">
            <FileText className="w-4 h-4" />
            Hands-On Station Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {bookMaterials.map((material: any) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="station" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {stationMaterials.map((material: any) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
