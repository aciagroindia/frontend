import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import ArticlesAdmin from "../../../../components/articles/ArticlesAdmin";

export default function AdminArticlesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Articles & Blog Posts</h1>
          <p className="text-sm text-gray-500">
            Write, format, publish, and manage wellness blogs, recipes, and guides for your store.
          </p>
        </div>
        <ArticlesAdmin />
      </div>
    </DashboardLayout>
  );
}
