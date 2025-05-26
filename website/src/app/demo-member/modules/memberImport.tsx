import { useState, type ChangeEvent } from "react";
import { CpFileInput } from "../components/cpFileInput";
import { CpProgressbar } from "../components/cpProgressbar";
import { CpSpinner } from "../components/cpSpinner";
import { config } from "@/app/utils/config";
import { enEN } from "@/app/translations/enEN";
import { getImportProgressPercent } from "../api/member";
import { TSessionData } from "../api/user";

export const VISIBLE_LAYER_MEMBER_IMPORT = "visible_layer_member_import";

export function MemberImport(
  {activeSessionData, handleGoBack}:
  {activeSessionData: TSessionData, handleGoBack: () => void}
) {
  const [loading, setLoading] = useState(false);
  const [inputFile, setInputFile] = useState<File>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadId, setUploadId] = useState("");
  const [importProgress, setImportProgress] = useState(0);
  const [done, setDone] = useState(false);
  const translationStrings = enEN;

  function onchange(event: ChangeEvent<HTMLInputElement>) {
    setInputFile(event.target.files?.[0]);
    setErrorMessage(null);
    setUploadProgress(0);
    setUploadId("");
    setImportProgress(0);
  }

  function handleFileUpload() {
    if (!inputFile) {
      setErrorMessage(translationStrings.messagePleaseSelectFileUpload);
      return;
    }
    setErrorMessage(null);
    const body = new FormData();
    body.append("file", inputFile);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${config.api.member}/upload`, true);
      xhr.setRequestHeader("Authorization", `Bearer ${activeSessionData.sessionId}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      xhr.onloadstart = () => {
        setLoading(true);
      };

      xhr.onloadend = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadId(response.uploadId);
          setDone(true);
          handleImportProgress(response.uploadId);
        } else {
          // TODO: Include message in translation
          console.error('Error uploading file:', xhr.statusText);
        }
      };

      xhr.send(body);
    } catch (error) {
      setLoading(false);
      // TODO: Include message in translation
      setErrorMessage(`Error when uploading file (${error}).`);
    }
  }

  function handleImportProgress(uploadId: string) {
    const intervalId = setInterval(async () => {
      try {
        const result = await getImportProgressPercent(uploadId);
        setImportProgress(result.progressPercent);

        if (
          result.status === 'error' ||
          result.status === 'done' ||
          result.progressPercent >= 100
        ) {
          clearInterval(intervalId);
          setLoading(false);
        }

        if (result.status === 'error') {
          setErrorMessage(translationStrings.internalServerError);
        }
      } catch (error) {
        console.error(error);
        clearInterval(intervalId);
        setLoading(false);
      }
    }, 1000);
  }

  return (
    <div className="flex flex-col w-full p-5 pt-15 md:pt-5 mb-10">
      <h2 className="text-3xl font-bold">
        {translationStrings.memberImport} &gt; {translationStrings.uploadExcelFile}
      </h2>
      <div className="flex flex-col min-h-100 w-full justify-center">
        <div className="flex flex-row w-full justify-center my-5">
          <div className="flex flex-col w-full md:w-2/3 mb-10">
            <p>{translationStrings.importMembersExplanation1}<br />
              {translationStrings.importMembersExplanation2}</p>
            <ol className="list-decimal pl-10">
              <li>{translationStrings.no1}</li>
              <li>
                {translationStrings.regNumber}&nbsp;
                <em>({translationStrings.mustBePrefixedWith} &quot;REG-&quot;)</em>
              </li>
              <li>{translationStrings.name}</li>
              <li>{translationStrings.gender}</li>
              <li>{translationStrings.address}</li>
              <li>{translationStrings.birthDate}</li>
              <li>{translationStrings.phone1}</li>
              <li>{translationStrings.phone2}</li>
              <li>{translationStrings.marriageDate}</li>
              <li>{translationStrings.category} <em>(Umum, Jemaat Anak atau Simpatisan)</em></li>
            </ol>
            <p className="mt-5 font-bold">
              {translationStrings.importMembersExplanation3}&nbsp;
              <a
                href={`${config.api.member}/template`}
                className="underline"
                download
              >
                {translationStrings.here}
              </a>
            </p>
          </div>
        </div>
        <form>
          <div className="flex flex-row w-full justify-center mb-4">
            <div className="flex flex-col w-full md:w-2/3">
              <CpFileInput
                typeString="MS Excel (.xls, .xlsx)"
                // accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                // fileRef={fileRef}
                onChange={onchange}
                disabled={loading || done}
              />
            </div>
          </div>
          {errorMessage &&
            <div className="error_message text-center mb-4">
              {errorMessage}
            </div>
          }
          {uploadProgress > 0 && (
            <div className="flex flex-row w-full justify-center mb-4">
              <div className="flex flex-col w-full md:w-2/3">
                <span className="text-sm">{translationStrings.upload}</span>
                <CpProgressbar progress={uploadProgress} />
              </div>
            </div>
          )}
          {uploadId && (
            <div className="flex flex-row w-full justify-center mb-4">
              <div className="flex flex-col w-full md:w-2/3">
                <span className="text-sm me-5">{translationStrings.import}</span>
                <CpProgressbar progress={importProgress} />
              </div>
            </div>
          )}
          <div className="flex flex-row w-full justify-center">
            {!done && (
              <button
                type="button"
                className="primary me-4"
                onClick={handleFileUpload}
                disabled={loading}
              >
                {translationStrings.upload}
              </button>
            )}
            <button
              type="button"
              onClick={handleGoBack}
              disabled={loading}
            >
              {!done ? translationStrings.cancel : translationStrings.ok}
            </button>
          </div>
        </form>
      </div>
      {loading && <CpSpinner />}
    </div>
  );
}
