"use client";

import React, { useEffect } from 'react';
import { LoginPage, CURRENT_PAGE_LOGIN } from './modules/login';
import { CpThemeToggle } from './components/cpThemeToggle';
import { removeSessionId } from '@/app/utils/session';
import { getStoredTheme, setStoredTheme, sleep } from '@/app/utils/utils';
import { userLogout, getSessionData, type TSessionData } from './api/user';
import { Blank } from './modules/blank';
import { Dashboard, CURRENT_PAGE_DASHBOARD } from './modules/dashboard';
import { Member, CURRENT_PAGE_MEMBER } from './modules/member';
import { About, CURRENT_PAGE_ABOUT } from './modules/about';
import { PrepareSampleData, CURRENT_PAGE_PREPARE_SAMPLE_DATA } from './modules/prepareSampleData';
import { NotFound } from './modules/notFound';
import './page.css';
import { CpNavbar } from './components/cpNavbar';
import { CpSpinner } from './components/cpSpinner';

export default function AdminApp() {
  const [currentPage, setCurrentPage] = React.useState("");
  const [showNavbar, setShowNavbar] = React.useState("");
  const [activeTheme, setActiveTheme] = React.useState('light');
  const [loading, setLoading] = React.useState(false);
  const [activeSessionData, setActiveSessionData] = React.useState<TSessionData | null>(null);

  useEffect(() => {
    const theme = getStoredTheme();
    if (theme) {
      setActiveTheme(theme);
    } else {
      setStoredTheme(activeTheme);
    }
    checkSession();
  }, [activeTheme]);

  async function checkSession() {
    const sessionData = await getSessionData();
    setActiveSessionData(sessionData);
    await sleep(500);
    if (sessionData) {
      if (currentPage === "" || currentPage === CURRENT_PAGE_LOGIN) {
        setCurrentPage(CURRENT_PAGE_PREPARE_SAMPLE_DATA);
      }
    } else {
      if (currentPage !== CURRENT_PAGE_LOGIN) {
        setCurrentPage(CURRENT_PAGE_LOGIN);
      }
    }
  }

  function toggleTheme() {
    setActiveTheme(activeTheme === 'dark' ? 'light' : 'dark');
    if (activeTheme === 'light') {
      setActiveTheme('dark');
      setStoredTheme('dark');
    } else {
      setActiveTheme('light');
      setStoredTheme('light');
    }
  }

  function toggleShowNavbar() {
    setShowNavbar(showNavbar === "show" ? "" : "show");
  }

  async function handleLoginSuccessful() {
    await sleep(500);
    setCurrentPage(CURRENT_PAGE_DASHBOARD);
    checkSession();
  }

  async function handleLogout() {
    setLoading(true);
    setShowNavbar("");
    await userLogout();
    removeSessionId();
    setTimeout(() => {
      setCurrentPage(CURRENT_PAGE_LOGIN);
      setLoading(false);
    }, 1000);
  }

  function handleNavigate(path: string) {
    setShowNavbar("");
    setCurrentPage(path);
  }

  function LayoutNoNav({ children } : { children?: React.ReactNode | undefined }) {
    return (
      <div className={`layout_no_nav flex flex-col ${activeTheme}`}>
        {children}
        <CpThemeToggle currentTheme={activeTheme} onClick={toggleTheme}/>
        {loading && <CpSpinner/>}
      </div>
    );
  }

  function LayoutWithNav(
    {
      children, currentPage
    } : {
      children?: React.ReactNode | undefined,
      currentPage: string,
    }
  ) {
    return (
      <div className={`layout_with_nav w-screen h-screen ${activeTheme}`}>
        <div className="content_wrapper_1">
          {children}
        </div>
        <div className={`navbar_wrapper_1 ${showNavbar}`}>
          <CpNavbar
            toggleShow={toggleShowNavbar}
            logout={handleLogout}
            navigate={handleNavigate}
            activeSessionData={activeSessionData}
            currentPage={currentPage}
          />
        </div>
        <CpThemeToggle currentTheme={activeTheme} onClick={toggleTheme}/>
        {loading && <CpSpinner forNavbar={true}/>}
      </div>
    );
  }

  if (currentPage === "") {
    return (
      <LayoutNoNav>
        <Blank/>
      </LayoutNoNav>
    );
  }

  if (currentPage === CURRENT_PAGE_LOGIN) {
    return (
      <LayoutNoNav>
        <LoginPage loginSuccessful={handleLoginSuccessful}/>
      </LayoutNoNav>
    );
  }

  if (currentPage === CURRENT_PAGE_DASHBOARD) {
    if (activeSessionData) {
      return (
        <LayoutWithNav currentPage={currentPage}>
          <Dashboard activeSessionData={activeSessionData}/>
        </LayoutWithNav>
      );
    } else {
      return (<LayoutNoNav><LoginPage loginSuccessful={handleLoginSuccessful}/></LayoutNoNav>);
    }
  }

  if (currentPage === CURRENT_PAGE_MEMBER) {
    if (activeSessionData) {
      return (
        <LayoutWithNav currentPage={currentPage}>
          <Member activeSessionData={activeSessionData}/>
        </LayoutWithNav>
      );
    } else {
      return (<LayoutNoNav><LoginPage loginSuccessful={handleLoginSuccessful}/></LayoutNoNav>);
    }
  }

  if (currentPage === CURRENT_PAGE_PREPARE_SAMPLE_DATA) {
    if (activeSessionData) {
      return (
        <LayoutWithNav currentPage={currentPage}>
          <PrepareSampleData
            activeSessionData={activeSessionData}
            continueToDashboard={() => {setCurrentPage(CURRENT_PAGE_DASHBOARD)}}
          />
        </LayoutWithNav>
      );
    } else {
      return (
        <LayoutNoNav>
          <LoginPage loginSuccessful={handleLoginSuccessful}/>
        </LayoutNoNav>
      );
    }
  }

  if (currentPage === CURRENT_PAGE_ABOUT) {
    return (
      <LayoutWithNav currentPage={currentPage}>
        <About/>
      </LayoutWithNav>
    );
  }

  return (
    <LayoutNoNav>
      <NotFound navigate={handleNavigate}/>
    </LayoutNoNav>
  );
}
