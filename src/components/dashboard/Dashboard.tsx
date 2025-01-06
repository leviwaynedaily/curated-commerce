import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Stats } from "./Stats"
import { QuickActions } from "./QuickActions"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const { data: products } = useQuery({
    queryKey: ["products", storefront.id],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefront.id)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefront.id)

      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }

      console.log("All products fetched:", data)
      return data
    },
    enabled: !!storefront?.id,
  })

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
  })

  const greeting = getTimeBasedGreeting()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const setupProgress = calculateSetupProgress(storefront)

  return (
    <div className="space-y-6 md:space-y-8 fade-in px-4 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard for {storefront.name}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          {greeting}, {userName}. Here's an overview of {storefront.name}.
        </p>
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