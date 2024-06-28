import Document, { Head, Html, Main, NextScript } from 'next/document';
import Icon from '../public/images/fav-icon.png';

class MyDocument extends Document {
  constructor(props) {
    super(props);
    this.state = {
      resIcon: Icon,
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href={this.state.resIcon} />
          <link rel="apple-touch-icon" href="/fav-icon.svg" />
          <meta name="theme-color" content="#fff" />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="facebook-domain-verification" content="ij313smikmt3hd81jwbg1077rzoed8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap"
            rel="stylesheet"
          />

          <meta name="description" content="An online academy platform that provides islamic courses" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
