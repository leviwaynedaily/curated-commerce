import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, User } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface BusinessUserManagementProps {
  business: any
  businessUsers: any[]
  onRefetch: () => void
}

export function BusinessUserManagement({ business, businessUsers, onRefetch }: BusinessUserManagementProps) {
  const [newUserEmail, setNewUserEmail] = useState("")
  const [isAddingUser, setIsAddingUser] = useState(false)

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
  )
}