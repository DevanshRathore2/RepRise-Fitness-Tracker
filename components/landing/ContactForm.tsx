"use client";

import React, { useState } from "react";
import { PaperPlaneTilt, CheckCircle, CaretDown } from "@phosphor-icons/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("fat_loss");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 800);
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-8 max-w-4xl mx-auto border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase font-display">
          CONNECT WITH OUR COACHING TEAM
        </h2>
        <p className="text-base text-zinc-300 leading-relaxed font-normal">
          Questions about custom macro plans, team athletic rosters, or enterprise integrations? Send us a message.
        </p>
      </div>

      <div className="p-8 sm:p-12 rounded-xl bg-surface-indigo border border-white/15 shadow-[0_3px_68px_rgba(69,42,124,0.3)] relative">
        {isSuccess ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] flex items-center justify-center shadow-[0_0_20px_rgba(53,237,126,0.4)]">
              <CheckCircle size={36} weight="fill" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase font-display">MESSAGE RECEIVED</h3>
            <p className="text-sm text-zinc-300 max-w-md">
              A sports nutritionist from our team will review your inquiry and respond within 24 hours.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSuccess(false)}
              className="mt-4"
            >
              SEND ANOTHER MESSAGE
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="Devansh Rathore"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 px-4 rounded-lg bg-[#070b24]/90 border border-white/20 text-white placeholder:text-zinc-400 focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/25 shadow-inner"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="devansh@reprise.fit"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 rounded-lg bg-[#070b24]/90 border border-white/20 text-white placeholder:text-zinc-400 focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/25 shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="athlete-goal"
                className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display"
              >
                ATHLETIC FOCUS
              </label>
              <div className="relative">
                <select
                  id="athlete-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full h-12 pl-4 pr-11 rounded-lg bg-[#070b24]/90 border border-white/20 text-white text-sm font-medium focus:outline-none focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/25 appearance-none cursor-pointer hover:border-white/30 transition-all shadow-inner"
                >
                  <option value="fat_loss" className="bg-[#0b0f33] text-white">Body Recomposition & Fat Loss</option>
                  <option value="muscle_gain" className="bg-[#0b0f33] text-white">Hypertrophy & Strength Gain</option>
                  <option value="endurance" className="bg-[#0b0f33] text-white">Endurance & Hybrid Race Prep</option>
                  <option value="coaching" className="bg-[#0b0f33] text-white">Coach / Team Roster Integration</option>
                </select>
                <CaretDown
                  size={16}
                  weight="bold"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-message"
                className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display"
              >
                TRANSMISSION MESSAGE
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                placeholder="Tell us about your current training split or specific nutrition targets..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-lg bg-[#070b24]/90 border border-white/20 text-white text-sm placeholder:text-zinc-400 font-medium transition-all focus:outline-none focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/25 hover:border-white/30 resize-none shadow-inner"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-8 h-12 rounded-lg font-bold text-sm uppercase tracking-wider gap-2 shadow-[0_4px_20px_rgba(88,101,242,0.35)] hover:shadow-[0_4px_24px_rgba(88,101,242,0.55)] cursor-pointer"
            >
              <span>{isSubmitting ? "TRANSMITTING..." : "SUBMIT INQUIRY"}</span>
              <PaperPlaneTilt size={18} weight="bold" />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
