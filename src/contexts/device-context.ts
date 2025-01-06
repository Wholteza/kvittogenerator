import React from "react";

export type DeviceContextProps = {
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const DeviceContext = React.createContext<DeviceContextProps>({
  isDesktop: true,
  isPhone: false,
  isTablet: false
})

export default DeviceContext