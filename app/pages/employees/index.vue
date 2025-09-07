<template>
  <div>
    <EmployeeTable :items="items"  @delete-user="deleteUser" />
  </div>
</template>

<script setup lang="ts">
import EmployeeTable from '../../../components/EmployeeTable.vue'
import { ref, watch } from 'vue'
import api from '../../../composables/axios'

const items = ref([])

const getData = async () => {
  try {
    const response = await api.get('users')
    console.log('response.data.users', response.data.users)
    items.value = response.data.users
  } catch (e) {
    console.error(e)
  }
}

const deleteUser = async (userId: string) => {
  alert("asds")
  console.log('first', userId)
  try {
    await api.delete(`users/${userId}`)
    items.value = items.value.filter((user) => user.id !== userId)
  } catch (e) {
    console.error(e)
  }
}


getData()
</script>

<style>
.cont {
	background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));
;
}
</style>