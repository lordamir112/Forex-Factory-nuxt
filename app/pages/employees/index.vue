
<template>
  <EmployeeTable
    :items="employees"
    :currentPage="currentPage"
    :totalPages="totalPages()"
    :limit="limit"
    :loading="loading"
    @search="handleSearch"
    @limit-change="handleLimitChange"
    @page-change="handlePageChange"
    @delete-user="handleDelete"
    @showEmployee="showEmployee"
  />
</template>

<script setup lang="ts">
import EmployeeTable from "../../../components/EmployeeTable.vue"
import { onMounted } from "vue"
import { useEmployees } from "../../../composables/useEmployees"
import { useStore } from "../../../stores/store"
import { useRouter } from "vue-router"

const router = useRouter()


const {
  employees,
  loadEmployees,
  searchEmployees,
  deleteEmployee,
  goToPage,
  loading,
  currentPage,
  totalPages,
  limit,
} = useEmployees()


const store = useStore()

console.log(store)
// initial load
onMounted(() => {
  if(store.tableOptions.searchQuery.length > 0){
    searchEmployees(store.tableOptions.searchQuery)
  }
  limit.value = store.tableOptions.limit
  goToPage(store.tableOptions.currentPage)
  loadEmployees()
}


)

// handlers from child
function handleSearch(query: string) {
  searchEmployees(query)
  
}

function handleLimitChange(newLimit: number) {
  limit.value = newLimit
  goToPage(1)
}

function handlePageChange(page: number) {
  goToPage(page)
}

function showEmployee(employee:object) 
{
  store.setEmployee(employee)
  store.setTableOptions(currentPage,limit,)
  router.push(`/employees/${employee.id}`)
}

async function handleDelete(id: number) {
  await deleteEmployee(id)
}

// onMounted(() => {
//   store.setTableOptions( options => ({
//     ...options,
//     currentPage: currentPage.value,
//     limit: limit.value,
//   }) )
// })

</script>

