<template>
  <div class="antialiased font-sans bg-gray h-100 p-4">
    <div class="container mx-auto">
      <div class="py-8">
        <h2 class="text-2xl font-semibold leading-tight mb-4 text-white shadow-2xl">
          Employees
        </h2>
        <!-- Search & Page Size -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 px-5">
          <input
            v-model="localSearch"
            type="text"
            placeholder="Search..."
            class="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
          <h1 class="text-center text-xl font-bold mb-4"> Employees List </h1>
          <div class="flex items-center gap-2">
            <Icon 
              v-if="selectedIds.length > 0"
              icon="mdi:delete-forever"
              style="color: crimson; font-size: 35px; cursor: pointer;"
              @click="openDelete(selectedIds)"
              />
            <Icon
              icon="mdi:add-circle"
              style="color: green; font-size: 35px; cursor: pointer;"
              title="Add Employee"
              @click="router.push('/employees/new')"
          />
          <select v-model="localLimit" class="p-2 border rounded">
            <option v-for="n in [10,25,50]" :key="n" :value="n">{{ n }}</option>
          </select>
          </div>
        </div>
        <!-- Table -->
        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div class="inline-block min-w-full shadow rounded-lg overflow-hidden bg-white">
            <table class="min-w-full leading-normal table-auto shadow-2xl">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                  </th>
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
                  <th class="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in sortedItems" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">
                    <input type="checkbox" :value="item.id" v-model="selectedIds" />
                  </td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.lastName }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.email }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.company.department }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.company.title }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ formatters.formatDate(item.birthDate) }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{{ item.role }}</td>
                  <td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700 flex gap-2">
                    <Icon
                      icon="mdi:delete-forever"
                      style="color: crimson; font-size: 35px; cursor: pointer;"
                      @click="openDelete([item.id])"
                    />
                    <Icon
                    icon="mdi:eye-circle"
                    style="color: dodgerblue; font-size: 30px; cursor: pointer;"
                    title="View employee"
                    @click="emit('showEmployee', item)"
                  />
                  </td>
                </tr>
                <tr v-if="!items.length && !props.loading">
                  <td colspan="7" class="px-4 py-2 text-center text-gray-500">No records found</td>
                </tr>
                <tr v-if="props.loading">
                  <td colspan="7" class="px-4 py-2 text-center text-gray-500"><LoadingSpinner/></td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between gap-2">
              <span class="text-xs xs:text-sm text-gray-900 mb-2 xs:mb-0">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <div class="inline-flex items-center gap-2">
                <button
                  class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50"
                  :disabled="currentPage === 1"
                  @click="$emit('page-change', currentPage - 1)"
                >
                  Prev
                </button>
                <button
                  class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50"
                  :disabled="currentPage === totalPages"
                  @click="$emit('page-change', currentPage + 1)"
                >
                  Next
                </button>

                <!-- Go to page input -->
                <input
                  type="number"
                  min="1"
                  :max="totalPages"
                  v-model.number="jumpPage"
                  @keydown.enter="goToPage"
                  placeholder="page"
                  class="p-2 border rounded w-50 ml-2"/>
                <button
                  class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 ml-1  "
                  @click="goToPage">
                  Go
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
 <ConfirmModal
    v-model="openModal"
    :title="`Delete employee${deleteIds.length > 1 ? 's' : ''}`"
    :message="`Are you sure you want to delete ${deleteIds.length > 1 ? 'these employees' : 'this employee'}?`"
    @confirm="handleDelete"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, watch,computed } from "vue"
import { Icon } from "@iconify/vue"
import formatters from "../utils/formatters"
import { useRouter } from "vue-router"
import LoadingSpinner from "./LoadingSpinner.vue"
import ConfirmModal from "./AlertModal.vue"
import { useStore } from "../stores/store"

const store = useStore()
const router = useRouter()

const columns = [
  { key: "lastName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "company.department", label: "Department" },
  { key: "company.title", label: "Title" },
  { key: "birthDate", label: "Hire Date" },
  { key: "role", label: "Status" },
]

const props = defineProps<{
  items: any[]
  currentPage: number
  totalPages: number
  limit: number
  loading: boolean
}>()

const emit = defineEmits(["search", "limit-change", "page-change", "delete-user", "showEmployee"])

const openModal = ref(false)
const jumpPage = ref<number | null>(null)
const deleteIds = ref<number[]>([])
const selectAll = ref(false)
const selectedIds = ref<number[]>([])
const localSearch = ref('')
const localLimit = ref(props.limit || 10)
const sortKey = ref("")
const sortOrder = ref<"asc" | "desc">("asc")

function toggleSelectAll() {
  if (selectAll.value) {
    selectedIds.value = props.items.map(item => item.id)
  } else {
    selectedIds.value = []
  }
}

function goToPage() {
  if (!jumpPage.value) return
  const page = Math.min(Math.max(jumpPage.value, 1), props.totalPages)
  emit('page-change', page)
  jumpPage.value = null
}

function handleDelete() {
  if (deleteIds.value.length > 0) 
  {
    deleteIds.value.forEach((id) => {
      emit('delete-user', id)
    })
    deleteIds.value = []
    selectedIds.value = []
    selectAll.value = false
  }
  openModal.value = false
}

function handleCancel() {
  openModal.value = false
}

function openDelete(ids: number[]) {
  console.log(ids)
  deleteIds.value = ids
  openModal.value = true
}

function sortByColumn(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortKey.value = key
    sortOrder.value = "asc"
  }
}

const sortedItems = computed(() => {
  if (!sortKey.value) return props.items

  const keys = sortKey.value.split(".") // برای key های nested مثل company.department
  return [...props.items].sort((a, b) => {
    let valA = a
    let valB = b

    keys.forEach(k => {
      valA = valA?.[k]
      valB = valB?.[k]
    })

    if (valA == null) return 1
    if (valB == null) return -1

    if (typeof valA === "string") valA = valA.toLowerCase()
    if (typeof valB === "string") valB = valB.toLowerCase()

    if (valA < valB) return sortOrder.value === "asc" ? -1 : 1
    if (valA > valB) return sortOrder.value === "asc" ? 1 : -1
    return 0
  })
})

// search sync
watch(localSearch, (val) => 
{
  store.setSearchQuery(localSearch.value)
  emit("search", val)
}
)
// limit sync
watch(localLimit, (val) =>emit("limit-change", val))

watch(() => props.items, () => {
  selectAll.value = false
  selectedIds.value = []
})

onMounted(() => {
localSearch.value = store.tableOptions.searchQuery
})



</script>
