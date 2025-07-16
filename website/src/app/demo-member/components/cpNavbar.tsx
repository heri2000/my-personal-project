import React, { MouseEventHandler } from "react";
import { enEN } from "@/app/translations/enEN";
import { CURRENT_PAGE_DASHBOARD } from "../modules/dashboard";
import { CURRENT_PAGE_MEMBER } from "../modules/member";
import { CURRENT_PAGE_ABOUT } from "../modules/about";
import { TSessionData } from "../api/user";
import "./cpNavbar.css";
import { IcMenuIcon, IcPersonIcon } from "./IcIcons";

export function CpNavbar(
  {
    toggleShow, logout, navigate, activeSessionData, currentPage
  } : {
    toggleShow: () => void,
    logout: MouseEventHandler<HTMLButtonElement>,
    navigate: (path: string) => void,
    activeSessionData: TSessionData | null,
    currentPage: string,
  }
) {
  const translationStrings = enEN;

  function handleToggleClick() {
    toggleShow();
  }

  return (
    <div className="navbar relative rounded-lg shadow-lg shadow-black bg-indigo-200 dark:bg-gray-800 border border-indigo-300 dark:border-gray-700">
      <div className="relative rounded-lg w-full h-full overflow-hidden">
        <div className="flex flex-col mt-6 mb-4">
          <div className="navbar_title_icon">
            <a href="#" title={activeSessionData ? activeSessionData.email : "-"}>
              <IcPersonIcon/>
            </a>
          </div>
          <div className="text-center font-bold text-indigo-700 dark:text-gray-400 mb-2 p-2 wrap-break-word">
            <a href="#" title={activeSessionData ? activeSessionData.email : "-"} className="!no-underline">
              {activeSessionData ? activeSessionData.displayName : "-"}
            </a>
          </div>
          <div className="inline-flex flex-col w-full px-3">
            <button onClick={logout}>
              {translationStrings.log_out}
            </button>
          </div>
        </div>
        <nav className="navbar inline-flex h-full overflow-auto">
          <ul className="block w-full">
            <li>
              <a
                href="#"
                className={`navbar_menu_item ${currentPage === CURRENT_PAGE_DASHBOARD ? 'active' : ''}`}
                onClick={() => {navigate(CURRENT_PAGE_DASHBOARD)}}
              >
                {translationStrings.dashboard}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`navbar_menu_item ${currentPage === CURRENT_PAGE_MEMBER ? 'active' : ''}`}
                onClick={() => {navigate(CURRENT_PAGE_MEMBER)}}
              >
                {translationStrings.members}
              </a>
            </li>
            {activeSessionData &&
              activeSessionData.role === 'admin' &&
            (
              <li>
                <a
                  href="#"
                  className={`navbar_menu_item ${currentPage === CURRENT_PAGE_ABOUT ? 'active' : ''}`}
                  onClick={() => {navigate(CURRENT_PAGE_ABOUT)}}
                >
                  {translationStrings.about} {translationStrings.websiteTitle}
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="nav_toggle">
        <button
          type="button"
          onClick={handleToggleClick}
          className="button_icon !rounded-full"
          title="Menu"
        >
          <IcMenuIcon/>
        </button>
      </div>
    </div>
  );
}
