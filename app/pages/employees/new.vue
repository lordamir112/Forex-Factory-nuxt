
<template>
  <div class="p-6">
    <EmployeeForm 
    submit-label="Create" 
    @submit="handleCreate" 
    title="Create Employee"
    :loading="loading" />

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
const alertMessage = ref("")

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


