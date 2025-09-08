<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
    <!-- Name -->
    <div>
      <label class="block text-sm font-medium mb-1">Name</label>
      <input
        v-model="values.name"
        type="text"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input
        v-model="values.email"
        type="email"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
    </div>

    <!-- Department -->
    <div>
      <label class="block text-sm font-medium mb-1">Department</label>
      <input
        v-model="values.department"
        type="text"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <p v-if="errors.department" class="text-red-500 text-sm mt-1">{{ errors.department }}</p>
    </div>

    <!-- Title -->
    <div>
      <label class="block text-sm font-medium mb-1">Title</label>
      <input
        v-model="values.title"
        type="text"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
    </div>

    <!-- Hire Date -->
    <div>
      <label class="block text-sm font-medium mb-1">Hire Date</label>
      <input
        v-model="values.hireDate"
        type="date"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <p v-if="errors.hireDate" class="text-red-500 text-sm mt-1">{{ errors.hireDate }}</p>
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium mb-1">Status</label>
      <select
        v-model="values.status"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
    </div>

    <button
      type="submit"
      :disabled="submitting"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 mt-4"
    >
      {{ submitLabel }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue"
import * as yup from "yup"

const props = defineProps<{
  initial?: any
  submitLabel?: string
}>()

const emit = defineEmits(["submit"])

// Yup validation schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  department: yup.string().required("Department is required"),
  title: yup.string(),
  hireDate: yup.date().nullable(),
  status: yup.string().oneOf(["active", "inactive"]).required("Status is required"),
})

// Reactive form values
const values = reactive({
  name: props.initial?.name || "",
  email: props.initial?.email || "",
  department: props.initial?.department || "",
  title: props.initial?.title || "",
  hireDate: props.initial?.hireDate || "",
  status: props.initial?.status || "active",
})

// Errors object
const errors = reactive<any>({})

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    await schema.validate(values, { abortEarly: false })
    emit("submit", { ...values })
  } catch (err: any) {
    if (err.inner) {
      err.inner.forEach((e: any) => {
        errors[e.path] = e.message
      })
    }
  } finally {
    submitting.value = false
  }
}
</script>
