<template>
  <div class="startTabTemplate">
    <div class="startTabContent">
      <div class="startTabSelection">
        <div class="startTabStockSelection">
          <input placeholder="Select stocks" v-model="selectedStocks">
        </div>
        <div class="startTabParameterSelection">
          <div class="startTabOrderSelection">
            <select v-model="selectedOrder">
              <option v-for="orderType in orderTypes" :key="orderType"> {{orderType}}</option>
            </select>
          </div>
          <div class="startTabIntervalSelection">
            <select v-model="selectedInterval">
              <option v-for="intervalType in intervalTypes" :key="intervalType" :value="intervalType.intervalValue">{{ intervalType.intervalName }}</option>
            </select>
          </div>
          <div class="startTabDataSizeSelection">
            <select v-model="selectedDataSize">
              <option v-for="dataSize in dataSizes" :key="dataSize">{{ dataSize }}</option>
            </select>
          </div>
          <div class="startTabDecimalSelection">
            <select v-model="selectedDecimalSize">
              <option v-for="decimalSize in decimalSizes" :key="decimalSize">{{ decimalSize }}</option>
            </select>
          </div>
        </div>
        <input placeholder="Select indicators" v-model="selectedIndicators">
        <div class="startTabStrategySelection">
          <div class="startTabBuyingStrategySelection">
            <div class="buyingStrategyHeader">
              <p>{{ buyingStrategyHeader }} </p>
            </div>
            <div class="buyStrategySelection">
              <select>

              </select>

            </div>
            <div class="buyingStrategyParameterSelection" v-for="(buySignal, buySignalIndex) in buySignals" :key="buySignal">
              <div class="buyingStrategyIndicator">
                <p>{{ strategySelectionIndicatorText }} </p>
                <select v-model="buySignal.indicator">
                  <option v-for="indicator in availableIndicators" :key="indicator">{{ indicator }}</option>
                </select>
              </div>
              <div class="buyingStrategyOperator">
                <p>{{ strategySelectionOperatorText }} </p>
                <select v-model="buySignal.operator">
                  <option v-for="operator in availableOperators" :key="operator">{{ operator }}</option>
                </select>
              </div>
              <div class="buyingStrategyThreshold">
                <p>{{ strategySelectionThresholdText }} </p>
                <select v-model="buySignal.threshold">
                  <option v-for="threshold in availableThresholds" :key="threshold">{{ threshold }}</option>
                </select>
              </div>
              <div class="buyingStrategyDeleteButton">
                <button type="button" v-on:click="deleteTradingStrategy('BuyStrategy', buySignalIndex)">
                  <i class='fas fa-hourglass-start'></i>
                </button>
              </div>
            </div>
            <div class="buyingStrategyAddButton">
              <button type="button" v-on:click="this.addTradingStrategy('BuyStrategy')">{{ buyingStrategyAddButtonText }}</button>
            </div>
          </div>
          <div class="startTabSellingStrategySelection">
            <div class="sellingStrategyHeader">
              <p>{{ sellingStrategyHeader }} </p>
            </div>
            <div class="sellingStrategyParameterSelection" v-for="(sellSignal, sellSignalIndex) in sellSignals" :key="sellSignal">
              <div class="sellingStrategyIndicator">
                <p>{{ strategySelectionIndicatorText }} </p>
                <select v-model="sellSignal.indicator">
                  <option v-for="indicator in availableIndicators" :key="indicator">{{ indicator }}</option>
                </select>
              </div>
              <div class="sellingStrategyOperator">
                <p>{{ strategySelectionOperatorText }} </p>
                <select v-model="sellSignal.operator">
                  <option v-for="operator in availableOperators" :key="operator">{{ operator }}</option>
                </select>
              </div>
              <div class="sellingStrategyThreshold">
                <p>{{ strategySelectionThresholdText }} </p>
                <select v-model="sellSignal.threshold">
                  <option v-for="threshold in availableThresholds" :key="threshold">{{ threshold }}</option>
                </select>
              </div>
              <div class="sellingStrategyDeleteButton">
                <button type="button" v-on:click="deleteTradingStrategy('SellStrategy', sellSignalIndex)">
                  <i class="fas fa-x"></i>
                </button>
              </div>
            </div>
            <div class="sellingStrategyAddButton" >
              <button type="button" v-on:click="this.addTradingStrategy('SellStrategy')">{{ sellingStrategyAddButtonText }}</button>
            </div>
          </div>
        </div>
        <div class="startTabSelectionButton">
          <button type="button" v-on:click="this.setTimeSeriesData(selectedStocks, selectedIndicators, selectedOrder, selectedInterval, selectedDataSize, selectedDecimalSize)">{{ startButtonText }}</button>
        </div>
      </div>
      <div class="startTabTradingData" v-if="showTradingData">
        <div class="startTabTradingDataContent">
          <div class="startTabTimeSeriesTable">
            <table class="table table-sm">
              <thead class="table-dark">
                <tr>
                  <th v-for="timeSeriesTableColumn in timeSeriesTableColumns" :key="timeSeriesTableColumn">
                    {{timeSeriesTableColumn}}
                  </th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="value in timeSeriesTableTradingData" :key="value">
                <td v-for="(cellData, index) in value" :key="index" v-bind:class="{timeSeriesTableSignalCell: cellData === buySignalText || cellData === holdSignalText || cellData === sellSignalText}">
                  {{cellData}}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="startTabTradingStatistics">
            <div class="tradingStatisticsTradeTable">
              <table>
                <tr class="tradeTableHeader">
                  <td v-for="tradeHeader in tradingStatisticsTradeHeaders" :key="tradeHeader">
                    {{tradeHeader}}
                  </td>
                </tr>
                <tr>
                  <td>{{tradingStatistic.totalTrades}}</td>
                  <td>{{tradingStatistic.positiveTrades}}</td>
                  <td>{{tradingStatistic.negativeTrades}}</td>
                  <td>{{tradingStatistic.successRate}} %</td>
                </tr>
              </table>
            </div>
            <div class="tradingStatisticsPerformanceTable">
              <table>
                <tr class="performanceTableHeader">
                  <td v-for="performanceHeader in tradingStatisticsPerformanceHeaders" :key="performanceHeader">
                    {{performanceHeader}}
                  </td>
                </tr>
                <tr>
                  <td>{{tradingStatistic.totalProfitPercentage}}</td>
                  <td>{{tradingStatistic.mean}}</td>
                  <td>{{tradingStatistic.standardDeviation}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./StartTab.ts"></script>
<style scoped lang="less" src="./StartTab.less"></style>
