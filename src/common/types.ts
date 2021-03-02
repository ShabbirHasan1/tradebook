export type Summary = {
  ordinal: number;
  key: string;
  label: string;
  value: number;
  indicator: string;
  type: string;
};

export type Portfolio = {
  symbol: string;
  name: string;
  entry_date: string;
  exit_date: string;
  buy_qty: number;
  sell_qty: number;
  avg_buy_price: number;
  avg_sell_price: number;
  pnl: number;
};
