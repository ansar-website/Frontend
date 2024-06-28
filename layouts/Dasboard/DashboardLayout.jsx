import { Spin } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../components/Common/Context/Context';
import Sidebar from '../../components/Dashboard/sidebar/sidebar';
import Navbar from '../../components/main-navbar/navbar';
import AuthHelpers from '../../helpers/auth/helpers';
import ProfileServ from '../../services/profile/profile';

function DashboardLayout({ children, genInfo }) {
  const { setUserData } = useContext(Context);
  const router = useRouter();
  const [auth, setAuth] = useState(false); // has to be false
  const [userData, setUserDataSts] = useState();
  // fetching profile
  useEffect(() => {
    if (AuthHelpers.CheckAuth()) {
      axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.userToken}` };
      ProfileServ.GetProfile()
        .then((res) => {
          setAuth(true);
          const UserObj = res.data;
          setUserDataSts(UserObj);
          setUserData(UserObj);
          localStorage.userObj = JSON.stringify(UserObj);
        })
        .catch(() => {
          router.push('/login');
          AuthHelpers.Logout();
        });
    } else {
      router.push('/login');
      AuthHelpers.Logout();
    }
  }, []);
  // wide container
  const [wide, setWide] = useState(false);
  return (
    <>
      {auth ? (
        <>
          <Navbar activeNav dsNavbar genInfo={genInfo} />
          <div className="dashboard-layout flex">
            <Sidebar
              collapssedSide={(val) => {
                setWide(!val);
              }}
              userData={userData}
            />
            <div className={`dashboardContainer${wide ? ' wideCont' : ''}`}>{children}</div>
          </div>
        </>
      ) : (
        <div className="center hvh_100 flex_row_c">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
export default DashboardLayout;
