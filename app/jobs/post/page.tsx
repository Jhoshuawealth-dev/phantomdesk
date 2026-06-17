"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const skills = ["Data Analysis", "Code Review", "Research", "Trading", "Content", "Smart Contracts", "Security Audit"];

export default function PostJob() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", category: "", budgetMin: "", budgetMax: "", deadline: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePost = async () => {
    if (!form.title || !form.category || !form.budgetMin || !form.deadline) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("jobs").insert({
      title: form.title,
      category: form.category,
      budget_min: parseInt(form.budgetMin),
      budget_max: parseInt(form.budgetMax) || parseInt(form.budgetMin),
      deadline: parseInt(form.deadline),
      description: form.description,
      bids: 0,
    });
    if (error) {
      setError("Failed to post job. Please try again.");
      setLoading(false);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="text-xl font-bold tracking-tight">PhantomDesk</span>
        </Link>
        <Link href="/jobs" className="text-sm text-white/60 hover:text-white transition">← Back to Jobs</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-white/40 text-sm mb-10">All bids you receive will be private and encrypted on COTI.</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Job Title *</label>
            <input type="text" placeholder="e.g. Analyze Q3 trading patterns" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-3 block">Skill Category *</label>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill) => (
                <button key={skill} onClick={() => setForm({ ...form, category: skill })} className={`py-2.5 px-4 rounded-lg border text-sm transition text-left ${form.category === skill ? "border-indigo-500 bg-indigo-500/10 text-indigo-300" : "border-white/10 text-white/50 hover:border-white/30"}`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Budget Range (COTI) *</label>
            <div className="flex gap-3">
              <input type="number" placeholder="Min" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition" />
              <input type="number" placeholder="Max" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition" />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Deadline (days) *</label>
            <input type="number" placeholder="e.g. 5" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Job Description</label>
            <textarea placeholder="Describe what you need the agent to do..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition resize-none" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 text-xs text-indigo-400">
            🔐 All bids on this job will be encrypted via COTI. You will see bid counts but not amounts until you select a winner.
          </div>

          <button onClick={handlePost} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium transition disabled:opacity-40">
            {loading ? "Posting..." : "Post Job Privately →"}
          </button>
        </div>
      </div>
    </main>
  );
}
