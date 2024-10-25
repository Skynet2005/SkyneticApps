// src/components/auth/login-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginSchema } from "@/schemas";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { CardWrapper } from "@/src/components/auth/card-wrapper";
import { Button } from "@/src/components/ui/button";
import { FormError } from "@/src/components/form-error";
import { FormSuccess } from "@/src/components/form-success";
import { login } from "@/src/actions/login";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginResponse = (data: any) => {
    if (data?.error) {
      form.reset();
      setError(data.error);
    }
    if (data?.success) {
      form.reset();
      setSuccess(data.success);
    }
    if (data?.twoFactor) {
      setShowTwoFactor(true);
    }
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then(handleLoginResponse)
        .catch(() => setError("Something went wrong"));
    });
  };

  const renderTwoFactorField = () => (
    <FormField
      control={form.control}
      name="code"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Two Factor Code</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={isPending}
              placeholder="8675301"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderEmailAndPasswordFields = () => (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={isPending}
                placeholder="skynetic@example.com"
                type="email"
                className="bg-neutral-100 border-neutral-900"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={isPending}
                placeholder="******"
                type="password"
                className="bg-neutral-100 border-neutral-900"
              />
            </FormControl>
            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 font-normal"
            >
              <Link href="/auth/reset">
                Forgot password?
              </Link>
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-4 rounded-md"
        >
          <div className="space-y-4">
            {showTwoFactor ? renderTwoFactorField() : renderEmailAndPasswordFields()}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full"
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
