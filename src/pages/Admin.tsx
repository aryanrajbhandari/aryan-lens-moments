import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
}

interface Photo {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  image_url: string;
  is_featured: boolean;
  sort_order: number;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [photoForm, setPhotoForm] = useState({
    title: "",
    caption: "",
    category: "nature",
    image_url: "",
    is_featured: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive"
        });
      } else {
        setProfile(data);
        if (data.is_admin) {
          fetchPhotos();
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching photos:", error);
        toast({
          title: "Error",
          description: "Failed to fetch photos",
          variant: "destructive"
        });
      } else {
        setPhotos(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password
        });

        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Logged in successfully"
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/admin`;
        
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Account created successfully! Please check your email to confirm your account."
          });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully"
      });
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPhoto) {
        const { error } = await supabase
          .from("photos")
          .update(photoForm)
          .eq("id", editingPhoto.id);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to update photo",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Photo updated successfully"
          });
          setEditingPhoto(null);
          resetPhotoForm();
          fetchPhotos();
        }
      } else {
        const { error } = await supabase
          .from("photos")
          .insert([{ ...photoForm, sort_order: photos.length }]);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to add photo",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Photo added successfully"
          });
          resetPhotoForm();
          fetchPhotos();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const { error } = await supabase
        .from("photos")
        .delete()
        .eq("id", photoId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete photo",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Photo deleted successfully"
        });
        fetchPhotos();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetPhotoForm = () => {
    setPhotoForm({
      title: "",
      caption: "",
      category: "nature",
      image_url: "",
      is_featured: false
    });
  };

  const editPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setPhotoForm({
      title: photo.title,
      caption: photo.caption || "",
      category: photo.category,
      image_url: photo.image_url,
      is_featured: photo.is_featured
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isLogin ? "Admin Login" : "Admin Signup"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to access the admin panel" : "Create an admin account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isLogin ? "Login" : "Signup")}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show non-admin message if user is not admin
  if (profile && !profile.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have admin privileges. Contact an administrator to get admin access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin panel
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.full_name || profile?.email}
            </span>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Photo Management */}
          <Card>
            <CardHeader>
              <CardTitle>Photo Management</CardTitle>
              <CardDescription>Add, edit, and manage gallery photos</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhotoSubmit} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={photoForm.title}
                      onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={photoForm.category}
                      onValueChange={(value) => setPhotoForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="street">Street</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={photoForm.image_url}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, image_url: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={photoForm.caption}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, caption: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={photoForm.is_featured}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  />
                  <Label htmlFor="is_featured">Featured Photo</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      editingPhoto ? "Update Photo" : "Add Photo"
                    )}
                  </Button>
                  {editingPhoto && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingPhoto(null);
                        resetPhotoForm();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>

              {/* Photos List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Existing Photos</h3>
                <div className="grid gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{photo.title}</h4>
                        <p className="text-sm text-muted-foreground">{photo.category}</p>
                        {photo.is_featured && (
                          <span className="inline-block px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editPhoto(photo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {photos.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No photos added yet. Add your first photo above.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;