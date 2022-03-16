import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class ConfigTab extends Vue {
  msg!: string
}
