import EagleWelcome from "@/components/EagleWelcome/EagleWelcome";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen mt-[86px]">
        {children}
        <EagleWelcome />
      </div>
    </>
  );
}
