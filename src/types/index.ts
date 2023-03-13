export interface WalletInfo {
  totalBalance: number;
  dollar: number;
  tonateHistoryList: any;
}

export interface Tonate {
  value: number;
  address: string | undefined;
  sendReceiveTon: () => Promise<void> | undefined;
  sendWithdrawAll: () => Promise<void> | undefined;
  sendMoney: () => Promise<void> | undefined;
}
