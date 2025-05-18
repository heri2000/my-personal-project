export function CpDialog(
  {title, handleClose, dismissable=true, children}:
  {
    title: string,
    handleClose: () => void,
    dismissable?: boolean,
    children: React.ReactNode,
  }
) {
  return (
    <div className="dialog">
      <div
        className="dialog_dimmer"
        onClick={() => {
          if (dismissable) {
            handleClose();
          }
        }}
      >
      </div>
      <div className="dialog_wrapper_1">
        <div className="dialog_wrapper_2">
          <div className="dialog_title">
            {title}
          </div>
          <div className="flex flex-col h-60 justify-center p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
