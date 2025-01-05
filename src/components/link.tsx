import { ReactNode } from "react";
import { Link as RouterLink } from 'react-router'

import './link.scss'

type Props = {
  children: string;
  to: string;
  className?: string;
}

const Link = ({ children: text, to, className }: Props): ReactNode => {
  return <RouterLink to={to} className={`link--router-link ${className}`}>{text}</RouterLink>
}

export default Link