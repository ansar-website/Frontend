import Footer from '../../components/footer/footer';
import Navbar from '../../components/main-navbar/navbar';

function ClientLayout({ children, genInfo }) {
  return (
    <>
      <Navbar genInfo={genInfo} />
      {children}
      <Footer genInfo={genInfo} />
    </>
  );
}
export default ClientLayout;
