<script setup lang="ts">
import { object, string } from 'zod';

const authStore = useAuthStore();
const { user, tenant } = storeToRefs(authStore);
const toast = useToast();

const isEditing = ref(false);

const schema = object({
  username: string().min(3, 'Username must be at least 3 characters'),
  email: string().email('Invalid email address'),
  tenantName: string().min(2, 'Tenant name must be at least 2 characters'),
  company: string().min(2, 'Company must be at least 2 characters'),
});

const state = reactive({
  username: user.value?.username ?? '',
  email: user.value?.email ?? '',
  tenantName: tenant.value?.name ?? '',
  company: tenant.value?.company ?? '',
});

function onEdit() {
  state.username = user.value?.username ?? '';
  state.email = user.value?.email ?? '';
  state.tenantName = tenant.value?.name ?? '';
  state.company = tenant.value?.company ?? '';
  isEditing.value = true;
}

async function onSave() {
  // TODO: wire to update account API
  toast.add({ title: 'Account updated', color: 'success', icon: 'i-lucide-check' });
  isEditing.value = false;
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">
          Account Details
        </h2>
        <UButton
          v-if="!isEditing"
          label="Edit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="outline"
          size="sm"
          @click="onEdit"
        />
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <UAvatar
          size="xl"
          :alt="user?.username"
          icon="i-lucide-user"
        />
        <div v-if="isEditing">
          <UButton
            label="Upload photo"
            icon="i-lucide-upload"
            color="neutral"
            variant="outline"
            size="sm"
          />
          <p class="text-xs text-dimmed mt-1">
            JPG, PNG or WebP. Max 2MB.
          </p>
        </div>
        <div v-else>
          <p class="font-semibold">
            {{ user?.username }}
          </p>
          <p class="text-sm text-dimmed">
            {{ user?.email }}
          </p>
        </div>
      </div>

      <UForm
        :schema="schema"
        :state="state"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        @submit="onSave"
      >
        <UFormField
          label="Username"
          name="username"
        >
          <UInput
            v-model="state.username"
            :disabled="!isEditing"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            :disabled="!isEditing"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Tenant Name"
          name="tenantName"
        >
          <UInput
            v-model="state.tenantName"
            :disabled="!isEditing"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Company"
          name="company"
        >
          <UInput
            v-model="state.company"
            :disabled="!isEditing"
            class="w-full"
          />
        </UFormField>

        <div
          v-if="isEditing"
          class="col-span-full flex justify-end gap-2"
        >
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="isEditing = false"
          />
          <UButton
            label="Save changes"
            icon="i-lucide-save"
            type="submit"
          />
        </div>
      </UForm>
    </div>
  </UCard>
</template>
