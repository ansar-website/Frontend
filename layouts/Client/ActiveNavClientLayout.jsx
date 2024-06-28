import Footer from '../../components/footer/footer';
import Navbar from '../../components/main-navbar/navbar';

function ClientLayout({ children, genInfo }) {
  return (
    <>
      <Navbar activeNav genInfo={genInfo} />
      <div className="activeNavLayoutContainer">{children}</div>
      <Footer genInfo={genInfo} />
    </>
  );
}
export default ClientLayout;
