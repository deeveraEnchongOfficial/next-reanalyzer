"use client";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, Pencil, Trash2, Plus, ArrowUpDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ConfirmDialog from "@/components/ui/confirm-dialog";

import { useToast } from "@/hooks/use-notification-toast";
import { SubscriptionSchema } from "@/schemas";
import { AppSubPlan, SubPlanRequest } from "@/types/subscription";
import {
  createSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
} from "@/actions/admin/subscriptions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormKey =
  | "name"
  | "isActive"
  | "isFree"
  | "aiTokenLimitPerMonth"
  | "realApiLimitPerMonth";
type SortKey =
  | "name"
  | "isActive"
  | "isFree"
  | "aiTokenLimitPerMonth"
  | "realApiLimitPerMonth";
type SortOrder = "asc" | "desc";

export default function Page() {
  const [appSubscriptions, setAppSubscriptions] = useState<AppSubPlan[]>([]);
  const [selectedAppSubscription, setSelectedAppSubscription] =
    useState<AppSubPlan | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAppSubscription, setNewAppSubscription] =
    useState<AppSubPlan | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [mode, setMode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof SubscriptionSchema>>({
    resolver: zodResolver(SubscriptionSchema),
    defaultValues: {
      name: "",
      isActive: false,
      isFree: false,
      aiTokenLimitPerMonth: 0,
      realApiLimitPerMonth: 0,
    },
  });

  const { showToast } = useToast();

  const sortedSubscriptions = [...appSubscriptions].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const setFormFieldValues = (appSubPlan: AppSubPlan) => {
    for (const [key, value] of Object.entries(appSubPlan)) {
      form.setValue(
        key as FormKey,
        value as string | number | boolean | undefined
      );
    }
  };

  const resetFormFieldValues = () => {
    form.reset();
  };

  const handleOnSubmit = async (values: z.infer<typeof SubscriptionSchema>) => {
    setIsProcessing(true);

    switch (mode) {
      case "c":
        const addSubscriptionRequest: SubPlanRequest = {
          id: newAppSubscription?.id ?? ("" as string),
          name: newAppSubscription?.name ?? ("" as string),
          isActive: newAppSubscription?.isActive ?? (false as boolean),
          isFree: newAppSubscription?.isFree ?? (false as boolean),
          aiTokenLimitPerDay:
            newAppSubscription?.aiTokenLimitPerDay ?? (0 as number),
          aiTokenLimitPerMonth:
            newAppSubscription?.aiTokenLimitPerMonth ?? (0 as number),
          aiTokenLimitPerYear:
            newAppSubscription?.aiTokenLimitPerYear ?? (0 as number),
          realApiLimitPerDay:
            newAppSubscription?.realApiLimitPerDay ?? (0 as number),
          realApiLimitPerMonth:
            newAppSubscription?.realApiLimitPerMonth ?? (0 as number),
          realApiLimitPerYear:
            newAppSubscription?.realApiLimitPerYear ?? (0 as number),
          createdAt: null,
          updatedAt: null,
        };

        const addAppSubPlan = await createSubscription(addSubscriptionRequest);

        if ("errors" in addAppSubPlan) {
          setErrors(addAppSubPlan.errors as string[]);
          setIsProcessing(false);
        } else {
          setAppSubscriptions([
            ...appSubscriptions,
            { ...(newAppSubscription as AppSubPlan), id: addAppSubPlan.id },
          ]);
          resetFormFieldValues();
          setNewAppSubscription(null);
          setIsAddOpen(false);
          setIsProcessing(false);

          showToast("Subscription added", "success");
        }
        break;
      case "u":
        const updateSubscriptionRequest: SubPlanRequest = {
          id: selectedAppSubscription?.id as string,
          name: selectedAppSubscription?.name as string,
          isActive: selectedAppSubscription?.isActive as boolean,
          isFree: selectedAppSubscription?.isFree as boolean,
          aiTokenLimitPerDay:
            selectedAppSubscription?.aiTokenLimitPerDay as number,
          aiTokenLimitPerMonth:
            selectedAppSubscription?.aiTokenLimitPerMonth as number,
          aiTokenLimitPerYear:
            selectedAppSubscription?.aiTokenLimitPerYear as number,
          realApiLimitPerDay:
            selectedAppSubscription?.realApiLimitPerDay as number,
          realApiLimitPerMonth:
            selectedAppSubscription?.realApiLimitPerMonth as number,
          realApiLimitPerYear:
            selectedAppSubscription?.realApiLimitPerYear as number,
          createdAt: null,
          updatedAt: null,
        };
        const updatedAppSubPlan = await updateSubscription(
          updateSubscriptionRequest
        );

        if ("errors" in updatedAppSubPlan) {
          setErrors(updatedAppSubPlan.errors as string[]);
          setIsProcessing(false);
        } else {
          resetFormFieldValues();
          setAppSubscriptions(
            appSubscriptions.map((s) =>
              s.id === selectedAppSubscription?.id
                ? { ...selectedAppSubscription }
                : s
            )
          );
          setIsEditOpen(false);
          setIsProcessing(false);

          showToast("Subscription updated", "success");
        }

        break;
    }
  };

  const handleView = (appSubPlan: AppSubPlan) => {
    setSelectedAppSubscription(appSubPlan);
    setIsViewOpen(true);
  };

  const handleEdit = (appSubPlan: AppSubPlan) => {
    setFormFieldValues(appSubPlan);
    setSelectedAppSubscription(appSubPlan);
    setIsEditOpen(true);
  };

  const handleDelete = (appSubPlan: AppSubPlan) => {
    setSelectedAppSubscription(appSubPlan);
    setIsDeleteOpen(true);
  };

  const handleDeleteAppSubscription = async () => {
    const appSubPlan = await deleteSubscription(
      selectedAppSubscription?.id as string
    );

    if ("errors" in appSubPlan) {
      setErrors(appSubPlan.errors as string[]);
    } else {
      setAppSubscriptions(
        appSubscriptions.filter((s) => s.id !== selectedAppSubscription?.id)
      );
      setIsDeleteOpen(false);

      showToast("Subscription deleted", "success");
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const fetchAppSubscriptions = async () => {
    const appSubscriptions = await getAllSubscriptions();

    const finalAppSubscriptions = appSubscriptions.map((sub) => {
      return {
        id: sub.id,
        name: sub.name,
        isActive: sub?.isActive as boolean,
        isFree: sub?.isFree as boolean,
        aiTokenLimitPerDay: sub?.aiTokenLimitPerDay as number,
        aiTokenLimitPerMonth: sub?.aiTokenLimitPerMonth as number,
        aiTokenLimitPerYear: sub?.aiTokenLimitPerYear as number,
        realApiLimitPerDay: sub?.realApiLimitPerDay as number,
        realApiLimitPerMonth: sub?.realApiLimitPerMonth as number,
        realApiLimitPerYear: sub?.realApiLimitPerYear as number,
      };
    }) as AppSubPlan[];

    setAppSubscriptions(finalAppSubscriptions);
  };

  useEffect(() => {
    if (errors.length > 0) {
      showToast(
        <ul className="list-none">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>,
        "error"
      );
    }
  }, [errors]);

  useEffect(() => {
    setNewAppSubscription(
      isAddOpen === true
        ? {
            id: "" as string,
            name: "" as string,
            isActive: true as boolean,
            isFree: true as boolean,
            aiTokenLimitPerDay: 0 as number,
            aiTokenLimitPerMonth: 0 as number,
            aiTokenLimitPerYear: 0 as number,
            realApiLimitPerDay: 0 as number,
            realApiLimitPerMonth: 0 as number,
            realApiLimitPerYear: 0 as number,
          }
        : null
    );
    setMode(isAddOpen === true ? "c" : null);
  }, [isAddOpen]);

  useEffect(() => {
    setErrors([]);
    setMode(isEditOpen === true ? "u" : null);
  }, [isEditOpen]);

  useEffect(() => {
    fetchAppSubscriptions();
  }, []);

  return (
    <div className="mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Subscriptions</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add New Subscription</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new subscription.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Name"
                            value={newAppSubscription?.name}
                            onChange={(e) => {
                              setNewAppSubscription({
                                ...newAppSubscription,
                                name: e.target.value,
                              } as AppSubPlan);
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="col-span-4" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Active</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={newAppSubscription?.isActive}
                            onCheckedChange={(checked) => {
                              setNewAppSubscription({
                                ...newAppSubscription,
                                isActive: checked.valueOf() as boolean,
                              } as AppSubPlan);
                              field.onChange(checked);
                            }}
                            className="col-span-3"
                          />
                        </FormControl>
                        <FormMessage className="col-span-4" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Free</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={newAppSubscription?.isFree}
                            onCheckedChange={(checked) => {
                              setNewAppSubscription({
                                ...newAppSubscription,
                                isFree: checked.valueOf() as boolean,
                              } as AppSubPlan);
                              field.onChange(checked);
                            }}
                            className="col-span-3"
                          />
                        </FormControl>
                        <FormMessage className="col-span-4" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aiTokenLimitPerMonth"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>AI token monthly limit</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="AI token monthly limit"
                            type="number"
                            value={newAppSubscription?.aiTokenLimitPerMonth}
                            onChange={(e) => {
                              setNewAppSubscription({
                                ...newAppSubscription,
                                aiTokenLimitPerMonth: Number(e.target.value),
                              } as AppSubPlan);
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="col-span-4" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="realApiLimitPerMonth"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Real estate API monthly limit</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Real estate API monthly limit"
                            type="number"
                            value={newAppSubscription?.realApiLimitPerMonth}
                            onChange={(e) => {
                              setNewAppSubscription({
                                ...newAppSubscription,
                                realApiLimitPerMonth: Number(e.target.value),
                              } as AppSubPlan);
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="col-span-4" />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {isProcessing === false ? "Add Subscription" : "Adding..."}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="hover:bg-transparent"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("isActive")}
                  className="hover:bg-transparent"
                >
                  Active
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("isFree")}
                  className="hover:bg-transparent"
                >
                  Free
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("aiTokenLimitPerMonth")}
                  className="hover:bg-transparent"
                >
                  AI token limit
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("realApiLimitPerMonth")}
                  className="hover:bg-transparent"
                >
                  Real estate API limit
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <span className="block text-center">No data...</span>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {sortedSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>
                      {sub.isActive === true ? (
                        <span>Yes</span>
                      ) : (
                        <span>No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {sub.isFree === true ? <span>Yes</span> : <span>No</span>}
                    </TableCell>
                    <TableCell>{sub.aiTokenLimitPerMonth}</TableCell>
                    <TableCell>{sub.realApiLimitPerMonth}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(sub)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(sub)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sub)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Subscription Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>
          {selectedAppSubscription && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Name:</Label>
                <span className="col-span-3">
                  {selectedAppSubscription.name}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Active</Label>
                <span className="col-span-3">
                  {selectedAppSubscription.isActive === true ? "Yes" : "No"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Free</Label>
                <span className="col-span-3">
                  {selectedAppSubscription.isFree === true ? "Yes" : "No"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">
                  AI token monthly limit
                </Label>
                <span className="col-span-3">
                  {selectedAppSubscription.aiTokenLimitPerMonth ?? 0}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">
                  Real estate API monthly limit
                </Label>
                <span className="col-span-3">
                  {selectedAppSubscription.realApiLimitPerMonth ?? 0}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <DialogHeader>
                <DialogTitle>Edit Subscription</DialogTitle>
              </DialogHeader>
              {selectedAppSubscription && (
                <>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Name"
                              value={selectedAppSubscription?.name}
                              onChange={(e) => {
                                setSelectedAppSubscription({
                                  ...selectedAppSubscription,
                                  name: e.target.value,
                                });
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Active</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={selectedAppSubscription?.isActive}
                              onCheckedChange={(checked) => {
                                setSelectedAppSubscription({
                                  ...selectedAppSubscription,
                                  isActive: checked.valueOf() as boolean,
                                } as AppSubPlan);
                                field.onChange(checked);
                              }}
                              className="col-span-3"
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Free</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={selectedAppSubscription?.isFree}
                              onCheckedChange={(checked) => {
                                setSelectedAppSubscription({
                                  ...selectedAppSubscription,
                                  isFree: checked.valueOf() as boolean,
                                } as AppSubPlan);
                                field.onChange(checked);
                              }}
                              className="col-span-3"
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aiTokenLimitPerMonth"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>AI token monthly limit</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="AI token monthly limit"
                              type="number"
                              value={
                                selectedAppSubscription?.aiTokenLimitPerMonth
                              }
                              onChange={(e) => {
                                setSelectedAppSubscription({
                                  ...selectedAppSubscription,
                                  aiTokenLimitPerMonth: Number(e.target.value),
                                } as AppSubPlan);
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="realApiLimitPerMonth"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Real estate API monthly limit</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Real estate API monthly limit"
                              type="number"
                              value={
                                selectedAppSubscription?.realApiLimitPerMonth
                              }
                              onChange={(e) => {
                                setSelectedAppSubscription({
                                  ...selectedAppSubscription,
                                  realApiLimitPerMonth: Number(e.target.value),
                                } as AppSubPlan);
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <DialogFooter>
                <Button type="submit">
                  {isProcessing === false
                    ? "Update Subscription"
                    : "Updating..."}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Subscription Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Confirm Delete"
        description="Are you sure you want to delete subscription? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteAppSubscription}
      />
    </div>
  );
}
