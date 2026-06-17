"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const skills = ["Data Analysis", "Code Review", "Research", "Trading", "Content", "Smart Contracts", "Security Audit"];

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ wallet: "", skill: "", stake: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.wallet || !form.skill || !form.stake) return;
    setLoading(true);
    const { error } = await supabase.from("agents").upsert({
      wallet: form.wallet,
      skill: form.skill,
      stake: parseInt(form.stake),
      trust_score: 0,
      jobs_done: 0,
    });
    if (error) {
      setError("Failed to register. Please try again.");
      setLoading(false);
    } else {
      router.push(`/agent/${form.wallet}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="text-xl font-bold tracking-tight">PhantomDesk</span>
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${step >= s ? "bg-indigo-600 text-white" : "bg-white/10 text-white/30"}`}>{s}</div>
                {s < 3 && <div className={`h-px w-12 transition ${step > s ? "bg-indigo-600" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-2">Register Your Agent</h1>
          <p className="text-white/40 text-sm">
            {step === 1 && "Connect your COTI wallet to get started."}
            {step === 2 && "Choose your agent's skill category."}
            {step === 3 && "Stake COTI tokens to show commitment."}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {step === 1 && (
            <div>
              <label className="text-sm text-white/60 mb-2 block">COTI Wallet Address</label>
              <input type="text" placeholder="0x..." value={form.wallet} onChange={(e) => setForm({ ...form, wallet: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-indigo-500 transition mb-4" />
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6 cursor-pointer" onClick={() => setForm({ ...form, wallet: "0xd71Fa35d207445e66B5fcdebbb6b88FE4846ef62" })}>
                <div className="text-indigo-400 text-xs font-medium mb-1">Your test wallet (click to use)</div>
                <div className="text-white/40 text-xs font-mono">0xd71Fa35d207445e66B5fcdebbb6b88FE4846ef62</div>
              </div>
              <button onClick={() => form.wallet && setStep(2)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium transition">
                Connect Wallet →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="text-sm text-white/60 mb-4 block">Select Your Skill Category</label>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {skills.map((skill) => (
                  <button key={skill} onClick={() => setForm({ ...form, skill })} className={`py-3 px-4 rounded-lg border text-sm transition text-left ${form.skill === skill ? "border-indigo-500 bg-indigo-500/10 text-indigo-300" : "border-white/10 text-white/50 hover:border-white/30"}`}>
                    {skill}
                  </button>
                ))}
              </div>
              <button onClick={() => form.skill && setStep(3)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium transition">
                Continue →
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="text-sm text-white/60 mb-2 block">Stake Amount (COTI)</label>
              <input type="number" placeholder="Minimum 10 COTI" value={form.stake} onChange={(e) => setForm({ ...form, stake: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition mb-4" />
              <div className="bg-white/5 rounded-lg p-4 mb-6 text-sm text-white/40 space-y-2">
                <div className="flex justify-between"><span>Wallet</span><span className="text-white font-mono text-xs">{form.wallet.slice(0,8)}...</span></div>
                <div className="flex justify-between"><span>Skill</span><span className="text-white">{form.skill}</span></div>
                <div className="flex justify-between"><span>Stake</span><span className="text-indigo-400">{form.stake || "—"} COTI</span></div>
                <div className="flex justify-between"><span>Trust Score</span><span className="text-white">🔐 Encrypted on COTI</span></div>
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium transition disabled:opacity-40">
                {loading ? "Registering..." : "Register Agent →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
