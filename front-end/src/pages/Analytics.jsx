import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import prefixZero from "@/utils/prefixZero";
import { cn } from "@/lib/utils";

const schema = z.object({
  method: z
    .string({
      required_error: "Please enter your method of payment",
    })
    .min(3, "Method must be at least 3 characters"),

  status: z.enum(["Paid", "Unpaid", "Pending"], {
    required_error: "Please select a status",
    invalid_type_error: "Status must be either 'paid', 'unpaid', or 'pending'",
  }),

  deadlineDate: z.date({
    required_error: "Deadline date is required",
  }),

  totalAmount: z
    .number({
      required_error: "Total amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive({
      message: "Amount must be greater than 0",
    }),
});

export default function Analytics() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      method: "",
      deadlineDate: null,
      status: "",
      totalAmount: "",
    },
  });

  const {
    control,
    watch,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const defaultInvoices = [
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
      totalAmount: 250.0,
      payment: {
        method: "Credit Card",
        transactions: [
          {
            transactionId: "TXN1001",
            date: "2025-01-01",
            amount: 250.0,
            status: "Success",
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

  const [invoices, setInvoices] = useState(JSON.parse(localStorage.getItem("invoices")) || defaultInvoices);

  const [openDialog, setOpenDialog] = useState(false);

  const [activeId, setActiveId] = useState(null);

  const onSubmit = (data) => {
    const payload = {
      invoiceId: activeId ? activeId :  `INV${prefixZero(+invoices[invoices.length -1].invoiceId.slice(-3) + 1)}`,
      deleted: false,
      payment: {
        method: data.method,
      },
      ...data,
    };
    console.log(payload);
    if (activeId) {
      const updatedArray = invoices.map((invoices) =>
        invoices.invoiceId == activeId ? { ...invoices, ...payload } : invoices
      );
      setInvoices(updatedArray);
    } else {
      setInvoices((prev) => [...prev, payload]);
    }
    alert("Invoice added successfully");
    setActiveId(null);
    setOpenDialog(false);
    form.reset();
  };

  useEffect(() => {
    const invoice = invoices.find((invoice) => invoice.invoiceId === activeId);
    if (invoice) {
      setValue("method", invoice.payment?.method || "");
      setValue(
        "deadlineDate",
        invoice.deadlineDate ? new Date(invoice.deadlineDate) : null
      );
      setValue("status", invoice.status || "");
      setValue("totalAmount", invoice.totalAmount || 0);
    }
  }, [activeId]);


  const deleteInvoice = (id) => {
    const updatedArray = invoices.filter((invoice) => invoice.invoiceId !== id);
    setInvoices(updatedArray);
  };

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  return (
    <>
      {/* <pre>{JSON.parse(localStorage.getItem("invoices")).filter((invoice) => invoice.deleted == false).length}</pre> */}
      {/* <pre>{invoices.length}</pre> */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Deadline Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoiceId}>
              <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice?.payment?.method}</TableCell>
              <TableCell>
                {dayjs(invoice.deadlineDate).format("DD MMM YYYY")}
              </TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
              <TableCell className="text-center">
                {" "}
                <Dialog open={openDialog} >
                  <DialogTrigger>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpenDialog(true);
                        setActiveId(invoice.invoiceId);
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                
                  <DialogContent className="sm:max-w-md" showCloseButton={false}>
                    <DialogHeader>
                      <XIcon onClick={() => setOpenDialog(false)} className="absolute top-[16px] right-[16px] p-[4px] cursor-pointer hover:bg-primary hover:text-primary-foreground rounded" />
                      <DialogTitle>
                         {activeId ? `Edit Invoice : ${activeId}` : "Add Invoice"}
                      </DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view this.
                      </DialogDescription>
                    </DialogHeader>
                    {/* <pre className="h-64 overflow-y-auto">{JSON.stringify(form, null, 2)}</pre> */}
                    <Form {...form}>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        {/* <pre>{JSON.stringify(getValues(), null, 2)}</pre> */}
                        {/* <pre>{JSON.stringify(watch("status"), null, 2)}</pre> */}
                        <FormField
                          control={control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Paid">Paid</SelectItem>
                                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name="method"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment method</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Add your payment method"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setValue("method", e.target.value);
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="deadlineDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Deadline Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        dayjs(field.value).format("DD MMM YYYY")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date("1900-01-01")
                                    }
                                    // captionLayout="dropdown"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Your date of birth is used to calculate your
                                age.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* <div className="flex gap-3">
                            <FormField
                              control={control}
                              name="deadlineDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Deadline Date</FormLabel>
                                  <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className={`w-48 justify-between font-normal ${
                                            !field.value
                                              ? "text-muted-foreground"
                                              : ""
                                          }`}
                                        >
                                          {field.value
                                            ? dayjs(field.value).format(
                                                "DD MMM YYYY"
                                              )
                                            : "Select deadline date"}
                                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : null
                                        }
                                        onSelect={(date) => {
                                          field.onChange(date);
                                          setOpen(false);
                                        }}
                                        disabled={(date) =>
                                          date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div> */}

                        <FormField
                          control={control}
                          name={"totalAmount"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>totalAmount</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="totalAmount"
                                  {...field}
                                  onChange={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    field.onChange(
                                      e.target.value && +e.target.value
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter className="flex justify-between w-full">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setOpenDialog(false)}
                            >
                              Close
                            </Button>
                          </DialogClose>

                          <Button type="submit" variant="primary">
                            Save
                          </Button>
                        </DialogFooter>
                        {/* Removed duplicate submit button */}
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  onClick={() => deleteInvoice(invoice.invoiceId)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {invoices.reduce(
                (acc, invoice) => acc + invoice.totalAmount,
                100
              )}
            </TableCell>
          </TableRow>
          <TableRow className="flex justify-end">
            <TableCell colSpan={6}>
              <Button
                variant="outline"
                onClick={() => {
                  form.reset();
                  setActiveId(null);
                  setOpenDialog(true);
                }}
              >
                Add Invoice
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

// {
//   "control": {
//     "_subjects": {
//       "array": {
//         "observers": []
//       },
//       "state": {
//         "observers": [
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//           {}
//         ]
//       }
//     },
//     "_proxyFormState": {
//       "isDirty": false,
//       "dirtyFields": true,
//       "validatingFields": false,
//       "touchedFields": true,
//       "isValidating": false,
//       "isValid": false,
//       "errors": "all",
//       "disabled": true
//     },
//     "_fields": {
//       "method": {
//         "_f": {
//           "ref": {},
//           "name": "method",
//           "mount": true,
//           "value": ""
//         }
//       },
//       "date": {
//         "_f": {
//           "ref": {
//             "name": "date"
//           },
//           "name": "date",
//           "mount": true,
//           "value": null
//         }
//       },
//       "endDate": {
//         "_f": {
//           "ref": {
//             "name": "endDate"
//           },
//           "name": "endDate",
//           "mount": true,
//           "value": null
//         }
//       }
//     },
//     "_formValues": {
//       "method": "",
//       "date": null,
//       "endDate": null
//     },
//     "_state": {
//       "action": false,
//       "mount": true,
//       "watch": false
//     },
//     "_defaultValues": {
//       "method": "",
//       "date": null,
//       "endDate": null
//     },
//     "_names": {
//       "mount": {},
//       "disabled": {},
//       "unMount": {},
//       "array": {},
//       "watch": {}
//     },
//     "_formState": {
//       "submitCount": 6,
//       "isDirty": false,
//       "isReady": true,
//       "isLoading": false,
//       "isValidating": false,
//       "isSubmitted": true,
//       "isSubmitting": false,
//       "isSubmitSuccessful": false,
//       "isValid": false,
//       "touchedFields": {
//         "method": true
//       },
//       "dirtyFields": {},
//       "validatingFields": {},
//       "errors": {
//         "method": {
//           "message": "Please enter a valid URL",
//           "type": "invalid_format",
//           "ref": {}
//         },
//         "date": {
//           "message": "Invalid input: expected date, received null",
//           "type": "invalid_type",
//           "ref": {
//             "name": "date"
//           }
//         },
//         "endDate": {
//           "message": "Invalid input: expected date, received null",
//           "type": "invalid_type",
//           "ref": {
//             "name": "endDate"
//           }
//         }
//       },
//       "disabled": false,
//       "name": "method"
//     },
//     "_options": {
//       "mode": "onSubmit",
//       "reValidateMode": "onChange",
//       "shouldFocusError": true,
//       "defaultValues": {
//         "method": "",
//         "date": null,
//         "endDate": null
//       }
//     }
//   },
//   "formState": {
//     "defaultValues": {
//       "method": "",
//       "date": null,
//       "endDate": null
//     }
//   }
// }
