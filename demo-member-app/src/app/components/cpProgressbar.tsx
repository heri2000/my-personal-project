export function CpProgressbar({progress}: {progress: number}) {
  return (
    <div className="flex flex-row w-full">
      <div className="flex grow bg-indigo-300 dark:bg-slate-700">
        <div className="flex h-full bg-indigo-500 dark:bg-slate-400" style={{width: `${progress}%`}}></div>
      </div>
      <div className="flex w-10 ms-1 text-xs justify-end">
        {progress && progress.toLocaleString(undefined, {maximumFractionDigits: 0})}%
      </div>
    </div>
  );
}
