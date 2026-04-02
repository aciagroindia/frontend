import HeroBanners from "../../../../../components/marcketing/HeroBanners";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";

export default function HeroBannersPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <HeroBanners />
        </div>
      </div>
    </DashboardLayout>
  );
}
