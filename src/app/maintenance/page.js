import MaintenanceMain from "@/components/layout/main/MaintenanceMain";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Maintenance | Tutorbay - Education Palatform",
  description: "Maintenance| Tutorbay - Education Palatform",
};
const Maintenance = () => {
  return (
    <main>
      <MaintenanceMain />
      <ThemeController />
    </main>
  );
};

export default Maintenance;
