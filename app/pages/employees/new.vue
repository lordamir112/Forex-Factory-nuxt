
<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">New Employee</h1>
    <EmployeeForm submit-label="Create" @submit="handleCreate" :loading="loading" />
    <ConfirmModal
    v-model="openModal"
    title="Create employee"
    :message="alertMessage"
    :show-cancel="false"
     @confirm="openModal = false"
  />
  </div>
</template>

<script setup lang="ts">
import EmployeeForm from "../../../components/EmployeeForm.vue"
import { useEmployees } from "../../../composables/useEmployees"
import ConfirmModal from "../../../components/AlertModal.vue"

const { createEmployee,loading } = useEmployees()
const openModal = ref(false)
const alertMessage = ref("test")

async function handleCreate(payload: any) {
  try {
    await createEmployee(payload).then(() => 
    {
      openModal.value = true
      alertMessage.value = "Employee created successfully"
    })
  } catch (e) {
      openModal.value = true
      alertMessage.value = "Failed to create employee"
  }
}
</script>


