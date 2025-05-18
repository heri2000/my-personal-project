import { CURRENT_PAGE_DASHBOARD } from "./dashboard";
import { enEN } from "@/app/translations/enEN";

export function NotFound(
  {navigate} : {navigate: (path: string) => void}
) {
  const translationStrings = enEN;

  return (
    <main className="flex flex-col w-full h-dvh justify-center">
      <div className="flex flex-col items-center justify-center mb-100">
        <p>{translationStrings.pageNotFound}.</p>
        <p>
          {translationStrings.backTo}&nbsp;
          <a
            href="#"
            className="font-bold"
            onClick={() => {navigate(CURRENT_PAGE_DASHBOARD)}}
          >
            {translationStrings.dashboard}
          </a>.
        </p>
      </div>
    </main>
  );
}
