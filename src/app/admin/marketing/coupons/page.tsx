import CouponTable from "../../../../../components/marcketing/CouponTable";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";


export default function CouponsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
          <p className="text-gray-600">Manage your discount codes and promotional offers.</p>
        </div>
        <CouponTable />
      </div>
    </DashboardLayout>
  );
}
