import { Link } from 'react-router-dom';

import LogoIcon from '../../assets/icons/Logo.svg?react';

function Header() {
  return (
    <header>
        <div className="logo">
            <Link to="/">
              <LogoIcon width={60} height={60} className="logo-box icon"/>
            </Link>
            <span className="text-heading">Planbell</span>
        </div>
        
    </header>
  );
};

export default Header;