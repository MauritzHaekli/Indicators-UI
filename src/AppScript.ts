import { Options, Vue } from 'vue-class-component'
import { SideBarTab } from './assets/types'
import StartTab from './components/StartTabComponent/StartTab.vue'
import ConfigTab from './components/ConfigTabComponent/ConfigTab.vue'
import SettingsTab from './components/SettingsTabComponent/SettingsTab.vue'
import StatisticsTab from './components/StatisticsTabComponent/StatisticsTab.vue'
import StrategyTab from './components/StrategyTabComponent/StrategyTab.vue'

@Options({
  components: {
    StartTab: StartTab,
    ConfigTab: ConfigTab,
    SettingsTab: SettingsTab,
    StatisticsTab: StatisticsTab,
    StrategyTab: StrategyTab
  },
  data () {
    return {
      sideBarTabs: [
        { name: 'startTab', label: 'Start', showTab: true, hovered: false, iconName: 'fa-solid fa-hourglass-start' },
        { name: 'statisticsTab', label: 'Statistics', showTab: false, hovered: false, iconName: 'fa-solid fa-percent' },
        { name: 'strategyTab', label: 'Strategy', showTab: false, hovered: false, iconName: 'fa-solid fa-chess-queen' },
        { name: 'configTab', label: 'Config', showTab: false, hovered: false, iconName: 'fa-solid fa-robot' },
        { name: 'settingsTab', label: 'Settings', showTab: false, hovered: false, iconName: 'fa-solid fa-cogs' }
      ]
    }
  },
  methods: {
    setActiveTab (selectedTab: SideBarTab) {
      this.sideBarTabs.forEach(function (sideBarTab: SideBarTab) {
        sideBarTab.showTab = sideBarTab.name === selectedTab.name
      })
    },
    setHover (sideBarTab: SideBarTab) {
      sideBarTab.hovered = !sideBarTab.hovered
    }
  }
})
export default class App extends Vue {}
