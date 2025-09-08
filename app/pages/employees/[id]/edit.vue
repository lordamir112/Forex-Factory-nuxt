<script setup lang="ts">
import EmployeeForm from "../../../../components/EmployeeForm.vue"
import { useStore } from "../../../../stores/store"
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted } from "vue"

const route = useRoute()
const router = useRouter()
const store = useStore()

const employee = ref<any | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  if (!store.selected || Number(store.selected.id) !== id) {
    try {
      await store.selectEmployee(id)
    } catch (e) {
      console.error("Failed to fetch selected employee:", e)
    }
  }
  employee.value = store.selected
})

async function handleUpdate(payload: any) {
  try {
    await store.updateEmployee(Number(route.params.id), payload)
    router.push("/employees")
  } catch (e) {
    alert("Failed to update employee")
  }
}
</script>

<template>
  <div class="p-6">
    <button class="mb-4 px-3 py-1 bg-gray-300 rounded" @click="router.push('/employees')">
      ← Back to List
    </button>

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
