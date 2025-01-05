import { Outlet } from "react-router";

const Layout = () => {

  return (<div className="container">
    <div className="menu">
      <img src="/logotype.webp"></img>
    </div>
    <div className="content">
      <Outlet />
    </div>
  </div>)

}

export default Layout;