import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Palette, Save } from 'lucide-react';

export default function LogoUpload() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [branding, setBranding] = useState({
    logoUrl: '',
    faviconUrl: '',
    companyName: 'PowerHaus Academy',
    tagline: 'Transform Your Power',
    primaryColor: '#B266FF',
    secondaryColor: '#00FFA3',
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append(type, file);

    try {
      const res = await fetch('/api/branding/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setBranding(prev => ({
          ...prev,
          [type === 'logo' ? 'logoUrl' : 'faviconUrl']: data.url,
        }));
        toast({
          title: 'Upload Successful',
          description: `${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully!`,
        });
      }
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBranding = async () => {
    try {
      const res = await fetch('/api/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding),
      });

      if (res.ok) {
        toast({
          title: 'Branding Saved',
          description: 'Your branding settings have been updated!',
        });
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save branding. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Brand Settings</h1>
        <p className="text-gray-400">Customize your PowerHaus Academy branding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-purple-500" />
              Logo Upload
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upload your company logo (recommended: 500x200px, transparent PNG)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {branding.logoUrl ? (
              <div className="relative w-full h-48 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border-2 border-purple-500/30">
                <img
                  src={branding.logoUrl}
                  alt="Company Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border-2 border-dashed border-purple-500/30 flex flex-col items-center justify-center">
                <ImageIcon className="w-16 h-16 text-purple-500/50 mb-3" />
                <p className="text-gray-500 text-sm">Logo Preview</p>
              </div>
            )}

            <label
              htmlFor="logo-upload"
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-purple-500/10 border-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload Logo'}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoUpload(e, 'logo')}
                disabled={uploading}
              />
            </label>
          </CardContent>
        </Card>

        {/* Favicon Upload */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-cyan-500" />
              Favicon Upload
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upload your favicon (recommended: 32x32px, ICO or PNG)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {branding.faviconUrl ? (
              <div className="relative w-full h-48 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border-2 border-cyan-500/30">
                <img
                  src={branding.faviconUrl}
                  alt="Favicon"
                  className="w-16 h-16 object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-xl bg-gradient-to-br from-cyan-900/30 to-black border-2 border-dashed border-cyan-500/30 flex flex-col items-center justify-center">
                <ImageIcon className="w-16 h-16 text-cyan-500/50 mb-3" />
                <p className="text-gray-500 text-sm">Favicon Preview</p>
              </div>
            )}

            <label
              htmlFor="favicon-upload"
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-cyan-500/10 border-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload Favicon'}
              <input
                id="favicon-upload"
                type="file"
                accept="image/*,.ico"
                className="hidden"
                onChange={(e) => handleLogoUpload(e, 'favicon')}
                disabled={uploading}
              />
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Brand Settings */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-500" />
            Brand Identity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Customize your company name, tagline, and color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-gray-300">
                Company Name
              </Label>
              <Input
                id="company-name"
                value={branding.companyName}
                onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-gray-300">
                Tagline
              </Label>
              <Input
                id="tagline"
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
          </div>

          {/* Color Scheme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Color */}
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-gray-300">
                Primary Color (Purple)
              </Label>
              <div className="flex gap-3">
                <Input
                  id="primary-color"
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="w-20 h-12 bg-black/40 border-white/10 cursor-pointer"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="flex-1 bg-black/40 border-white/10 text-white font-mono"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="text-gray-300">
                Secondary Color (Cyan)
              </Label>
              <div className="flex gap-3">
                <Input
                  id="secondary-color"
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="w-20 h-12 bg-black/40 border-white/10 cursor-pointer"
                />
                <Input
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="flex-1 bg-black/40 border-white/10 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-8 rounded-xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-white/10">
            <div className="text-center mb-6">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Logo Preview"
                  className="max-h-16 mx-auto mb-4"
                />
              ) : (
                <div className="text-5xl font-bold text-white mb-4">{branding.companyName}</div>
              )}
              <p className="text-xl text-gray-400">{branding.tagline}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <div
                className="w-24 h-24 rounded-xl shadow-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: branding.primaryColor }}
              >
                Primary
              </div>
              <div
                className="w-24 h-24 rounded-xl shadow-lg flex items-center justify-center text-black font-bold"
                style={{ backgroundColor: branding.secondaryColor }}
              >
                Secondary
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveBranding}
            className="w-full bg-purple-500 hover:bg-purple-600 text-lg py-6"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Branding Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
