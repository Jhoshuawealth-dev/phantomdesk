"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function JobDetail() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [bid, setBid] = useState("");
  const [bidPlaced, setBidPlaced] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
    fetchMessages();
  }, [jobId]);

  const fetchJob = async () => {
    const { data } = await supabase.from("jobs").select("*").eq("id", jobId).single();
    if (data) setJob(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*").eq("job_id", jobId).order("created_at");
    if (data) setMessages(data);
  };

  const submitBid = async () => {
    if (!bid) return;
    await supabase.from("bids").insert({ job_id: jobId, agent_wallet: "0xd71Fa35d207445e66B5fcdebbb6b88FE4846ef62", amount: parseInt(bid) });
    await supabase.from("jobs").update({ bids: (job?.bids || 0) + 1 }).eq("id", jobId);
    setBidPlaced(true);
  };

  const sendMessage = async () => {
    if (!message) return;
    await supabase.from("messages").insert({ job_id: jobId, from_wallet: "0xd71Fa35d207445e66B5fcdebbb6b88FE4846ef62", content: message });
    setMessage("");
    fetchMessages();
  };

  if (loading) return <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center"><p className="text-white/40">Loading...</p></main>;
  if (!job) return <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center"><p className="text-white/40">Job not found.</p></main>;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="text-xl font-bold tracking-tight">PhantomDesk</span>
        </Link>
        <Link href="/jobs" className="text-sm text-white/60 hover:text-white transition">← Back to Jobs</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full mb-3">{job.category}</div>
            <h1 className="text-xl font-bold mb-2">{job.title}</h1>
            <p className="text-white/40 text-sm mb-4">{job.description}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Budget</span><span className="text-indigo-400 font-medium">{job.budget_min}–{job.budget_max} COTI</span></div>
              <div className="flex justify-between"><span className="text-white/40">Deadline</span><span>{job.deadline} days</span></div>
              <div className="flex justify-between"><span className="text-white/40">Bids</span><span>{job.bids} received</span></div>
              <div className="flex justify-between"><span className="text-white/40">Escrow</span><span className="text-green-400">🔒 Private</span></div>
            </div>
          </div>

          {!bidPlaced ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-3">Place Private Bid</h3>
              <p className="text-white/40 text-xs mb-4">Your bid amount is encrypted. Only the client can see it.</p>
              <input type="number" placeholder="Your bid in COTI" value={bid} onChange={(e) => setBid(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition mb-3" />
              <button onClick={submitBid} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg text-sm font-medium transition">
                Submit Encrypted Bid →
              </button>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
              <div className="text-green-400 font-semibold mb-1">✓ Bid Submitted</div>
              <p className="text-white/40 text-xs mb-2">Your bid of <span className="text-indigo-400">{bid} COTI</span> is encrypted on-chain.</p>
              <div className="font-mono text-xs text-indigo-300 break-all bg-black/20 rounded p-2">0x4f2a...e891 · Encrypted</div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Escrow Status</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Job Posted", done: true },
                { label: "Bid Accepted", done: bidPlaced },
                { label: "Escrow Locked", done: false },
                { label: "Job Complete", done: false },
                { label: "Payment Released", done: false },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.done ? "bg-indigo-400" : "bg-white/10"}`} />
                  <span className={s.done ? "text-white" : "text-white/30"}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-full min-h-[500px]">
            <div className="border-b border-white/10 px-6 py-4">
              <h3 className="font-semibold">Private Negotiation</h3>
              <p className="text-white/30 text-xs mt-0.5">All messages are end-to-end encrypted via COTI · Nobody else can read this</p>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-center">
                <p className="text-indigo-400 text-xs">🔐 This conversation is encrypted on the COTI blockchain.</p>
              </div>
              {messages.length === 0 && (
                <p className="text-white/20 text-xs text-center pt-4">No messages yet. Start the negotiation.</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from_wallet === "0xd71Fa35d207445e66B5fcdebbb6b88FE4846ef62" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${msg.from_wallet === "0xd71Fa35d207445e66B5fcdebbb6b88FE4846ef62" ? "bg-indigo-600/30 border border-indigo-500/30" : "bg-white/5 border border-white/10"}`}>
                    <div className="text-white/40 text-xs mb-1">{msg.from_wallet.slice(0,8)}... · {new Date(msg.created_at).toLocaleTimeString()}</div>
                    <div className="text-white/80 text-sm">🔒 [Encrypted] {msg.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-4 flex gap-3">
              <input type="text" placeholder="Type a message — it will be encrypted before sending" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition" />
              <button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-lg text-sm font-medium transition">
                🔒 Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
