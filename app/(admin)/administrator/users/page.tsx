"use client";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Pencil, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";

import { UserRole } from "@prisma/client";

import { useToast } from "@/hooks/use-notification-toast";
import { UserSchema } from "@/schemas";
import { AppUser, UserRequest } from "@/types/user";
import {
  getAllUsers,
  updateUser,
  resetUserPassword,
} from "@/actions/admin/users";

type FormKey =
  | "userName"
  | "email"
  | "name"
  | "isActive"
  | "subscriptionType"
  | "discount"
  | "monthlyTotal";
type SortKey =
  | "userName"
  | "email"
  | "name"
  | "isActive"
  | "subscriptionType"
  | "discount"
  | "monthlyTotal";
type SortOrder = "asc" | "desc";

export default function UserAdminPage() {
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [selectedAppUser, setSelectedAppUser] = useState<AppUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("userName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      userName: "",
      email: "",
      name: "",
      isActive: false,
      subscriptionType: "",
      discount: 0,
      monthlyTotal: 0,
    },
  });

  const { showToast } = useToast();

  const sortedUsers = [...appUsers].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const setFormFieldValues = (appUser: AppUser) => {
    for (const [key, value] of Object.entries(appUser)) {
      form.setValue(
        key as FormKey,
        value as string | number | boolean | undefined
      );
    }
  };

  const handleOnSubmit = async (values: z.infer<typeof UserSchema>) => {
    setIsProcessing(true);

    const userRequest: UserRequest = {
      id: selectedAppUser?.id as string,
      name: selectedAppUser?.name as string,
      isActive: selectedAppUser?.isActive as boolean,
      email: selectedAppUser?.email as string,
      emailVerified: null,
      image: null,
      password: "",
      role: selectedAppUser?.role as UserRole,
      isTwoFactorEnabled: false,
      twoFactorConfirmationId: null,
      discount: selectedAppUser?.discount as number,
      monthlyTotal: selectedAppUser?.monthlyTotal as number,
    };
    const updatedAppUser = await updateUser(userRequest);

    if ("errors" in updatedAppUser) {
      setErrors(updatedAppUser.errors as string[]);
      setIsProcessing(false);
    } else {
      setAppUsers(
        appUsers.map((u) =>
          u.id === selectedAppUser?.id
            ? { ...selectedAppUser, userName: selectedAppUser.email }
            : u
        )
      );
      setIsEditOpen(false);
      setIsProcessing(false);

      showToast("User updated", "success");
    }
  };

  const handleUpdateAppUserPassword = async () => {
    setIsProcessing(true);

    const userRequest: UserRequest = {
      id: selectedAppUser?.id as string,
      name: selectedAppUser?.name as string,
      isActive: selectedAppUser?.isActive as boolean,
      email: selectedAppUser?.email as string,
      emailVerified: null,
      image: null,
      password: "",
      role: selectedAppUser?.role as UserRole,
      isTwoFactorEnabled: false,
      twoFactorConfirmationId: null,
      discount: selectedAppUser?.discount as number,
      monthlyTotal: selectedAppUser?.monthlyTotal as number,
    };
    const updatedAppUser = await resetUserPassword(userRequest);

    if ("errors" in updatedAppUser) {
      setErrors(updatedAppUser.errors as string[]);
    } else {
      showToast("Password updated", "success");
    }

    setIsProcessing(false);
  };

  const handleReset = (appUser: AppUser) => {
    setSelectedAppUser(appUser);
    setIsResetPasswordOpen(true);
  };

  const handleEdit = (appUser: AppUser) => {
    setFormFieldValues(appUser);
    setSelectedAppUser(appUser);
    setIsEditOpen(true);
  };

  const toggleRowExpansion = (userId: string) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(userId)
        ? prevExpandedRows.filter((id) => id !== userId)
        : [...prevExpandedRows, userId]
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const fetchAppUsers = async () => {
    const appUsers = await getAllUsers();

    const finalAppUsers = appUsers.map((user) => {
      return {
        id: user.id,
        userName: user.email,
        password: user.password,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        subscriptionType: "Free",
        discount: user.discount ?? 0,
        monthlyTotal: user.monthlyTotal ?? 0,
        aiApiInToken: 3,
        aiApiOutToken: 4,
        realApiCalls: 5,
        role: user.role,
      };
    }) as AppUser[];

    console.log(finalAppUsers);
    setAppUsers(finalAppUsers);
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
    setErrors([]);
  }, [isEditOpen]);

  useEffect(() => {
    fetchAppUsers();
  }, []);

  return (
    <div className="mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Users
        </h1>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("userName")}
                  className="hover:bg-transparent"
                >
                  Username
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Password</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("email")}
                  className="hover:bg-transparent"
                >
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
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
                  onClick={() => handleSort("subscriptionType")}
                  className="hover:bg-transparent"
                >
                  Subscription Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("discount")}
                  className="hover:bg-transparent"
                >
                  Discount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("monthlyTotal")}
                  className="hover:bg-transparent"
                >
                  Monthly Total
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <span className="block text-center">No data...</span>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {sortedUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <TableRow key={user.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleRowExpansion(user.id)}
                          aria-label={
                            expandedRows.includes(user.id)
                              ? "Collapse row"
                              : "Expand row"
                          }
                        >
                          {expandedRows.includes(user.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.userName}
                      </TableCell>
                      <TableCell>
                        {user.password !== null ? (
                          <Button
                            variant="ghost"
                            onClick={() => handleReset(user)}
                            disabled={isProcessing}
                          >
                            {selectedAppUser?.id !== user.id ? (
                              <span>Reset</span>
                            ) : isProcessing === false ? (
                              <span>Reset</span>
                            ) : (
                              <span>Resetting...</span>
                            )}
                          </Button>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        {user.isActive === true ? (
                          <span>Yes</span>
                        ) : (
                          <span>No</span>
                        )}
                      </TableCell>
                      <TableCell>{user.subscriptionType}</TableCell>
                      <TableCell>{user.discount}</TableCell>
                      <TableCell>{user.monthlyTotal}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(user.id) && (
                      <TableRow key={user.id}>
                        <TableCell colSpan={5}>
                          <div className="p-4 bg-gray-50">
                            <p>AI API in tokens: {user.aiApiInToken}</p>
                            <p>AI API out tokens: {user.aiApiOutToken}</p>
                            <p>Real Estate API calls: {user.realApiCalls}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              {selectedAppUser && (
                <>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Username"
                              disabled
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Email"
                              value={selectedAppUser.email}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  email: e.target.value,
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
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Name"
                              value={selectedAppUser.name}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
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
                              checked={selectedAppUser.isActive}
                              onCheckedChange={(checked) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  isActive: checked.valueOf() as boolean,
                                });
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
                      name="subscriptionType"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Subscription</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Subscription"
                              value={selectedAppUser.subscriptionType}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  subscriptionType: e.target.value,
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
                      name="discount"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Discount</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Discount"
                              type="number"
                              value={selectedAppUser.discount}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  discount: Number(e.target.value),
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
                      name="monthlyTotal"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Monthly Total</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Monthly Total"
                              type="number"
                              value={selectedAppUser.monthlyTotal}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  monthlyTotal: Number(e.target.value),
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
                      name="aiApiInToken"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>AI API in tokens</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="AI API in tokens"
                              value={selectedAppUser.aiApiInToken}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  aiApiInToken: Number(e.target.value),
                                });
                                field.onChange(e.target.value);
                              }}
                              disabled
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aiApiOutToken"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>AI API out tokens</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="AI API out tokens"
                              value={selectedAppUser.aiApiOutToken}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  aiApiOutToken: Number(e.target.value),
                                });
                                field.onChange(e.target.value);
                              }}
                              disabled
                            />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="realApiCalls"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Real Estate API calls</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Real Estate API calls"
                              value={selectedAppUser.realApiCalls}
                              onChange={(e) => {
                                setSelectedAppUser({
                                  ...selectedAppUser,
                                  realApiCalls: Number(e.target.value),
                                });
                                field.onChange(e.target.value);
                              }}
                              disabled
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
                  {isProcessing === false ? "Update User" : "Updating..."}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        title="Confirm Reset"
        description="Are you sure you want to reset password? This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={handleUpdateAppUserPassword}
      />
    </div>
  );
}
