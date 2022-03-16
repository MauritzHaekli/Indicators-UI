import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class StrategyTab extends Vue {
  msg!: string
}
