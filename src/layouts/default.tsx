import { Outlet } from "react-router";
import "./default.scss";
import Link from "~components/link";
import Typography from "~components/typography";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faBars } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";

const Layout = () => {

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const menuClassNames = useMemo<string>(() => {
    return menuIsOpen ? "left-menu--open" : "left-menu--closed"
  }, [menuIsOpen])

  const contentClassNames = useMemo<string>(() => {
    return menuIsOpen ? "content--shink" : "content-expand"
  }, [menuIsOpen])


  return (
    <div className="default-layout--container">
      <div className="top-menu">
        <div className="left-side">
          <Icon icon={faBars} className="toggle-menu" onClick={() => setMenuIsOpen((prev) => !prev)} />
          <Icon className="icon" icon={faFilePdf} size="2x"></Icon>
          <Typography type="bold" size="large" className="text">
            Kvittogenerator
          </Typography>
        </div>
        <div className="right-side">
          <div className="portrait"></div><Typography>User Name</Typography>
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
  );
};

export default Layout;
