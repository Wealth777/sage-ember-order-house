import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { goAfterLogin } from "@/components/site/DemoAccounts";
import { RESTAURANT } from "@/lib/config";
import { register } from "@/services/auth";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => ({
    meta: [
      { title: `Create an account — ${RESTAURANT.name}` },
      { name: "description", content: "Create a customer account to order online and track your orders." },
      { property: "og:title", content: `Create an account — ${RESTAURANT.name}` },
      { property: "og:description", content: "Join to order online and track your orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name").max(80),
    email: z.string().trim().email("Please enter a valid email").max(120),
    phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
    password: z.string().min(6, "Password must be at least 6 characters").max(64),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

type Fields = z.infer<typeof schema>;

function RegisterPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const [form, setForm] = useState<Fields>({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | "form", string>>>({});
  const [busy, setBusy] = useState(false);

  const field = (key: keyof Fields, label: string, type = "text", autoComplete?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="h-11"
        aria-invalid={Boolean(errors[key])}
      />
      {errors[key] && <p className="text-xs font-semibold text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <AuthLayout>
      <h1 className="text-4xl font-semibold">Create your account</h1>
      <p className="mt-2 text-muted-foreground">Order in seconds and follow every order live.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const parsed = schema.safeParse(form);
          if (!parsed.success) {
            const errs: Partial<Record<keyof Fields, string>> = {};
            for (const issue of parsed.error.issues) errs[issue.path[0] as keyof Fields] ??= issue.message;
            setErrors(errs);
            return;
          }
          setErrors({});
          setBusy(true);
          setTimeout(() => {
            try {
              const user = register(parsed.data);
              toast.success(`Welcome to ${RESTAURANT.name}, ${user.name.split(" ")[0]}!`);
              goAfterLogin(router, user.role, redirect);
            } catch (err) {
              setErrors({ form: (err as Error).message });
              setBusy(false);
            }
          }, 400);
        }}
      >
        {field("name", "Full name", "text", "name")}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("email", "Email", "email", "email")}
          {field("phone", "Phone", "tel", "tel")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("password", "Password", "password", "new-password")}
          {field("confirm", "Confirm password", "password", "new-password")}
        </div>
        {errors.form && <p className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">{errors.form}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" search={redirect ? { redirect } : {}} className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
