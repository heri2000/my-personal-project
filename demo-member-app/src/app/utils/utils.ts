// export type JSONValue =
//     | string
//     | number
//     | boolean
//     | { [x: string]: JSONValue }
//     | Array<JSONValue>;

// export interface IMember {
//   id: string,
//   regNumber: string,
//   name: string,
//   gender: string,
//   address: string | null,
//   birthDate: string | null,
//   phone1: string | null,
//   phone2: string | null,
//   marriageDate: string | null,
//   category: string | null,
//   createdAt: Date | null,
//   updatedAt: Date | null,
//   deletedAt: Date | null,
// }

export const PAGE_LIMITS = [10, 25, 50, 100];
export const TEXT_COLOR_FOR_LIGHT_THEME = "#3729ac";
export const TEXT_COLOR_FOR_DARK_THEME = "#d1d5dc";

export function dateToString(date: string | null): string {
  if (date) {
    const dateStr = date.slice(0, 10);
    const [ year, month, day ] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  return "";
}

// export const pageLimits = [10, 25, 50, 100];

// export function parseErrorMessage(errorKey: string): string {
//   if (errorKey in enEN) {
//     return enEN[errorKey];
//   } else {
//     return errorKey
//   }
// }

export function getStoredTheme(): string {
  const theme = localStorage.getItem('theme');
  return theme || '';
}

export function setStoredTheme(theme: string): void {
  localStorage.setItem('theme', theme);
}

export function parseErrorMessage(
  translationStrings: Record<string, string>,
  errorKey: string
): string {
  if (errorKey in translationStrings) {
    return translationStrings[errorKey];
  } else {
    return errorKey
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
