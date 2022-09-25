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

    isTradingEquationFulfilled (indicator: string, operator: string, threshold: string) {
      switch (operator) {
        case '>': return parseFloat(indicator) > parseFloat(threshold)
        case '<': return parseFloat(indicator) < parseFloat(threshold)
        case '>=': return parseFloat(indicator) >= parseFloat(threshold)
        case '<=': return parseFloat(indicator) <= parseFloat(threshold)
        case '=': return parseFloat(indicator) === parseFloat(threshold)
      }
    },

    getTimeSeriesTableColumns (timeSeriesTableData: timeSeriesTableData[]): string[] {
      return Object.keys(timeSeriesTableData[0])
    },

    calculateTradeProfitAbsolute (openingPrice: string, closingPrice: string): number {
      return parseFloat(closingPrice) - parseFloat(openingPrice)
    },

    calculateTradeProfitRelative (openingPrice: string, closingPrice: string): number {
      return (parseFloat(closingPrice) - parseFloat(openingPrice)) / parseFloat(openingPrice) * 100
    },

    getTableTradingData (stockData: timeSeriesStockData[], buySignals: tradingSignal[], sellSignals: tradingSignal[]): timeSeriesTableData[] {
      const tableData: timeSeriesTableData[] = this.mergeTradingStatisticsToStockData(stockData)
      let tradeOpeningPrice = 0

      tableData.forEach((tableDataEntry, tableDataIndex) => {
        let buySignalsFulfilledCounter = 0
        let sellSignalsFulfilledCounter = 0

        const tableDataIndexSufficient: boolean = tableDataIndex > 0
        if (tableDataIndexSufficient) {
          buySignals.forEach(buySignal => {
            const buySignalFulfilled: boolean = this.isTradingEquationFulfilled(tableDataEntry[buySignal.indicator], buySignal.operator, buySignal.threshold)
            const currentlyNotInTrade: boolean = tableData[tableDataIndex - 1].signal === this.waitSignalText
            if (currentlyNotInTrade && buySignalFulfilled) {
              buySignalsFulfilledCounter += 1
              if (buySignalsFulfilledCounter === buySignals.length) {
                tradeOpeningPrice = parseFloat(tableDataEntry.open as string)
                tableDataEntry.signal = this.buySignalText
                tableDataEntry.profit = this.calculateTradeProfitAbsolute(tableDataEntry.open, tableDataEntry.close).toFixed(2)
                tableDataEntry.profitPercentage = this.calculateTradeProfitRelative(tableDataEntry.open, tableDataEntry.close).toFixed(4)
              }
            }
          })
          sellSignals.forEach(sellSignal => {
            const currentlyInTrade: boolean = tableData[tableDataIndex - 1].signal === this.buySignalText || tableData[tableDataIndex - 1].signal === this.holdSignalText
            const sellSignalFulfilled: boolean = this.isTradingEquationFulfilled(tableDataEntry[sellSignal.indicator], sellSignal.operator, sellSignal.threshold)

            if (currentlyInTrade && sellSignalFulfilled) {
              sellSignalsFulfilledCounter += 1
              if (sellSignalsFulfilledCounter === sellSignals.length) {
                tableDataEntry.signal = this.sellSignalText
                tableDataEntry.profit = this.calculateTradeProfitAbsolute(tradeOpeningPrice, tableDataEntry.close).toFixed(2)
                tableDataEntry.profitPercentage = this.calculateTradeProfitRelative(tradeOpeningPrice, tableDataEntry.close).toFixed(4)
                tradeOpeningPrice = 0
                sellSignalsFulfilledCounter = 0
              } else {
                tableDataEntry.signal = this.holdSignalText
                tableDataEntry.profit = this.calculateTradeProfitAbsolute(tradeOpeningPrice, tableDataEntry.close).toFixed(2)
                tableDataEntry.profitPercentage = this.calculateTradeProfitRelative(tradeOpeningPrice, tableDataEntry.close).toFixed(4)
              }
            } else if (currentlyInTrade && !sellSignalFulfilled) {
              tableDataEntry.signal = this.holdSignalText
              tableDataEntry.profit = this.calculateTradeProfitAbsolute(tradeOpeningPrice, tableDataEntry.close).toFixed(2)
              tableDataEntry.profitPercentage = this.calculateTradeProfitRelative(tradeOpeningPrice, tableDataEntry.close).toFixed(4)
            }
          })
        }
      })
      return tableData
    },
    calculateSumOfArray (array: number[]): number {
      let sumOfArray = 0
      array.forEach(profit => {
        sumOfArray += profit
      })
      return sumOfArray
    },

    calculateMeanOfArray (array: number[]): number {
      let meanOfArray = 0
      array.forEach(profit => {
        meanOfArray += profit
      })
      meanOfArray = meanOfArray / array.length
      return meanOfArray
    },

    calculateStandardDeviationOfArray (array: number[]): number {
      const mean = this.calculateMeanOfArray(array)
      array = array.map(arrayEntry => {
        return (arrayEntry - mean) ** 2
      })
      const variance = this.calculateMeanOfArray(array)
      return Math.sqrt(variance)
    },

    getTradingStatistics (tableData: timeSeriesTableData[], tradingStatistic: tradingStatistic): tradingStatistic {
      let totalTradeCounter = 0
      let positiveTradeCounter = 0
      let negativeTradeCounter = 0
      const profits: number[] = []

      tableData.forEach(tableDataEntry => {
        const tradeFinished: boolean = tableDataEntry.signal === this.sellSignalText
        const tradeSuccessful: boolean = tableDataEntry.profitPercentage > 0

        if (tradeFinished) {
          totalTradeCounter += 1
          profits.push(parseFloat(tableDataEntry.profitPercentage))
          tradeSuccessful ? positiveTradeCounter += 1 : negativeTradeCounter += 1
        }
      })
      tradingStatistic.totalTrades = totalTradeCounter
      tradingStatistic.positiveTrades = positiveTradeCounter
      tradingStatistic.negativeTrades = negativeTradeCounter
      if (tradingStatistic.totalTrades > 0) {
        tradingStatistic.successRate = parseFloat(((positiveTradeCounter / (positiveTradeCounter + negativeTradeCounter)) * 100).toFixed(2))
        tradingStatistic.totalProfitPercentage = this.calculateSumOfArray(profits).toFixed(2)
        tradingStatistic.mean = this.calculateMeanOfArray(profits).toFixed(2)
        tradingStatistic.standardDeviation = this.calculateStandardDeviationOfArray(profits).toFixed(2)
      }
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

    addTradingStrategy (addedTradingStrategy: string) {
      const emptyTradingSignal: tradingSignal = {
        indicator: '',
        operator: '',
        threshold: ''
      }
      if (addedTradingStrategy === 'BuyStrategy') {
        this.buySignals.push(emptyTradingSignal)
      }
      if (addedTradingStrategy === 'SellStrategy') {
        this.sellSignals.push(emptyTradingSignal)
      }
    },

    deleteTradingStrategy (deletedTradingStrategy: string, deletedTradingStrategyIndex: number) {
      if (deletedTradingStrategy === 'BuyStrategy') {
        this.buySignals.splice(deletedTradingStrategyIndex, 1)
      }
      if (deletedTradingStrategy === 'SellStrategy') {
        this.sellSignals.splice(deletedTradingStrategyIndex, 1)
      }
    }
  },
  data () {
    return {
      startButtonText: 'Start Backtest' as string,
      timeSeriesTableTradingData: [{}] as timeSeriesTableData[],
      timeSeriesTableIndicatorData: '' as string,
      availableIndicators: ['ema', 'rsi', 'adx', 'percent_b'] as string[],
      availableOperators: ['>', '>=', '=', '<', '<='] as string[],
      availableThresholds: ['0', '1', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75'] as string[],
      availableStrategies: ['EMA-Strategy', 'RSI-Strategy', 'ADX-Strategy', 'Bollinger-Strategy'],
      selectedStocks: 'BNTX' as string,
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
      buyingStrategyHeader: 'Buy-Strategy' as string,
      sellingStrategyHeader: 'Sell-Strategy' as string,
      buyingStrategyAddButtonText: 'Add Buy-Strategy' as string,
      sellingStrategyAddButtonText: 'Add Sell-Strategy' as string,
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
      buySignals: [{
        indicator: 'adx',
        operator: '>',
        threshold: '25'
      }] as tradingSignal[],
      sellSignals: [{
        indicator: 'adx',
        operator: '<',
        threshold: '20'
      }] as tradingSignal[],
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
      tradingStatisticsTradeHeaders: ['Getätigte Trades', 'positive Trades', 'negative Trades', 'Erfolgsquote'],
      tradingStatisticsPerformanceHeaders: ['Gesamtgewinn (%)', 'Erwartungswert', 'Standardabweichung'],
      totalTradesText: 'Getätigte Trades: ',
      positiveTradesText: 'positive Trades: ',
      negativeTradesText: 'negative Trades: ',
      successRateText: 'Erfolgsquote: ',
      meanText: 'Erwartungswert: ',
      standardDeviationText: 'Standardabweichung',
      apiToken: '82535d7d9eb84b5d905463e011aaaee8' as string
    }
  }
})
export default class StartTab extends Vue {
}
