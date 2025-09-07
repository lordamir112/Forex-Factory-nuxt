<template>
  <div>
    <EmployeeTable :items="items" />
  </div>
</template>

<script setup lang="ts">
import EmployeeTable from '../../../components/EmployeeTable.vue'
import { ref, watch } from 'vue'
const items = ref([])

const config = useRuntimeConfig()
fetch(config.public.apiBase)
.then(res => res.json())
.then(data => {
  items.value = data.users
  console.log (data.users)
});

</script>

<style>
.cont {
	background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));
;
}
</style>