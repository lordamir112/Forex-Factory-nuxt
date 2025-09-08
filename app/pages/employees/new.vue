<script setup lang="ts">
import EmployeeForm from "../../../components/EmployeeForm.vue"
import { useEmployees } from "../../../composables/useEmployees"
import { useRouter } from "vue-router"

const { createEmployee } = useEmployees()
const router = useRouter()

async function handleCreate(payload: any) {
  try {
    await createEmployee(payload).then(() => 
    {
        alert("Employee created successfully")
    })
    router.push("/employees")
  } catch (e) {
    alert("Failed to create employee")
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">New Employee</h1>
    <EmployeeForm submit-label="Create" @submit="handleCreate" />
  </div>
</template>
