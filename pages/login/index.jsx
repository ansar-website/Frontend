import { Button, Checkbox, Divider, Form, Input, message, Spin } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineUser } from 'react-icons/ai';
import { BsKey } from 'react-icons/bs';
import SocialLogin from '../../components/social-login/social-login';
import AuthHelpers from '../../helpers/auth/helpers';
import bgSplach from '../../public/images/auth-bg-splach.png';
import greenLogo from '../../public/images/green-logo.png';
import whiteLogo from '../../public/images/white-logo.png';
import LoginServ from '../../services/auth/login';
import ProfileServ from '../../services/profile/profile';

function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [spinning, setSpinning] = useState(true);
  const [isLogedin, setIslogedIn] = useState(false);
  const [form] = Form.useForm();
  // routing auth
  useEffect(() => {
    if (AuthHelpers.CheckAuth()) {
      axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.userToken}` };
      ProfileServ.GetProfile()
        .then(() => {
          setSpinning(true);
          setIslogedIn(true);
          router.push('/dashboard/profile');
        })
        .catch(() => {
          setSpinning(false);
          AuthHelpers.Logout();
        });
    } else {
      setSpinning(false);
    }
  }, []);
  // submit login form
  const SubmitLogin = (values) => {
    if (!isLogedin) {
      setSpinning(true);
      form.resetFields();
      const valuesObj = values;
      const { remember } = valuesObj;
      delete valuesObj.remember;
      LoginServ.Login(valuesObj)
        .then((res) => {
          const { data } = res;
          const { user } = data;
          const { access_token: accessToken } = data;
          const { refresh_token: refreshToken } = data;
          if (data && user && accessToken) {
            AuthHelpers.CreateUser(remember, { user }, accessToken, 1, refreshToken);
            axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.userToken}` };
            const courseID = Number(sessionStorage.comingFromCourse);
            if (courseID) {
              ProfileServ.GetProfile()
                .then((resRoute) => {
                  const UserObj = resRoute.data;
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
          }
        })
        .catch((err) => {
          const errorObj = err.response.data;
          Object.values(errorObj).map((item) => item.map((msg) => message.error({ content: t(msg), duration: 4 })));
        })
        .finally(() => {
          setSpinning(false);
        });
    }
  };

  return (
    <div className="auth-page flex_btw stretch wrap">
      <div className="rightImage flex_row_c">
        <img src={whiteLogo} alt="logo" className="logo" />
        <img src={bgSplach} alt="splach" className="splach" />
      </div>
      {/* start left form */}
      <div className="leftForm flex_col_c login">
        <Spin spinning={spinning}>
          <div className="resLogo mb_70 flex_row_c">
            <img src={greenLogo} alt="logo" className="logo" />
          </div>
          <div className="FormCont">
            <div className="flex_btw">
              <h1 className="f_20 bold">{t('login')}</h1>
              <Link href="/register">
                <span className="dgc hvmc">{t('register')}</span>
              </Link>
            </div>

            <Form
              name="loginForm"
              className="authForm mt_12"
              initialValues={{
                remember: true,
              }}
              onFinish={SubmitLogin}
              form={form}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: t('Please input your username or email'),
                  },
                ]}
              >
                <Input placeholder={t('nameOrEmail')} className="formInput" prefix={<AiOutlineUser />} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: t('Please input your password'),
                  },
                  {
                    min: 8,
                    message: t('password_min'),
                  },
                ]}
              >
                <Input.Password placeholder={t('password')} className="formInput mt_24" prefix={<BsKey />} />
              </Form.Item>

              <div className="flex_btw dc mt_9">
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>{t('Remember me')}</Checkbox>
                </Form.Item>
                <Link href="/forget-password">
                  <span className="hvmc">{t('Forget password')}</span>
                </Link>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="wide mt_28 fw_8 f_15 submit" size="large">
                  {t('submit')}
                </Button>
              </Form.Item>
            </Form>

            <div className="mbt_55 formDivider login">
              <Divider>
                <span className="lgc f_14">{t('or')}</span>
              </Divider>
            </div>
            {/* social login */}
            <SocialLogin />
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default Login;
