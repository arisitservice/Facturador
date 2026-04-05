<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui';
import type { output } from 'zod';

import { email, object, string } from 'zod';

import type { ApiError } from '~/types/facturador/api';

definePageMeta({
  layout: 'login',
  name: 'signup',
});

const authStore = useAuthStore();
const { signUp } = authStore;
const { isLoading, isAuthenticated } = storeToRefs(authStore);
const toast = useToast();
const apiErrors = ref<ApiError[]>();

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo({ name: 'nova-dashboard' });
  }
});

const fields = ref<AuthFormField[]>([
  { name: 'tenantName', type: 'text', label: 'Tenant name', placeholder: 'Enter your tenant name', required: true },
  { name: 'company', type: 'text', label: 'Company', placeholder: 'Enter your company name', required: true },
  { name: 'username', type: 'text', label: 'Username', placeholder: 'Enter your username', required: true },
  { name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
  { name: 'password', type: 'password', label: 'Password', placeholder: 'Enter your password', required: true },
  { name: 'confirmPassword', type: 'password', label: 'Confirm password', placeholder: 'Confirm your password', required: true },
]);

const schema = object({
  tenantName: string().min(2, 'Tenant name must be at least 2 characters'),
  company: string().min(2, 'Company must be at least 2 characters'),
  username: string().min(3, 'Username must be at least 3 characters'),
  email: email('Invalid email address'),
  password: string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Schema = output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const { tenantName, company, username, email, password } = event.data;
    const payload = {
      tenant: { name: tenantName, company },
      owner: { username, email, password },
    };
    const response = await signUp(payload);

    if (!response.isSuccess && response.errors) {
      apiErrors.value = response.errors;
      return;
    }

    toast.add({
      title: 'Account created!',
      description: 'You can now sign in.',
      color: 'success',
    });
    navigateTo({ name: 'login' });
  }
  catch {
    apiErrors.value?.push({ property: 'unknown', errorMessage: 'An unexpected error occurred. Please try again.' });
  }
}
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :loading="isLoading"
    :submit="{ label: 'Create account' }"
    title="Create your account"
    icon="i-lucide-user-plus"
    @submit="onSubmit"
  >
    <template #description>
      Already have an account? <ULink
        to="/login"
        class="text-primary font-medium"
      >
        Sign in
      </ULink>.
    </template>

    <template #validation>
      <UAlert
        v-if="apiErrors?.length"
        color="error"
        icon="i-lucide-info"
        title="Please fix the following errors:"
      >
        <template #description>
          <ul class="list-disc pl-4 mt-1 space-y-0.5">
            <li
              v-for="error in apiErrors"
              :key="error.errorMessage"
            >
              {{ error.errorMessage }}
            </li>
          </ul>
        </template>
      </UAlert>
    </template>

    <template #footer>
      By creating an account, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
      >
        Terms of Service
      </ULink>.
    </template>
  </UAuthForm>
</template>
