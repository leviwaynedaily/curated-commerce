import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { UserManagement } from "@/components/users/UserManagement"

export default function Users() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  )
}