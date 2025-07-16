import { MouseEventHandler } from "react";
import "./cpThemeToggle.css";
import { IcDarkModeIcon, IcLightModeIcon } from "./IcIcons";
import { enEN } from "@/app/translations/enEN";

export function CpThemeToggle(
  { currentTheme, onClick }:
  {
    currentTheme: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
  }
) {
  const translationStrings = enEN;

  return (
    <div className="theme_toggle">
      <button
        type="button"
        className="button_icon !rounded-full"
        onClick={onClick}
        title={translationStrings.darkModeLightMode}
      >
        {currentTheme === "dark" ? <IcLightModeIcon/> : <IcDarkModeIcon/>}
      </button>
    </div>
  );
}
