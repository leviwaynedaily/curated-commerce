import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Stats } from "./Stats"
import { QuickActions } from "./QuickActions"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { UserButton } from "@/components/auth/UserButton"

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const calculateSetupProgress = (storefront: any) => {
  const checkpoints = [
    !!storefront.name,
    !!storefront.description,
    !!storefront.logo_url,
    !!storefront.favicon_url,
  ]

  const completedSteps = checkpoints.filter(Boolean).length
  return Math.round((completedSteps / checkpoints.length) * 100)
}

export function Dashboard({ storefront }: { storefront: any }) {
  const { data: products, error: productsError } = useQuery({
    queryKey: ["products", storefront.id],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefront.id)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefront.id)

      if (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
        return []
      }

      console.log("All products fetched:", data)
      return data || []
    },
    enabled: !!storefront?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })

  const { data: user, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error fetching user:", error)
        toast.error("Failed to load user data")
        return null
      }
      return user
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })

  const greeting = getTimeBasedGreeting()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const setupProgress = calculateSetupProgress(storefront)

  if (productsError || userError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          There was an error loading the dashboard. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 fade-in px-4 md:px-0">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Dashboard for {storefront.name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              {greeting}, {userName}. Here's an overview of {storefront.name}.
            </p>
          </div>
          <UserButton />
        </div>

        {storefront.logo_url && (
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-white rounded-md p-2 w-fit">
              <img 
                src={storefront.logo_url} 
                alt={storefront.name || 'Store logo'} 
                className="h-12 object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Storefront Status: {storefront.is_published ? (
                <span className="text-green-500">Published</span>
              ) : (
                <span className="text-yellow-500">Draft</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Setup Progress: {setupProgress}% complete
            </p>
          </div>
        </div>

        <Progress value={setupProgress} className="h-2" />

        {setupProgress < 100 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete your storefront setup to ensure the best experience for your customers.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Stats products={products || []} />

      <div className="grid gap-4 md:grid-cols-2">
        <QuickActions />
      </div>
    </div>
  )
}