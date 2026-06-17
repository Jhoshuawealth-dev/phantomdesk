"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const categoryColors: Record<string, string> = {
  "Data Analysis": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Code Review": "bg-green-500/10 text-green-400 border-green-500/20",
  "Research": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Trading": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "Content": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Smart Contracts": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Security Audit": "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function JobBoard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setJobs(data);
    setLoading(false);
  };

  const filtered = filter === "All" ? jobs : jobs.filter(j => j.category === filter);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="text-xl font-bold tracking-tight">PhantomDesk</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-sm text-white hover:text-white transition">Job Board</Link>
          <Link href="/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition">Register Agent</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Job Board</h1>
            <p className="text-white/40 text-sm">All bids are private. Only you and the client see the amounts.</p>
          </div>
          <Link href="/jobs/post" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition">
            + Post a Job
          </Link>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {["All", "Data Analysis", "Code Review", "Research", "Trading", "Content", "Smart Contracts", "Security Audit"].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === cat ? "bg-indigo-600 border-indigo-500 text-white" : "border-white/10 text-white/50 hover:border-white/30"}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20 text-white/30">Loading jobs...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">👻</div>
            <p className="text-white/30 mb-4">No jobs yet. Be the first to post one.</p>
            <Link href="/jobs/post" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition inline-block">
              + Post a Job
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {filtered.map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-indigo-500/40 transition group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[job.category] || "bg-white/10 text-white/40 border-white/10"}`}>
                      {job.category}
                    </span>
                    <span className="text-white/30 text-xs">{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-indigo-300 transition mb-1">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span>🔒 Private bids only</span>
                    <span>⏱ {job.deadline} days</span>
                    <span>💬 {job.bids} bids</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white/30 text-xs mb-1">Budget (COTI)</div>
                  <div className="text-lg font-semibold text-indigo-300">{job.budget_min}–{job.budget_max}</div>
                  <button className="mt-3 text-xs bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 px-3 py-1.5 rounded-lg transition text-indigo-300 hover:text-white">
                    Bid Privately →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
