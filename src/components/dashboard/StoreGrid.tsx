import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { useState } from "react"

interface StoreGridProps {
  storefronts: any[]
  business: any
  onStoreSelect: (storeId: string) => void
}

export function StoreGrid({ storefronts, business, onStoreSelect }: StoreGridProps) {
  const [showCreateStore, setShowCreateStore] = useState(false)

  return (
    <div className="space-y-8">
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

      <Dialog open={showCreateStore} onOpenChange={setShowCreateStore}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Store</DialogTitle>
          </DialogHeader>
          {business && (
            <StorefrontForm
              businessId={business.id}
              onSuccess={() => {
                setShowCreateStore(false)
                window.location.reload()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {storefronts && storefronts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {storefronts.map((store) => (
            <Card
              key={store.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => {
                console.log("Selecting storefront:", store.id)
                localStorage.setItem('lastStorefrontId', store.id)
                onStoreSelect(store.id)
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
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No storefronts found. Create your first storefront to get started.</p>
        </div>
      )}
    </div>
  )
}