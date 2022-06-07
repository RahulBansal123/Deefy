import React, { useState } from 'react';
import Modal from '../../Utils/Modal';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import UAuth from '@uauth/js';

import Logo from '../../assets/logo.png';
import WalletModal from './WalletModal';
import { useDispatch } from 'react-redux';
import { setMonitorWallet } from '../../Store/actionCreatos/wallets';

const uauth = new UAuth({
  clientID: '5707e27e-11dc-4981-9782-fefc554cbc06',
  redirectUri:
    process.env.NODE_ENV === 'production'
      ? 'https://deefy.on.fleek.co/'
      : 'http://localhost:3000',
});

const Auth = () => {
  const [isOpen, toggle] = useState(false);
  const dispatch = useDispatch();

  const handleClick = () => {
    toggle(true);
  };

  const loginWithUnstoappable = async () => {
    try {
      const authorization = await uauth.loginWithPopup();

      if (authorization.idToken.wallet_address) {
        dispatch(setMonitorWallet(authorization.idToken.wallet_address));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ModalContent = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 1.6rem 0 1.6rem;
  `;

  const config = {
    supportedChainIds: [1, 56], // 1 - ethereum mainnet, 56 - binance smart chain
    connectors: {
      walletconnect: {
        qrcode: true,
      },
      walletlink: {
        qrcode: true,
      },
    },
  };
  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-12 col-lg-4">
            <div className="card login-box-container">
              <div className="card-body">
                <div className="text-center">
                  <img src={Logo} alt="ValiDefi" width="60%" />
                </div>
                <div className="authent-text">
                  <p>Please connect your wallet</p>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-blue m-b-xs bg-white"
                    onClick={loginWithUnstoappable}
                    // style={{
                    //   color: 'rgb(76, 71, 247)',
                    //   border: '2px solid rgb(76, 71, 247)',
                    // }}
                  >
                    Login with Unstoppable
                  </button>
                  <button
                    className="btn btn-blue m-b-xs"
                    style={{ color: '#fff' }}
                    onClick={handleClick}
                  >
                    Connect to a wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        handleClose={() => toggle(false)}
        width={isMobile ? 85 : 35}
        height={isMobile ? 60 : 80}
        title="Connect to a wallet"
      >
        <ModalContent className="flex-column">
          <WalletModal
            isOpen={isOpen}
            onClose={() => toggle(false)}
            config={config}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Auth;
