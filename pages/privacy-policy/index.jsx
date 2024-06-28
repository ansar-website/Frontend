import { Spin } from 'antd';
import ActiveNavClientLayout from '../../layouts/Client/ActiveNavClientLayout';

function PrivacyPolicy({ genInfo }) {
  return (
    <div className="pdt_50 pdb_30 center">
      <Spin spinning={!genInfo}>
        {genInfo && <div className="container" dangerouslySetInnerHTML={{ __html: genInfo.privacy_policy }} />}
      </Spin>
    </div>
  );
}
export default PrivacyPolicy;
PrivacyPolicy.Layout = ActiveNavClientLayout;
