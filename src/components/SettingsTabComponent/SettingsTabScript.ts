import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class SettingsTab extends Vue {
  msg!: string
}
