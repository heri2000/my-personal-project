import { useEffect, useState } from "react";
import { TDashboardStatistics, getDashboardStatistics } from "../api/dashboard";
import DashboardMemberGenderChart from "./dashboardMemberGenderChart";
import DashboardMemberCategoriesChart from "./dashboardMemberCategoriesChart";
import DashboardMemberAgeGroupsChart from "./dashboardMemberAgeGroupsChart";
import { enEN } from "@/app/translations/enEN";
import { TSessionData } from "../api/user";

export function DashboardMember(
  { activeSessionData }:
  { activeSessionData: TSessionData }
) {
  const translationStrings = enEN;
  const [statistics, setStatistics] = useState<TDashboardStatistics | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  async function fetchStatistics() {
    const result = await getDashboardStatistics(activeSessionData.sessionId);
    setStatistics(result);
  }

  return (
    <div className="flex flex-col mb-12">
      <h2 className="text-center">{translationStrings.memberSummary}</h2>
      {statistics && (
        <div className="flex flex-row justify-center mb-4">
          <h3>{translationStrings.totalMembers} : {statistics.totalMembers}</h3>
        </div>
      )}
      {statistics && (
        <div className="flex flex-col md:flex-row justify-normal md:justify-evenly">
          <DashboardMemberGenderChart statistics={statistics}/>
          <DashboardMemberCategoriesChart statistics={statistics}/>
          <DashboardMemberAgeGroupsChart statistics={statistics}/>
        </div>
      )}
    </div>
  );
}
