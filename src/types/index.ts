export interface WalletInfo {
  balance: {
    ton: string;
    dollar: string;
  };
  tonateHistoryList: any;
}

export interface Tonate {
  value: number;
  address: string | undefined;
  sendReceiveTon: () => Promise<void> | undefined;
  sendWithdrawAll: () => Promise<void> | undefined;
  sendMoney: () => Promise<void> | undefined;
}
