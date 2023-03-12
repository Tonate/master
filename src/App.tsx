import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonateContract } from './hooks/userTonateContract';
import { useTonConnect } from './hooks/useTonConnect';

function App() {
  const {connected} = useTonConnect();
  const {value, address, sendReceiveTon, sendWithdrawAll, sendMoney} = useTonateContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Tonate Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Eatable Balance</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick= {() => {
            sendReceiveTon();
          }}
          >
            Eat Ton
          </a>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick= {() => {
            sendMoney();
          }}
          >
            Send Money ( 0.02 TON )
          </a>
        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick= {() => {
            sendWithdrawAll();
          }}
          >
            Withdraw All
          </a>

      </div>
    </div>
    );
}

export default App
