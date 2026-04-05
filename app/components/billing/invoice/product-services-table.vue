<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

import type { ProductService } from '~/lib/schemas/billing';

import { productServiceSchema } from '~/lib/schemas/billing';

const productServices = defineModel<ProductService[]>({ required: true });

const isProductModalOpen = shallowRef(false);
const editingIndex = shallowRef<number | null>(null);
const isEditing = computed(() => editingIndex.value !== null);

const newProductService = ref<ProductService>({
  detailedDescription: '',
  productServiceId: 0,
  measureUnitId: 0,
  quantity: 0,
  unitPrice: 0,
});

const columns: TableColumn<ProductService>[] = [
  { accessorKey: 'detailedDescription', header: 'Description' },
  { accessorKey: 'productServiceId', header: 'Product/Service' },
  { accessorKey: 'measureUnitId', header: 'Unit' },
  { accessorKey: 'quantity', header: 'Qty' },
  { accessorKey: 'unitPrice', header: 'Unit Price' },
  { id: 'actions', header: '' },
];

function resetNewProductService() {
  newProductService.value = {
    detailedDescription: '',
    productServiceId: 0,
    measureUnitId: 0,
    quantity: 0,
    unitPrice: 0,
  };
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
          :schema="productServiceSchema"
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
            label="Product/Service"
            name="productServiceId"
            required
          >
            <UInput
              v-model.number="newProductService.productServiceId"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Measure unit"
            name="measureUnitId"
            required
          >
            <UInput
              v-model.number="newProductService.measureUnitId"
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
