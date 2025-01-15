import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, ChevronDown, ChevronUp, User, Plus, X } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

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
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleOpenDialog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserEmail) {
      toast.error("Please enter a valid email address")
      return
    }
    setShowUserDialog(true)
  }

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleAddUser = async () => {
    if (!business?.id || !newUserEmail || !newUserName || !newUserPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (!validatePassword(newUserPassword)) {
      return
    }

    try {
      setIsAddingUser(true)
      console.log("Creating new user:", { email: newUserEmail, name: newUserName })

      // First create the user in auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            name: newUserName
          }
        }
      })

      if (signUpError) {
        console.error("Error creating user:", signUpError)
        throw signUpError
      }

      // Call the Edge Function to add user to business
      const { data, error } = await supabase.functions.invoke('create-business-user', {
        body: {
          email: newUserEmail,
          businessId: business.id
        }
      })

      if (error) {
        console.error("Edge function error:", error)
        throw error
      }

      toast.success("User added successfully")
      setNewUserEmail("")
      setNewUserName("")
      setNewUserPassword("")
      setPasswordError("")
      setShowUserDialog(false)
      onRefetch()
    } catch (error: any) {
      console.error("Error adding user:", error)
      toast.error(error.message || "Failed to add user. Please try again.")
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
            <form onSubmit={handleOpenDialog} className="flex gap-2 mb-6">
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

            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Name</label>
                    <Input
                      id="name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Enter user's name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="password">Password</label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => {
                        setNewUserPassword(e.target.value)
                        validatePassword(e.target.value)
                      }}
                      placeholder="Enter password (min. 6 characters)"
                    />
                    {passwordError && (
                      <p className="text-sm text-destructive">{passwordError}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} disabled={isAddingUser}>
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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