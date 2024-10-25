"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";

import { useCurrentUser } from "@/src/hooks/use-current-user";
import { settings } from "@/src/actions/settings";
import { SettingsSchema } from "@/schemas";

import { Card, CardHeader, CardContent, } from "@/src/components/ui/card";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage, } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { FormError } from "@/src/components/form-error";
import { FormSuccess } from "@/src/components/form-success";

const SettingsPage = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
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

  return (
    <Card className="w-[600px] bg-gradient-to-b from-neutral-400/90 to-neutral-700/90">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {renderFormFields(form, isPending, { isOAuth: user?.isOAuth })}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const renderFormFields = (
  form: ReturnType<typeof useForm<z.infer<typeof SettingsSchema>>>,
  isPending: boolean,
  user: { isOAuth?: boolean }
) => {
  const fields = [
    {
      name: "name" as const,
      label: "Name",
      placeholder: "Skynetic",
      type: "text",
      disabled: isPending,
      description: "Enter your full name",
    },
    {
      name: "email" as const,
      label: "Email",
      placeholder: "skynetic@example.com",
      type: "email",
      disabled: isPending || user?.isOAuth,
      readOnly: user?.isOAuth,
      description: "Enter your email address",
    },
    {
      name: "password" as const,
      label: "Password",
      placeholder: "******",
      type: "password",
      disabled: isPending || user?.isOAuth,
      readOnly: user?.isOAuth,
      description: "Enter your current password",
    },
    {
      name: "newPassword" as const,
      label: "New Password",
      placeholder: "******",
      type: "password",
      disabled: isPending || user?.isOAuth,
      readOnly: user?.isOAuth,
      description: "Enter a new password",
    },
  ];

  return fields.map(({ name, label, placeholder, type, disabled, readOnly, description }) => (
    <FormField
      key={name}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormDescription className="text-neutral-200">{description}</FormDescription>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              readOnly={readOnly}
              className="bg-neutral-100 border-neutral-900 dark:text-neutral-900"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
};

export default SettingsPage;
