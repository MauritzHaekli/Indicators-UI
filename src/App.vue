<template>
  <div id="view">
    <div class="sideBar">
      <div class="sideBarMenu">
        <div class="sideBarTab" v-for="sideBarTab in this.sideBarTabs" :key="sideBarTab"
             v-on:click="this.setActiveTab(sideBarTab)"
             v-bind:class="{ selected: sideBarTab.showTab, hovered: sideBarTab.hovered}"
             v-on:mouseover="this.setHover(sideBarTab)"
             v-on:mouseleave="this.setHover(sideBarTab)">
          <div class="sideBarTabContent">
            <i v-bind:class="sideBarTab.iconName"></i>
            <div class="sideBarTabLabel">{{ sideBarTab.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tabContent">
      <StartTab v-if="this.sideBarTabs[0].showTab" />
      <StatisticsTab v-if="this.sideBarTabs[1].showTab" />
      <StrategyTab v-if="this.sideBarTabs[2].showTab" />
      <ConfigTab v-if="this.sideBarTabs[3].showTab" />
      <SettingsTab v-if="this.sideBarTabs[4].showTab" />
    </div>
  </div>
</template>

<script lang="ts" src="./AppScript.ts"></script>
<style lang="less" src="./AppStyle.less"></style>
