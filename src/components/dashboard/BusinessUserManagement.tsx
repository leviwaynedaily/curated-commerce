import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, ChevronDown, ChevronUp, User, Plus } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface BusinessUserManagementProps {
  business: any
  businessUsers: any[]
  onRefetch: () => void
}

export function BusinessUserManagement({ business, businessUsers, onRefetch }: BusinessUserManagementProps) {
  const [newUserEmail, setNewUserEmail] = useState("")
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isUsersExpanded, setIsUsersExpanded] = useState(false)
  const [isBillingExpanded, setIsBillingExpanded] = useState(false)

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business?.id || !newUserEmail) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      setIsAddingUser(true)
      console.log("Adding user to business:", business.id)
      console.log("Searching for user with email:", newUserEmail)

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newUserEmail)
        .maybeSingle()

      if (userError) {
        console.error("Error finding user:", userError)
        toast.error("An error occurred while searching for the user")
        return
      }

      if (!userData) {
        console.log("No user found with email:", newUserEmail)
        toast.error("No user found with this email address")
        return
      }

      console.log("User found:", userData.id)

      const { data: existingAccess, error: existingAccessError } = await supabase
        .from("business_users")
        .select("id")
        .eq("business_id", business.id)
        .eq("user_id", userData.id)
        .maybeSingle()

      if (existingAccessError) throw existingAccessError

      if (existingAccess) {
        toast.error("User already has access to this business")
        return
      }

      const { error } = await supabase
        .from("business_users")
        .insert({
          business_id: business.id,
          user_id: userData.id,
          role: "member"
        })

      if (error) throw error

      toast.success("User added successfully")
      setNewUserEmail("")
      onRefetch()
    } catch (error) {
      console.error("Error adding user:", error)
      toast.error("Failed to add user. Please try again.")
    } finally {
      setIsAddingUser(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsUsersExpanded(!isUsersExpanded)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>User Management</CardTitle>
            </div>
            {isUsersExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <CardDescription>
            Manage users that have access to all Curately Storefronts
          </CardDescription>
        </CardHeader>
        {isUsersExpanded && (
          <CardContent>
            <form onSubmit={handleAddUser} className="flex gap-2 mb-6">
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span>{user.profiles.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(!businessUsers || businessUsers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No users found. Add users to collaborate on your business.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsBillingExpanded(!isBillingExpanded)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Billing</CardTitle>
            </div>
            {isBillingExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <CardDescription>
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        {isBillingExpanded && (
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Billing Coming Soon</h4>
                <p className="text-sm text-muted-foreground">
                  We're working on adding billing features. Stay tuned!
                </p>
              </div>
              <Button variant="secondary" disabled>
                <CreditCard className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}