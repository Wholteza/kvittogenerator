import { Outlet } from "react-router";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faBars, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import DeviceContext, { DeviceContextProps } from "~contexts/device-context";
import Link from "~components/link";
import Typography from "~components/typography";

import "./default.scss";

const Layout = () => {
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

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(
    deviceContextProps.isDesktop
  );

  const menuClassNames = useMemo<string>(() => {
    return menuIsOpen ? "left-menu--open" : "left-menu--closed";
  }, [menuIsOpen]);

  const contentClassNames = useMemo<string>(() => {
    return menuIsOpen ? "content--shink" : "content-expand";
  }, [menuIsOpen]);

  return (
    <DeviceContext.Provider value={deviceContextProps}>
      <div className="default-layout--container">
        <div className="top-menu">
          <div className="left-side">
            <Icon
              icon={faBars}
              className="toggle-menu"
              onClick={() => setMenuIsOpen((prev) => !prev)}
            />
            <Icon className="icon" icon={faFilePdf} size="2x"></Icon>
            <Typography type="bold" size="large" className="text">
              Kvittogenerator
            </Typography>
          </div>
          <div className="right-side">
            <div className="portrait"><Icon icon={faUserSlash} size="xs"></Icon></div>
            <Typography>Utloggad</Typography>
          </div>
        </div>
        <div className="content-container">
          <div className={`left-menu ${menuClassNames}`}>
            <Link to={"/"} className="link">
              <Typography uppercase>Hem</Typography>
            </Link>
            <Link to={"/old"} className="link">
              <Typography uppercase>Äldre version</Typography>
            </Link>
          </div>
          <div className={`content ${contentClassNames}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </DeviceContext.Provider>
  );
};

export default Layout;
