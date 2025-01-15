import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard as DashboardContent } from "@/components/dashboard/Dashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StorefrontForm } from "@/components/forms/StorefrontForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showCreateStore, setShowCreateStore] = useState(false);
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        navigate("/login");
        return;
      }
      setSession(currentSession);
    };
    
    checkAuth();
  }, [navigate]);

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Business query error:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!session,
  });

  const { data: storefronts } = useQuery({
    queryKey: ["storefronts", business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      console.log("Fetching storefronts for business:", business.id);
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)
        .order("name");

      if (error) throw error;
      console.log("Storefronts fetched:", data?.length);
      return data;
    },
    enabled: !!business?.id,
  });

  const { data: businessUsers, refetch: refetchBusinessUsers } = useQuery({
    queryKey: ["business-users", business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      console.log("Fetching business users for business:", business.id);

      const { data: businessUsers, error: businessUsersError } = await supabase
        .from("business_users")
        .select("id, role, user_id")
        .eq("business_id", business.id);

      if (businessUsersError) throw businessUsersError;

      const userIds = businessUsers.map(user => user.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const usersWithProfiles = businessUsers.map(user => ({
        ...user,
        profiles: profiles.find(profile => profile.id === user.user_id)
      }));

      console.log("Business users fetched:", usersWithProfiles);
      return usersWithProfiles;
    },
    enabled: !!business?.id,
  });

  const { data: storefront, isLoading, error } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return null;

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      return data;
    },
    enabled: !!currentStorefrontId && !!session,
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id || !newUserEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsAddingUser(true);
      console.log("Adding user to business:", business.id);
      console.log("Searching for user with email:", newUserEmail);

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newUserEmail)
        .maybeSingle();

      if (userError) {
        console.error("Error finding user:", userError);
        toast.error("An error occurred while searching for the user");
        return;
      }

      if (!userData) {
        console.log("No user found with email:", newUserEmail);
        toast.error("No user found with this email address");
        return;
      }

      console.log("User found:", userData.id);

      const { data: existingAccess, error: existingAccessError } = await supabase
        .from("business_users")
        .select("id")
        .eq("business_id", business.id)
        .eq("user_id", userData.id)
        .maybeSingle();

      if (existingAccessError) throw existingAccessError;

      if (existingAccess) {
        toast.error("User already has access to this business");
        return;
      }

      const { error } = await supabase
        .from("business_users")
        .insert({
          business_id: business.id,
          user_id: userData.id,
          role: "member"
        });

      if (error) throw error;

      toast.success("User added successfully");
      setNewUserEmail("");
      refetchBusinessUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    } finally {
      setIsAddingUser(false);
    }
  };

  if (!session) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {!currentStorefrontId ? (
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Select a Storefront</h1>
                <p className="text-muted-foreground mt-2">
                  Choose a storefront to manage or create a new one
                </p>
              </div>
              {business && (
                <Button
                  onClick={() => setShowCreateStore(true)}
                  variant="default"
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Store
                </Button>
              )}
            </div>

            {/* Create Store Dialog */}
            <Dialog open={showCreateStore} onOpenChange={setShowCreateStore}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Store</DialogTitle>
                </DialogHeader>
                {business && (
                  <StorefrontForm
                    businessId={business.id}
                    onSuccess={() => {
                      setShowCreateStore(false);
                      // Refresh the storefronts list
                      window.location.reload();
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>

            {storefronts && storefronts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {storefronts.map((store) => (
                  <div
                    key={store.id}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => {
                      console.log("Selecting storefront:", store.id);
                      localStorage.setItem('lastStorefrontId', store.id);
                      window.location.reload();
                    }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between min-h-[3.5rem]">
                        <div className="flex flex-col justify-center">
                          <h3 className="text-2xl font-semibold leading-none tracking-tight">
                            {store.name}
                          </h3>
                          {store.is_published && (
                            <p className="text-sm text-muted-foreground mt-1">
                              /{store.slug}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className={store.is_published ? "text-green-500" : "text-yellow-500"}>
                            {store.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <Progress 
                          value={store.is_published ? 100 : 50} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No storefronts found. Create your first storefront to get started.</p>
              </div>
            )}

            {business && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Business Users</h2>
                  </div>
                  <form onSubmit={handleAddUser} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter user email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-64"
                    />
                    <Button type="submit" size="sm" disabled={isAddingUser}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </form>
                </div>
                <div className="rounded-lg border">
                  <div className="p-4">
                    <div className="divide-y">
                      {businessUsers?.map((user) => (
                        <div key={user.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span>{user.profiles.email}</span>
                          </div>
                          <span className="text-sm text-muted-foreground capitalize">{user.role}</span>
                        </div>
                      ))}
                      {(!businessUsers || businessUsers.length === 0) && (
                        <p className="py-3 text-muted-foreground text-center">No users found. Add users to collaborate on your business.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <div>Loading storefront information...</div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error loading storefront information. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            ) : storefront ? (
              <DashboardContent storefront={storefront} />
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Storefront not found. Please select a different storefront.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
