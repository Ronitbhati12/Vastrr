import React from "react";

export default function GlowCard() {
  return (
    <div className="relative flex flex-col justify-end gap-3 rounded-none bg-black p-6 text-white w-full h-full min-h-[380px] border border-[var(--theme-border)] overflow-hidden group cursor-pointer">
      
      {/* Animated Gradient Border */}
      <div 
        className="absolute -inset-[3px] -z-10 m-auto rounded-none bg-[linear-gradient(-45deg,#e81cff_0%,#40c9ff_100%)] transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:rotate-[-90deg] group-hover:scale-x-[1.34] group-hover:scale-y-[0.77]"
      />

      {/* Glow Blur */}
      <div className="absolute inset-0 -z-[1] bg-[linear-gradient(-45deg,#fc00ff_0%,#00dbde_100%)] blur-[25px] opacity-30 transition-all duration-500 group-hover:blur-[35px] group-hover:opacity-60" />

      {/* Content */}
      <div className="z-10 space-y-2 font-mono">
        <span className="text-[9px] text-[#40c9ff] tracking-[0.2em] font-bold uppercase">HOT RELEASE</span>
        
        <h3 className="text-xl font-bold uppercase tracking-tight font-display text-white leading-tight">
          Popular this month
        </h3>
        
        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-4">
          Powered By
        </p>
        
        <p className="text-xs font-semibold text-[#e81cff] uppercase tracking-wider">
          Vastrr &times; Uiverse
        </p>
      </div>

    </div>
  );
}
