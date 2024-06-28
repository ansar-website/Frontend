import { Badge, Drawer, Dropdown } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import AuthHelpers from '../../helpers/auth/helpers';
import FemaleUserAvt from '../../public/images/female-user.png';
import GreenLogo from '../../public/images/green-logo-her.png';
import BellWhite from '../../public/images/icons/bell-white.svg';
import Bell from '../../public/images/icons/bell.svg';
import Menue from '../../public/images/icons/menue.svg';
import UserAvt from '../../public/images/user.png';
import whiteLogo from '../../public/images/white-logo-her.png';
import { Context } from '../Common/Context/Context';
import DsLinks from '../Dashboard/sidebar/sidebarLinks';
import Notifications from './notifications/index';

function Navbar({ activeNav, dsNavbar, focusLayout, genInfo }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLogedin, setisLogedin] = useState(false);
  const { UserData } = useContext(Context);
  const [User, setUser] = useState();
  // drawer
  const [open, setopen] = useState(false);
  const [dsopen, setdsopen] = useState(false);
  useEffect(() => {
    setopen(false);
    setdsopen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (!activeNav) {
      const nav = document.getElementById('home-navbar');
      window.onscroll = () => {
        const scrollTopVal = window.pageYOffset;
        if (!nav.classList.contains('activeTransparent')) {
          if (scrollTopVal > 450) {
            nav.classList.add('activeNav');
          } else {
            nav.classList.remove('activeNav');
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (scrollTopVal > 450) {
            nav.classList.add('activeTransparentSticky');
          } else {
            nav.classList.remove('activeTransparentSticky');
          }
        }
      };
    }
    // check auth
    if (AuthHelpers.CheckAuth()) {
      axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.userToken}` };
      setisLogedin(true);
      if (UserData?.pk) {
        setUser(UserData);
      } else {
        setUser(JSON.parse(AuthHelpers.GetUserData()));
      }
    }
  }, []);
  useEffect(() => {
    if (UserData?.pk) {
      setUser(UserData);
    } else if (AuthHelpers.CheckAuth()) setUser(JSON.parse(AuthHelpers.GetUserData()));
  }, [UserData]);
  // Links
  function Links(className) {
    return (
      <ul className={`links ${className} gap-40`}>
        <li className={`link${router.pathname === '/' ? ' activeLink' : ''}`}>
          <Link href="/">{t('home')}</Link>
        </li>

        <li className={`link${router.pathname.includes('/course') ? ' activeLink' : ''}`}>
          <Link href="/courses">{t('courses')}</Link>
        </li>
        <li className={`link${router.pathname.includes('/blogs') ? ' activeLink' : ''}`}>
          <Link href="/blogs">{t('blogs')}</Link>
        </li>
        <li className={`link${router.pathname.includes('/events') ? ' activeLink' : ''}`}>
          <Link href="/events">{t('events')}</Link>
        </li>
        <li className={`link${router.pathname.includes('/about') ? ' activeLink' : ''}`}>
          <Link href="/about">{t('about')}</Link>
        </li>
        <li className={`link${router.pathname.includes('/contact') ? ' activeLink' : ''}`}>
          <Link href="/contact">{t('contact')}</Link>
        </li>
      </ul>
    );
  }
  // auth Links
  function AuthLinks(gap, inDesktop) {
    return (
      <>
        {isLogedin ? (
          <div className="authLinks flex_btw gap-20 align_center dashboardLink">
            <Dropdown
              dropdownRender={() => <Notifications genInfo={genInfo} />}
              trigger={['click']}
              placement="bottom"
              overlayClassName="notifications-dropdown"
            >
              <button type="button" className="notifs">
                <Badge count={genInfo?.notification_count || 0}>
                  <img src={BellWhite} alt="bell" className="white" />
                  <img src={Bell} alt="bell" className="green hidden" />
                </Badge>
              </button>
            </Dropdown>
            {/* notifications dropdown */}
            <Link href="/dashboard/profile">
              <div className="flex align_center gap-20 grow">
                <img
                  src={User.profile_picture || (UserData?.user?.gender === 'female' ? FemaleUserAvt : UserAvt)}
                  alt="user"
                  className="userAvatar"
                  width="47px"
                  height="47px"
                />

                <span className="fw_7 f_16 wc userName" id="nav-username">
                  {`${User?.user?.first_name.toUpperCase()} ${User?.user?.last_name.toUpperCase()}`}
                </span>
              </div>
            </Link>
          </div>
        ) : (
          <div className={`authLinks  flex_row_c gap-${gap} f_18 ${inDesktop ? 'inDesktop' : null}`}>
            <Link href="/login">
              <span className="login authLink">{t('enter')}</span>
            </Link>
            <Link href="/register">
              <span className="register authLink">{t('signup_now')}</span>
            </Link>
          </div>
        )}
      </>
    );
  }

  return (
    <nav className={`${activeNav ? 'activeNav ' : ''}home-navbar flex_btw wc f_16 fw_7`} id="home-navbar">
      {/* dashboard profile responsive */}
      {User && dsNavbar && (
        <button
          type="button"
          className="wc f_30 hidden dsProfileBtn flex_row_c"
          onClick={() => setdsopen(!dsopen)}
          onBlur={() =>
            setTimeout(() => {
              setdsopen(false);
            })
          }
        >
          <img
            src={User.profile_picture || (UserData?.user?.gender === 'female' ? FemaleUserAvt : UserAvt)}
            alt="user"
            className="userAvatar"
            width="35px"
            height="35px"
          />
        </button>
      )}

      <Link href="/">
        <img src={whiteLogo} alt="logo" className="logo white" />
        <img src={GreenLogo} alt="logo" className="logo green" />
      </Link>
      {Links('flex_row_c')}
      {AuthLinks(50, true)}
      {/* drawer toggler */}
      <button
        type="button"
        className="wc f_30 hidden drawerBtn"
        onClick={() => {
          if (focusLayout) {
            document.querySelector('.layoutSidebar').classList.toggle('activeFocus');
          } else {
            setopen(true);
          }
        }}
      >
        {focusLayout ? <img src={Menue} alt="menue" /> : <HiOutlineMenuAlt2 />}
      </button>
      {/* drawer for small screens */}
      <Drawer placement="left" onClose={() => setopen(false)} open={open} className="navDrawer">
        {Links('flex_col_c')}
        {AuthLinks(20)}
      </Drawer>

      {dsopen && (
        <div className="profileLinks">
          <DsLinks dsProfile />
        </div>
      )}
    </nav>
  );
}
export default Navbar;
