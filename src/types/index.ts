export interface WalletInfo {
  balance: {
    ton: string;
    dollar: string;
  };
}

export interface Tonate {
  value: number;
  title: string;
  address: string | undefined;
  sendReceiveTon: () => Promise<void> | undefined;
  sendWithdrawAll: () => Promise<void> | undefined;
  sendMoney: () => Promise<void> | undefined;
}
