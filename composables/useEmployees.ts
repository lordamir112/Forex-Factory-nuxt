// composables/useEmployees.ts
import { ref } from "vue"
import { useAbortableFetch } from "./useAbortableFetch"

export function useEmployees() {
  const { doFetch, throttledFetch, abort } = useAbortableFetch()

  const employees = ref<any[]>([])
  const total = ref(0)
  const loading = ref(false)

  // pagination state
  const limit = ref(10)   // rows per page
  const skip = ref(0)     // offset
  const currentPage = ref(1)

  // fetch employees with pagination
  async function loadEmployees() {
    loading.value = true
    try {
      const data = await doFetch(
        `https://dummyjson.com/users?limit=${limit.value}&skip=${skip.value}`
      )
      employees.value = data.users
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  // search employees (throttled)
  function searchEmployees(query: string) {
    if (!query) {
      return loadEmployees()
    }

    loading.value = true
    throttledFetch(
      `https://dummyjson.com/users/search?q=${encodeURIComponent(
        query
      )}&limit=${limit.value}&skip=${skip.value}`,
      {},
      (data) => {
        employees.value = data.users
        total.value = data.total
        loading.value = false
      },
      (err) => {
        console.error("Search error:", err)
        loading.value = false
      }
    )
  }

  // delete employee
  async function deleteEmployee(id: number) {
    await doFetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" })
    employees.value = employees.value.filter((u) => u.id !== id)
    total.value--
  }

  // go to specific page
  function goToPage(page: number) {
    currentPage.value = page
    skip.value = (page - 1) * limit.value
    loadEmployees()
  }

  // computed total pages
  function totalPages() {
    return Math.ceil(total.value / limit.value)
  }

  return {
    employees,
    total,
    limit,
    skip,
    currentPage,
    loading,
    loadEmployees,
    searchEmployees,
    deleteEmployee,
    goToPage,
    totalPages,
    abort,
  }
}
