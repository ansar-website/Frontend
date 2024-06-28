import { Button, Form, Input, message, Spin } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillKeyFill } from 'react-icons/bs';
import { IoMdKeypad } from 'react-icons/io';
import AuthHelpers from '../../helpers/auth/helpers';
import bgSplach from '../../public/images/auth-bg-splach.png';
import greenLogo from '../../public/images/green-logo.png';
import whiteLogo from '../../public/images/white-logo.png';
import ResetService from '../../services/auth/reset';
import ProfileServ from '../../services/profile/profile';

function ResetPassword() {
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
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const User = urlParams.get('uid');
      const Token = urlParams.get('token');

      valuesObj.uid = User;
      valuesObj.token = Token;
      ResetService.ResetConfirm(valuesObj)
        .then((res) => {
          message.success({ content: t(res.data.detail), duration: 3.5 });
          router.push('/login');
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
              <h1 className="f_18 bold">{t('remake password')}</h1>
              <Link href="/login">
                <span className="dgc hvmc">{t('login')}</span>
              </Link>
            </div>

            <Form name="resetForm" className="authForm mt_12" onFinish={SubmitLogin} form={form}>
              <Form.Item
                name="new_password1"
                rules={[
                  { required: true, message: t('Please input your password') },
                  { min: 8, message: t('password_min') },
                ]}
              >
                <Input.Password className="formInput" prefix={<BsFillKeyFill />} placeholder={t('password')} />
              </Form.Item>

              <Form.Item
                name="new_password2"
                className="mt_20"
                dependencies={['new_password1']}
                rules={[
                  { required: true, message: t('Please input your password') },
                  { min: 8, message: t('password_min') },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password1') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('The two passwords that you entered do not match')));
                    },
                  }),
                ]}
              >
                <Input.Password className="formInput" prefix={<IoMdKeypad />} placeholder={t('confirmPassword')} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="wide mt_28 fw_8 f_15 submit" size="large">
                  {t('send')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default ResetPassword;
