export interface Thesis {
  id: string;
  ticker: string;
  entryPrice: number;
  why: string;
  targetPrice?: number;
  stopPrice?: number;
  createdAt: number;
}
