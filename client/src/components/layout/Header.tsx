import Logo from '../../assets/icons/Logo.svg';

function Header() {
  return (
    <header>
        <div className="logo">
            <img src={Logo} width={60} height={60}></img>
            <span className="text-heading">Planbell</span>
        </div>
        
    </header>
  );
};

export default Header;