import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    employee: {
      id: null,
      first_name: '',
      last_name: '',
      title: '',
    } as object,
    tableOptions: 
    {
      currentPage: 1,
      limit: 10,
      searchQuery: ''
    }
  }),

  actions: {
    setEmployee(data: object) {
      this.employee = data

    }
    , 
    setTableOptions(currentPage: number, limit: number ,) {
      this.tableOptions.currentPage = currentPage
      this.tableOptions.limit = limit
    },
    setSearchQuery(query: string) {
      this.tableOptions.searchQuery = query
    }
  },
  persist: true
})
