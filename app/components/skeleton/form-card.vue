<script setup lang="ts">
const props = withDefaults(defineProps<{
  fieldCount?: number;
}>(), {
  fieldCount: 5,
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="i in props.fieldCount"
      :key="i"
      class="flex flex-col gap-1.5"
    >
      <USkeleton class="h-4 w-24 rounded-md" />
      <USkeleton class="h-8 w-full rounded-md" />
    </div>
  </div>
</template>
