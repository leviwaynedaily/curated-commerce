import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { KeyRound, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
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
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [lastCreatedUserCredentials, setLastCreatedUserCredentials] = useState<{email: string, password: string} | null>(null)
  const [userToDelete, setUserToDelete] = useState<{ id: string, email: string } | null>(null)
  const [resetRequests, setResetRequests] = useState<Record<string, number>>({})

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = generateTemporaryPassword()

    try {
      console.log("Creating user with email:", email)
      
      // First, check if the session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        console.error("Session error:", sessionError)
        toast.error("Session expired. Please log in again.")
        return
      }

      // Create the user using admin functions
      const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (signUpError) throw signUpError

      if (!user) {
        throw new Error("User creation failed")
      }

      console.log("User created successfully:", user.id)

      // Add user to business_users table
      const { error: linkError } = await supabase
        .from('business_users')
        .insert([
          {
            business_id: business.id,
            user_id: user.id,
            role: 'member'
          }
        ])

      if (linkError) throw linkError

      console.log("User linked to business successfully")
      
      setLastCreatedUserCredentials({ email, password })
      setIsAddingUser(false)
      onRefetch()
      toast.success("User added successfully")
    } catch (error: any) {
      console.error("Error adding user:", error)
      toast.error(error.message || "Failed to add user")
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      console.log("Deleting user:", userToDelete.email)
      
      // First, check if the session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        console.error("Session error:", sessionError)
        toast.error("Session expired. Please log in again.")
        return
      }

      // Delete the user using admin functions
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      )

      if (deleteError) throw deleteError

      console.log("User deleted successfully")
      setUserToDelete(null)
      onRefetch()
      toast.success("User deleted successfully")
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast.error(error.message || "Failed to delete user")
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
      
      // First, check if the session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        console.error("Session error:", sessionError)
        toast.error("Session expired. Please log in again.")
        return
      }

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
    } catch (error: any) {
      console.error("Error resetting password:", error)
      toast.error(error.message || "Failed to reset password")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Business Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage users who have access to this business
          </p>
        </div>
        <Button onClick={() => setIsAddingUser(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="space-y-4">
            {businessUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <div className="font-medium">{user.profiles.email}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {user.role}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResetPassword(user.profiles.email)}
                    disabled={isResetDisabled(user.profiles.email)}
                    title={getResetButtonTooltip(user.profiles.email)}
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  {user.role !== 'owner' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserToDelete({ id: user.user_id, email: user.profiles.email })}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Add a new user to this business. They will receive an email with their login credentials.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter user's email"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!lastCreatedUserCredentials}
        onOpenChange={() => setLastCreatedUserCredentials(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Created Successfully</DialogTitle>
            <DialogDescription>
              Please save these credentials and share them securely with the user:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="mt-1.5 p-2 bg-muted rounded-md">
                {lastCreatedUserCredentials?.email}
              </div>
            </div>
            <div>
              <Label>Temporary Password</Label>
              <div className="mt-1.5 p-2 bg-muted rounded-md">
                {lastCreatedUserCredentials?.password}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user {userToDelete?.email} and remove their access to this business.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}