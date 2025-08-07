export const defaultInvoices = [
  {
    invoiceId: "INV001",
    deleted: false,
    deadlineDate: "2025-08-01",
    deadlineTime: "12:00 AM",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
      },
    },
    status: "Paid",
    totalAmount: 750.0,
    payment: {
      method: "Credit Card",
      transactions: [
        {
          transactionId: "TXN1001",
          amount: 250.0,
        },
        {
          transactionId: "TXN1002",
          amount: 300.0,
        },
        {
          transactionId: "TXN1003",
          amount: 200.0,
        },
      ],
    },
    items: [
      {
        itemId: "ITM001",
        description: "Wireless Mouse",
        quantity: 2,
        unitPrice: 50.0,
      },
      {
        itemId: "ITM002",
        description: "Keyboard",
        quantity: 1,
        unitPrice: 150.0,
      },
    ],
    shipping: {
      trackingNumber: "TRK12345",
      provider: "FedEx",
      estimatedDelivery: "2025-08-10",
      status: "Delivered",
    },
    notes: "Delivered on time. No issues.",
  },
  {
    invoiceId: "INV002",
    deleted: false,
    deadlineDate: "2025-12-12",
    deadlineTime: "12:00 AM",
    customer: {
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+1-555-5678",
      address: {
        street: "456 Market St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "USA",
      },
    },
    status: "Pending",
    totalAmount: 150.0,
    payment: {
      method: "PayPal",
      transactions: [],
    },
    items: [
      {
        itemId: "ITM003",
        description: "USB-C Hub",
        quantity: 1,
        unitPrice: 150.0,
      },
    ],
    shipping: {
      trackingNumber: null,
      provider: null,
      estimatedDelivery: null,
      status: "Not Shipped",
    },
    notes: "Customer requested delayed delivery.",
  },
  {
    invoiceId: "INV003",
    deleted: false,
    deadlineDate: "2025-02-13",
    deadlineTime: "12:00 AM",
    customer: {
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1-555-9999",
      address: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "USA",
      },
    },
    status: "Unpaid",
    totalAmount: 350.0,
    payment: {
      method: "Bank Transfer",
      transactions: [],
    },
    items: [
      {
        itemId: "ITM004",
        description: '27" Monitor',
        quantity: 1,
        unitPrice: 350.0,
      },
    ],
    shipping: {
      trackingNumber: null,
      provider: null,
      estimatedDelivery: null,
      status: "Not Shipped",
    },
    notes: "Awaiting payment before shipping.",
  },
];
