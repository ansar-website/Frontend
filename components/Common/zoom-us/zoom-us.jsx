import { KJUR } from 'jsrsasign';
import React, { useEffect } from 'react';

const ZoomMeeting = ({ payload }) => {
  console.log('payload', payload);
  useEffect(async () => {
    const { ZoomMtg } = await import('@zoomus/websdk');

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.0/lib', '/av');
    ZoomMtg.preLoadWasm();
    // ZoomMtg.prepareJssdk();
    ZoomMtg.prepareWebSDK();

    function generateSignature(key, secret, meetingNumber, roleValue) {
      const iatValue = Math.round(new Date().getTime() / 1000) - 30;
      const expValue = iatValue + 60 * 60 * 24;
      const oHeader = { alg: 'HS256', typ: 'JWT' };

      const oPayload = {
        sdkKey: key,
        appKey: key,
        mn: meetingNumber,
        role: roleValue,
        iat: iatValue,
        exp: expValue,
        tokenExp: expValue,
      };

      const sHeader = JSON.stringify(oHeader);
      const sPayload = JSON.stringify(oPayload);
      const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret);
      return sdkJWT;
    }

    const signatureValue = generateSignature(payload.sdkKey, payload.sdkSecret, payload.meetingNumber, 0);
    ZoomMtg.init({
      leaveUrl: payload.leaveUrl,
      isSupportAV: true,
      isSupportChat: true,

      success() {
        document.getElementsByClassName('footer')[0].style.display = 'none';
        ZoomMtg.join({
          signature: signatureValue,
          meetingNumber: payload.meetingNumber,
          userName: payload.userName,
          sdkKey: payload.sdkKey,
          userEmail: payload.userEmail,
          passWord: payload.passWord,
          success() {
            document.getElementsByClassName('home-navbar')[0].style.display = 'none';
          },
          error(error) {
            console.log(error);
          },
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }, []);
  return (
    <div className="zoom-container">
      <div id="zmmtg-root" />
      <div id="nav-tool" />
      <div id="video-placeholder" />
    </div>
  );
};

export default ZoomMeeting;
