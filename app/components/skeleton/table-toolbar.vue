<script setup lang="ts">
const props = withDefaults(defineProps<{
  filterCount?: number;
}>(), {
  filterCount: 3,
});
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-1.5">
    <USkeleton class="h-8 max-w-sm w-full rounded-md" />
    <div class="flex items-center gap-1.5">
      <USkeleton
        v-for="i in props.filterCount"
        :key="i"
        class="h-8 w-24 rounded-md"
      />
    </div>
  </div>
</template>
