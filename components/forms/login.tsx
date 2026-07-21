"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const loginSchema = z.object({
  email: z.string().min(1, "Email required").email("Enter valid email"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: LoginValues) {
    const result = await signIn("resend", {
      email: values.email,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      form.setError("email", {
        message: "Couldn't send sign-in link. Try again.",
      });
      return;
    }

    setSubmittedEmail(values.email);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {submittedEmail ? "Check your inbox" : "Sign in"}
      </h1>
      <p className="mt-2 text-base text-muted-foreground">
        {submittedEmail
          ? "We sent a one-click sign-in link to your email."
          : "Enter your email and we’ll send you a one-click sign-in link."}
      </p>

      {submittedEmail ? (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm">Email address</label>
            <div className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground h-14 text-base flex items-center">
              {submittedEmail}
            </div>
          </div>
          <Button
            size="lg"
            className="w-full h-auto p-3 rounded-full bg-primary text-base text-primary-foreground hover:bg-primary-hover"
            onClick={() => {
              form.reset();
              setSubmittedEmail(null);
            }}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-6">
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-14 md:text-base"
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Button
              type="submit"
              size="lg"
              className="w-full h-auto p-3 rounded-full bg-primary text-base text-primary-foreground hover:bg-primary-hover"
              disabled={form.formState.isSubmitting}
            >
              Email me a sign-in link
            </Button>
          </FieldGroup>
        </form>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        New to Campaignr?{" "}
        <a href="/register" className="font-semibold text-foreground hover:text-primary">
          Sign up
        </a>
      </p>
    </div>
  );
}
