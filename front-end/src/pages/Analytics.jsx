import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDownIcon, Trash2, XIcon } from "lucide-react";
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
import { defaultInvoices } from "@/data/Analytics";

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
      transactions: [],
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

  const [invoices, setInvoices] = useState(
    JSON.parse(localStorage.getItem("invoices")) || defaultInvoices
  );

  const [openDialog, setOpenDialog] = useState(false);

  const [activeId, setActiveId] = useState(null);

  const transactions = watch("transactions");
  const onSubmit = (data) => {
    const existingInvoice = invoices.find(
      (invoice) => invoice.invoiceId == activeId
    );

    const editPayload = {
      ...existingInvoice,
      ...data,
      invoiceId: existingInvoice.invoiceId,
      payment: {
        method: data.method,
        transactions: [
          ...transactions
        ].filter(Boolean),
      },
    };
    
    const addPayload = {
      ...data,
      invoiceId: `INV${prefixZero(
        +invoices[invoices.length - 1].invoiceId.slice(-3) + 1
      )}`,
      payment: {
        method: data.method,
        transactions: [],
      },
    };
    if (activeId) {
      const updatedArray = invoices.map((invoices) =>
        invoices.invoiceId == activeId
          ? { ...invoices, ...editPayload }
          : invoices
      );
      setInvoices(updatedArray);
    } else {
      setInvoices((prev) => [...prev, addPayload]);
    }
    setActiveId(null);
    setOpenDialog(false);
    form.reset();
  };

  useEffect(() => {
    const invoice = invoices.find((invoice) => invoice.invoiceId === activeId);
    if (invoice) {
      setValue("method", invoice.payment?.method || "");
      setValue("transactions", invoice.payment?.transactions || []);
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
      <Button
        variant="destructive"
        onClick={() => {
          setInvoices(defaultInvoices);
          localStorage.setItem("invoices", JSON.stringify(defaultInvoices));
        }}
      >
        Reset
      </Button>
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
                {/* <pre>{JSON.stringify(invoice.payment?.transactions, null, 2)}</pre> */}
                {(invoice.payment?.transactions||[]).reduce((acc, t)=> acc + t.amount, 0)}
              </TableCell>
              <TableCell className="text-center">
                {" "}
                <Dialog open={openDialog}>
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

                  <DialogContent
                    className="sm:max-w-md "
                    showCloseButton={false}
                  >
                    <DialogHeader>
                      <XIcon
                        onClick={() => setOpenDialog(false)}
                        className="absolute top-[16px] right-[16px] p-[4px] cursor-pointer hover:bg-primary hover:text-primary-foreground rounded"
                      />
                      <DialogTitle>
                        {activeId
                          ? `Edit Invoice : ${activeId}`
                          : "Add Invoice"}
                      </DialogTitle>
                    </DialogHeader>
                    {/* <pre className="h-64 overflow-y-auto">{JSON.stringify(form, null, 2)}</pre> */}
                    <div className="max-h-[80vh] overflow-y-auto">
                      <Form {...form}>
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="space-y-8"
                        >
                          <p>{JSON.stringify(getValues(), null, 2)}</p>
                          <p>{JSON.stringify(transactions, null, 2)}</p>
                          {/* <pre>{JSON.stringify(watch("status"), null, 2)}</pre> */}
                          <div className="flex justify-between gap-[16px] w-full">
                            <div className="flex-1">
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
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Paid">
                                          Paid
                                        </SelectItem>
                                        <SelectItem value="Unpaid">
                                          Unpaid
                                        </SelectItem>
                                        <SelectItem value="Pending">
                                          Pending
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex-1">
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
                                              "pl-3 text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              dayjs(field.value).format(
                                                "DD MMM YYYY"
                                              )
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
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

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
                          <Button
                            type="button"
                            onClick={(e) => {
                              setValue("transactions", [
                                ...transactions,
                                {
                                  transactionId: transactions.length
                                    ? `TXN${
                                        +transactions[
                                          transactions.length - 1
                                        ]?.transactionId.slice(-4) + 1
                                      }`
                                    : "TXN001",
                                  amount: 0,
                                },
                              ]);
                            }}
                          >
                            Add transactions
                          </Button>

                          {/* <pre>{JSON.stringify(transactions, null, 2)}</pre> */}
                          {transactions.map((transaction, index) => (
                            <div className="flex items-end gap-[16px]">
                              <FormField
                                control={control}
                                name={`transactions[${index}].amount`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Transactions {transaction.transactionId}
                                      
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Transactions"
                                        {...field}
                                        onChange={(e) => {
                                          e.target.value =
                                            e.target.value.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                          console.log(transaction.transactionId + " " + e.target.value);
                                          field.onChange(
                                            e.target.value && +e.target.value
                                          );
                                          setValue("transactions", transactions.map((t)=> t.transactionId === transaction.transactionId ? {...t, amount: +e.target.value} : t))
                                          console.log(transactions);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  const updatedTransactions =
                                    transactions.filter(
                                      (t) =>
                                        t.transactionId !==
                                        transaction.transactionId
                                    );
                                  setValue("transactions", updatedTransactions);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </Button>
                            </div>
                          ))}
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
                    </div>
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
        {/* <pre>{JSON.stringify(invoices, null, 2)}</pre> */}
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
