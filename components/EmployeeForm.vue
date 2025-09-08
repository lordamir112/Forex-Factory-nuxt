<template>
  <form @submit.prevent="onSubmit" class="space-y-4 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
    <!-- Back Icon -->
    <div class="flex  justify-between">
      <Icon
          icon="mdi:arrow-back-circle"
          style="color: black; font-size: 35px; cursor: pointer;"
          title="Back to Employees"
          @click="router.push(route)"
        />
        <h1 class="text-xl font-bold mb-4">{{title}}</h1>
    </div>
    <!-- Name -->
    <div>
      <label class="block text-sm font-medium mb-1">Name</label>
      <Field
        name="name"
        as="input"
        type="text"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <Field
        name="email"
        as="input"
        type="email"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Department -->
    <div>
      <label class="block text-sm font-medium mb-1">Department</label>
      <Field
        name="department"
        as="input"
        type="text"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ErrorMessage name="department" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Title -->
    <div>
      <label class="block text-sm font-medium mb-1">Title</label>
      <Field
        name="title"
        as="input"
        type="text"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ErrorMessage name="title" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Hire Date -->
    <div>
      <label class="block text-sm font-medium mb-1">Hire Date</label>
      <Field
        name="hireDate"
        as="input"
        type="date"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ErrorMessage name="hireDate" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium mb-1">Status</label>
      <Field
        name="status"
        as="input"
        type="text"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <ErrorMessage name="status" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 flex justify-center items-center gap-2 space-x-2 hover:bg-blue-700"
    >
      {{ submitLabel }}
    <LoadingSpinner  v-if="props.loading" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import LoadingSpinner from "./LoadingSpinner.vue"
import formatters from '~~/utils/formatters'

const router = useRouter()

const props = defineProps<{
  initial?: any
  submitLabel?: string
  loading?: boolean
  title?: string
  route: string,
}>()

const emit = defineEmits(['submit'])

const { handleSubmit,  } = useForm({
  validateOnMount: false,
  initialValues: {
    name: props.initial?.lastName || '',
    email: props.initial?.email || '',
    department: props.initial?.company?.department || '',
    title: props.initial?.company?.title || '',
    hireDate: formatters.formFormatDate(props.initial?.birthDate) || '2025-09-10',
    status: props.initial?.role || '',
  },
  validationSchema: yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    department: yup.string().required('Department is required'),
    title: yup.string(),
    hireDate: yup.date().nullable(),
    status: yup.string(),
  }),
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>
