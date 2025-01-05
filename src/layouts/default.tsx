import { Outlet } from "react-router";
import "./default.scss"
import Link from "~components/link";

const Layout = () => {

  return (
    <div className="default-layout--container">
      <div className="menu">
        <img src="/logotype.webp"></img>
        <Link to={"/"} className="link">Hem</Link>
        <Link to={"/old"} className="link">Äldre version</Link>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )

}

export default Layout;