
<template>
  <div class="p-6">
    <button class="mb-4 px-3 py-1 bg-gray-300 rounded" @click="router.push('/employees')">
      ← Back
    </button>

    <div v-if="employee" class="space-y-2">
      <h1 class="text-xl font-bold">{{ employee.name }}</h1>
      <p>Email: {{ employee.email }}</p>
      <p>Department: {{ employee.department }}</p>
      <p>Title: {{ employee.title }}</p>
      <p>Status: {{ employee.status }}</p>
      <p>Hire Date: {{ employee.hireDate }}</p>
    </div>
    <p v-else>Loading...</p>
  </div>
</template>


<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useEmployees } from "../../../composables/useEmployees"
import { ref, onMounted } from "vue"

const { employees } = useEmployees()
const route = useRoute()
const router = useRouter()

const employee = ref<any>(null)

onMounted(() => {
  employee.value = employees.value.find((u) => u.id == route.params.id)
})
</script>
