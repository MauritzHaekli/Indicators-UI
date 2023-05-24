export interface SideBarTab {
  name: string,
  label: string,
  showTab: boolean,
  hovered: boolean,
  iconName: string
}

export interface timeSeriesStockMetaData {
  symbol: string,
  interval: string,
  currency: string,
  // eslint-disable-next-line camelcase
  exchange_timezone: string,
  exchange: string,
  type: string
}

export interface timeSeriesStockData {
  datetime?: string,
  open?: string,
  high?: string,
  low?: string,
  close?: string,
  volume?: string,
  [indicator: string]: string
}

export interface timeSeriesIndicatorData {
  datetime: string,
  [indicator: string]: string
}

export interface tradingTableData {
  datetime?: string,
  open?: string,
  high?: string,
  low?: string,
  close?: string,
  volume?: string,
  [indicator: string]: string,
  signal?: string
  profit?: number,
  profitPercentage?: number
}

export interface tradingStatistic {
  totalTrades: number,
  positiveTrades: number,
  negativeTrades: number,
  successRate: number,
  totalProfitPercentage: number,
  mean: number,
  standardDeviation: number
}

export interface tradingStrategy {
  selectionText: string,
  selectionKey: string,
  indicators: string[],
  thresholds: string[]
}

export interface intervalType {
  intervalName: string,
  intervalValue: string,
}

export interface tradingSignal {
  indicator: string,
  operator: string,
  threshold: string
}
