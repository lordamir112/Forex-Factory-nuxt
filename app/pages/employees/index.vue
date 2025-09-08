
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
  />
</template>

<script setup lang="ts">
import EmployeeTable from "../../../components/EmployeeTable.vue"
import { onMounted } from "vue"
import { useEmployees } from "../../../composables/useEmployees"

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


// initial load
onMounted(() => loadEmployees())

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

async function handleDelete(id: number) {
  await deleteEmployee(id)
}

</script>

