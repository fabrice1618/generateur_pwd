import { defineStore } from 'pinia'

export const useLoaderStore = defineStore('loader', {
  state: () => ({
    visible: false as boolean,
  }),
  actions: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    toggle() {
      this.visible = !this.visible
    }
  }
})

export default useLoaderStore
