"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCurrentUser } from "@/hooks/use-current-user";
import { UserSchema } from "@/schemas";
import { UserRole } from "@prisma/client";

import { settings } from "@/actions/settings";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-sucess";

const ProfilePage = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const user = useCurrentUser();

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      subscriptionType: undefined,
      discount: undefined,
      monthlyTotal: undefined,
      userImage: user?.image || undefined,
      aiApiInToken: undefined,
      aiApiOutToken: undefined,
      isActive: undefined,
      realApiCalls: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof UserSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return <></>;
};

export default ProfilePage;
