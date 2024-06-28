import { Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationsService from '../../../services/notifications/notifications';

function Notifications({ genInfo }) {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState();
  useEffect(() => {
    if (!genInfo) return;
    NotificationsService.GetNotifications().then((res) => {
      setNotifications(res.data);
    });
  }, [genInfo]);
  return (
    <main>
      <div className="notifications-container flex pdb_20 pdt_50">
        <Spin spinning={!notifications || false}>
          {notifications?.length > 0 ? (
            notifications?.map((notification) => (
              <div className={`pdtb_20 pdrl_20 wide notifications${!notification.is_read ? ' not-read' : ''}`}>
                <h2 className="f_20 mc fw_8 mb_20 flex_btw">{notification.title}</h2>
                <p className="f_16 fw_3 fw_4 dtitle">{notification.body}</p>
              </div>
            ))
          ) : (
            <div className="flex_row_c pdtb_20">
              <Empty description={t('no_data')} />
            </div>
          )}
        </Spin>
      </div>
    </main>
  );
}

export default Notifications;
