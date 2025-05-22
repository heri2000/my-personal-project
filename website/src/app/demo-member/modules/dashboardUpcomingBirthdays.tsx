import { enEN } from "@/app/translations/enEN";
import { useEffect, useState } from "react";
import { TMember } from "../api/member";
import { getDashboardUpcomingBirthdays } from "../api/dashboard";
import { dateToString } from "@/app/utils/utils";
import { TSessionData } from "../api/user";

const UPCOMING_DAYS = 7;

export function DashboardUpcomingBirthdays(
  { activeSessionData }:
  { activeSessionData: TSessionData }
) {
  const translationStrings = enEN;
  const [upcomingBirthdayMembers, setUpcomingBirthdayMembers] = useState<TMember[]>([]);

  useEffect(() => {
    fetchUpcomingBirthdayMembers();
  }, []);

  async function fetchUpcomingBirthdayMembers() {
    const result = await getDashboardUpcomingBirthdays(activeSessionData.sessionId, UPCOMING_DAYS);
    if (result) {
      setUpcomingBirthdayMembers(result);
    }
  }

  return (
    <div className="flex flex-col mb-12">
      <h2 className="text-center">
        {translationStrings.birthdaysInTheNext} {UPCOMING_DAYS} {translationStrings.futureDays}
      </h2>
      <div className="data_table">
        <table className="data_table">
          <thead>
            <tr>
              <th>{translationStrings.no1}</th>
              <th>{translationStrings.regNumber}</th>
              <th>{translationStrings.name}</th>
              <th>{translationStrings.birthDate}</th>
              <th>{translationStrings.gender}</th>
              <th></th>
              <th>{translationStrings.address}</th>
              <th>{translationStrings.phone1}</th>
              <th>{translationStrings.phone2}</th>
              <th>{translationStrings.marriageDate}</th>
            </tr>
          </thead>
          <tbody>
            {upcomingBirthdayMembers.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center">{translationStrings.noUpcomingBirthdays}</td>
              </tr>
            )}
            {upcomingBirthdayMembers.map((element: TMember, index: number) => {
              let badgeClass = "text-xs bg-gray-600 dark:bg-slate-400 text-white dark:text-slate-800 px-1 h-4 rounded-2xl mt-1 whitespace-nowrap";
              if (element.category?.toLowerCase() === "jemaat anak") {
                badgeClass = "text-xs bg-red-700 text-white px-1 h-4 rounded-2xl mt-1 whitespace-nowrap";
              } else if (element.category?.toLowerCase() === "simpatisan") {
                badgeClass = "text-xs bg-blue-700 text-white px-1 h-4 rounded-2xl mt-1 whitespace-nowrap";
              }
              return (
                <tr key={element.id}>
                  <td className="text-end">{index + 1}</td>
                  <td>{element.regNumber}</td>
                  <td>{element.name}</td>
                  <td className="whitespace-nowrap">{dateToString(element.birthDate)}</td>
                  <td className="text-center">{element.gender}</td>
                  <td><span className={badgeClass}>{element.category}</span></td>
                  <td>{element.address}</td>
                  <td>{element.phone1}</td>
                  <td>{element.phone2}</td>
                  <td className="whitespace-nowrap">{dateToString(element.marriageDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
