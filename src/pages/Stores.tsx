import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { useState } from "react"
import { Link } from "react-router-dom"

const Stores = () => {
  const [showCreateStore, setShowCreateStore] = useState(false)

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error("Error fetching business:", error)
        throw error
      }

      return data
    },
  })

  const { data: storefronts, isLoading } = useQuery({
    queryKey: ["storefronts", business?.id],
    queryFn: async () => {
      if (!business?.id) return []

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching storefronts:", error)
        throw error
      }

      return data
    },
    enabled: !!business?.id,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your stores in one place.
            </p>
          </div>
          <Button onClick={() => setShowCreateStore(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Store
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {storefronts?.map((store) => (
            <Card key={store.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{store.name}</CardTitle>
                <CardDescription>
                  {store.is_published ? "Published" : "Draft"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  {store.description || "No description"}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/stores/${store.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://curately.co/${store.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      View
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showCreateStore} onOpenChange={setShowCreateStore}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Store</DialogTitle>
            </DialogHeader>
            {business && (
              <StorefrontForm
                businessId={business.id}
                onSuccess={() => setShowCreateStore(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default Stores