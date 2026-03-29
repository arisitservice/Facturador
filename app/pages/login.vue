<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui';
import type { output } from 'zod';

import { email, object, string } from 'zod';

definePageMeta({
  layout: 'login',
  name: 'login',
});

const authStore = useAuthStore();
const { signIn } = authStore;
const { isAuthenticated } = storeToRefs(authStore);
const isLoading = ref(false);
// Redirect if already authenticated
onMounted(() => {
  if (isAuthenticated) {
    navigateTo({ name: 'nova-dashboard' });
  }
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

const schema = object({
  email: email('Invalid email address'),
  password: string().min(6, 'Password must be at least 6 characters long'),
});

type Schema = output<typeof schema>;
const error = ref(false);
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true;
    const response = await signIn(payload.data);

    if (!response.success) {
      error.value = true;
      // useAuthStore().setToken(response.token);
      // useAuthStore().setUser(response.user);
      return;
    }

    useRouter().push({
      name: 'nova-dashboard',
    });
  }
  catch {
    error.value = true;
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :loading="isLoading"
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
        title="Error signing in, try again"
      />
    </template>
  </UAuthForm>
</template>
