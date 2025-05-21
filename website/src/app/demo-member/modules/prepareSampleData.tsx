import { enEN } from "@/app/translations/enEN";
import { TSessionData } from "../api/user";
import { useEffect, useState } from "react";
import { getMemberCount, prepareSampleData } from "../api/member";

export const CURRENT_PAGE_PREPARE_SAMPLE_DATA = "current_page_prepare_sample_data";

export function PrepareSampleData(
  { activeSessionData, continueToDashboard }:
  { activeSessionData: TSessionData, continueToDashboard: () => void }
) {
  const [preparingSampleData, setPreparingSampleData] = useState(false);
  const [error, setError] = useState(false);
  const translationStrings = enEN;

  useEffect(() => {
    doGetMemberCount();
  }, []);

  async function doGetMemberCount() {
    const count = await getMemberCount(activeSessionData.sessionId);
    if (count === 0) {
      setPreparingSampleData(true);
      const result = await prepareSampleData(activeSessionData.sessionId);
      if (result) {
        continueToDashboard();
      } else {
        setError(true);
      }
    } else {
      continueToDashboard();
    }
  }

  return (
    <div className="standard_content">
      {preparingSampleData && (
        <div className="flex flex-col mt-50 w-full text-center">
          <h2>{translationStrings.preparingSampleData}...</h2>
        </div>
      )}

      {error && (
        <div className="flex flex-col mt-50 w-full text-center">
          {translationStrings.errorWhenPreparingSampleData}.
        </div>
      )}
    </div>
  );
}
