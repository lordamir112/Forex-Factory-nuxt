<template>
  <div class="p-6">
    <EmployeeForm
      v-if="employee"
      :initial="employee"
      submit-label="Save"
      @submit="handleUpdate"
      :loading="loading"
      title="Edit Employee"
    />
    <ConfirmModal
        v-model="openModal"
        title="Edit employee"
        :message="alertMessage"
        :show-cancel="false"
        @confirm="openModal = false"
      />
  </div>
</template>

<script setup lang="ts">
import EmployeeForm from "../../../../components/EmployeeForm.vue"
import { useStore } from "../../../../stores/store"
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import { useEmployees } from "~~/composables/useEmployees"
const { updateEmployee ,loading } = useEmployees()
import ConfirmModal from "../../../../components/AlertModal.vue"


const route = useRoute()
const router = useRouter()
const store = useStore()
const openModal = ref(false)
const alertMessage = ref("")
const employee = store.employee


async function handleUpdate(payload: any) {

  const body = {
    ...payload,
    firstName : payload.name,
    role: payload.status,
    company: {
      department: payload.department,
      title: payload.title
    },
  }
  try {
    await updateEmployee(store.employee.id, body).then(() => 
    {
      openModal.value = true
      alertMessage.value = "Employee edited successfully"
    })
  } catch (e) {
      openModal.value = true
      alertMessage.value = "Failed to edit employee"
  }
}

</script>

<
