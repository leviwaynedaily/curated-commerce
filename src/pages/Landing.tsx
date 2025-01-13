import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserQueries } from "@/hooks/useUserQueries";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserButton } from "@/components/auth/UserButton";
import { Lock, User, ExternalLink, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Landing = () => {
  const session = useSession();
  const { storefronts, business, businessUsers, refetchBusinessUsers } = useUserQueries(session);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id || !newUserEmail) return;

    try {
      setIsLoading(true);
      console.log("Adding user to business:", business.id);

      // First, get the user's ID from their email using the profiles table
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newUserEmail)
        .single();

      if (userError || !userData) {
        console.error("Error finding user:", userError);
        toast.error("User not found. Please check the email address.");
        return;
      }

      // Check if user already has access
      const { data: existingAccess } = await supabase
        .from("business_users")
        .select("id")
        .eq("business_id", business.id)
        .eq("user_id", userData.id)
        .single();

      if (existingAccess) {
        toast.error("User already has access to this business");
        return;
      }

      // Add user to business
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b flex items-center gap-2 px-3 sm:px-4 w-full">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 shrink-0 text-primary" />
          <span className="text-xl font-semibold">Curately</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </header>

      <main className="p-3 sm:p-4 w-full">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Select a Storefront</h1>
            <p className="text-muted-foreground mt-2">
              Choose a storefront to manage or create a new one
            </p>
          </div>

          {storefronts && storefronts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {storefronts.map((storefront) => (
                <div
                  key={storefront.id}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => {
                    console.log("Selecting storefront:", storefront.id);
                    localStorage.setItem('lastStorefrontId', storefront.id);
                    window.location.reload();
                  }}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between min-h-[3.5rem]">
                      <div className="flex flex-col justify-center">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">
                          {storefront.name}
                        </h3>
                        {storefront.is_published && (
                          <p className="text-sm text-muted-foreground mt-1">
                            /{storefront.slug}
                          </p>
                        )}
                      </div>
                      {storefront.is_published && (
                        <a
                          href={`/${storefront.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className={storefront.is_published ? "text-green-500" : "text-yellow-500"}>
                          {storefront.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <Progress 
                        value={storefront.is_published ? 100 : 50} 
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
                  <Button type="submit" size="sm" disabled={isLoading}>
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
      </main>
    </div>
  );
};

export default Landing;
