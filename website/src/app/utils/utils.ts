export const PAGE_LIMITS = [10, 25, 50, 100];
export const TEXT_COLOR_FOR_LIGHT_THEME = "#3729ac";
export const TEXT_COLOR_FOR_DARK_THEME = "#d1d5dc";

export function dateToString(date: string | null): string {
  if (date) {
    const dateStr = date.split('T')[0];
    const [ year, month, day ] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  return "";
}

export function dateToSqlString(date: string | null): string {
  if (date) {
    const dateStr = date.split('T')[0];
    const [ year, month, day ] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  }

  return "";
}

export function sqlDateTimeToSqlDate(date: string | null): string {
  if (date) {
    const parts = date.split('T');
    return parts[0];
  }

  return "";
}

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
