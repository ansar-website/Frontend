import { Spin } from 'antd';
import ActiveNavClientLayout from '../../layouts/Client/ActiveNavClientLayout';

function TermsAndConditions({ genInfo }) {
  return (
    <div className="pdt_50 pdb_30 center">
      <Spin spinning={!genInfo}>
        {genInfo && <div className="container" dangerouslySetInnerHTML={{ __html: genInfo.terms_and_conditions }} />}
      </Spin>
    </div>
  );
}
export default TermsAndConditions;
TermsAndConditions.Layout = ActiveNavClientLayout;
