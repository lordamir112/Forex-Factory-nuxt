<script setup lang="ts">
import EmployeeForm from "../../../../components/EmployeeForm.vue"
import { useEmployees } from "../../../../composables/useEmployees"
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted } from "vue"

const { employees, updateEmployee } = useEmployees()
const route = useRoute()
const router = useRouter()

const employee = ref<any>(null)

onMounted(() => {
  employee.value = employees.value.find((u) => u.id == route.params.id)
})

async function handleUpdate(payload: any) {
  try {
    await updateEmployee(Number(route.params.id), payload)
    router.push("/employees")
  } catch (e) {
    alert("Failed to update employee")
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Edit Employee</h1>
    <EmployeeForm
      v-if="employee"
      :initial="employee"
      submit-label="Save"
      @submit="handleUpdate"
    />
    <p v-else>Loading...</p>
  </div>
</template>
