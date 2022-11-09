<template>
  <div class="startTabTemplate">
    <div class="startTabContent">
      <div class="startTabHeaderContent">
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
              <div class="addingStrategySelection">
                <p>{{ buyingStrategyAddStrategy }}</p>
                <select v-model="buyingStrategySelection" @change="clearCurrentBuySignal()">
                  <option value="" disabled selected hidden>{{buyingStrategySelectionLabel}}</option>
                  <option v-for="availableStrategy in availableStrategies" :key="availableStrategy.selectionKey" :value="availableStrategy.selectionKey">
                    {{availableStrategy.selectionText}}
                  </option>
                </select>
              </div>
              <div v-for="availableStrategy in availableStrategies" :key="availableStrategy.selectionKey" >
                <div v-if="buyingStrategySelection === availableStrategy.selectionKey" class="buyingStrategySelection">
                  <p>{{ strategySelectionIndicatorText }} </p>
                  <select v-model="currentBuySignal.indicator">
                    <option v-for="indicator in availableStrategy.indicators" :key="indicator" >{{ indicator }}</option>
                  </select>
                  <p>{{ strategySelectionOperatorText }} </p>
                  <select v-model="currentBuySignal.operator">
                    <option v-for="operator in availableOperators" :key="operator">{{ operator }}</option>
                  </select>
                  <p>{{ strategySelectionIndicatorText }} </p>
                  <select v-model="currentBuySignal.threshold">
                    <option v-for="threshold in availableStrategy.thresholds" :key="threshold" >{{ threshold }}</option>
                  </select>
                  <div class="strategyClearButton">
                    <button type="button" v-on:click="clearCurrentBuySignal(); resetBuyingStrategySelection()">
                      <font-awesome-icon icon="fa-solid fa-xmark" />
                    </button>
                  </div>
                  <div class="strategyAddButton">
                    <button type="button" v-on:click="addTradingSignal('BuyStrategy', currentBuySignal); resetBuyingStrategySelection()">
                      <font-awesome-icon icon="fa-solid fa-plus" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="startTabSellingStrategySelection">
                <div class="addingStrategySelection">
                  <p>{{ sellingStrategyAddStrategy }}</p>
                  <select v-model="sellingStrategySelection" @change="clearCurrentSellSignal()">
                    <option value="" disabled selected hidden>{{sellingStrategySelectionLabel}}</option>
                    <option v-for="availableStrategy in availableStrategies" :key="availableStrategy.selectionKey" :value="availableStrategy.selectionKey">
                      {{availableStrategy.selectionText}}
                    </option>
                  </select>
                </div>
                <div v-for="availableStrategy in availableStrategies" :key="availableStrategy.selectionKey" >
                  <div v-if="buyingStrategySelection === availableStrategy.selectionKey" class="sellingStrategySelection">
                    <p>{{ strategySelectionIndicatorText }} </p>
                    <select v-model="currentSellSignal.indicator">
                      <option v-for="indicator in availableStrategy.indicators" :key="indicator" >{{ indicator }}</option>
                    </select>
                    <p>{{ strategySelectionOperatorText }} </p>
                    <select v-model="currentSellSignal.operator">
                      <option v-for="operator in availableOperators" :key="operator">{{ operator }}</option>
                    </select>
                    <p>{{ strategySelectionIndicatorText }} </p>
                    <select v-model="currentSellSignal.threshold">
                      <option v-for="threshold in availableStrategy.thresholds" :key="threshold" >{{ threshold }}</option>
                    </select>
                    <div class="strategyClearButton">
                      <button type="button" v-on:click="clearCurrentSellSignal(); resetSellingStrategySelection()">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                      </button>
                    </div>
                    <div class="strategyAddButton">
                      <button type="button" v-on:click="addTradingSignal('SellStrategy', currentSellSignal); resetSellingStrategySelection()">
                        <font-awesome-icon icon="fa-solid fa-plus" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="startTabBacktestButton">
                <button type="button" v-on:click="this.setTimeSeriesData(selectedStocks, selectedIndicators, selectedOrder, selectedInterval, selectedDataSize, selectedDecimalSize)">{{ startButtonText }}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="startTabTradingSignalsDisplay">
          <div class="startTabTradingSignals">
            <div class="selectedBuySignals">
              <div class="selectedBuySignalsHeader">
                <div class="buySignalsTableText">{{buySignalsTableText}}</div>
                <font-awesome-icon icon="fa-regular fa-credit-card" />
              </div>
              <div class="buySignalsTable table-responsive table-scroll">
                <table class="table table-striped mb-0">
                  <thead class="buySignalsTableHeader">
                    <tr>
                      <th scope="col" v-for="buySignalTableHeader in buySignalTableHeaders" :key="buySignalTableHeader">
                        {{buySignalTableHeader}}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(buySignal, buySignalIndex) in buySignals" :key="buySignal">
                      <td>{{buySignal.indicator}}</td>
                      <td>{{buySignal.operator}}</td>
                      <td>{{buySignal.threshold}}</td>
                      <td>
                        <button type="button" v-on:click="clearSelectedBuySignal(buySignalIndex)">
                          <font-awesome-icon icon="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="buySignals.length === 0">
                  <p>{{selectBuySignalWarning}}</p>
                </div>
              </div>
            </div>
            <div class="selectedSellSignals">
              <div class="selectedSellSignalsHeader">
                <div class="sellSignalsTableText">{{sellSignalsTableText}}</div>
                <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" />
              </div>
              <div class="sellSignalsTable table-responsive table-scroll">
                <table class="table table-striped mb-0">
                  <thead class="sellSignalsTableHeader">
                    <tr>
                      <th scope="col" v-for="sellSignalTableHeader in sellSignalTableHeaders" :key="sellSignalTableHeader">
                        {{sellSignalTableHeader}}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sellSignal, sellSignalIndex) in sellSignals" :key="sellSignal">
                      <td>{{sellSignal.indicator}}</td>
                      <td>{{sellSignal.operator}}</td>
                      <td>{{sellSignal.threshold}}</td>
                      <td>
                        <button type="button" v-on:click="clearSelectedSellSignal(sellSignalIndex)">
                          <font-awesome-icon icon="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="sellSignals.length === 0">
                  <p>{{selectSellSignalWarning}}</p>
                </div>
              </div>
            </div>
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
      <div class="startTabTradingData" v-if="showTradingData">
        <div class="startTabTradingDataContent">
          <div class="tradingDataTable table-responsive table-scroll">
            <table class="table table-striped mb-0">
              <thead>
              <tr>
                <th scope="col" v-for="timeSeriesTableColumn in timeSeriesTableColumns" :key="timeSeriesTableColumn">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./StartTab.ts"></script>
<style scoped lang="less" src="./StartTab.less"></style>
