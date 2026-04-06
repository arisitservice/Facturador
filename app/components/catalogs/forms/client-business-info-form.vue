<script setup lang="ts">
import { number, object, string } from 'zod';

import type { BusinessInfo } from '~/types/facturador/api/client-api';

import { useClientBusinessInfo } from '~/composables/clients/use-client-business-info';

const props = defineProps<{
  clientId: number;
  editTarget?: BusinessInfo;
}>();

const emit = defineEmits<{
  saved: [info: BusinessInfo];
  cancel: [];
}>();

const { create, update } = useClientBusinessInfo();
const taxRegimeStore = useTaxRegimeStore();
const { taxRegimes, isLoading: loadingRegimes } = storeToRefs(taxRegimeStore);
const toast = useToast();
const isSaving = ref(false);

onMounted(() => taxRegimeStore.getTaxRegimes());

const schema = object({
  businessName: string().min(3, 'Business name must be at least 3 characters'),
  taxId: string().min(10, 'Tax ID must be at least 10 characters'),
  taxRegimeId: number().min(1, 'Tax regime is required'),
  taxAddress: string().min(5, 'Tax address must be at least 5 characters'),
  postalCode: string().min(5, 'Postal code must be at least 5 characters'),
});

const state = reactive({
  businessName: props.editTarget?.businessName ?? '',
  taxId: props.editTarget?.taxId ?? '',
  taxRegimeId: props.editTarget?.taxRegimeId ?? 0,
  taxAddress: props.editTarget?.taxAddress ?? '',
  postalCode: props.editTarget?.postalCode ?? '',
});

const taxRegimeItems = computed(() =>
  taxRegimes.value.map(r => ({ label: `${r.satCode} — ${r.description}`, value: r.id })),
);

async function onSubmit() {
  isSaving.value = true;
  try {
    const response = props.editTarget
      ? await update(props.clientId, props.editTarget.id, state)
      : await create(props.clientId, state);

    if (response.isSuccess && response.payload) {
      toast.add({
        title: props.editTarget ? 'Business info updated' : 'Business info added',
        color: 'success',
        icon: 'i-lucide-check',
      });
      emit('saved', response.payload);
    }
    else {
      toast.add({ title: 'Something went wrong', color: 'error', icon: 'i-lucide-alert-circle' });
    }
  }
  finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Business Name"
      name="businessName"
      required
    >
      <UInput
        v-model="state.businessName"
        placeholder="Empresa S.A. de C.V."
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Tax ID (RFC)"
      name="taxId"
      required
    >
      <UInput
        v-model="state.taxId"
        placeholder="XAXX010101000"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Tax Regime"
      name="taxRegimeId"
      required
    >
      <USelect
        v-model="state.taxRegimeId"
        :items="taxRegimeItems"
        :loading="loadingRegimes"
        placeholder="Select a tax regime..."
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Tax Address"
      name="taxAddress"
      required
    >
      <UInput
        v-model="state.taxAddress"
        placeholder="Calle Principal 123, Col. Centro"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Postal Code"
      name="postalCode"
      required
    >
      <UInput
        v-model="state.postalCode"
        placeholder="06600"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-2 pt-2">
      <UButton
        label="Cancel"
        color="neutral"
        variant="ghost"
        type="button"
        @click="emit('cancel')"
      />
      <UButton
        :label="editTarget ? 'Save changes' : 'Add business info'"
        icon="i-lucide-save"
        :loading="isSaving"
        type="submit"
      />
    </div>
  </UForm>
</template>
