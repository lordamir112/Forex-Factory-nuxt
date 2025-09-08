
import { ref } from "vue"
import { useAbortableFetch } from "./useAbortableFetch"

export function useEmployees() {
  const { doFetch, throttledFetch, abort } = useAbortableFetch()

  const employees = ref<any[]>([])
  const total = ref(0)
  const loading = ref(false)

  // pagination state
  const limit = ref(10)
  const skip = ref(0)
  const currentPage = ref(1)

  // fetch employees
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

  // search employees
  function searchEmployees(query: string) {
    if (!query) return loadEmployees()

    loading.value = true
    throttledFetch(
      `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}&limit=${limit.value}&skip=${skip.value}`,
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

  // create employee (optimistic UI)
  async function createEmployee(payload: any) {
    const tempId = Date.now()
    const optimisticUser = { id: tempId, ...payload }

    // optimistic insert
    employees.value.unshift(optimisticUser)
    total.value++

    try {
      const data = await doFetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      // replace temp user with server response
      employees.value = employees.value.map((u) =>
        u.id === tempId ? data : u
      )
      return data
    } catch (err) {
      // rollback
      employees.value = employees.value.filter((u) => u.id !== tempId)
      total.value--
      throw err
    }
  }

  // update employee (optimistic UI)
  async function updateEmployee(id: number, payload: any) {
    const oldUser = employees.value.find((u) => u.id === id)
    if (!oldUser) return

    const backup = { ...oldUser }
    Object.assign(oldUser, payload)

    try {
      const data = await doFetch(`https://dummyjson.com/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      Object.assign(oldUser, data)
      return data
    } catch (err) {
      // rollback
      Object.assign(oldUser, backup)
      throw err
    }
  }

  // delete employee
  async function deleteEmployee(id: number) {
    const backup = [...employees.value]
    employees.value = employees.value.filter((u) => u.id !== id)
    total.value--

    try {
      await doFetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" })
    } catch (err) {
      employees.value = backup
      total.value++
      throw err
    }
  }

  // pagination helpers
  function goToPage(page: number) {
    currentPage.value = page
    skip.value = (page - 1) * limit.value
    loadEmployees()
  }

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
    createEmployee,
    updateEmployee,
    deleteEmployee,
    goToPage,
    totalPages,
    abort,
  }
}
