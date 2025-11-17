import { useState } from "react";
import { useStore, HeroAnimationType } from "../../lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { Sparkles, Image as ImageIcon, Upload, X, Palette } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function SiteSettings() {
  const { siteSettings, updateSiteSettings } = useStore();
  const [selectedAnimation, setSelectedAnimation] = useState<HeroAnimationType>(siteSettings.heroAnimation);
  const [backgroundOpacity, setBackgroundOpacity] = useState(siteSettings.heroBackgroundOpacity || 0.5);
  const [overlayOpacity, setOverlayOpacity] = useState(siteSettings.heroOverlayOpacity || 0.3);
  const [overlayColor, setOverlayColor] = useState(siteSettings.heroOverlayColor || '#000000');
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(siteSettings.customBackgroundImage);
  const [isUploading, setIsUploading] = useState(false);

  // Predefined color options from design system
  const colorOptions = [
    { name: 'Black', value: '#000000', preview: 'bg-black' },
    { name: 'Primary', value: 'var(--color-primary)', preview: 'bg-primary' },
    { name: 'Secondary', value: 'var(--color-secondary)', preview: 'bg-secondary' },
    { name: 'Accent', value: 'var(--color-accent)', preview: 'bg-accent' },
    { name: 'Destructive', value: 'var(--color-destructive)', preview: 'bg-destructive' },
    { name: 'Chart 1', value: 'var(--color-chart-1)', preview: 'bg-chart-1' },
    { name: 'Chart 2', value: 'var(--color-chart-2)', preview: 'bg-chart-2' },
    { name: 'Chart 3', value: 'var(--color-chart-3)', preview: 'bg-chart-3' },
    { name: 'Chart 4', value: 'var(--color-chart-4)', preview: 'bg-chart-4' },
    { name: 'Chart 5', value: 'var(--color-chart-5)', preview: 'bg-chart-5' },
  ];

  const animations = [
    {
      id: 'float' as HeroAnimationType,
      name: 'Float',
      description: 'Cards gently float up and down continuously',
      icon: '↕️'
    },
    {
      id: 'rotate' as HeroAnimationType,
      name: 'Rotate',
      description: 'Cards rotate slightly on hover',
      icon: '🔄'
    },
    {
      id: 'scale' as HeroAnimationType,
      name: 'Scale',
      description: 'Cards grow slightly on hover',
      icon: '🔍'
    },
    {
      id: 'slide' as HeroAnimationType,
      name: 'Slide In',
      description: 'Cards slide in from corners on load',
      icon: '➡️'
    }
  ];

  const handleSave = () => {
    updateSiteSettings({ heroAnimation: selectedAnimation, heroBackgroundOpacity: backgroundOpacity, heroOverlayOpacity: overlayOpacity, heroOverlayColor: overlayColor, customBackgroundImage: uploadedImage });
    toast.success("Settings saved successfully!");
  };

  const handleSaveBackground = () => {
    updateSiteSettings({ customBackgroundImage: uploadedImage });
    toast.success("Background image saved successfully!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
        toast.success("Image uploaded successfully!");
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(undefined);
    toast.success("Custom image removed");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground mb-2">Site Settings</h2>
        <p className="text-muted-foreground">
          Customize your website appearance and behavior
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Hero Section Animation
          </CardTitle>
          <CardDescription>
            Choose an animation effect for the hero section product cards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {animations.map((animation) => (
              <button
                key={animation.id}
                onClick={() => setSelectedAnimation(animation.id)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${selectedAnimation === animation.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 bg-card'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{animation.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-foreground">{animation.name}</h4>
                      {selectedAnimation === animation.id && (
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <p className="text-muted-foreground">{animation.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-muted-foreground">
              Current: <span className="text-primary">{animations.find(a => a.id === siteSettings.heroAnimation)?.name}</span>
            </p>
            <Button 
              onClick={handleSave}
              disabled={selectedAnimation === siteSettings.heroAnimation}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Background Opacity</CardTitle>
          <CardDescription>
            Adjust the opacity of the hero section background image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opacity Level</Label>
              <span className="text-muted-foreground">{Math.round(backgroundOpacity * 100)}%</span>
            </div>
            <Slider
              value={[backgroundOpacity]}
              onValueChange={(value) => setBackgroundOpacity(value[0])}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={backgroundOpacity === siteSettings.heroBackgroundOpacity}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Opacity Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Overlay Opacity</CardTitle>
          <CardDescription>
            Adjust the opacity of the hero section overlay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opacity Level</Label>
              <span className="text-muted-foreground">{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <Slider
              value={[overlayOpacity]}
              onValueChange={(value) => setOverlayOpacity(value[0])}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={overlayOpacity === siteSettings.heroOverlayOpacity}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Overlay Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Overlay Color</CardTitle>
          <CardDescription>
            Choose a color for the hero section overlay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => setOverlayColor(color.value)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${overlayColor === color.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 bg-card'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-5 w-5 ${color.preview} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-foreground">{color.name}</h4>
                      {overlayColor === color.value && (
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-muted-foreground">
              Current: <span className="text-primary">{colorOptions.find(a => a.value === siteSettings.heroOverlayColor)?.name || 'Black'}</span>
            </p>
            <Button 
              onClick={handleSave}
              disabled={overlayColor === siteSettings.heroOverlayColor}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Custom Background Image
          </CardTitle>
          <CardDescription>
            Upload your own background image for the hero section (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          {!uploadedImage ? (
            <label
              htmlFor="custom-background-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="mb-2 text-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-muted-foreground">
                  PNG, JPG, WEBP (max 5MB)
                </p>
              </div>
              <Input
                id="custom-background-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={uploadedImage}
                  alt="Custom background preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={handleRemoveImage}
                    size="sm"
                    variant="destructive"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground">Custom background uploaded</p>
                  <p className="text-muted-foreground">This image will be used as the hero section background</p>
                </div>
              </div>

              {/* Replace Button */}
              <label
                htmlFor="custom-background-replace"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Replace Image</span>
                <Input
                  id="custom-background-replace"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* Save Background Button */}
              <Button 
                onClick={handleSaveBackground}
                disabled={uploadedImage === siteSettings.customBackgroundImage}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Background Image
              </Button>
            </div>
          )}

          {isUploading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Uploading image...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Visit the home page to see the animation in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-foreground mb-1">Animation Preview</p>
              <p className="text-muted-foreground">
                Changes will be visible immediately on the home page hero section
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}