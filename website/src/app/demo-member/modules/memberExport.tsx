import { useState } from "react";
import { config } from "@/app/utils/config";
import { parseErrorMessage } from "@/app/utils/utils";
import { requestMemberExport, getExportProgressPercent } from "../api/member";
import { CpSpinner } from "../components/cpSpinner";
import { CpProgressbar } from "../components/cpProgressbar";
import { enEN } from "@/app/translations/enEN";
import { TSessionData } from "../api/user";

export const VISIBLE_LAYER_MEMBER_EXPORT = "visible_layer_member_export";

export function MemberExport(
  {activeSessionData, handleGoBack, search, order}:
  {
    activeSessionData: TSessionData,
    handleGoBack: () => void,
    search: string,
    order: string,
  }
) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportId, setExportId] = useState("");
  const [exportProgress, setExportProgress] = useState(0);
  const [done, setDone] = useState(false);
  const translationStrings = enEN;

  async function handleButtonDownloadClick() {
    setErrorMessage(null);
    setLoading(true);

    const result = await requestMemberExport(activeSessionData.sessionId, search, order);
    if (result.exportId) {
      setExportId(result.exportId);
      setExportProgress(0);
      const id = result.exportId;

      const intervalId = setInterval(async () => {
        const result = await getExportProgressPercent(id);
        setExportProgress(result.progressPercent);
        if (result.status === "done") {
          clearInterval(intervalId);
          setLoading(false);
          setDone(true);
          downloadFile(`${config.api.member}/download-exported-file/${id}`);
        }
        if (result.status === "error") {
          setErrorMessage(
            parseErrorMessage(
              translationStrings,
              result.errorMessage || translationStrings.unknownError
            )
          );
          clearInterval(intervalId);
          setLoading(false);
        }
      }, 1000);
    } else {
      setErrorMessage(
        parseErrorMessage(
          translationStrings,
          result.errorMessage || translationStrings.unknownError
        )
      );
      setLoading(false);
    }
  }

  function downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `FileName.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }

  return (
    <div className="flex flex-col w-full p-5 pt-15 md:pt-5">
      <h2 className="text-3xl font-bold">
        {translationStrings.memberExport} &gt; {translationStrings.downloadExcelFile}
      </h2>
      <div className="flex flex-col min-h-100 w-full justify-center">
        <div className="flex flex-row w-full justify-center my-5">
          <div className="flex flex-col w-full md:w-2/3 mb-10">
            <p>{translationStrings.exportMembersExplanation1}</p>
          </div>
        </div>
        {errorMessage &&
          <div className="error_message_color text-center mb-4">
            {errorMessage}
          </div>
        }
        {exportId && (
          <div className="flex flex-row w-full justify-center mb-4">
            <div className="flex flex-col w-full md:w-2/3">
              <span className="text-sm">{translationStrings.export}</span>
              <CpProgressbar progress={exportProgress} />
            </div>
          </div>
        )}
        <div className="flex flex-row w-full justify-center">
          {!done && (
            <button
              type="button"
              className="primary me-4"
              onClick={handleButtonDownloadClick}
              disabled={loading}
            >
              {translationStrings.download}
            </button>
          )}
          <button
            type="button"
            onClick={handleGoBack}
          >
            {!done ? translationStrings.cancel : translationStrings.done}
          </button>
        </div>
      </div>
      {loading && <CpSpinner />}
    </div>
  );
}
