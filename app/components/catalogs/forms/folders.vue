<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

import type { NewFolder } from '~/lib/schemas/catalogs';

import { newFolderSchema } from '~/lib/schemas/catalogs';

const { isAddNewRecordSlideoverOpen } = useDashboard();

const state = ref<NewFolder>({
  name: '',
  sectionId: 0,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<NewFolder>) {
  toast.add({ title: 'Success', description: `New folder ${event.data.name} added`, color: 'success' });
  isAddNewRecordSlideoverOpen.value = false;
}
</script>

<template>
  <UForm
    :schema="newFolderSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Name"
      placeholder="Folder name"
      name="name"
      required
    >
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <UFormField
      label="Section"
      placeholder="Select section"
      name="sectionId"
      required
    >
      <UInput
        v-model="state.sectionId"
        type="number"
        class="w-full"
      />
    </UFormField>
    <div class="flex justify-end gap-2">
      <UButton
        label="Cancel"
        color="neutral"
        variant="subtle"
        @click="isAddNewRecordSlideoverOpen = false"
      />
      <UButton
        label="Create"
        color="primary"
        variant="solid"
        type="submit"
      />
    </div>
  </UForm>
</template>
