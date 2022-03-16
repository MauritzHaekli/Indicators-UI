import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class StatisticsTab extends Vue {
  msg!: string
}
