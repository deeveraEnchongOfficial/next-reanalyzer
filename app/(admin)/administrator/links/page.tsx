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
import { AffiliateLinkSchema } from "@/schemas";
import { AppAffiliateLink, AffiliateLinkRequest } from "@/types/affiliate-link";
import {
  createAffiliateLink,
  getAllAffiliateLinks,
  updateAffiliateLink,
  deleteAffiliateLink,
} from "@/actions/admin/affiliate-links";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormKey =
  | "normalLink"
  | "affiliateLink"
  | "isActive"
  | "type"
  | "programLink"
  | "programNotes";
type SortKey =
  | "normalLink"
  | "affiliateLink"
  | "isActive"
  | "type"
  | "programLink"
  | "programNotes";
type SortOrder = "asc" | "desc";

export default function Page() {
  const [appAffiliateLinks, setAppAffiliateLinks] = useState<
    AppAffiliateLink[]
  >([]);
  const [selectedAppAffiliateLink, setSelectedAppAffiliateLink] =
    useState<AppAffiliateLink | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAppAffiliateLink, setNewAppAffiliateLink] =
    useState<AppAffiliateLink | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("normalLink");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [mode, setMode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof AffiliateLinkSchema>>({
    resolver: zodResolver(AffiliateLinkSchema),
    defaultValues: {
      normalLink: "",
      affiliateLink: "",
      isActive: false,
      type: "",
      programLink: "",
      programNotes: "",
    },
  });

  const { showToast } = useToast();

  const sortedAffiliateLinks = [...appAffiliateLinks].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const setFormFieldValues = (appAffiliateLink: AppAffiliateLink) => {
    for (const [key, value] of Object.entries(appAffiliateLink)) {
      form.setValue(key as FormKey, value as string | boolean | undefined);
    }
  };

  const resetFormFieldValues = () => {
    form.reset();
  };

  const handleOnSubmit = async (
    values: z.infer<typeof AffiliateLinkSchema>
  ) => {
    setIsProcessing(true);

    switch (mode) {
      case "c":
        const addAffiliateLinkRequest: AffiliateLinkRequest = {
          id: newAppAffiliateLink?.id ?? ("" as string),
          normalLink: newAppAffiliateLink?.normalLink ?? ("" as string),
          affiliateLink: newAppAffiliateLink?.affiliateLink ?? ("" as string),
          isActive: newAppAffiliateLink?.isActive ?? (false as boolean),
          type: newAppAffiliateLink?.type ?? ("" as string),
          programLink: newAppAffiliateLink?.programLink ?? ("" as string),
          programNotes: newAppAffiliateLink?.programNotes ?? ("" as string),
          createdAt: null,
          updatedAt: null,
        };

        const addAppAffiliateLink = await createAffiliateLink(
          addAffiliateLinkRequest
        );

        if ("errors" in addAppAffiliateLink) {
          setErrors(addAppAffiliateLink.errors as string[]);
          setIsProcessing(false);
        } else {
          setAppAffiliateLinks([
            ...appAffiliateLinks,
            {
              ...(newAppAffiliateLink as AppAffiliateLink),
              id: addAppAffiliateLink.id,
            },
          ]);
          resetFormFieldValues();
          setNewAppAffiliateLink(null);
          setIsAddOpen(false);
          setIsProcessing(false);

          showToast("Affiliate Link added", "success");
        }
        break;
      case "u":
        const updateAffiliateLinkRequest: AffiliateLinkRequest = {
          id: selectedAppAffiliateLink?.id ?? ("" as string),
          normalLink: selectedAppAffiliateLink?.normalLink ?? ("" as string),
          affiliateLink:
            selectedAppAffiliateLink?.affiliateLink ?? ("" as string),
          isActive: selectedAppAffiliateLink?.isActive ?? (false as boolean),
          type: selectedAppAffiliateLink?.type ?? ("" as string),
          programLink: selectedAppAffiliateLink?.programLink ?? ("" as string),
          programNotes:
            selectedAppAffiliateLink?.programNotes ?? ("" as string),
          createdAt: null,
          updatedAt: null,
        };
        const updatedAppAffiliateLink = await updateAffiliateLink(
          updateAffiliateLinkRequest
        );

        if ("errors" in updatedAppAffiliateLink) {
          setErrors(updatedAppAffiliateLink.errors as string[]);
          setIsProcessing(false);
        } else {
          resetFormFieldValues();
          setAppAffiliateLinks(
            appAffiliateLinks.map((s) =>
              s.id === selectedAppAffiliateLink?.id
                ? { ...selectedAppAffiliateLink }
                : s
            )
          );
          setIsEditOpen(false);
          setIsProcessing(false);

          showToast("Affiliate Link updated", "success");
        }

        break;
    }
  };

  const handleView = (appAffiliateLink: AppAffiliateLink) => {
    setSelectedAppAffiliateLink(appAffiliateLink);
    setIsViewOpen(true);
  };

  const handleEdit = (appAffiliateLink: AppAffiliateLink) => {
    setFormFieldValues(appAffiliateLink);
    setSelectedAppAffiliateLink(appAffiliateLink);
    setIsEditOpen(true);
  };

  const handleDelete = (appAffiliateLink: AppAffiliateLink) => {
    setSelectedAppAffiliateLink(appAffiliateLink);
    setIsDeleteOpen(true);
  };

  const handleDeleteAppAffiliateLink = async () => {
    const appAffiliateLink = await deleteAffiliateLink(
      selectedAppAffiliateLink?.id as string
    );

    if ("errors" in appAffiliateLink) {
      setErrors(appAffiliateLink.errors as string[]);
    } else {
      setAppAffiliateLinks(
        appAffiliateLinks.filter((s) => s.id !== selectedAppAffiliateLink?.id)
      );
      setIsDeleteOpen(false);

      showToast("Affiliate Link deleted", "success");
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

  const fetchAppAffiliateLinks = async () => {
    const appAffiliateLinks = await getAllAffiliateLinks();

    const finalAppAffiliateLinks = appAffiliateLinks.map((link) => {
      return {
        id: link?.id ?? ("" as string),
        normalLink: link?.normalLink ?? ("" as string),
        affiliateLink: link?.affiliateLink ?? ("" as string),
        isActive: link?.isActive ?? (false as boolean),
        type: link?.type ?? ("" as string),
        programLink: link?.programLink ?? ("" as string),
        programNotes: link?.programNotes ?? ("" as string),
      };
    }) as AppAffiliateLink[];

    setAppAffiliateLinks(finalAppAffiliateLinks);
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
    setNewAppAffiliateLink(
      isAddOpen === true
        ? {
            id: "" as string,
            normalLink: "" as string,
            affiliateLink: "" as string,
            isActive: true as boolean,
            type: "" as string,
            programLink: "" as string,
            programNotes: "" as string,
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
    fetchAppAffiliateLinks();
  }, []);

  return (
    <div className="mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Affiliate Links</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Affiliate Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add New Affiliate Link</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new affiliate link.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="normalLink"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Normal Link</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Normal Link"
                            value={newAppAffiliateLink?.normalLink}
                            onChange={(e) => {
                              setNewAppAffiliateLink({
                                ...newAppAffiliateLink,
                                normalLink: e.target.value,
                              } as AppAffiliateLink);
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
                    name="affiliateLink"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Affiliate Link</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Affiliate Link"
                            value={newAppAffiliateLink?.affiliateLink}
                            onChange={(e) => {
                              setNewAppAffiliateLink({
                                ...newAppAffiliateLink,
                                affiliateLink: e.target.value,
                              } as AppAffiliateLink);
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
                            checked={newAppAffiliateLink?.isActive}
                            onCheckedChange={(checked) => {
                              setNewAppAffiliateLink({
                                ...newAppAffiliateLink,
                                isActive: checked.valueOf() as boolean,
                              } as AppAffiliateLink);
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
                    name="type"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Type"
                            value={newAppAffiliateLink?.type}
                            onChange={(e) => {
                              setNewAppAffiliateLink({
                                ...newAppAffiliateLink,
                                type: e.target.value,
                              } as AppAffiliateLink);
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
                    name="programLink"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Program Link</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Program Link"
                            value={newAppAffiliateLink?.programLink}
                            onChange={(e) => {
                              setNewAppAffiliateLink({
                                ...newAppAffiliateLink,
                                programLink: e.target.value,
                              } as AppAffiliateLink);
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
                    name="programNotes"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Program Notes</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Program Notes"
                            value={newAppAffiliateLink?.programNotes}
                            onChange={(e) => {
                              setNewAppAffiliateLink({
                                ...newAppAffiliateLink,
                                programNotes: e.target.value,
                              } as AppAffiliateLink);
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
                    {isProcessing === false
                      ? "Add Affiliate Link"
                      : "Adding..."}
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
                  onClick={() => handleSort("normalLink")}
                  className="hover:bg-transparent"
                >
                  Normal Link
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("affiliateLink")}
                  className="hover:bg-transparent"
                >
                  Affiliate Link
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
                  onClick={() => handleSort("type")}
                  className="hover:bg-transparent"
                >
                  Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("programLink")}
                  className="hover:bg-transparent"
                >
                  Program Link
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("programNotes")}
                  className="hover:bg-transparent"
                >
                  Program Notes
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAffiliateLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <span className="block text-center">No data...</span>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {sortedAffiliateLinks.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.normalLink}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sub.affiliateLink}
                    </TableCell>
                    <TableCell>
                      {sub.isActive === true ? (
                        <span>Yes</span>
                      ) : (
                        <span>No</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{sub.type}</TableCell>
                    <TableCell className="font-medium">
                      {sub.programLink}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sub.programNotes}
                    </TableCell>
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

      {/* View Affiliate Link Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AffiliateLink Details</DialogTitle>
          </DialogHeader>
          {selectedAppAffiliateLink && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Normal Link:</Label>
                <span className="col-span-3">
                  {selectedAppAffiliateLink.normalLink ?? ""}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Affiliate Link:</Label>
                <span className="col-span-3">
                  {selectedAppAffiliateLink.affiliateLink ?? ""}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Active</Label>
                <span className="col-span-3">
                  {selectedAppAffiliateLink.isActive === true ? "Yes" : "No"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Type</Label>
                <span className="col-span-3">
                  {selectedAppAffiliateLink.type ?? ""}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Program Link</Label>
                <span className="col-span-3">
                  {selectedAppAffiliateLink.programLink ?? ""}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Program Notes</Label>
                <span className="col-span-3">
                  {selectedAppAffiliateLink.programNotes ?? ""}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Affiliate Link Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <DialogHeader>
                <DialogTitle>Edit Affiliate Link</DialogTitle>
              </DialogHeader>
              {selectedAppAffiliateLink && (
                <>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="normalLink"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Normal Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Normal Link"
                              value={selectedAppAffiliateLink?.normalLink}
                              onChange={(e) => {
                                setSelectedAppAffiliateLink({
                                  ...selectedAppAffiliateLink,
                                  normalLink: e.target.value,
                                } as AppAffiliateLink);
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
                      name="affiliateLink"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Affiliate Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Affiliate Link"
                              value={selectedAppAffiliateLink?.affiliateLink}
                              onChange={(e) => {
                                setSelectedAppAffiliateLink({
                                  ...selectedAppAffiliateLink,
                                  affiliateLink: e.target.value,
                                } as AppAffiliateLink);
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
                              checked={selectedAppAffiliateLink?.isActive}
                              onCheckedChange={(checked) => {
                                setSelectedAppAffiliateLink({
                                  ...selectedAppAffiliateLink,
                                  isActive: checked.valueOf() as boolean,
                                } as AppAffiliateLink);
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
                      name="type"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Type"
                              value={selectedAppAffiliateLink?.type}
                              onChange={(e) => {
                                setSelectedAppAffiliateLink({
                                  ...selectedAppAffiliateLink,
                                  type: e.target.value,
                                } as AppAffiliateLink);
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
                      name="programLink"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Program Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Program Link"
                              value={selectedAppAffiliateLink?.programLink}
                              onChange={(e) => {
                                setSelectedAppAffiliateLink({
                                  ...selectedAppAffiliateLink,
                                  programLink: e.target.value,
                                } as AppAffiliateLink);
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
                      name="programNotes"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                          <FormLabel>Program Notes</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="col-span-3"
                              placeholder="Program Notes"
                              value={selectedAppAffiliateLink?.programNotes}
                              onChange={(e) => {
                                setSelectedAppAffiliateLink({
                                  ...selectedAppAffiliateLink,
                                  programNotes: e.target.value,
                                } as AppAffiliateLink);
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
                    ? "Update Affiliate Link"
                    : "Updating..."}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete AffiliateLink Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Confirm Delete"
        description="Are you sure you want to delete link? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteAppAffiliateLink}
      />
    </div>
  );
}
