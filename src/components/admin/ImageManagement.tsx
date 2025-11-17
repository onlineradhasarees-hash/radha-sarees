import { useState } from "react";
import { useStore, HeroImage, CategoryImage } from "../../lib/store";
import { syncedActions } from "../../lib/useData";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Upload, Save, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ImageManagement() {
  const { siteSettings } = useStore();
  
  // Hero section images (4 boxes)
  const [heroImages, setHeroImages] = useState<HeroImage[]>(
    siteSettings.heroImages || [
      { title: "Bridal Collection", url: "https://images.unsplash.com/photo-1726981448126-c7fc9237cdb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwc2FyZWUlMjBzaWxrfGVufDF8fHx8MTc2MzM2NDU5Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
      { title: "Pure Silk", url: "https://images.unsplash.com/photo-1742287721821-ddf522b3f37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhuaWMlMjBzaWxrJTIwc2FyZWV8ZW58MXx8fHwxNzYzMzY0NTkyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
      { title: "Designer Wear", url: "https://images.unsplash.com/photo-1756483509177-bbabd67a3234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNhcmVlJTIwZWxlZ2FudHxlbnwxfHx8fDE3NjMzNjQ1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080" },
      { title: "Festival Special", url: "https://images.unsplash.com/photo-1761125056724-fb6485468a9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMHNhcmVlJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzYzMzY0NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080" }
    ]
  );

  // Category images (6 categories)
  const [categoryImages, setCategoryImages] = useState<CategoryImage[]>(
    siteSettings.categoryImages || [
      { name: "Wedding", url: "https://images.unsplash.com/photo-1726981448126-c7fc9237cdb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwc2FyZWUlMjBzaWxrfGVufDF8fHx8MTc2MzM2NDU5Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "Ethnic", url: "https://images.unsplash.com/photo-1742287721821-ddf522b3f37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhuaWMlMjBzaWxrJTIwc2FyZWV8ZW58MXx8fHwxNzYzMzY0NTkyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "Casuals", url: "https://images.unsplash.com/photo-1692107271822-50cc09b2bf73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBjb3R0b24lMjBzYXJlZXxlbnwxfHx8fDE3NjMzMTk4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "Festival", url: "https://images.unsplash.com/photo-1761125056724-fb6485468a9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMHNhcmVlJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzYzMzY0NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "New Arrivals", url: "https://images.unsplash.com/photo-1756483509177-bbabd67a3234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNhcmVlJTIwZWxlZ2FudHxlbnwxfHx8fDE3NjMzNjQ1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "Celebrity", url: "https://images.unsplash.com/photo-1762068863008-dbeb2e2c6896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYXJlZSUyMGJyaWRhbHxlbnwxfHx8fDE3NjMzNjQ1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080" }
    ]
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleHeroImageChange = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...heroImages];
    updated[index] = { ...updated[index], [field]: value };
    setHeroImages(updated);
  };

  const handleCategoryImageChange = (index: number, field: 'name' | 'url', value: string) => {
    const updated = [...categoryImages];
    updated[index] = { ...updated[index], [field]: value };
    setCategoryImages(updated);
  };

  const handleImageUpload = async (index: number, type: 'hero' | 'category', file: File) => {
    try {
      // Convert file to base64 data URL so it can be stored
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        if (type === 'hero') {
          handleHeroImageChange(index, 'url', imageUrl);
        } else {
          handleCategoryImageChange(index, 'url', imageUrl);
        }
        
        toast.success("Image uploaded successfully. Click 'Save All Changes' to save.");
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving images...', { heroImages, categoryImages });
      const result = await syncedActions.updateSiteSettings({
        heroImages,
        categoryImages
      });
      console.log('Save result:', result);
      toast.success("Images saved successfully");
    } catch (error) {
      console.error('Error saving images:', error);
      toast.error("Failed to save images");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Homepage Images</h2>
          <p className="text-muted-foreground">
            Manage images for Hero section and Shop by Collection
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="categories">Shop by Collection</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card style={{ borderRadius: 'var(--radius)' }}>
            <CardHeader>
              <CardTitle>Hero Section Images</CardTitle>
              <CardDescription>
                Upload or set image URLs for the 4 boxes in the hero section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroImages.map((image, index) => (
                  <Card key={index} style={{ borderRadius: 'var(--radius)' }}>
                    <CardContent className="p-4 space-y-4">
                      <div className="aspect-[3/4] relative overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
                        <ImageWithFallback
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`hero-title-${index}`}>Title</Label>
                        <Input
                          id={`hero-title-${index}`}
                          value={image.title}
                          onChange={(e) => handleHeroImageChange(index, 'title', e.target.value)}
                          placeholder="Enter title"
                          style={{ borderRadius: 'var(--radius)' }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`hero-url-${index}`}>Image URL</Label>
                        <Input
                          id={`hero-url-${index}`}
                          value={image.url}
                          onChange={(e) => handleHeroImageChange(index, 'url', e.target.value)}
                          placeholder="Enter image URL"
                          style={{ borderRadius: 'var(--radius)' }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`hero-upload-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-center gap-2 p-2 border border-border hover:bg-muted transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Upload Image</span>
                          </div>
                          <input
                            id={`hero-upload-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, 'hero', file);
                            }}
                          />
                        </Label>
                        {image.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleHeroImageChange(index, 'url', '')}
                            style={{ borderRadius: 'var(--radius)' }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card style={{ borderRadius: 'var(--radius)' }}>
            <CardHeader>
              <CardTitle>Shop by Collection Images</CardTitle>
              <CardDescription>
                Upload or set image URLs for the 6 category cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryImages.map((category, index) => (
                  <Card key={index} style={{ borderRadius: 'var(--radius)' }}>
                    <CardContent className="p-4 space-y-4">
                      <div className="aspect-square relative overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
                        <ImageWithFallback
                          src={category.url}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`category-name-${index}`}>Category Name</Label>
                        <Input
                          id={`category-name-${index}`}
                          value={category.name}
                          onChange={(e) => handleCategoryImageChange(index, 'name', e.target.value)}
                          placeholder="Enter category name"
                          disabled
                          style={{ borderRadius: 'var(--radius)' }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`category-url-${index}`}>Image URL</Label>
                        <Input
                          id={`category-url-${index}`}
                          value={category.url}
                          onChange={(e) => handleCategoryImageChange(index, 'url', e.target.value)}
                          placeholder="Enter image URL"
                          style={{ borderRadius: 'var(--radius)' }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`category-upload-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-center gap-2 p-2 border border-border hover:bg-muted transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Upload Image</span>
                          </div>
                          <input
                            id={`category-upload-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, 'category', file);
                            }}
                          />
                        </Label>
                        {category.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryImageChange(index, 'url', '')}
                            style={{ borderRadius: 'var(--radius)' }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}