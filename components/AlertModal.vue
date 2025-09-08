<!-- components/ConfirmModal.vue -->
<template>
  <Dialog :open="modelValue" @close="$emit('update:modelValue', false)">
    <DialogOverlay class="fixed inset-0 bg-black bg-opacity-50" />
    <DialogPanel class="fixed inset-0 flex items-center justify-center p-4">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <DialogTitle class="text-lg font-semibold">{{ title }}</DialogTitle>
        <DialogDescription class="text-sm text-gray-600 mb-4">{{ message }}</DialogDescription>

        <div class="flex justify-end space-x-2">
          <button
            v-if="showCancel"
            @click="$emit('cancel')"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {{ cancelText }}
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script setup>
import { Dialog, DialogOverlay, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: 'Are you sure?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  showCancel: { type: Boolean, default: true },
})
</script>
