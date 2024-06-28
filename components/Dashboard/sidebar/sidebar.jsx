import { message, Spin, Upload } from 'antd';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillEdit } from 'react-icons/ai';
import UserFemale from '../../../public/images/female-user.png';
import CollapseIcon from '../../../public/images/icons/fi-rr-box.svg';
import User from '../../../public/images/user.png';
import ProfileServ from '../../../services/profile/profile';
import { Context } from '../../Common/Context/Context';
import DsLinks from './sidebarLinks';

function Sidebar(props) {
  const { t } = useTranslation();
  const [collapssed, setcollapssed] = useState(false);
  const { UserData } = useContext(Context);
  // profile image
  const [imgLoading, setImgLoading] = useState(false);
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('is not a image file'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('Image must smaller than 2MB!'));
    }
    return isJpgOrPng && isLt2M;
  };

  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    //  update profile picture
    if (info.file.status === 'uploading') setImgLoading(true);
    const formData = new FormData();
    formData.append('profile_picture', info.file.originFileObj);
    ProfileServ.UpdateProfile(formData)
      .then((res) => {
        if (res.status === 200) {
          setImageUrl(res.data.profile_picture);
        } else {
          message.error(t('an error occurred'));
        }
      })
      .finally(() => {
        setTimeout(() => {
          setImgLoading(false);
        }, 500);
      });
  };
  return (
    <aside
      className={`dashboardSidebar flex_col align_center${collapssed ? ' collapsedSide' : ''} 
      ${UserData?.user?.gender}`}
    >
      {/* collapse btn */}
      <button
        type="button"
        className="collapse wide flex flex_end"
        onClick={() => {
          setcollapssed(!collapssed);
          props.collapssedSide(collapssed);
        }}
      >
        <img src={CollapseIcon} alt="collapse" />
      </button>
      {/* profile image and info */}
      <div className="flex_col_c userData">
        <div className="updateImg flex_row_c" style={{ borderRadius: '50%' }}>
          <Spin spinning={imgLoading}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader mt_5"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="avatar"
                    className="userImg"
                    style={{
                      width: '100%',
                    }}
                  />
                  <span className="pin">
                    <AiFillEdit />
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={UserData?.profile_picture || (UserData?.user?.gender === 'female' ? UserFemale : User)}
                    alt="user"
                    className="userImg"
                  />
                  <span className="pin">
                    <AiFillEdit />
                  </span>
                </>
              )}
            </Upload>
          </Spin>
        </div>

        <div className="userTextData flex_col_c">
          <h2 className="f_16 fw_7 mt_15" id="side-username">
            {UserData?.user?.first_name} {UserData?.user?.last_name}
          </h2>
          <span>عضو جديد</span>
        </div>
      </div>
      {/* dashboard links */}
      <DsLinks />
    </aside>
  );
}
export default Sidebar;
