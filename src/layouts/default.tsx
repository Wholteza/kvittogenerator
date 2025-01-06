import { Outlet } from "react-router";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faBars,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useMemo, useState } from "react";
import DeviceContext from "~contexts/device-context";
import Link from "~components/link";
import Typography from "~components/typography";

import "./default.scss";

const Layout = () => {
  const deviceContext = useContext(DeviceContext);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(
    deviceContext.isDesktop
  );

  const menuClassNames = useMemo<string>(() => {
    return menuIsOpen ? "left-menu--open" : "left-menu--closed";
  }, [menuIsOpen]);

  const contentClassNames = useMemo<string>(() => {
    return menuIsOpen ? "content--shink" : "content-expand";
  }, [menuIsOpen]);

  return (
    <div className="default-layout--container">
      <div className="top-menu">
        <div className="left-side">
          <Icon
            icon={faBars}
            className="toggle-menu"
            onClick={() => setMenuIsOpen((prev) => !prev)}
          />
          <Icon className="icon" icon={faFilePdf} size="2x"></Icon>
          <Link to="/">
            <Typography type="bold" size="large" className="text">
              Kvittogenerator
            </Typography>
          </Link>
        </div>
        <div className="right-side">
          <div className="portrait">
            <Icon icon={faUserSlash} size="xs"></Icon>
          </div>
          <Typography>Utloggad</Typography>
        </div>
      </div>
      <div className="content-container">
        <div className={`left-menu ${menuClassNames}`}>
          <Link to={"/"} className="link">
            <Typography uppercase>Hem</Typography>
          </Link>
          <Link to={"/company-information"} className="link">
            <Typography uppercase>Företagsinformation</Typography>
          </Link>
          <Link to={"/create-receipt"} className="link">
            <Typography uppercase>Skapa kvitto</Typography>
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
  );
};

export default Layout;
