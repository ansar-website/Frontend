import { Button, Form, Input, message, Spin } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineUser } from 'react-icons/ai';
import AuthHelpers from '../../helpers/auth/helpers';
import bgSplach from '../../public/images/auth-bg-splach.png';
import greenLogo from '../../public/images/green-logo.png';
import whiteLogo from '../../public/images/white-logo.png';
import ResetService from '../../services/auth/reset';
import ProfileServ from '../../services/profile/profile';

function ForgetPassword() {
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
      ResetService.Reset(valuesObj)
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

            <Form name="forgetForm" className="authForm mt_12" onFinish={SubmitLogin} form={form}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: t('Enter a valid email address.'),
                  },
                  {
                    required: true,
                    message: t('Please input your email'),
                  },
                ]}
              >
                <Input placeholder={t('email')} className="formInput" prefix={<AiOutlineUser />} />
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

export default ForgetPassword;
