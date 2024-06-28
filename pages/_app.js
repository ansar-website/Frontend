/* eslint-disable import/no-unresolved */
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfigProvider } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { I18nextProvider } from 'react-i18next';
import '../components/Common/count-down/count-down.scss';
import '../components/Common/radius-header/radius-header.scss';
import '../components/Common/zoom-us/zoom-us.scss';
import '../components/main-navbar/navbar.scss';
import { API_URL, DEFAULT_COLOR } from '../config/config';
import AuthHelpers from '../helpers/auth/helpers';
import '../layouts/Dasboard/DashboardLayout.scss';
import i18n from '../services/i18n';
import ProfileServ from '../services/profile/profile';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ContextProvider } from '../components/Common/Context/Context';
import '../components/footer/footer.scss';
import '../styles/authForm/authForm.scss';
import '../styles/globals.scss';
import '../styles/set.scss';
import './about/about.scss';
import './blogs/blog-details.scss';
import './blogs/blogs.scss';
import './contact/contact.scss';
import './course-details/[courseId]/focus-area/focus-area.scss';
import './course-details/course-details.scss';
import './home.scss';
import './teachers/teachers.scss';

axios.defaults.baseURL = API_URL;

const EmptyLayout = ({ children }) => <>{children}</>;

export default function App({ Component, pageProps }) {
  const [genInfo, setgenInfo] = useState();
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-5XLC3JD' });
    if (AuthHelpers.CheckAuth()) {
      axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.userToken}` };
    }
    axios.get('/general_settings/general_settings/').then((res) => {
      setgenInfo(res.data);
    });
  }, []);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const refresh = localStorage.refreshToken || sessionStorage.refreshToken;
      if (error.response?.status === 401 || error === 401) {
        if (refresh) {
          ProfileServ.UpdateToken(refresh)
            .then((res) => {
              const { access } = res.data;
              if (localStorage.refreshToken) {
                localStorage.userToken = access;
              } else if (sessionStorage.refreshToken) {
                sessionStorage.userToken = access;
              }
            })
            .catch(() => {
              AuthHelpers.Logout();
              window.location.reload();
            });
        } else {
          AuthHelpers.Logout();
          window.location.reload();
        }
      }
      return Promise.reject(error);
    }
  );

  // facebook pixel analytics
  const router = useRouter();
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init('975179353434144'); // facebookPixelId
        ReactPixel.pageView();

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView();
        });
      });
  }, [router.events]);

  // // google analytics
  // useEffect(() => {
  //   ReactGA.initialize('AIzaSyBbu9YPTEPMiK3nDsrerEciFTgJ906JDwA');
  //   ReactGA.pageview(window?.location.pathname + window?.location.search);
  // }, []);

  const Layout = Component.Layout || EmptyLayout;
  return (
    <>
      <NextNProgress
        color={DEFAULT_COLOR}
        startPosition={0.4}
        stopDelayMs={200}
        height={4}
        showOnShallow
        options={{ easing: 'ease-in-out', speed: 500 }}
      />
      <GoogleOAuthProvider clientId="596765493552-m4vli8d2b1i2cqc9m849sdqfjhcosanr.apps.googleusercontent.com">
        <I18nextProvider i18n={i18n}>
          <ConfigProvider
            direction="rtl"
            theme={{
              token: {
                colorPrimary: DEFAULT_COLOR,
              },
            }}
          >
            <ContextProvider>
              <Layout genInfo={genInfo}>
                <Component {...pageProps} genInfo={genInfo} />
              </Layout>
            </ContextProvider>
          </ConfigProvider>
        </I18nextProvider>
      </GoogleOAuthProvider>
    </>
  );
}
