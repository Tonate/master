import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";
import { Address, OpenedContract } from "ton-core";
import { Tonate as ton } from "@/types";
import { WalletInfo } from "@/types";
import { WalletInfoBox, RankingList, LoginBox, AlertModal, RankingBox } from "@/components";
import { TonateLogo } from "@/components/icon";
import { useTonClient } from "@/hooks/useTonClient";

import styles from "./TonatePage.module.css";

import Tonate from "@/contracts/tonate";
import { useTonConnect } from "@/hooks/useTonConnect";

export function ReceiveTonPage() {
  const client = useTonClient();
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    balance: { ton: "0", dollar: "0" },
  });
  const [isLogin, setIsLogin] = useState(false);
  const [tonate, setTonate] = useState<ton>();
  const [isVisibleAlertModal, setIsVisibleAlertModal] = useState(false);
  const { sender } = useTonConnect();

  useEffect(() => {
    loadContract();

    if (wallet?.account) {
      setIsLogin(true);
      getWalletInfo();
    } else {
      setIsLogin(false);
    }
  }, [client, wallet]);

  const   getWalletInfo = async() => {
    if (!client) {
      return;
    }

    const tonCoinMarketValue = {
      quotes: {
        USD: {
          price: 2.4,
        },
      },
    };

    const nanoTon = await client?.getBalance(
      Address.parse(wallet?.account.address!)
    );

    const myTon = Number.parseFloat(nanoTon?.toString()!) / 1000000000;
    const myDollar = (myTon * tonCoinMarketValue.quotes.USD.price).toFixed(2);

    setWalletInfo({
      ...walletInfo,
      balance: { ton: myTon.toFixed(3), dollar: myDollar },
    });
  }

  const loadContract =  async () => {
    if( !client ) { return; }
    if( !location.href.split('?')[1] ) {return;}
    const address = location.href.split('?')[1]
    console.log(address);
    try {
    const tonate = new Tonate(Address.parse(address));
    const tonateContract = client.open(tonate) as OpenedContract<Tonate>;

    const value = await tonateContract.getBalance();
    const title = await tonateContract.getTitle();


    setTonate ( 
        {
            value: Number(value),
            title: title.replace("\x00\x00\x00\x00", ""),
            address: tonateContract?.address.toString(),
            sendReceiveTon: () => {
                return tonateContract?.sendReceiveTon(sender);
            },
            sendWithdrawAll: () => {
                return tonateContract?.sendWithdrawAll(sender);
            },
            sendMoney: () => {
                return tonateContract?.sendMoney(sender);
            },
        }
    );
    
    console.log(tonate);
    } catch(e) {
        console.log(e);
        navigate("/");
    }
  }

  const receiveTon = (isSuccess: boolean) => {
    setIsVisibleAlertModal(!isSuccess);
  };

  return (
    <div className={styles.tonatePage}>
      <div className={styles.title}>
        <TonateLogo />
        <span>TONate</span>
      </div>

      {isLogin && tonate ? (
        <RankingBox 
        rankOrder={0} tonate={tonate!} isLogin={false} onClickReceiveTon={function (isSuccess: boolean): void {
                  throw new Error("Function not implemented.");
              } }></RankingBox>
      ) : (
        <LoginBox></LoginBox>
      )}


      <AlertModal
        isOpen={isVisibleAlertModal}
        onClickConfirm={setIsVisibleAlertModal}
      />

    </div>
  );
}
