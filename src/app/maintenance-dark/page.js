import MaintenanceMain from "@/components/layout/main/MaintenanceMain";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Maintenance - Dark | Tutorbay - Education Palatform",
  description: "Maintenance - Dark | Tutorbay - Education Palatform",
};
const Maintenance_Dark = () => {
  return (
    <main className="is-dark">
      <MaintenanceMain />
      <ThemeController />
    </main>
  );
};

export default Maintenance_Dark;
