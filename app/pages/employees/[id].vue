<template>
  <div class="p-6">
    <button
      class="mb-4 px-3 py-1 bg-gray-300 rounded"
      @click="router.push('/employees')"
    >
      ← Back
    </button>

    <div v-if="employee" class="space-y-2">
      <h1 class="text-xl font-bold">{{ employee.firstName }} {{ employee.lastName }}</h1>
      <p>Email: {{ employee.email }}</p>
      <p>Department: {{ employee.company?.department }}</p>
      <p>Title: {{ employee.company?.title }}</p>
      <p>Status: {{ employee.role }}</p>
      <p>Hire Date: {{ employee.birthDate }}</p>

      <button
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="router.push(`/employees/${employee.id}/edit`)"
      >
        Edit Employee
      </button>
    </div>

    <p v-else>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useStore } from "../../../stores/store"
import { onMounted } from "vue"

const route = useRoute()
const router = useRouter()
const store = useStore()
const employee = store.employee

onMounted(async () => {
  if (!employee.value || employee.value.id != route.params.id) {
    await store.fetchEmployeeById(route.params.id as string)
  }
})
</script>
