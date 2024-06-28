import { Button, DatePicker, Form, Input, message, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../components/Common/Context/Context';
import DashboardLayout from '../../../layouts/Dasboard/DashboardLayout';
import ProfileServ from '../../../services/profile/profile';

export default function DashboardProfile() {
  const { t } = useTranslation();
  const { UserData: userDataVal, setUserData } = useContext(Context);

  const [userData, setUserDataSts] = useState(userDataVal);
  const [edit, setEdit] = useState(false);
  const [loading, setloading] = useState(false);
  const [nameAsCertEdit, setnameAsCertEdit] = useState(true);
  // change date picker
  const dateFormat = 'YYYY/MM/DD';
  const [birthDate, setbirthDate] = useState();
  const ChangePicker = (_, dateString) => {
    setbirthDate(dateString);
  };
  // submitEdit
  const submitEdit = (values) => {
    setloading(true);
    const profile = {
      user: {
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
      },
      dob: birthDate,
      name_as_in_certificate: values.nameAsCert,
    };
    ProfileServ.UpdateProfile(profile)
      .then((res) => {
        const userDataC = res.data;
        setUserData(userDataC);
        setUserDataSts(userDataC);
        localStorage.userObj = JSON.stringify(userDataC);
        document.getElementById('side-username').innerText =
          `${profile.user.first_name} ${profile.user.last_name}`.toUpperCase();
        document.getElementById('nav-username').innerText =
          `${profile.user.first_name} ${profile.user.last_name}`.toUpperCase();
        const sideBar = document.querySelector('.dashboardSidebar');
        if (userDataC.user?.gender === 'male') {
          sideBar.classList.add('male');
          sideBar.classList.remove('female');
        } else {
          sideBar.classList.add('female');
          sideBar.classList.remove('male');
        }
        setnameAsCertEdit(false);
        message.success(t('profile updated successfully'));
      })
      .catch((err) => {
        const errorObj = err.response.data;
        Object.values(errorObj).map((item) => item.map((msg) => message.error({ content: t(msg), duration: 7 })));
      })
      .finally(() => {
        setEdit(false);
        setloading(false);
      });
  };
  // change password
  const [passwordLoading, setpasswordLoading] = useState(false);
  const [changePass, setchangePass] = useState(false);
  const [form] = Form.useForm();
  const SubmitChange = (values) => {
    setpasswordLoading(true);
    ProfileServ.ChangePassword(values)
      .then((res) => {
        form.resetFields();
        setchangePass(false);
        message.success({ content: t(res.data.detail), duration: 4 });
      })
      .catch((err) => {
        const errorObj = err.response.data;
        Object.values(errorObj).map((item) => item.map((msg) => message.error({ content: t(msg), duration: 4 })));
      })
      .finally(() => {
        setpasswordLoading(false);
      });
  };
  return (
    <div className="profile-page">
      <header className="head flex_btw">
        <span className="fw_7 f_16">{t('general_info')}</span>
        <button
          className="fw_7 f_16"
          type="button"
          onClick={() => {
            setEdit(!edit);
          }}
        >
          {t('edit_profile')}
        </button>
      </header>

      <Spin spinning={loading}>
        <Form
          name="EditProfile"
          disabled={!edit}
          initialValues={{
            firstName: userData.user?.first_name || t('undefined'),
            lastName: userData.user?.last_name || t('undefined'),
            gender: userData.user?.gender,
            nameAsCert: userData.name_as_in_certificate,
          }}
          className="editProfile"
          onFinish={submitEdit}
        >
          <div className="userInfo flex_col gap-28">
            <div className="flex gap-54 f_16 fw_6 infoItem">
              <span className="infoProp">{t('first_name')}</span>
              <span className="infoVal flex gap-54">
                <span>:</span>
                <Form.Item
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: t('Please input your First Name!'),
                    },
                    {
                      max: 150,
                      message: t('you exceeded the maximum'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </span>
            </div>
            <div className="flex gap-54 f_16 fw_6 infoItem">
              <span className="infoProp">{t('last_name')}</span>
              <span className="infoVal flex gap-54">
                <span>:</span>
                <Form.Item
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: t('Please input your Last Name!'),
                    },
                    {
                      max: 150,
                      message: t('you exceeded the maximum'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </span>
            </div>
            <div className="flex gap-54 f_16 fw_6 infoItem">
              <span className="infoProp">{t('birth_date')}</span>
              <span className="infoVal flex gap-54">
                <span>:</span>
                {edit ? (
                  <DatePicker
                    onChange={ChangePicker}
                    size="large"
                    placeholder={t('birthDate')}
                    showToday={false}
                    style={{ width: '231px' }}
                    defaultValue={userData.dob && dayjs(userData.dob, dateFormat)}
                  />
                ) : (
                  <span> {userData.dob || t('undefined')} </span>
                )}
              </span>
            </div>
            <div className="flex gap-54 f_16 fw_6 infoItem">
              <span className="infoProp">{t('gender')}</span>
              <span className="infoVal flex gap-54">
                <span>:</span>
                {edit ? (
                  <Form.Item
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: t('Please select your gender'),
                      },
                    ]}
                  >
                    <Select style={{ width: '231px' }} size="large">
                      <Select.Option value="male">{t('male')}</Select.Option>
                      <Select.Option value="female">{t('female')}</Select.Option>
                    </Select>
                  </Form.Item>
                ) : (
                  <span> {t(userData.user.gender) || t('undefined')} </span>
                )}
              </span>
            </div>
            <div className="flex gap-54 f_16 fw_6 infoItem">
              <span className="infoProp">{t('name_as_cert')}</span>
              <span className="infoVal flex gap-54">
                <span>:</span>
                {edit && !userData.name_as_in_certificate && nameAsCertEdit ? (
                  <Form.Item
                    name="nameAsCert"
                    rules={[
                      {
                        required: true,
                        message: t('Please Enter Your certificate name'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                ) : (
                  <span>{userData.name_as_in_certificate || t('undefined')}</span>
                )}
              </span>
            </div>
          </div>
          {edit && (
            <div className="flex_end">
              <Button type="primary" size="large" htmlType="submit" className="bold pdrl_30">
                {t('send')}
              </Button>
            </div>
          )}
        </Form>
      </Spin>
      {/* change password form */}
      <h2 className="fw_7 f_16 pdb_20">{t('change password')}</h2>
      <Spin spinning={passwordLoading}>
        <Form layout="vertical" onFinish={SubmitChange} form={form}>
          <Form.Item
            name="new_password1"
            className="mb_15"
            rules={[{ required: true }, { min: 8, message: t('password_min') }]}
            label={t('password')}
            style={{ maxWidth: '300px' }}
          >
            <Input.Password className="formInput" />
          </Form.Item>

          <Form.Item
            name="new_password2"
            dependencies={['new_password1']}
            style={{ maxWidth: '300px' }}
            rules={[
              { required: true },
              { min: 8, message: t('password_min') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password1') === value) {
                    if (!value) {
                      setchangePass(false);
                    } else {
                      setchangePass(true);
                    }
                    return Promise.resolve();
                  }
                  setchangePass(false);
                  return Promise.reject(new Error(t('The two passwords that you entered do not match')));
                },
              }),
            ]}
            label={t('confirmPassword')}
          >
            <Input.Password className="formInput" />
          </Form.Item>
          {changePass && (
            <div className="flex_end mt_15">
              <Button type="primary" size="large" htmlType="submit" className="bold pdrl_30">
                {t('change password')}
              </Button>
            </div>
          )}
        </Form>
      </Spin>
    </div>
  );
}

DashboardProfile.Layout = DashboardLayout;
