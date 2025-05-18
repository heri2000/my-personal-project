import { DashboardUpcomingBirthdays } from "./dashboardUpcomingBirthdays";
import { DashboardMember } from "./dashboardMember";
import { enEN } from "@/app/translations/enEN";

export const CURRENT_PAGE_DASHBOARD = "current_page_dashboard";

export function Dashboard() {
  const translationStrings = enEN;

  return (
    <div className="standard_content">
      <h1 className="page_title">{translationStrings.dashboard}</h1>
      <div className="mt-8">
        <DashboardUpcomingBirthdays/>
        <DashboardMember/>
      </div>
    </div>
  );
}
