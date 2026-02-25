export const productServiceTableColumns = [
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Product/Service',
    dataIndex: 'productService',
    key: 'productService',
    ellipsis: true,
  },
  {
    title: 'Unit of Measure',
    dataIndex: 'unitOfMeasure',
    key: 'unitOfMeasure',
    ellipsis: true,
  },
  {
    title: 'Qty.',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 60,
  },
  {
    title: 'Unit Price',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 150,
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right',
    width: 80,
  },
];

export const paymentReceptionTableColumns = [
  {
    title: 'Fiscal Folio (UUID)',
    dataIndex: 'fiscalFolio',
    key: 'fiscalFolio',
  },
  {
    title: 'Tax Object',
    dataIndex: 'taxObject',
    key: 'taxObject',
    ellipsis: true,
  },
  {
    title: 'Series',
    dataIndex: 'series',
    key: 'series',
    ellipsis: true,
  },
  {
    title: 'Exchange Rate',
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
  },
  {
    title: 'Installment No.',
    dataIndex: 'installmentNumber',
    key: 'installmentNumber',
  },
  {
    title: 'Previous Balance',
    dataIndex: 'previousBalanceAmount',
    key: 'previousBalanceAmount',
  },
  {
    title: 'Amount Paid',
    dataIndex: 'amountPaid',
    key: 'amountPaid',
  },
  {
    title: 'Outstanding Balance',
    dataIndex: 'outstandingBalanceAmount',
    key: 'outstandingBalanceAmount',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right',
  },
];

export const issuedInvoicesTableColumns = [
  { title: 'Folio', dataIndex: 'folio', key: 'folio' },
  { title: 'Tax ID', dataIndex: 'taxId', key: 'taxId' },
  { title: 'Legal Name', dataIndex: 'legalName', key: 'legalName' },
  { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount' },
  { title: 'Currency', dataIndex: 'currency', key: 'currency' },
  { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate' },
  { title: 'Invoice Status', dataIndex: 'invoiceStatus', key: 'invoiceStatus' },
  { title: 'Stamping Status', dataIndex: 'stampingStatus', key: 'stampingStatus' },
  { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus' },
  { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
  { title: 'Actions', key: 'actions' },
];

export const issuedPaymentComplementsTableColumns = [
  { title: 'Folio', dataIndex: 'folio', key: 'folio' },
  { title: 'Fiscal Folio (UUID)', dataIndex: 'uuid', key: 'uuid' },
  { title: 'Legal Name', dataIndex: 'legalName', key: 'legalName' },
  { title: 'Installment No.', dataIndex: 'installmentNumber', key: 'installmentNumber' },
  { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount' },
  { title: 'Amount Paid', dataIndex: 'amountPaid', key: 'amountPaid' },
  { title: 'Remaining Balance', dataIndex: 'outstandingBalanceAmount', key: 'outstandingBalanceAmount' },
  { title: 'Currency', dataIndex: 'currency', key: 'currency' },
  { title: 'Registration Date', dataIndex: 'registrationDate', key: 'registrationDate' },
  { title: 'Stamping Status', dataIndex: 'stampingStatus', key: 'stampingStatus' },
  { title: 'Actions', key: 'actions' },
];

export const issuedCreditNotesTableColumns = [
  { title: 'Folio', dataIndex: 'folio', key: 'folio' },
  { title: 'Related Invoice', dataIndex: 'relatedDocument', key: 'relatedDocument' },
  { title: 'Tax ID', dataIndex: 'taxId', key: 'taxId' },
  { title: 'Legal Name', dataIndex: 'legalName', key: 'legalName' },
  { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount' },
  { title: 'Currency', dataIndex: 'currency', key: 'currency' },
  { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate' },
  { title: 'Invoice Status', dataIndex: 'invoiceStatus', key: 'invoiceStatus' },
  { title: 'Stamping Status', dataIndex: 'stampingStatus', key: 'stampingStatus' },
  { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus' },
  { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
  { title: 'Actions', key: 'actions' },
];

export const reportsTableColumns = [
  { title: 'Folio', dataIndex: 'folio', key: 'folio' },
  { title: 'Fiscal Folio (UUID)', dataIndex: 'fiscalFolio', key: 'fiscalFolio' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Client', dataIndex: 'clientId', key: 'clientId' },
  { title: 'Currency', dataIndex: 'currency', key: 'currency' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  { title: 'Actions', key: 'actions' },
];
