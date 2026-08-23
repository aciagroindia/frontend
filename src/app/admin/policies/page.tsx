import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import PoliciesAdmin from "../../../../components/policies/PoliciesAdmin";

export default function AdminPoliciesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <PoliciesAdmin />
      </div>
    </DashboardLayout>
  );
}
