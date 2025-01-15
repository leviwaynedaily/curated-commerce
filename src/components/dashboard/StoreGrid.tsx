import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StorefrontForm } from "@/components/forms/StorefrontForm";
import { Plus, ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

interface StoreGridProps {
  storefronts: any[];
  business: any;
  refetchStorefronts: () => void;
}

export function StoreGrid({ storefronts, business, refetchStorefronts }: StoreGridProps) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStoreSelect = (storeId: string) => {
    localStorage.setItem('lastStorefrontId', storeId);
    navigate('/dashboard');
  };

  const calculateProgress = (store: any) => {
    const steps = [
      !!store.name,
      !!store.description,
      !!store.logo_url,
      !!store.favicon_url,
    ];
    return (steps.filter(Boolean).length / steps.length) * 100;
  };

  const getPublicUrl = (slug: string) => {
    return `${window.location.origin}/${slug}`;
  };

  return (
    <div className="w-full space-y-8">
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
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-open-sans">
          Manage your storefronts and create engaging shopping experiences for your customers.
        </p>
        {business && (
          <div className="pt-4">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New Storefront
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Storefront</DialogTitle>
          </DialogHeader>
          <StorefrontForm
            businessId={business?.id}
            onSuccess={() => {
              setIsDialogOpen(false);
              refetchStorefronts();
            }}
          />
        </DialogContent>
      </Dialog>

      {storefronts && storefronts.length > 0 ? (
        <div className="flex justify-center items-center w-full px-4">
          <div className="w-full max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {storefronts.map((store) => (
                  <CarouselItem key={store.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2 flex justify-center">
                    <Card
                      className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full max-w-md cursor-pointer"
                      onClick={() => handleStoreSelect(store.id)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-white rounded-md p-2 w-20 h-20 flex items-center justify-center">
                            {store.logo_url ? (
                              <img
                                src={store.logo_url}
                                alt={store.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              store.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {store.is_published ? "Published" : "Draft"}
                            </span>
                            {store.is_published && store.slug && (
                              <a 
                                href={getPublicUrl(store.slug)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{store.name}</h3>
                        {store.slug && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {store.slug}
                          </p>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Setup Progress</span>
                            <span className="font-medium">{Math.round(calculateProgress(store))}%</span>
                          </div>
                          <Progress value={calculateProgress(store)} className="h-2" />
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
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No storefronts found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}