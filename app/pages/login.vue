<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui';

import { z } from 'zod';

definePageMeta({
  layout: 'login',
});

const fields = ref<AuthFormField[]>([
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
]);

const schema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type Schema = z.output<typeof schema>;
const error = false;
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log(payload.data);
}
</script>

<template>
  <main class="grid h-dvh place-items-center">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Login"
        class="max-w-md"
        @submit="onSubmit"
      >
        <template #validation>
          <UAlert
            v-if="error"
            color="error"
            icon="i-lucide-info"
            title="Error signing in"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </main>
</template>
