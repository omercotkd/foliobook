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

export interface Portfolio {
  id: string;
  name: string;
  broker: string;
  /** Short abbreviation shown inside the avatar circle (e.g. "IB", "RH") */
  brokerAbbr: string;
  /** Hex color used for the portfolio avatar */
  avatarColor: string;
}
