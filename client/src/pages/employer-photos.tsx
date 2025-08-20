import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, ImageIcon, Upload, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface Photo {
  id: string;
  url: string;
  caption: string;
  category: "office" | "team" | "events" | "culture" | "workspace";
  uploaded: string;
}

const photoCategories = [
  { value: "office", label: "Office Space" },
  { value: "team", label: "Team Photos" },
  { value: "events", label: "Company Events" },
  { value: "culture", label: "Company Culture" },
  { value: "workspace", label: "Work Environment" }
];

export default function EmployerPhotos() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
      caption: "Our collaborative open-plan office space",
      category: "office",
      uploaded: "2024-01-15"
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      caption: "Team meeting in our modern conference room",
      category: "team",
      uploaded: "2024-01-10"
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    url: "",
    caption: "",
    category: "office" as const
  });

  // File upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photos', file);
      
      const response = await fetch('/api/upload/company-photos', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.files?.[0]) {
        const uploadedFile = data.files[0];
        setNewPhoto(prev => ({ ...prev, url: uploadedFile.url }));
        toast({
          title: "Photo uploaded successfully",
          description: "You can now add a caption and save the photo.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: "Please try again with a different image.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    uploadPhotoMutation.mutate(file);
  };

  const handleAddPhoto = () => {
    if (!newPhoto.url || !newPhoto.caption) {
      toast({
        title: "Missing Information",
        description: "Please upload an image and provide a caption",
        variant: "destructive"
      });
      return;
    }

    const photo: Photo = {
      id: Date.now().toString(),
      ...newPhoto,
      uploaded: new Date().toISOString().split('T')[0]
    };

    setPhotos([...photos, photo]);
    setNewPhoto({ url: "", caption: "", category: "office" });
    setIsAddingNew(false);

    toast({
      title: "Photo Added",
      description: "The photo has been added to your company gallery"
    });
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
    toast({
      title: "Photo Removed",
      description: "The photo has been removed from your gallery"
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "office":
        return "bg-blue-100 text-blue-800";
      case "team":
        return "bg-green-100 text-green-800";
      case "events":
        return "bg-purple-100 text-purple-800";
      case "culture":
        return "bg-pink-100 text-pink-800";
      case "workspace":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.category]) {
      acc[photo.category] = [];
    }
    acc[photo.category].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/employer-profile-setup")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile Setup
              </Button>
              <div>
                <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Company Photos</h1>
                <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                  Showcase your workplace, team, and company culture
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <ImageIcon className="w-5 h-5 text-pink-600" />
              Manage Company Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
              Give job seekers a visual insight into your company culture, workspace, and team. 
              High-quality photos help candidates envision themselves working at your company.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800" style={{fontFamily: 'Poppins'}}>
                <strong>Direct Upload Available:</strong> You can now upload photos directly from your computer. 
                Supported formats: JPG, PNG, GIF, WebP. Maximum file size: 5MB.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add New Photo */}
        {!isAddingNew ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <Button 
                onClick={() => setIsAddingNew(true)}
                className="w-full bg-pink-600 hover:bg-pink-700"
                style={{fontFamily: 'Sora'}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Photo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>Add New Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photo">Upload Photo *</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadPhotoMutation.isPending}
                    className="w-full h-32 border-dashed border-2 border-gray-300 hover:border-pink-400"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm">
                        {uploadPhotoMutation.isPending 
                          ? "Uploading..." 
                          : "Click to upload or drag and drop"
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF, WebP (Max 5MB)
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="caption">Photo Caption *</Label>
                <Input
                  id="caption"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})}
                  placeholder="e.g. Our collaborative open-plan office space"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newPhoto.category}
                  onChange={(e) => setNewPhoto({...newPhoto, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {photoCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {newPhoto.url && (
                <div>
                  <Label>Preview</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img 
                      src={newPhoto.url} 
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f3f4f6"/><text x="200" y="100" text-anchor="middle" fill="%236b7280" font-size="14">Invalid image URL</text></svg>';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddPhoto}
                  className="bg-pink-600 hover:bg-pink-700"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Photo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  style={{fontFamily: 'Sora'}}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo Gallery */}
        <div className="space-y-8">
          <h3 className="text-lg font-semibold" style={{fontFamily: 'Sora'}}>
            Photo Gallery ({photos.length} photos)
          </h3>

          {Object.entries(groupedPhotos).map(([category, categoryPhotos]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-medium" style={{fontFamily: 'Sora'}}>
                  {photoCategories.find(c => c.value === category)?.label}
                </h4>
                <Badge className={getCategoryColor(category)}>
                  {categoryPhotos.length} photo{categoryPhotos.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={photo.url} 
                        alt={photo.caption}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f3f4f6"/><text x="200" y="100" text-anchor="middle" fill="%236b7280" font-size="14">Image failed to load</text></svg>';
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(photo.url, '_blank')}
                          className="bg-white/80 hover:bg-white/90 p-1 h-auto"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="bg-white/80 hover:bg-white/90 text-red-600 hover:text-red-700 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="font-medium text-sm mb-1" style={{fontFamily: 'Sora'}}>
                        {photo.caption}
                      </p>
                      <p className="text-xs text-gray-500">
                        Added {new Date(photo.uploaded).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {photos.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>No photos added yet</h4>
                <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
                  Start building visual appeal by adding photos of your workplace, team, and company culture.
                </p>
                <Button 
                  onClick={() => setIsAddingNew(true)}
                  variant="outline"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Your First Photo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}