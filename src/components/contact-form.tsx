"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-line bg-mist px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-white";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-line bg-white p-10 text-center">
        <CheckCircle2 className="size-14 text-primary" />
        <h3 className="mt-4 text-xl font-bold text-ink">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-body">
          Thanks for reaching out — our team will get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="rounded-3xl border border-line bg-white p-7 sm:p-9"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <h3 className="text-xl font-bold text-ink">Send us a message</h3>
      <p className="mt-1.5 text-sm text-body">
        Questions about a booking, partnership, or long-term rental? Write to us.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input required placeholder="Full name" className={inputCls} />
        <input required type="email" placeholder="Email address" className={inputCls} />
        <input placeholder="Phone (optional)" className={`${inputCls} sm:col-span-2`} />
        <textarea
          required
          placeholder="Your message..."
          rows={5}
          className={`${inputCls} resize-none sm:col-span-2`}
        />
      </div>

      <button
        type="submit"
        className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
      >
        Send message
        <Send className="size-4" />
      </button>
    </form>
  );
}
