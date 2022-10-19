import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faXmark, faHourglassStart, faPercent, faChessQueen, faRobot, faCogs, faHandHoldingDollar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCreditCard } from '@fortawesome/free-regular-svg-icons'

library.add(faPlus, faXmark, faHourglassStart, faPercent, faChessQueen, faRobot, faCogs, faHandHoldingDollar, faCreditCard, faTrash)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
