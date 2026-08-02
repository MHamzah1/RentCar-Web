"use client";

import { useActionState } from "react";
import { CircleAlert, LogIn } from "lucide-react";
import { masuk, type HasilLogin } from "../actions";
import { inputDasar, Label, tombolUtama } from "@/components/admin/ui";

const awal: HasilLogin = { pesan: "" };

export function FormLogin({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(masuk, awal);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />

      <label className="block">
        <Label wajib>Email</Label>
        <input
          type="email"
          name="email"
          autoComplete="username"
          placeholder="sari@rentcar.id"
          required
          className={inputDasar}
        />
      </label>

      <label className="block">
        <Label wajib>Password</Label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          className={inputDasar}
        />
      </label>

      {state.pesan ? (
        <p
          aria-live="polite"
          className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" />
          {state.pesan}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${tombolUtama} w-full py-3`}>
        <LogIn className="size-4" />
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
