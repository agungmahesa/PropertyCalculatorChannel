const config = {
  plugins: {
    "@tailwindcss/postcss": {
      config: {
        content: [
          "/Users/agung/.gemini/antigravity/playground/stellar-viking/pages/**/*.{js,ts,jsx,tsx,mdx}",
          "/Users/agung/.gemini/antigravity/playground/stellar-viking/components/**/*.{js,ts,jsx,tsx,mdx}",
          "/Users/agung/.gemini/antigravity/playground/stellar-viking/app/**/*.{js,ts,jsx,tsx,mdx}",
        ],
        safelist: [
          "p-8", "p-6", "space-y-8", "space-y-6", "grid-cols-1", "grid-cols-2", "grid-cols-4",
          "grid-cols-5", "grid-cols-12", "lg:grid-cols-2", "md:grid-cols-2", "md:grid-cols-5",
          "col-span-8", "col-span-4", "gap-3", "gap-4", "gap-6", "gap-8", "rounded-xl", "border",
          "rounded-xl",
          "border",
          "bg-white",
          "bg-indigo-600",
          "bg-slate-50",
          "bg-green-50",
          "bg-red-50",
          "bg-emerald-50",
          "text-green-700",
          "text-red-700",
          "text-emerald-700",
          "text-emerald-600",
          "hover:bg-slate-50",
          "rounded-full",
          "px-2",
          "py-1"
        ],
        theme: {
          extend: {
            colors: {
              background: "var(--background)",
              foreground: "var(--foreground)",
            },
          },
        },
        plugins: [],
      }
    },
  },
};
export default config;
