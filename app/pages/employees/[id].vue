<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4" style="height: 100vh;">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md p-4">
      <div class="flex  justify-between">
      <Icon
          icon="mdi:arrow-back-circle"
          style="color: black; font-size: 35px; cursor: pointer;"
          title="Back to Employees"
          @click="router.push('/employees')"
        />
        <h1 class="text-xl font-bold mb-4">Employee details</h1>
      </div>
      <span style="height: 1px;width: 100%; border: 1px solid black;display: block; margin: 10px 0px;"></span>
      <!-- Employee Info -->
      <div v-if="employee" class="space-y-3 flex flex-col gap-2 ">
        <h1 class="text-2xl font-bold text-gray-800">
          {{ employee?.firstName ?? "" }} {{ employee?.lastName ?? "" }}
        </h1>

        <p class="text-gray-600"><span class="font-semibold">Email:</span> {{ employee?.email ?? "no data" }}</p>
        <p class="text-gray-600"><span class="font-semibold">Department:</span> {{ employee?.company?.department ?? "no data" }}</p>
        <p class="text-gray-600"><span class="font-semibold">Title:</span> {{ employee?.company?.title ?? "no data" }}</p>
        <p class="text-gray-600"><span class="font-semibold">Status:</span> {{ employee?.role ?? "no data" }}</p>
        <p class="text-gray-600"><span class="font-semibold">Hire Date:</span> {{ employee?.birthDate ?? "no data" }}</p>

        <!-- Edit Button -->
        <button
          class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          @click="router.push(`/employees/${employee?.id}/edit`)"
        >
          Edit Employee
        </button>
      </div>

      <p v-else class="text-gray-500 text-center">Loading...</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useStore } from "../../../stores/store"
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const employee = store.employee


</script>
