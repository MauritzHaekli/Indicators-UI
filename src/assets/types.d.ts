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

export interface timeSeriesTableData {
  datetime?: string,
  open?: string,
  high?: string,
  low?: string,
  close?: string,
  volume?: string,
  [indicator: string]: string,
  signal?: string
  profit?: float,
  profitPercentage?: float
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

export interface timeSeriesData {
  data: timeSeriesStockMetaData,
  values: timeSeriesStockData[],
  status: string
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

export interface emaIndicator {
  emaIndicatorLabel: string,
  emaIndicatorKey: string
}

export interface rsiIndicator {
  rsiIndicatorLabel: string,
  rsiIndicatorKey: string
}
export interface adxIndicator {
  adxIndicatorLabel: string,
  adxIndicatorKey: string
}
export interface bollingerIndicator {
  bollingerIndicatorLabel: string,
  bollingerIndicatorKey: string
}

export interface stockParameters {
  stockParameterLabel: string,
  stockParameterKey: string
}
