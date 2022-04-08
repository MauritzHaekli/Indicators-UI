import { Options, Vue } from 'vue-class-component'
import axios, { AxiosResponse } from 'axios'
import {
  intervalType,
  timeSeriesIndicatorData,
  timeSeriesStockData,
  timeSeriesTableData,
  tradingSignal
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

    getTimeSeriesTableColumns (timeSeriesTableData: timeSeriesTableData[]): string[] {
      return Object.keys(timeSeriesTableData[0])
    },

    async setTimeSeriesData (stock: string, indicators: string[], order: string, interval: string, outputsize: string, decimalSize: string) {
      let stockData: timeSeriesTableData[] = [{}]
      let indicatorData: timeSeriesTableData[] = [{}]
      await this.getTimeSeriesStockData(stock, order, interval, outputsize, decimalSize).then(async (response: AxiosResponse) => {
        stockData = response.data.values
        for (const indicator of indicators) {
          await this.getTimeSeriesIndicatorData(stock, indicator, order, interval, outputsize, decimalSize).then((response: AxiosResponse) => {
            indicatorData = response.data.values
            stockData = this.mergeIndicatorDataToTimeSeries(stockData, indicatorData)
            this.timeSeriesTableStockData = stockData
            console.log(indicator)
          })
        }
      })
      stockData.forEach(stockDataEntry => {
        if (parseFloat(stockDataEntry.rsi) >= 70) {
          stockDataEntry.signal = 'Buy'
        } else {
          stockDataEntry.signal = ''
        }
      })
      this.timeSeriesTableColumns = this.getTimeSeriesTableColumns(stockData)
    },

    addTradingSignal (addedStrategy: string) {
      const emptyTradingSignal: tradingSignal = {
        indicator: '',
        operator: '',
        threshold: ''
      }
      if (addedStrategy === 'BuyStrategy') {
        this.buySignals.push(emptyTradingSignal)
      }
      if (addedStrategy === 'SellStrategy') {
        this.sellSignals.push(emptyTradingSignal)
      }
    }
  },
  data () {
    return {
      startButtonText: 'Start Something' as string,
      timeSeriesTableStockData: [{}] as timeSeriesStockData,
      timeSeriesTableIndicatorData: '' as string,
      availableIndicators: ['ema', 'rsi', 'adx'] as string[],
      availableOperators: ['>', '>=', '=', '<', '<='] as string[],
      availableThresholds: ['15', '20', '25', '30'] as string[],
      selectedStocks: 'BNTX' as string,
      selectedIndicators: ['ema', 'rsi', 'adx'] as string[],
      selectedOrder: 'ASC' as string,
      selectedInterval: '1min' as string,
      selectedDataSize: '10' as string,
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
      dataSizes: ['3', '10', '50', '500', '5000'] as string[],
      buySignals: [{
        indicator: '',
        operator: '',
        threshold: ''
      }] as tradingSignal[],
      sellSignals: [{
        indicator: '',
        operator: '',
        threshold: ''
      }] as tradingSignal[],
      timeSeriesTableColumns: [] as string[],
      apiToken: '82535d7d9eb84b5d905463e011aaaee8' as string
    }
  }
})
export default class StartTab extends Vue {
}
