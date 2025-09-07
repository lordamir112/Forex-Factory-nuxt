<template>
  <div class="antialiased font-sans bg-gray h-100 p-4">
    <div class="container mx-auto">
      <div class="py-8">
        <h2 class="text-2xl font-semibold leading-tight mb-4  text-white shadow-2xl	">Employees</h2>

        <!-- Search & Page Size -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg	"
          />
          <select v-model="perPage" class="p-2 border rounded">
            <option v-for="n in [10,25,50]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <!-- Table -->
        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div class="inline-block min-w-full shadow rounded-lg overflow-hidden bg-white">
            <table class="min-w-full leading-normal table-auto shadow-2xl	">
              <thead>
                <tr class="bg-gray-100">
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    @click="sortByColumn(column.key)"
                    class="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                  >
                    {{ column.label }}
                    <span v-if="sortKey === column.key">
                      {{ sortOrder === 'asc' ? '⬆️' : '⬇️' }}
                    </span>
                  </th>
                  <th
                    class="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="item in paginatedItems"
                  :key="item.email"
                  class="hover:bg-gray-50"
                >
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.lastName }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.email }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.company.department }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.company.title }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ formatters.formatDate(item.birthDate) }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.role }}</td>
                   <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">

                    <Icon 
                      icon="mdi:delete-forever"
                      style="color: crimson; font-size: 35px; cursor: pointer;"
                      
                      @click="$emit('delete-user', item.id)"
                     />
                  </td>
                </tr>
                <tr v-if="paginatedItems.length === 0">
                  <td colspan="6" class="px-4 py-2 text-center text-gray-500">No records found</td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span class="text-xs xs:text-sm text-gray-900 mb-2 xs:mb-0">
                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredAndSortedItems.length }} Entries
              </span>
              <div class="inline-flex">
                <button
                  class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  Prev
                </button>
                <button
                  class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import formatters from '../utils/formatters' // مسیر utility تو پروژه
import { Icon } from "@iconify/vue";

const props = defineProps<{
  items: Array<{
    firstName: string
    email: string
    company: { department: string; title: string }
    birthDate: string | Date
    role: string
  }>
}>()
console.log(props.items)
const columns = [
  { key: 'lastName', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'company.department', label: 'Department' },
  { key: 'company.title', label: 'Title' },
  { key: 'birthDate', label: 'Hire Date' },
  { key: 'role', label: 'Status' },
]

// State
const searchQuery = ref('')
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const perPage = ref(10)



const sortByColumn = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Filtered, sorted & paginated
const filteredAndSortedItems = computed(() => {
  let filtered = props.items.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )

  if (!sortKey.value) return filtered

  // Use utility for nested sorting
  return formatters.sortItems(filtered, sortKey.value, sortOrder.value)
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredAndSortedItems.value.length / perPage.value))
const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
const endIndex = computed(() => Math.min(startIndex.value + perPage.value, filteredAndSortedItems.value.length))
const paginatedItems = computed(() => filteredAndSortedItems.value.slice(startIndex.value, endIndex.value))

// Reset page when search or perPage changes
watch([searchQuery, perPage], () => {
  currentPage.value = 1
})
</script>

