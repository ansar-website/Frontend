import { useGoogleLogin } from '@react-oauth/google';
import { message, Spin } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { useTranslation } from 'react-i18next';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import AuthHelpers from '../../helpers/auth/helpers';
import SocialLoginServ from '../../services/auth/socialLogin';
import ProfileServ from '../../services/profile/profile';

function SocialLogin() {
  const { t } = useTranslation();
  const router = useRouter();
  // create user and redirect
  const LoginHelper = (user, accessToken, refreshToken) => {
    AuthHelpers.CreateUser(true, user, accessToken, 1, refreshToken);
    axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.userToken}` };
    const courseID = Number(sessionStorage.comingFromCourse);
    if (courseID) {
      ProfileServ.GetProfile()
        .then((res) => {
          const UserObj = res.data;
          localStorage.userObj = JSON.stringify(UserObj);
          router.push(`/course-details/${courseID}`);
          sessionStorage.removeItem('comingFromCourse');
        })
        .catch(() => {
          router.push('/login');
          AuthHelpers.Logout();
        });
    } else {
      router.push('/dashboard/profile');
    }
  };
  const [spinning, setSpinning] = useState(false);
  // facebook login function
  const responseFacebook = (response) => {
    const data = response;
    const payload = {
      access_token: data.accessToken,
    };
    SocialLoginServ.FacebookLogin(payload)
      .then((res) => {
        const dataRes = res.data;
        const { user } = dataRes;
        const { access_token: accessToken } = dataRes;
        const { refresh_token: refreshToken } = dataRes;
        if ((dataRes && user && accessToken, refreshToken)) {
          LoginHelper(user, accessToken, refreshToken);
        }
      })
      .catch(() => {
        message.error(t('an error occurred'));
      })
      .finally(() => {
        setSpinning(false);
      });
  };

  // google login function
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const payload = {
          access_token: tokenResponse.access_token,
        };

        SocialLoginServ.GoogleLogin(payload).then((res) => {
          const dataRes = res.data;
          const { user } = dataRes;
          const { access_token: accessToken } = dataRes;
          const { refresh_token: refreshToken } = dataRes;
          if (dataRes && user && accessToken) {
            LoginHelper(user, accessToken, refreshToken);
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
  });
  return (
    <Spin spinning={spinning}>
      <div className="socialLogin flex_col">
        <FacebookLogin
          appId="5721703521277800"
          autoLoad={false}
          fields="name,email,picture" // define the required fields
          icon={<BsFacebook />}
          cssClass="facebookLogin flex_row_c gap-15 f_15 fw_8 shadow mb_21"
          textButton={t('facebookLogin')}
          onClick={() => {
            setSpinning(true);
          }}
          callback={responseFacebook}
        />
        <button type="button" className="googleLogin flex_row_c gap-15 f_15 fw_8 shadow" onClick={googleLogin}>
          <FcGoogle />
          <span className="btnText">{t('googleLogin')}</span>
        </button>
      </div>
    </Spin>
  );
}
export default SocialLogin;
