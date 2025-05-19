import { DashboardUpcomingBirthdays } from "./dashboardUpcomingBirthdays";
import { DashboardMember } from "./dashboardMember";
import { enEN } from "@/app/translations/enEN";
import { TSessionData } from "../api/user";

export const CURRENT_PAGE_DASHBOARD = "current_page_dashboard";

export function Dashboard(
  { activeSessionData }:
  { activeSessionData: TSessionData }
) {
  const translationStrings = enEN;

  return (
    <div className="standard_content">
      <h1 className="page_title">{translationStrings.dashboard}</h1>
      <div className="mt-8">
        <DashboardUpcomingBirthdays activeSessionData={activeSessionData}/>
        <DashboardMember activeSessionData={activeSessionData}/>
      </div>
    </div>
  );
}
