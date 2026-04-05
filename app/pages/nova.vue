<script setup lang="ts">
import { sub } from 'date-fns';

import type { Period, Range } from '~/types/facturador/dashboard';

definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard'],
});

const { isNotificationsSlideoverOpen, isAddNewRecordSlideoverOpen } = useDashboard();
const route = useRoute();
const title = computed(() => {
  switch (route.name) {
    case 'nova-dashboard':
      return 'Home';
    case 'nova-catalogs-clients':
      return 'Clients';
    case 'nova-catalogs-products-services':
      return 'Products & Services';
    case 'nova-catalogs-tax-regimes':
      return 'Tax Regimes';
    case 'nova-catalogs-invoice-usages':
      return 'Invoice Usages';
    case 'nova-catalogs-payment-methods':
      return 'Payment Methods';
    case 'nova-catalogs-payment_forms':
      return 'Payment Forms';
    case 'nova-billing-invoices-new-invoice':
      return 'New Invoice';
    case 'nova-billing-credit-notes-new-credit-note':
      return 'New Credit Note';
    case 'nova-billing-payment-complements-new-payment-complement':
      return 'New Payment Complement';
    default:
      return '';
  }
});

// show dashboard header and toolbar only on the dashboard index page
const showDashboardHeader = computed(() => route.path === '/nova/dashboard');
const showCatalogsHeader = computed(() => route.path.startsWith('/nova/catalogs'));

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<Period>('daily');
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="ARIS TI NOVA" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <h1 v-if="!showDashboardHeader">
            {{ title }}
          </h1>
          <div v-if="showDashboardHeader">
            <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
            <DateRangePicker v-model="range" class="-ms-1" />
            <PeriodSelect v-model="period" :range="range" />
          </div>
        </template>
        <template #right>
          <div v-if="showCatalogsHeader">
            <UButton
              label="Agregar"
              color="primary"
              icon="i-lucide-plus"
              @click="isAddNewRecordSlideoverOpen = true"
            />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>
