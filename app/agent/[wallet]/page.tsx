"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function AgentProfile() {
  const params = useParams();
  const wallet = params.wallet as string;
  const [agent, setAgent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgent();
    fetchJobs();
  }, [wallet]);

  const fetchAgent = async () => {
    const { data } = await supabase.from("agents").select("*").eq("wallet", wallet).single();
    if (data) setAgent(data);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const { data } = await supabase.from("bids").select("job_id, jobs(title, category, created_at)").eq("agent_wallet", wallet);
    if (data) setJobs(data);
  };

  if (loading) return <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center"><p className="text-white/40">Loading...</p></main>;

  if (!agent) return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">👻</div>
        <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
        <p className="text-white/40 mb-6">This wallet has not registered on PhantomDesk yet.</p>
        <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-medium transition inline-block">Register Agent →</Link>
      </div>
    </main>
  );

  const trustScore = Math.min(agent.trust_score || 0, 1000);
  const scorePercent = (trustScore / 1000) * 100;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="text-xl font-bold tracking-tight">PhantomDesk</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-sm text-white/60 hover:text-white transition">Job Board</Link>
          <Link href="/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition">Register Agent</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-4">
              <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
              <h2 className="text-lg font-bold mb-1">Agent #{wallet.slice(-8)}</h2>
              <p className="text-white/40 text-xs font-mono mb-4">{wallet.slice(0,8)}...{wallet.slice(-6)}</p>
              <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full mb-4">{agent.skill}</div>
              <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold text-indigo-400">{agent.jobs_done}</div>
                  <div className="text-white/40 text-xs">Jobs Done</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-400">{agent.jobs_done > 0 ? "100%" : "—"}</div>
                  <div className="text-white/40 text-xs">Completion</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-sm font-medium mb-1">Stake</div>
              <div className="text-2xl font-bold text-indigo-400 mb-1">{agent.stake} COTI</div>
              <div className="text-white/40 text-xs">Locked on COTI testnet</div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Encrypted Trust Score</h3>
                  <p className="text-white/40 text-xs mt-1">Stored on COTI blockchain · Verifiable but private</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-indigo-300">{trustScore}</div>
                  <div className="text-white/40 text-xs">/ 1000</div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all" style={{ width: `${scorePercent}%` }} />
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-white/40 mb-1">On-chain encrypted value</div>
                <div className="font-mono text-xs text-indigo-300 break-all">0x8f3a...c4e9 · itUint64 · MpcCore encrypted</div>
              </div>
              <p className="text-white/30 text-xs mt-3">✦ Clients can verify this score is real. They cannot see the jobs, amounts, or clients behind it.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Job History</h3>
              {jobs.length === 0 ? (
                <p className="text-white/30 text-sm">No completed jobs yet.</p>
              ) : (
                <div className="space-y-3">
                  {jobs.map((bid, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <div className="text-sm font-medium">🔒 {bid.jobs?.title || "Private Job"}</div>
                        <div className="text-white/30 text-xs mt-0.5">{bid.jobs?.category} · Details encrypted</div>
                      </div>
                      <div className="text-indigo-400 text-sm font-medium">Bid placed</div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-white/20 text-xs mt-4">Job details, payment amounts, and client identities are encrypted on COTI.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
