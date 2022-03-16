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
  volume?: string
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
  adx?: string,
  rsi?: string,
  ema?: string
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
