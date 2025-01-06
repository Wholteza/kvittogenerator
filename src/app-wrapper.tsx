import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "~layouts/default";
import CompanyInformation from "~pages/company-information";
import Home from "~pages/Home";
import Login from "~pages/login";
import Old from "~pages/Old";

import "./app-wrapper.scss";
import { useEffect, useState } from "react";
import DeviceContext, { DeviceContextProps } from "~contexts/device-context";
import CompanyContext, {
  initialCompanyInformation,
} from "~contexts/company-context";
import useLocalStorage from "~use-local-storage";

const AppWrapper = () => {
  // TODO: Move to hook
  const [deviceContextProps, setDeviceContextProps] =
    useState<DeviceContextProps>({
      isDesktop: window.innerWidth > 1024,
      isTablet: window.innerWidth < 1024 && window.innerWidth > 767,
      isPhone: window.innerWidth <= 767,
    });

  useEffect(() => {
    const handleResize = () => {
      setDeviceContextProps({
        isDesktop: window.innerWidth > 1024,
        isTablet: window.innerWidth < 1024 && window.innerWidth > 767,
        isPhone: window.innerWidth <= 767,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [companyInformation, setCompanyInformation] =
    useLocalStorage<CompanyInformation>(
      "company-information-context",
      initialCompanyInformation
    );

  return (
    <CompanyContext.Provider
      value={{ state: companyInformation, setState: setCompanyInformation }}
    >
      <DeviceContext.Provider value={deviceContextProps}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />}></Route>
              <Route path="/old" element={<Old />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route
                path="/company-information"
                element={<CompanyInformation />}
              ></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </DeviceContext.Provider>
    </CompanyContext.Provider>
  );
};

export default AppWrapper;
