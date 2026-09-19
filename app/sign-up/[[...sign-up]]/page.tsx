import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Barbell } from "@phosphor-icons/react/dist/ssr";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#070921] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#35ed7e]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#5865f2]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#5865f2] flex items-center justify-center text-white shadow-[0_0_25px_rgba(88,101,242,0.5)] group-hover:scale-105 transition-transform">
            <Barbell size={22} weight="bold" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white font-display">
            REP<span className="text-[#5865f2]">RISE</span>
          </span>
        </Link>
        <p className="text-xs text-zinc-400 font-mono">Create your personalized athlete account</p>
      </div>

      {/* Clerk SignUp Component */}
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-[#0c1033]/95 border border-white/15 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden",
            headerTitle: "text-white font-display uppercase tracking-tight font-bold",
            headerSubtitle: "text-zinc-400 text-xs",
            formButtonPrimary:
              "bg-[#35ed7e] hover:bg-[#2ecc71] text-black text-xs font-extrabold font-mono tracking-wider uppercase py-3 rounded-xl shadow-[0_0_20px_rgba(53,237,126,0.4)] transition-all active:scale-[0.99]",
            formFieldInput:
              "bg-[#070a24] border-white/15 text-white placeholder:text-zinc-500 rounded-xl text-xs font-mono py-2.5 focus:border-[#35ed7e]",
            footer: "bg-[#080b23] border-t border-white/10",
            footerActionLink: "text-[#00b0f4] hover:text-white font-bold text-xs",
            footerActionText: "text-zinc-400 text-xs",
            socialButtonsBlockButton:
              "bg-[#13193e] border border-white/15 text-white hover:bg-[#1a2254] text-xs font-bold rounded-xl transition-all",
          },
        }}
      />
    </div>
  );
}
