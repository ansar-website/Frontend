import { useTranslation } from 'react-i18next';
import headBg from '../../../public/images/head-bg.png';

function Header(props) {
  const { t } = useTranslation();
  return (
    <header className={`${props?.innerImage ? 'innerImage ' : ''}radiusHead`}>
      <img src={headBg} alt="head-bg" className="headBg" />
      <div className="flex_col_c headContent wc center">
        {props?.titleText && <h1 className="hbold headTitle">{t(props.titleText)} </h1>}
        {props.pText && <p className="center fw_4 blogText">{t(props.pText)}</p>}
      </div>
    </header>
  );
}
export default Header;
