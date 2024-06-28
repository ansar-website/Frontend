import { Button, Form, Input, message, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { FaTelegramPlane } from 'react-icons/fa';
import { GrFacebookOption } from 'react-icons/gr';
import { HiLocationMarker } from 'react-icons/hi';
import { IoMdMail } from 'react-icons/io';
import { MdPhoneInTalk } from 'react-icons/md';
import { SiWhatsapp } from 'react-icons/si';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import ClientLayout from '../../layouts/Client/ClientLayout';
import ContactService from '../../services/contact/contact';

const { TextArea } = Input;

function Contact({ genInfo }) {
  const { t } = useTranslation();
  const [spinning, setSpin] = useState(false);
  const [form] = Form.useForm();
  // footer margin
  useEffect(
    () => () => {
      const footer = document.querySelector('.footer');
      if (footer) footer.style.marginTop = '0px';
    },
    []
  );

  // submit login form
  const SubmitContact = (values) => {
    setSpin(true);
    ContactService.SubmitContact(values)
      .then(() => {
        message.success(t('contact_msg'));
      })
      .catch(() => {
        message.error({ content: t('contact_err'), duration: 4 });
      })
      .finally(() => {
        setSpin(false);
        form.resetFields();
      });
  };
  return (
    <div className="contact-page">
      {/* header */}
      <RadiusHeader titleText="تواصل معنا" />
      {/* contact section */}
      <div className="container">
        <section className="contactSection flex_btw mt_100">
          {/* form */}
          <div className="contactFormSection">
            <Spin spinning={spinning}>
              <Form
                name="loginForm"
                className="contactForm"
                initialValues={{
                  complain_type: 'complain',
                }}
                onFinish={SubmitContact}
                form={form}
              >
                <Form.Item
                  name="full_name"
                  className="mb_30"
                  rules={[
                    {
                      required: true,
                      message: t('Full Name is required'),
                    },
                  ]}
                >
                  <Input placeholder={t('full_name')} className="formInput" />
                </Form.Item>
                <Form.Item
                  name="email"
                  className="mb_30"
                  rules={[
                    {
                      type: 'email',
                      message: `${`${t('email')} ${t('valid_email')}`}`,
                    },
                    {
                      required: true,
                      message: t('Please input your email'),
                    },
                  ]}
                >
                  <Input placeholder={t('email')} className="formInput" />
                </Form.Item>

                <Form.Item
                  name="complain_type"
                  className="mb_30"
                  rules={[
                    {
                      required: true,
                      message: t('Please select your topic'),
                    },
                  ]}
                >
                  <Select className="formInput formSelect" defaultValue="complain">
                    <Select.Option value="complain">{t(' شكوى')}</Select.Option>
                    <Select.Option value="suggestion">{t('مقترح')}</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="message"
                  className="mb_25"
                  rules={[
                    {
                      required: true,
                      message: t('Please input your message'),
                    },
                  ]}
                >
                  <TextArea placeholder={t('message')} className="formInput textArea" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="fw_7 f_15 submit" size="large">
                    {t('send')}
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </div>
          {/* contact info */}
          <div className="contactInfoSection flex_col">
            <div className="infoTitle">
              <h3 className="fw_6 f_28 wc">{t('contact_info')}</h3>
              <p className="f_18 fw_400 text">{t('قل شيئًا لبدء محادثة مباشرة مع أحد مسؤولينا')}</p>
            </div>
            <div className="links wc flex_col f_16 gap-50">
              <div className="linkItem flex align_center gap-25">
                <MdPhoneInTalk />
                <span style={{ direction: 'ltr' }}>{genInfo?.contact_phone}</span>
              </div>
              <a href="mailto:info@ansaracademy.net" className="linkItem flex align_center gap-25">
                <IoMdMail />
                <span>{genInfo?.contact_email}</span>
              </a>
              <div className="linkItem flex gap-25">
                <HiLocationMarker />
                <span>{genInfo?.contact_address}</span>
              </div>
            </div>
            <div className="flex socialMedia wc flex_end gap-30">
              <a href={genInfo?.contact_facebook} className="socialItem" target="_blank" rel="noreferrer">
                <GrFacebookOption />
              </a>
              <a href={genInfo?.contact_twitter} className="socialItem" target="_blank" rel="noreferrer">
                <AiOutlineTwitter />
              </a>
              <a href={genInfo?.contact_telegram} className="socialItem" target="_blank" rel="noreferrer">
                <FaTelegramPlane />
              </a>
              <a href={genInfo?.contact_instagram} className="socialItem" target="_blank" rel="noreferrer">
                <AiOutlineInstagram />
              </a>
              <a href={genInfo?.contact_whatsapp} className="socialItem" target="_blank" rel="noreferrer">
                <SiWhatsapp />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
Contact.Layout = ClientLayout;
