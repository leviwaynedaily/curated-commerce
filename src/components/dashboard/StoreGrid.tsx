import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Store, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface StoreGridProps {
  storefronts: any[]
  business: any
  onStoreSelect: (storeId: string) => void
}

export function StoreGrid({ storefronts, business, onStoreSelect }: StoreGridProps) {
  const [showCreateStore, setShowCreateStore] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/676a7b0a-3b60-49d7-bee1-49a8b896e630.png"
            alt="Curately Logo" 
            className="h-16 w-auto animate-fadeIn"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-brand-dark font-montserrat">
          Welcome to Your Digital Storefront
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-open-sans truncate">
          Manage your storefronts and create engaging shopping experiences for your customers.
        </p>
        {business && (
          <Button
            onClick={() => setShowCreateStore(true)}
            variant="default"
            size="lg"
            className="mt-8 animate-fadeIn bg-brand-green hover:bg-brand-green/90 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Store
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
        <div className="w-full flex justify-center">
          <Carousel className="w-full max-w-5xl">
            <CarouselContent className="-ml-2 md:-ml-4">
              {storefronts.map((store) => (
                <CarouselItem key={store.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card
                    className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    onClick={() => {
                      console.log("Selecting storefront:", store.id)
                      localStorage.setItem('lastStorefrontId', store.id)
                      onStoreSelect(store.id)
                      navigate(`/store/${store.id}`)
                    }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-brand-green/10">
                            <Store className="h-6 w-6 text-brand-green" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold tracking-tight group-hover:text-brand-green transition-colors font-montserrat">
                              {store.name}
                            </h3>
                            {store.is_published && (
                              <p className="text-sm text-muted-foreground font-open-sans">
                                /{store.slug}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-green transition-colors" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-open-sans">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-open-sans">
            No storefronts found. Create your first storefront to get started.
          </p>
        </div>
      )}
    </div>
  )
}