"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useUser } from "@/lib/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, refetch, clear } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: ProfileValues) {
    setSaved(false);
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      form.setError("firstName", { message: "Couldn't save changes. Try again." });
      return;
    }

    await refetch();
    setSaved(true);
  }

  async function onDeleteAccount() {
    setDeleting(true);
    const res = await fetch("/api/me", { method: "DELETE" });

    if (!res.ok) {
      setDeleting(false);
      return;
    }

    clear();
    await signOut({ redirect: false });
    router.push("/login");
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-7 p-7">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details.
        </p>
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>Update your name below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-3">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!form.formState.errors.firstName}>
                    <FieldLabel htmlFor="firstName">First name</FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
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
                      aria-invalid={!!form.formState.errors.lastName}
                      {...form.register("lastName")}
                    />
                    <FieldError errors={[form.formState.errors.lastName]} />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input id="email" type="email" value={user?.email ?? ""} disabled readOnly />
                  <FieldDescription>
                    Email is tied to sign-in and can&apos;t be changed here.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3">
            {saved && (
              <span className="text-sm text-muted-foreground">Saved.</span>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="ring-destructive/20">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This can&apos;t be undone.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes your account and all associated data.
                  This action can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleting}
                  onClick={onDeleteAccount}
                >
                  {deleting ? "Deleting…" : "Delete account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
