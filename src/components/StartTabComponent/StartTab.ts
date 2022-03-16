import { Options, Vue } from 'vue-class-component'
import axios, { AxiosResponse } from 'axios'
import { intervalType, timeSeriesIndicatorData, timeSeriesStockData, timeSeriesTableData } from '@/assets/types'

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

    mergeIndicatorDataToTimeSeries (timeSeriesStockArray: timeSeriesStockData[], timeSeriesIndicatorArray: timeSeriesIndicatorData): timeSeriesTableData[] {
      return timeSeriesStockArray.map((timeSeriesStockDataItem: timeSeriesStockData, index: number) => Object.assign({}, timeSeriesStockDataItem, timeSeriesIndicatorArray[index]))
    },

    getTimeSeriesTableColumns (timeSeriesTableData: timeSeriesTableData[]): string[] {
      return Object.keys(timeSeriesTableData[0])
    },

    async setTimeSeriesData (stock: string, indicators: string[], order: string, interval: string, outputsize: string, decimalSize: string) {
      let stockData: timeSeriesStockData[] = [{}]
      let indicatorData: timeSeriesStockData[] = [{}]
      this.getTimeSeriesStockData(stock, order, interval, outputsize, decimalSize).then(async (response: AxiosResponse) => {
        stockData = response.data.values
        for (const indicator of indicators) {
          await this.getTimeSeriesIndicatorData(stock, indicator, order, interval, outputsize, decimalSize).then((response: AxiosResponse) => {
            indicatorData = response.data.values
            stockData = this.mergeIndicatorDataToTimeSeries(stockData, indicatorData)
            this.timeSeriesTableStockData = stockData
            this.timeSeriesTableColumns = this.getTimeSeriesTableColumns(stockData)
          })
        }
      })
    }
  },
  data () {
    return {
      startButtonText: 'Start Something' as string,
      timeSeriesTableStockData: [{}] as timeSeriesStockData,
      timeSeriesTableIndicatorData: '' as string,
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
      intervalTypes: [{
        intervalName: '1 minute',
        intervalValue: '1min'
      },
      {
        intervalName: '5 minutes',
        intervalValue: '5min'
      },
      {
        intervalName: '15 minutes',
        intervalValue: '15min'
      }
      ] as intervalType[],
      dataSizes: ['3', '10', '50', '500', '5000'] as string[],
      timeSeriesTableColumns: [] as string[],
      apiToken: '82535d7d9eb84b5d905463e011aaaee8' as string
    }
  }
})
export default class StartTab extends Vue {
}
