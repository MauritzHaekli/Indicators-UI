import { Options, Vue } from 'vue-class-component'
import axios, { AxiosResponse } from 'axios'
import {
  intervalType,
  timeSeriesIndicatorData,
  timeSeriesStockData,
  timeSeriesTableData,
  tradingSignal,
  tradingStatistic
} from '@/assets/types'

import {
  isTradingEquationFulfilled,
  calculateSuccessRate,
  calculateTradeProfitAbsolute,
  calculateTradeProfitRelative,
  calculateSumOfArray,
  calculateMeanOfArray,
  calculateStandardDeviationOfArray
} from '@/assets/services/StatisticsService'

@Options({
  props: {
  },
  computed: {

  },

  methods: {
    async getTimeSeriesStockData (stock: string, order: string, interval: string, outputsize: string, decimalSize: string): Promise<void> {
      try {
        const timeSeriesStockDataURL = `https://api.twelvedata.com/time_series?symbol=${stock}&order=${order}&interval=${interval}&outputsize=${outputsize}&dp=${decimalSize}&apikey=${this.apiToken}`
        return await axios.get(timeSeriesStockDataURL)
      } catch (err) {
        console.error(err)
      }
    },

    async getTimeSeriesIndicatorData (stock: string, indicator: string, order: string, interval: string, outputsize: string, decimalSize: string): Promise<void> {
      try {
        const timeSeriesIndicatorDataURL = `https://api.twelvedata.com/${indicator}?symbol=${stock}&order=${order}&interval=${interval}&outputsize=${outputsize}&dp=${decimalSize}&apikey=${this.apiToken}`
        return await axios.get(timeSeriesIndicatorDataURL)
      } catch (err) {
        console.error(err)
      }
    },

    mergeIndicatorDataToTimeSeries (timeSeriesStockArray: timeSeriesTableData[], timeSeriesIndicatorArray: timeSeriesIndicatorData): timeSeriesTableData[] {
      return timeSeriesStockArray.map((timeSeriesStockDataItem: timeSeriesTableData, index: number) => Object.assign({}, timeSeriesStockDataItem, timeSeriesIndicatorArray[index]))
    },

    mergeTradingStatisticsToStockData (stockData: timeSeriesStockData[]): timeSeriesTableData[] {
      const tradingStatisticsEntry = {
        signal: '',
        profit: '',
        profitPercentage: ''
      }
      stockData.forEach(tableDataEntry => {
        Object.assign(tableDataEntry, tradingStatisticsEntry)
      })
      return stockData
    },

    getTimeSeriesTableColumns (timeSeriesTableData: timeSeriesTableData[]): string[] {
      return Object.keys(timeSeriesTableData[0])
    },

    getCurrentSignalTableDataEntry (tableDataKey: string, tableData: timeSeriesTableData[], tableDataIndex: number):number {
      switch (tableDataKey) {
        case 'last EMA': return parseFloat(tableData[tableDataIndex - 1].ema as string)
        case 'current EMA': return parseFloat(tableData[tableDataIndex].ema as string)
        case 'stock price(open)': return parseFloat(tableData[tableDataIndex].open as string)
        case 'stock price(close)': return parseFloat(tableData[tableDataIndex].close as string)
        case 'last RSI': return parseFloat(tableData[tableDataIndex - 1].rsi as string)
        case 'current RSI': return parseFloat(tableData[tableDataIndex].rsi as string)
        case 'last ADX': return parseFloat(tableData[tableDataIndex - 1].adx as string)
        case 'current ADX': return parseFloat(tableData[tableDataIndex].adx as string)
        case 'last Bollinger': return parseFloat(tableData[tableDataIndex - 1].percent_b as string)
        case 'current Bollinger': return parseFloat(tableData[tableDataIndex].percent_b as string)
        default: return 0
      }
    },

    getTableTradingData (stockData: timeSeriesStockData[], buySignals: tradingSignal[], sellSignals: tradingSignal[]): timeSeriesTableData[] {
      const tableData: timeSeriesTableData[] = this.mergeTradingStatisticsToStockData(stockData)
      let tradeOpeningPrice = 0

      tableData.forEach((tableDataEntry, tableDataIndex) => {
        let buySignalsFulfilledCounter = 0
        let sellSignalsFulfilledCounter = 0
        const currentClosingPrice: number = parseFloat(tableDataEntry.close as string)
        const tableDataIndexSufficient: boolean = tableDataIndex > 0
        if (tableDataIndexSufficient) {
          buySignals.forEach(buySignal => {
            const currentBuySignalIndicator: number = this.getCurrentSignalTableDataEntry(buySignal.indicator, tableData, tableDataIndex)
            const currentBuySignalThreshold: number = this.getCurrentSignalTableDataEntry(buySignal.threshold, tableData, tableDataIndex)
            const buySignalFulfilled: boolean = isTradingEquationFulfilled(currentBuySignalIndicator, buySignal.operator, currentBuySignalThreshold)
            const currentlyNotInTrade: boolean = tableData[tableDataIndex - 1].signal === this.waitSignalText
            if (currentlyNotInTrade && buySignalFulfilled) {
              buySignalsFulfilledCounter += 1
              if (buySignalsFulfilledCounter === buySignals.length) {
                tradeOpeningPrice = parseFloat(tableDataEntry.open as string)
                const startingClosingPrice: number = parseFloat(tableDataEntry.close as string)
                tableDataEntry.signal = this.buySignalText
                tableDataEntry.profit = calculateTradeProfitAbsolute(tradeOpeningPrice, startingClosingPrice)
                tableDataEntry.profitPercentage = calculateTradeProfitRelative(tradeOpeningPrice, startingClosingPrice)
              }
            }
          })
          sellSignals.forEach(sellSignal => {
            const currentlyInTrade: boolean = tableData[tableDataIndex - 1].signal === this.buySignalText || tableData[tableDataIndex - 1].signal === this.holdSignalText
            const currentSellSignalIndicator: number = this.getCurrentSignalTableDataEntry(sellSignal.indicator, tableData, tableDataIndex)
            const currentSellSignalThreshold: number = this.getCurrentSignalTableDataEntry(sellSignal.threshold, tableData, tableDataIndex)
            const sellSignalFulfilled: boolean = isTradingEquationFulfilled(currentSellSignalIndicator, sellSignal.operator, currentSellSignalThreshold)
            if (currentlyInTrade && sellSignalFulfilled) {
              sellSignalsFulfilledCounter += 1
              if (sellSignalsFulfilledCounter === sellSignals.length) {
                tableDataEntry.signal = this.sellSignalText
                tableDataEntry.profit = calculateTradeProfitAbsolute(tradeOpeningPrice, currentClosingPrice)
                tableDataEntry.profitPercentage = calculateTradeProfitRelative(tradeOpeningPrice, currentClosingPrice)
                tradeOpeningPrice = 0
                sellSignalsFulfilledCounter = 0
              } else {
                tableDataEntry.signal = this.holdSignalText
                tableDataEntry.profit = calculateTradeProfitAbsolute(tradeOpeningPrice, currentClosingPrice)
                tableDataEntry.profitPercentage = calculateTradeProfitRelative(tradeOpeningPrice, currentClosingPrice)
              }
            } else if (currentlyInTrade && !sellSignalFulfilled) {
              tableDataEntry.signal = this.holdSignalText
              tableDataEntry.profit = calculateTradeProfitAbsolute(tradeOpeningPrice, currentClosingPrice)
              tableDataEntry.profitPercentage = calculateTradeProfitRelative(tradeOpeningPrice, currentClosingPrice)
            }
          })
        }
      })
      return tableData
    },

    getTradingStatistics (tableData: timeSeriesTableData[], tradingStatistic: tradingStatistic): tradingStatistic {
      let totalTradeCounter = 0
      let positiveTradeCounter = 0
      let negativeTradeCounter = 0
      const profits: number[] = []

      tableData.forEach(tableDataEntry => {
        const tradeFinished: boolean = tableDataEntry.signal === this.sellSignalText
        const tradeSuccessful: boolean = tableDataEntry.profitPercentage as number > 0

        if (tradeFinished) {
          totalTradeCounter += 1
          profits.push(tableDataEntry.profitPercentage as number)
          tradeSuccessful ? positiveTradeCounter += 1 : negativeTradeCounter += 1
        }
      })
      tradingStatistic.totalTrades = totalTradeCounter
      tradingStatistic.positiveTrades = positiveTradeCounter
      tradingStatistic.negativeTrades = negativeTradeCounter
      tradingStatistic.successRate = calculateSuccessRate(positiveTradeCounter, negativeTradeCounter)
      tradingStatistic.totalProfitPercentage = calculateSumOfArray(profits)
      tradingStatistic.mean = calculateMeanOfArray(profits)
      tradingStatistic.standardDeviation = calculateStandardDeviationOfArray(profits)
      return tradingStatistic
    },

    async setTimeSeriesData (stock: string, indicators: string[], order: string, interval: string, outputsize: string, decimalSize: string) {
      let stockData: timeSeriesStockData[] = [{}]
      let indicatorData: timeSeriesStockData[] = [{}]
      let tableTradingData : timeSeriesTableData[] = [{}]
      await this.getTimeSeriesStockData(stock, order, interval, outputsize, decimalSize).then(async (response: AxiosResponse) => {
        stockData = response.data.values
        for (const indicator of indicators) {
          await this.getTimeSeriesIndicatorData(stock, indicator, order, interval, outputsize, decimalSize).then((response: AxiosResponse) => {
            indicatorData = response.data.values
            stockData = this.mergeIndicatorDataToTimeSeries(stockData, indicatorData)
          })
        }
      })
      tableTradingData = this.getTableTradingData(stockData, this.buySignals, this.sellSignals)
      this.timeSeriesTableTradingData = tableTradingData
      this.tradingStatistic = this.getTradingStatistics(tableTradingData, this.tradingStatistic)
      this.timeSeriesTableColumns = this.getTimeSeriesTableColumns(this.timeSeriesTableTradingData)
      this.showTradingData = true
    },

    addTradingSignal (addedTradingStrategy: string, tradingSignal: tradingSignal) {
      if (addedTradingStrategy === 'BuyStrategy') {
        this.buySignals.push(tradingSignal)
      }
      if (addedTradingStrategy === 'SellStrategy') {
        this.sellSignals.push(tradingSignal)
      }
      this.clearCurrentBuySignal()
    },

    clearCurrentBuySignal () {
      this.currentBuySignal = {
        indicator: '',
        operator: '',
        threshold: ''
      }
    },
    clearCurrentSellSignal () {
      this.currentSellSignal = {
        indicator: '',
        operator: '',
        threshold: ''
      }
    },

    clearSelectedBuySignal (index: number) {
      this.buySignals.splice(index, 1)
    },

    clearSelectedSellSignal (index: number) {
      this.sellSignals.splice(index, 1)
    },

    resetBuyingStrategySelection () {
      this.buyingStrategySelection = ''
    },
    resetSellingStrategySelection () {
      this.sellingStrategySelection = ''
    }
  },
  data () {
    return {
      startButtonText: 'Start Backtest' as string,
      timeSeriesTableTradingData: [{}] as timeSeriesTableData[],
      timeSeriesTableIndicatorData: '' as string,
      availableOperators: ['>', '>=', '=', '<', '<='] as string[],
      availableStrategies: [{
        selectionText: 'EMA-Strategy',
        selectionKey: 'ema',
        indicators: ['last EMA', 'current EMA'] as string[],
        thresholds: ['last EMA', 'current EMA', 'stock price(open)', 'stock price(close)']
      }, {
        selectionText: 'RSI-Strategy',
        selectionKey: 'rsi',
        indicators: ['last RSI', 'current RSI'] as string[],
        thresholds: ['10', '20', '30', '40', '50', '60', '70', '80']

      }, {
        selectionText: 'ADX-Strategy',
        selectionKey: 'adx',
        indicators: ['last ADX', 'current ADX'] as string[],
        thresholds: ['10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70']
      }, {
        selectionText: 'Bollinger-Strategy',
        selectionKey: 'bollinger',
        indicators: ['last Bollinger', 'current Bollinger'] as string[],
        thresholds: ['-1.5', '-1', '-0.5', '0', '0.25', '0.5', '0.75', '1', '1.25', '1.5']
      }],
      selectedStocks: 'TSLA' as string,
      selectedIndicators: ['ema', 'rsi', 'adx', 'percent_b'] as string[],
      selectedOrder: 'ASC' as string,
      selectedInterval: '1min' as string,
      selectedDataSize: '100' as string,
      selectedDecimalSize: '2' as string,
      orderTypes: ['ASC', 'DESC'] as string[],
      decimalSizes: ['1', '2', '3', '4'] as string[],
      orderSelectionText: 'Choose selection order' as string,
      intervalSelectionText: 'Choose selection interval' as string,
      dataSizeSelectionText: 'Choose data size' as string,
      decimalSizeSelectionText: 'Choose decimal size' as string,
      strategySelectionIndicatorText: 'Indicator: ' as string,
      strategySelectionOperatorText: 'Operator: ' as string,
      strategySelectionThresholdText: 'Threshold: ' as string,
      buyingStrategyAddStrategy: 'Add a Buy-Strategy: ' as string,
      buyingStrategySelectionLabel: '-- Select a strategy --' as string,
      buyingStrategySelection: '' as string,
      sellingStrategyAddStrategy: 'Add a Sell-Strategy: ' as string,
      sellingStrategySelectionLabel: '-- Select a strategy --' as string,
      sellingStrategySelection: '' as string,
      showTradingData: false,
      buySignalText: 'Buy',
      holdSignalText: 'Hold',
      sellSignalText: 'Sell',
      waitSignalText: '',
      intervalTypes: [{
        intervalName: '1 min',
        intervalValue: '1min'
      },
      {
        intervalName: '5 min',
        intervalValue: '5min'
      },
      {
        intervalName: '15 min',
        intervalValue: '15min'
      }
      ] as intervalType[],
      dataSizes: ['10', '50', '100', '500', '5000'] as string[],
      currentBuySignal: {
        indicator: '',
        operator: '',
        threshold: ''
      } as tradingSignal,
      currentSellSignal: {
        indicator: '',
        operator: '',
        threshold: ''
      } as tradingSignal,
      buySignals: [{
        indicator: 'last EMA',
        operator: '>',
        threshold: 'stock price(close)'
      }] as tradingSignal[],
      buySignalsTableText: 'Selected Buy-Signals' as string,
      buySignalTableHeaders: ['Indicator', 'Operator', 'Threshold', ''] as string[],
      selectBuySignalWarning: 'Please select at least one Buy-Signal' as string,
      sellSignals: [{
        indicator: 'last EMA',
        operator: '<=',
        threshold: 'stock price(close)'
      }] as tradingSignal[],
      sellSignalsTableText: 'Selected Sell-Signals' as string,
      sellSignalTableHeaders: ['Indicator', 'Operator', 'Threshold', ''] as string[],
      selectSellSignalWarning: 'Please select at least one Sell-Signal' as string,
      timeSeriesTableColumns: [] as string[],
      tradingStatistic: {
        totalTrades: 0,
        positiveTrades: 0,
        negativeTrades: 0,
        successRate: 0,
        totalProfitPercentage: 0,
        mean: 0,
        standardDeviation: 0
      },
      tradingStatisticsTradeHeaders: ['Trades(total)', 'positive Trades', 'negative Trades', 'Success rate'],
      tradingStatisticsPerformanceHeaders: ['Total Earnings (%)', 'Mean', 'Standard deviation'],
      apiToken: '82535d7d9eb84b5d905463e011aaaee8' as string
    }
  }
})
export default class StartTab extends Vue {
}
