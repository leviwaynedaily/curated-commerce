import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, User, Trash2, KeyRound } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BusinessUserManagementProps {
  business: any
  businessUsers: any[]
  onRefetch: () => void
}

export function BusinessUserManagement({ business, businessUsers, onRefetch }: BusinessUserManagementProps) {
  const [newUserEmail, setNewUserEmail] = useState("")
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [lastCreatedUserCredentials, setLastCreatedUserCredentials] = useState<{email: string, password: string} | null>(null)
  const [userToDelete, setUserToDelete] = useState<{ id: string, email: string } | null>(null)
  const [resetRequests, setResetRequests] = useState<Record<string, number>>({})

  const generateTemporaryPassword = () => {
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
      console.log("Adding user to business:", business.id)

      // First verify the current user has permission to add users to this business
      const { data: businessCheck, error: businessCheckError } = await supabase
        .from("businesses")
        .select("id")
        .eq("id", business.id)
        .single()

      if (businessCheckError || !businessCheck) {
        console.error("Error checking business permissions:", businessCheckError)
        toast.error("You don't have permission to add users to this business")
        return
      }
      
      const tempPassword = generateTemporaryPassword()
      
      // Use the Edge Function to create the user instead of direct signup
      const { data: newUser, error: createError } = await supabase.functions.invoke('create-user', {
        body: { email: newUserEmail, password: tempPassword }
      })

      console.log("Create user response:", { newUser, createError })

      if (createError) {
        console.error("Error creating user:", createError)
        toast.error("Failed to create user account")
        return
      }

      let userId = newUser?.data?.user?.id

      if (!userId) {
        // If user wasn't created, try to find existing user
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", newUserEmail)
          .single()
        
        userId = existingProfile?.id
        console.log("Found existing user:", userId)
      } else {
        // Store the credentials for display
        setLastCreatedUserCredentials({
          email: newUserEmail,
          password: tempPassword
        })
        toast.success("New user account created successfully")
      }

      if (!userId) {
        toast.error("Failed to get user ID")
        return
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

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      console.log("Deleting user from business:", userToDelete.id)
      
      const { error: deleteError } = await supabase
        .from("business_users")
        .delete()
        .eq("user_id", userToDelete.id)
        .eq("business_id", business.id)

      if (deleteError) throw deleteError

      toast.success("User removed from business successfully")
      onRefetch()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to remove user from business")
    } finally {
      setUserToDelete(null)
    }
  }

  const isResetDisabled = (email: string) => {
    const lastRequest = resetRequests[email]
    if (!lastRequest) return false
    const timeSinceLastRequest = Date.now() - lastRequest
    return timeSinceLastRequest < 60000 // 60 seconds cooldown
  }

  const getResetButtonTooltip = (email: string) => {
    if (!isResetDisabled(email)) return "Send password reset email"
    const timeLeft = Math.ceil((60000 - (Date.now() - resetRequests[email])) / 1000)
    return `Please wait ${timeLeft} seconds before requesting another reset`
  }

  const handleResetPassword = async (email: string) => {
    if (isResetDisabled(email)) {
      toast.error("Please wait before requesting another password reset")
      return
    }

    try {
      console.log("Resetting password for user:", email)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error("Please wait before requesting another password reset")
        } else {
          throw error
        }
        return
      }

      setResetRequests(prev => ({
        ...prev,
        [email]: Date.now()
      }))
      toast.success("Password reset email sent successfully")
    } catch (error) {
      console.error("Error resetting password:", error)
      toast.error("Failed to send password reset email")
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

      {lastCreatedUserCredentials && (
        <Alert>
          <AlertDescription className="space-y-2">
            <p><strong>New user created!</strong></p>
            <p>Email: {lastCreatedUserCredentials.email}</p>
            <p>Temporary Password: <strong>{lastCreatedUserCredentials.password}</strong></p>
            <p className="text-sm text-muted-foreground">Please save these credentials - they won't be shown again!</p>
          </AlertDescription>
        </Alert>
      )}

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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground capitalize">{user.role}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResetPassword(user.profiles.email)}
                    disabled={isResetDisabled(user.profiles.email)}
                    title={getResetButtonTooltip(user.profiles.email)}
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserToDelete({ id: user.user_id, email: user.profiles.email })}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {(!businessUsers || businessUsers.length === 0) && (
              <p className="py-3 text-muted-foreground text-center">No users found. Add users to collaborate on your business.</p>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {userToDelete?.email} from the business. They will no longer have access to any storefronts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
