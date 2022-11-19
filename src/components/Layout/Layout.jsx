import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import operations from 'Redux/Auth/auth.service';

import { Header } from './Layout.styled';

import { nameSelector, tokenSelector } from 'Redux/Selectors/authSelectors';
import { Logo } from 'components/Logo/Logo';
import { HeaderAuthNav } from 'components/HeaderAuthNav/HeaderAuthNav';
import { AuthNavMobile } from 'components/HeaderAuthNav/AuthNavMobile/AuthNavMobile';
import { HeaderPrivateNav } from 'components/HeaderPrivateNav/HeaderPrivateNav';
import { HeaderExitBox } from 'components/HeaderExitBox/HeaderExitBox';
import { HeaderMenuBtn } from 'components/HeaderMenuBtn/HeaderMenuBtn';
import { MenuBox } from 'components/MenuBox/MenuBox';

export const Layout = () => {
  const dispatch = useDispatch();
  const [authorization, setAuthorization] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const TOKEN = useSelector(tokenSelector);
  const NAME = useSelector(nameSelector);

  const handleLogOut = () => {
    dispatch(operations.logOut());

    setAuthorization(false);
  };

  const handleAuthorization = () => {
    setAuthorization(!authorization);
  };

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthorizationRestart = () => {
    setAuthorization(false);
  };

  return (
    <>
      <Header>
        <Logo handleAuthorizationRestart={handleAuthorizationRestart} />
        {!TOKEN && !authorization && (
          <HeaderAuthNav handleAuthorization={handleAuthorization} />
        )}
        {!TOKEN && !authorization && <AuthNavMobile />}
        {TOKEN && <HeaderPrivateNav />}
        {TOKEN && <HeaderExitBox NAME={NAME} handleLogOut={handleLogOut} />}
        {TOKEN && (
          <>
            <HeaderMenuBtn
              handleMenuOpen={handleMenuOpen}
              isMenuOpen={isMenuOpen}
            />
            {isMenuOpen && <MenuBox />}
          </>
        )}
      </Header>
      <Outlet />
    </>
  );
};
