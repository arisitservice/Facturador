<script setup lang="ts">
definePageMeta({
  name: 'nova-account',
});

const businessInfoStore = useBusinessInfoStore();

await useAsyncData('account-business-info', () => businessInfoStore.fetchBusinessInfoList(), {
  immediate: !businessInfoStore.businessInfoList.length,
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
    <AccountDetailsCard />
    <AccountBusinessInfoList />
  </div>
</template>
