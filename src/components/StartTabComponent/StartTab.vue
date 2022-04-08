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
            <div class="buyingStrategyParameterSelection" v-for="buySignal in buySignals" :key="buySignal">
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
            </div>
            <div class="buyingStrategyAddButton" v-on:click="this.addTradingSignal('BuyStrategy')">
              <button type="button" >{{ buyingStrategyAddButtonText }}</button>
            </div>
          </div>
          <div class="startTabSellingStrategySelection">
            <div class="sellingStrategyHeader">
              <p>{{ sellingStrategyHeader }} </p>
            </div>
            <div class="sellingStrategyParameterSelection" v-for="sellSignal in sellSignals" :key="sellSignal">
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
            </div>
            <div class="sellingStrategyAddButton" v-on:click="this.addTradingSignal('SellStrategy')">
              <button type="button" >{{ sellingStrategyAddButtonText }}</button>
            </div>
          </div>
        </div>
        <div class="startTabSelectionButton" v-on:click="this.setTimeSeriesData(selectedStocks, selectedIndicators, selectedOrder, selectedInterval, selectedDataSize, selectedDecimalSize)">
          <button type="button" >{{ startButtonText }}</button>
        </div>
      </div>
      <div class="startTabTimeSeriesTable">
        <table >
          <tr>
            <th v-for="timeSeriesTableColumn in timeSeriesTableColumns" :key="timeSeriesTableColumn">
              {{timeSeriesTableColumn}}
            </th>
          </tr>
          <tbody>
          <tr v-for="(value, key) in timeSeriesTableStockData" :key="key">
            <td v-for="cellData in value" :key="cellData">{{cellData}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./StartTab.ts"></script>
<style scoped lang="less" src="./StartTab.less"></style>
