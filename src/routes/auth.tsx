import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, KeyRound, LockKeyhole, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in privately — CrwdNet" },
      { name: "description", content: "Use CrwdNet with a private pseudonymous account." },
      { property: "og:title", content: "Sign in privately — CrwdNet" },
      { property: "og:description", content: "Use CrwdNet with a private pseudonymous account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alias, setAlias] = useState("");
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/" });
    });
  }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setWorking(true);
    setMessage("");
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else void navigate({ to: "/" });
    } else {
      const cleanAlias = alias.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
      if (!cleanAlias) {
        setMessage("Choose a short public alias.");
        setWorking(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { alias: cleanAlias }, emailRedirectTo: window.location.origin },
      });
      if (error) setMessage(error.message);
      else if (data.session && data.user) {
        await supabase.from("profiles").upsert({ user_id: data.user.id, alias: cleanAlias }, { onConflict: "user_id" });
        void navigate({ to: "/" });
      } else setMessage("Check your email to confirm your private account, then sign in.");
    }
    setWorking(false);
  }

  async function googleSignIn() {
    setWorking(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setMessage(result.error.message);
      setWorking(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><span className="display-type text-lg font-bold">CrwdNet<span className="text-primary">.</span></span></Link>
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to explore</Link>
      </div>
      <div className="mx-auto grid max-w-5xl gap-10 py-14 lg:grid-cols-[0.9fr_1fr] lg:items-center lg:py-24">
        <div><Badge variant="secondary" className="gap-2"><LockKeyhole className="size-3.5" /> Privacy-first access</Badge><h1 className="display-type mt-6 text-4xl font-bold leading-tight sm:text-5xl">Join the signal,<br /><span className="text-primary">not the exposure.</span></h1><p className="mt-5 max-w-md leading-7 text-muted-foreground">Your public identity is a pseudonym. Your phone number and exact location stay out of the network.</p></div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex border-b border-border"><button className={`flex-1 border-b-2 pb-3 text-sm font-bold ${mode === "signin" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`} onClick={() => { setMode("signin"); setMessage(""); }}>Sign in</button><button className={`flex-1 border-b-2 pb-3 text-sm font-bold ${mode === "signup" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`} onClick={() => { setMode("signup"); setMessage(""); }}>Create account</button></div>
          <form className="mt-7 space-y-4" onSubmit={submit}>{mode === "signup" && <label className="block text-sm font-semibold">Public alias<Input value={alias} onChange={(event) => setAlias(event.target.value)} className="mt-2 h-11" placeholder="nightowl_7" maxLength={24} required /><span className="mt-1 block text-xs font-normal text-muted-foreground">This is the only identity others may see.</span></label>}<label className="block text-sm font-semibold">Email<Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11" placeholder="you@example.com" required /></label><label className="block text-sm font-semibold">Password<Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11" placeholder="At least 8 characters" minLength={8} required /></label>{message && <p className="rounded-lg bg-secondary px-3 py-2 text-sm leading-5 text-secondary-foreground">{message}</p>}<Button type="submit" className="h-11 w-full" disabled={working}>{working ? "Working..." : mode === "signin" ? "Sign in privately" : "Create private account"}</Button></form>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div><Button variant="outline" className="h-11 w-full" onClick={googleSignIn} disabled={working}><KeyRound className="size-4" /> Continue with Google</Button><p className="mt-5 text-center text-xs leading-5 text-muted-foreground">Community signals are estimates and expire automatically.</p>
        </div>
      </div>
    </main>
  );
}