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

  const generateTemporaryPassword = () => {
    // Generate a random 12-character password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from(crypto.getRandomValues(new Uint32Array(12)))
      .map((x) => chars[x % chars.length])
      .join('')
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business?.id || !newUserEmail) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      setIsAddingUser(true)
      console.log("Checking if user exists:", newUserEmail)

      // First check if user already exists
      const { data: existingUser, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newUserEmail)
        .maybeSingle()

      if (userError) {
        console.error("Error checking user:", userError)
        toast.error("An error occurred while checking user")
        return
      }

      let userId = existingUser?.id

      // If user doesn't exist, create them
      if (!existingUser) {
        console.log("User doesn't exist, creating new account")
        const tempPassword = generateTemporaryPassword()
        
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: newUserEmail,
          password: tempPassword,
        })

        if (signUpError) {
          console.error("Error creating user:", signUpError)
          toast.error("Failed to create user account")
          return
        }

        userId = newUser.user?.id
        
        // Show temporary password to admin
        toast.success(`User created! Temporary password: ${tempPassword}`, {
          duration: 10000, // Show for 10 seconds
        })
      }

      // Check if user already has access
      const { data: existingAccess, error: existingAccessError } = await supabase
        .from("business_users")
        .select("id")
        .eq("business_id", business.id)
        .eq("user_id", userId)
        .maybeSingle()

      if (existingAccessError) throw existingAccessError

      if (existingAccess) {
        toast.error("User already has access to this business")
        return
      }

      // Add user to business
      const { error: addError } = await supabase
        .from("business_users")
        .insert({
          business_id: business.id,
          user_id: userId,
          role: "member"
        })

      if (addError) throw addError

      toast.success("User added successfully to business")
      setNewUserEmail("")
      onRefetch()
    } catch (error) {
      console.error("Error in user management:", error)
      toast.error("Failed to manage user. Please try again.")
    } finally {
      setIsAddingUser(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Business Users</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage users that have access to all Curately Storefronts
        </p>
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