import { message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileServ from '../../services/profile/profile';

function VerifyEmail() {
  const router = useRouter();
  const { key } = router.query;
  const { t } = useTranslation();
  useEffect(() => {
    if (key) {
      ProfileServ.VerifyEmail(key)
        .then((res) => {
          if (res.status === 200) {
            message.success({ content: t('Verification e-mail success'), duration: 5 });
            router.push('/login');
          }
        })
        .catch(() => {
          message.error({ content: t('Verification e-mail failed'), duration: 1 });
          router.push('/');
        });

    }
  }, [key]);
}

export default VerifyEmail;
