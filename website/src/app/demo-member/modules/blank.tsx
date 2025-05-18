import "./blank.css";

export const CURRENT_PAGE_BLANK = "current_page_blank";

export function Blank() {
  return (
    <div className="standard_content flex flex-col justify-center min-h-screen">
      <div className="flex flex-row justify-center">
        <div className="cp_loader">
            <span className="cp_bar"></span>
            <span className="cp_bar"></span>
            <span className="cp_bar"></span>
        </div>
      </div>
    </div>
  );
}
