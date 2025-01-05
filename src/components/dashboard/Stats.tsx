import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageCheck, PackageX } from "lucide-react"

interface StatsProps {
  products: any[]
}

export function Stats({ products }: StatsProps) {
  console.log("Products in Stats:", products)
  // Filter products by their exact status values
  const activeProducts = products?.filter(p => p.status === "active")?.length || 0
  const inactiveProducts = products?.filter(p => p.status === "inactive")?.length || 0
  const totalProducts = products?.length || 0

  console.log("Active products:", activeProducts)
  console.log("Inactive products:", inactiveProducts)
  console.log("Total products:", totalProducts)

  const stats = [
    {
      title: "Active Products",
      value: activeProducts,
      icon: PackageCheck,
      change: "+2",
      changeType: "positive",
      percentage: totalProducts ? Math.round((activeProducts / totalProducts) * 100) : 0,
      color: "bg-green-500"
    },
    {
      title: "Inactive Products",
      value: inactiveProducts,
      icon: PackageX,
      change: "-1",
      changeType: "negative",
      percentage: totalProducts ? Math.round((inactiveProducts / totalProducts) * 100) : 0,
      color: "bg-red-500"
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${stat.color} transition-all duration-500`}
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {stat.percentage}% of total products
            </p>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}