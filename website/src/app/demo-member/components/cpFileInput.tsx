import { enEN } from "@/app/translations/enEN";

export function CpFileInput(
  {typeString, accept, onChange, disabled}: {
    typeString: string,
    accept: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    disabled: boolean
  }
) {
  const languageStrings = enEN;

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="file_input" className="mb-1">{languageStrings.uploadFile}</label>
      <input
        type="file"
        id="file_input"
        accept={accept}
        onChange={onChange}
        className="block w-full placeholder-slate-800 text-slate-600 dark:text-slate-400 file:bg-slate-300 dark:file:bg-slate-700 !p-0 file:px-4 file:py-1 file:text-slate-800 dark:file:text-slate-200 mb-1"
        disabled={disabled}
      />
      <p className="text-sm">{typeString}</p>
    </div>
  );
}
