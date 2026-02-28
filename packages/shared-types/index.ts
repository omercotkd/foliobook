export interface Thesis {
  id: string;
  ticker: string;
  entryPrice: number;
  why: string;
  targetPrice?: number;
  stopPrice?: number;
  createdAt: number;
}

export type PositionDirection = "long" | "short";

export interface Position {
  id: string;
  ticker: string;
  companyName: string;
  direction: PositionDirection;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  currency: string;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  thesis?: Thesis;
}
