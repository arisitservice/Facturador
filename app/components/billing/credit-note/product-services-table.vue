<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

import type { CreditNoteProductService } from '~/lib/schemas/billing';

import { creditNoteProductServiceSchema } from '~/lib/schemas/billing';

const productServices = defineModel<CreditNoteProductService[]>({ required: true });

const isProductModalOpen = shallowRef(false);
const editingIndex = shallowRef<number | null>(null);
const isEditing = computed(() => editingIndex.value !== null);

const newProductService = ref<CreditNoteProductService>({
  detailedDescription: '',
  quantity: 0,
  unitPrice: 0,
  isTaxable: false,
  withholdingType: undefined,
});

const columns: TableColumn<CreditNoteProductService>[] = [
  { accessorKey: 'detailedDescription', header: 'Description' },
  { accessorKey: 'quantity', header: 'Qty' },
  { accessorKey: 'unitPrice', header: 'Unit Price' },
  { accessorKey: 'isTaxable', header: 'Taxable' },
  { accessorKey: 'withholdingType', header: 'Withholding' },
  { id: 'actions', header: '' },
];

function resetNewProductService() {
  newProductService.value = {
    detailedDescription: '',
    quantity: 0,
    unitPrice: 0,
    isTaxable: false,
    withholdingType: undefined,
  };
}

function onTaxableChange(v: boolean) {
  if (!v) {
    newProductService.value.withholdingType = undefined;
  }
}

function openAddModal() {
  resetNewProductService();
  editingIndex.value = null;
  isProductModalOpen.value = true;
}

function openEditModal(index: number) {
  newProductService.value = { ...productServices.value[index]! };
  editingIndex.value = index;
  isProductModalOpen.value = true;
}

function deleteProductService(index: number) {
  productServices.value.splice(index, 1);
}

function saveProductService() {
  if (editingIndex.value !== null) {
    productServices.value[editingIndex.value] = { ...newProductService.value };
  }
  else {
    productServices.value.push({ ...newProductService.value });
  }
  resetNewProductService();
  isProductModalOpen.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <UButton
        label="Add Product / Service"
        icon="i-lucide-plus"
        variant="outline"
        @click="openAddModal"
      />
    </div>
    <UTable
      :data="productServices"
      :columns="columns"
      class="flex-1"
    >
      <template #actions-cell="{ row }">
        <div class="flex gap-1 justify-end">
          <UButton
            icon="i-lucide-pencil"
            variant="ghost"
            size="xs"
            @click="openEditModal(row.index)"
          />
          <UButton
            icon="i-lucide-trash"
            variant="ghost"
            color="error"
            size="xs"
            @click="deleteProductService(row.index)"
          />
        </div>
      </template>
    </UTable>

    <UModal
      v-model:open="isProductModalOpen"
      :title="isEditing ? 'Edit Product / Service' : 'Add Product / Service'"
      description="Fill in the details and click Save to apply the changes."
    >
      <template #body>
        <UForm
          :schema="creditNoteProductServiceSchema"
          :state="newProductService"
          class="flex flex-col gap-4"
          @submit="saveProductService"
        >
          <UFormField
            label="Detailed Description"
            name="detailedDescription"
            required
          >
            <UInput
              v-model="newProductService.detailedDescription"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Quantity"
            name="quantity"
            required
          >
            <UInput
              v-model.number="newProductService.quantity"
              type="number"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Unit Price"
            name="unitPrice"
            required
          >
            <UInput
              v-model.number="newProductService.unitPrice"
              type="number"
              class="w-full"
            />
          </UFormField>
          <div class="flex w-full flex-col md:flex-row gap-4 min-h-16">
            <UFormField
              label="Is Taxable"
              name="isTaxable"
            >
              <USwitch
                v-model="newProductService.isTaxable"
                @update:model-value="onTaxableChange($event as boolean)"
              />
            </UFormField>
            <UFormField
              v-if="newProductService.isTaxable"
              label="Withholding Type"
              name="withholdingType"
            >
              <USelect
                v-model="newProductService.withholdingType"
                :items="[{ label: 'VAT', value: 'vat' }, { label: 'Income Tax', value: 'incomeTax' }]"
                class="min-w-12"
              />
            </UFormField>
          </div>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              type="button"
              @click="isProductModalOpen = false"
            />
            <UButton
              :label="isEditing ? 'Save' : 'Add'"
              type="submit"
              icon="i-lucide-check"
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
