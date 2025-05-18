import { config } from "@/app/utils/config";
import { TMember } from "./member";

export type TDashboardStatistics = {
  totalMembers: number;
  male: number;
  female: number;
  categories: {
    [key: string]: number;
  };
  ageGroups: {
    [key: string]: number;
  };
}

export async function getDashboardStatistics(): Promise<TDashboardStatistics> {
  const statistics: TDashboardStatistics = {
    totalMembers: 0,
    male: 0,
    female: 0,
    categories: {
      simpatisan: 0,
      umum: 0,
      jemaatAnak: 0,
    },
    ageGroups: {
      under18: 0,
      from19to25: 0,
      from26to59: 0,
      over60: 0,
      unknown: 0,
    },
  };

  try {
    const response = await fetch(`${config.api.dashboard}/statistics`, {method: 'GET'});
    const responseJson = await response.json();
    if (response.status !== 200) {
      console.error('Failed to fetch dashboard statistics');
    } else {
      statistics.totalMembers = responseJson.statistics.totalMembers;
      statistics.male = responseJson.statistics.male;
      statistics.female = responseJson.statistics.female;
      statistics.categories = responseJson.statistics.categories;
      statistics.ageGroups = responseJson.statistics.ageGroups;
    }
  } catch (error) {
    console.error(error);
  }

  return statistics;
}

export async function getDashboardUpcomingBirthdays(
  days: number
): Promise<TMember[] | null> {
  try {
    const response = await fetch(
      `${config.api.dashboard}/upcoming-birthdays/${days}`, {method: 'GET'}
    );
    const responseJson = await response.json();

    if (response.status !== 200) {
      console.error('Failed to fetch upcoming birthdays');
      return null;
    }

    return responseJson.data;
  } catch (error) {
    console.error(error);
  }

  return null;
}
