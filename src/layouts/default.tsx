import { Outlet } from "react-router";
import "./default.scss"
import Link from "~components/link";

const Layout = () => {

  return (
    <div className="default-layout--container">
      <div className="menu">
        <img src="/logotype.webp"></img>
        <Link to={"/"} className="link">Home</Link>
        <Link to={"/old"} className="link">old</Link>
      </div>
      <div className="content">
        content
        <Outlet />
      </div>
    </div>
  )

}

export default Layout;