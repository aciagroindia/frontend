import DiscountTable from "../../../../../components/marcketing/Discount";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";


export default function DiscountsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <DiscountTable />
      </div>
    </DashboardLayout>
  );
}
