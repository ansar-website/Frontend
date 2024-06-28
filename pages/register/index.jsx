import { Button, Checkbox, Divider, Form, Input, message, Select, Spin } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SocialLogin from '../../components/social-login/social-login';
import AuthHelpers from '../../helpers/auth/helpers';
import { validateMessages } from '../../helpers/common/helpers';
import bgSplach from '../../public/images/auth-bg-splach.png';
import greenLogo from '../../public/images/green-logo.png';
import whiteLogo from '../../public/images/white-logo.png';
import RegisterServ from '../../services/auth/register';
import ProfileServ from '../../services/profile/profile';

function Register() {
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
  // submit register form
  const SubmitRegister = (values) => {
    if (!isLogedin) {
      setSpinning(true);
      form.resetFields(['password1', 'password2']);
      const dataObj = values;
      delete dataObj.agreeToTerms;
      dataObj.first_name = 'first';
      dataObj.last_name = 'last';
      RegisterServ.Register(dataObj)
        .then((res) => {
          const { data } = res;
          const { user } = data;
          const { access_token: accessToken } = data;
          const { refresh_token: refreshToken } = data;
          if (data && user && accessToken) {
            AuthHelpers.CreateUser(true, user, accessToken, 1, refreshToken);
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
          if (res.status === 201) {
            message.success({ content: t('Verification e-mail sent'), duration: 3 }).then(() => {
              router.push('/login');
            });
          }
        })
        .catch((err) => {
          const errorObj = err.response.data;
          Object.values(errorObj).map((item) => item.map((msg) => message.error({ content: t(msg), duration: 15 })));
        })
        .finally(() => {
          setSpinning(false);
        });
    }
  };
  const userNamePattern = /^[a-zA-Z0-9@/./+/-/_]+$/;

  return (
    <div className=" auth-page flex_btw stretch wrap">
      <div className="rightImage flex_row_c">
        <img src={whiteLogo} alt="logo" className="logo" />
        <img src={bgSplach} alt="splach" className="splach" />
      </div>
      {/* start left form */}
      <div className="leftForm flex_col_c register">
        <div className="resLogo mb_30 flex_row_c">
          <img src={greenLogo} alt="logo" className="logo" />
        </div>

        <div className="FormCont">
          <Spin spinning={spinning}>
            <div className="flex_btw">
              <h1 className="f_20 bold">{t('create acount')}</h1>
              <Link href="/login">
                <span className="dgc hvmc">{t('login')}</span>
              </Link>
            </div>

            <Form
              name="registerForm"
              className="authForm mt_20 f_12"
              initialValues={{
                remember: true,
              }}
              onFinish={SubmitRegister}
              form={form}
              validateMessages={validateMessages}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    pattern: userNamePattern,
                    message: t(
                      'Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.'
                    ),
                  },
                ]}
                label={t('username')}
                className="mb_19"
              >
                <Input className="formInput" />
              </Form.Item>

              <Form.Item
                label={t('gender')}
                name="gender"
                className="mb_19"
                rules={[
                  {
                    required: true,
                    message: t('Please select your gender'),
                  },
                ]}
              >
                <Select className="formInput formSelect">
                  <Select.Option value="male">{t('male')}</Select.Option>
                  <Select.Option value="female">{t('female')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="email"
                className="mb_19"
                rules={[
                  {
                    type: 'email',
                    required: true,
                  },
                ]}
                label={t('email')}
              >
                <Input className="formInput" />
              </Form.Item>

              <Form.Item
                name="password1"
                className="mb_19"
                rules={[{ required: true }, { min: 8, message: t('password_min') }]}
                label={t('password')}
              >
                <Input.Password className="formInput" />
              </Form.Item>

              <Form.Item
                name="password2"
                dependencies={['password1']}
                rules={[
                  { required: true },
                  { min: 8, message: t('password_min') },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password1') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('The two passwords that you entered do not match')));
                    },
                  }),
                ]}
                label={t('confirmPassword')}
              >
                <Input.Password className="formInput" />
              </Form.Item>

              <div className="flex_btw dc mt_14 agreePolicy">
                <Form.Item name="agreeToTerms" valuePropName="checked">
                  <div className="flex gap-7 align_center">
                    <Checkbox />
                    <div>
                      {`${t('agree To')} `}
                      <Link href="/terms-conditions">
                        <span className="bold pnt">{t('terms')}</span>
                      </Link>

                      {`${t('and')} `}
                      <Link href="/privacy-policy">
                        <span className="bold pnt">{t('privacyPolicy')}</span>
                      </Link>
                    </div>
                  </div>
                </Form.Item>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="wide mt_15 fw_8 f_15 submit" size="large">
                  {t('create acount')}
                </Button>
              </Form.Item>
            </Form>

            <div className="mt_25 mb_45 formDivider register">
              <Divider>
                <span className="lgc f_14">{t('or')}</span>
              </Divider>
            </div>
            {/* social login */}
            <SocialLogin />
          </Spin>
        </div>
      </div>
    </div>
  );
}
export default Register;
