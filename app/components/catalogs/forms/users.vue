<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

import type { NewUser } from '~/lib/schemas/catalogs';

import { newUserSchema } from '~/lib/schemas/catalogs';

const { isAddNewRecordSlideoverOpen } = useDashboard();

const state = ref<NewUser>({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  roleId: undefined,
  canReview: false,
  canApprove: false,
  canEdit: false,
  canDelete: false,
  canDownload: false,
  accessApp: false,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<NewUser>) {
  toast.add({ title: 'Success', description: `New user ${event.data.name} added`, color: 'success' });
  isAddNewRecordSlideoverOpen.value = false;
}
</script>

<template>
  <UForm
    :schema="newUserSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Name"
      placeholder="John Doe"
      name="name"
      required
    >
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <UFormField
      label="Email"
      placeholder="john@example.com"
      name="email"
      required
    >
      <UInput
        v-model="state.email"
        type="email"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Password"
      placeholder="••••••••"
      name="password"
      required
    >
      <UInput
        v-model="state.password"
        type="password"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Confirm Password"
      placeholder="••••••••"
      name="passwordConfirm"
      required
    >
      <UInput
        v-model="state.passwordConfirm"
        type="password"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Role"
      placeholder="Select role"
      name="roleId"
    >
      <UInput
        v-model="state.roleId"
        type="number"
        class="w-full"
      />
    </UFormField>

    <div class="space-y-2">
      <p class="text-sm font-medium">
        Permissions
      </p>
      <div class="grid grid-cols-2 gap-2">
        <UCheckbox
          v-model="state.canReview"
          label="Can Review"
          name="canReview"
        />
        <UCheckbox
          v-model="state.canApprove"
          label="Can Approve"
          name="canApprove"
        />
        <UCheckbox
          v-model="state.canEdit"
          label="Can Edit"
          name="canEdit"
        />
        <UCheckbox
          v-model="state.canDelete"
          label="Can Delete"
          name="canDelete"
        />
        <UCheckbox
          v-model="state.canDownload"
          label="Can Download"
          name="canDownload"
        />
        <UCheckbox
          v-model="state.accessApp"
          label="Access App"
          name="accessApp"
        />
      </div>
    </div>

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
