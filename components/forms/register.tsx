"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().min(1, "Email required").email("Enter valid email"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  async function onSubmit(values: RegisterValues) {
    const registerResponse = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!registerResponse.ok) {
      form.setError("email", {
        message: "Couldn't create account. Try again.",
      });
      return;
    }

    const result = await signIn("resend", {
      email: values.email,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      form.setError("email", {
        message: "Couldn't send sign-up link. Try again.",
      });
      return;
    }

    setSubmittedEmail(values.email);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {submittedEmail ? "Check your inbox" : "Create your account"}
      </h1>
      <p className="mt-2 text-base text-muted-foreground">
        {submittedEmail
          ? "We sent a one-click sign-up link to your email."
          : "Enter your details and we’ll send you a one-click sign-up link."}
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
            Use different details
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-6">
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!form.formState.errors.firstName}>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  className="h-14 md:text-base"
                  aria-invalid={!!form.formState.errors.firstName}
                  {...form.register("firstName")}
                />
                <FieldError errors={[form.formState.errors.firstName]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.lastName}>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  className="h-14 md:text-base"
                  aria-invalid={!!form.formState.errors.lastName}
                  {...form.register("lastName")}
                />
                <FieldError errors={[form.formState.errors.lastName]} />
              </Field>
            </div>

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
              Email me a sign-up link
            </Button>
          </FieldGroup>
        </form>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-foreground hover:text-primary">
          Sign in
        </a>
      </p>
    </div>
  );
}
