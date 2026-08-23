import BulkBanners from "../../../../../components/marcketing/BulkBanners";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";

export default function BulkBannersPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Bulk Banners</h1>
          <p className="text-sm text-gray-500">Manage hero carousel banners displayed on the Bulk Order page</p>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <BulkBanners />
        </div>
      </div>
    </DashboardLayout>
  );
}
