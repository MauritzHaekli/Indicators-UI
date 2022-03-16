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
              <option disabled value="">{{ orderSelectionText }}</option>
              <option v-for="orderType in orderTypes" :key="orderType"> {{orderType}}</option>
            </select>
          </div>
          <div class="startTabIntervalSelection">
            <select v-model="selectedInterval">
              <option disabled value="">{{ intervalSelectionText }}</option>
              <option v-for="intervalType in intervalTypes" :key="intervalType" :value="intervalType.intervalValue">{{ intervalType.intervalName }}</option>
            </select>
          </div>
          <div class="startTabDataSizeSelection">
            <select v-model="selectedDataSize">
              <option disabled value="">{{ dataSizeSelectionText }}</option>
              <option v-for="dataSize in dataSizes" :key="dataSize">{{ dataSize }}</option>
            </select>
          </div>
          <div class="startTabDecimalSelection">
            <select v-model="selectedDecimalSize">
              <option disabled value="">{{ decimalSizeSelectionText }}</option>
              <option v-for="decimalSize in decimalSizes" :key="decimalSize">{{ decimalSize }}</option>
            </select>
          </div>
        </div>
        <input placeholder="Select indicators" v-model="selectedIndicators">
        <input type="checkbox">
        <div class="startTabSelectionButton" v-on:click="this.setTimeSeriesData(selectedStocks, selectedIndicators, selectedOrder, selectedInterval, selectedDataSize, selectedDecimalSize)">
          <button type="button" >{{ startButtonText }}</button>
        </div>
      </div>
      <table class="timeSeriesTable">
        <thead>
        <tr>
          <th v-for="firstEntry in timeSeriesTableColumns" :key="firstEntry">
            {{firstEntry}}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(value, key) in timeSeriesTableStockData" :key="key">
          <td v-for="test in value" :key="test">{{test}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" src="./StartTab.ts"></script>
<style scoped lang="less" src="./StartTab.less"></style>
