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
  <UAuthForm
    :schema="schema"
    :fields="fields"
    title="Welcome back"
    icon="i-lucide-lock"
    @submit="onSubmit"
  >
    <template #description>
      Don't have an account? <ULink
        to="/signup"
        class="text-primary font-medium"
      >
        Sign up
      </ULink>.
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
      >
        Forgot password?
      </ULink>
    </template>

    <template #footer>
      By signing in, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
      >
        Terms of Service
      </ULink>.
    </template>
    <template #validation>
      <UAlert
        v-if="error"
        color="error"
        icon="i-lucide-info"
        title="Error signing in"
      />
    </template>
  </UAuthForm>
</template>
