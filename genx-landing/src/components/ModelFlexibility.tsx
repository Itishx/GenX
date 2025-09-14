import React from 'react'

const ModelFlexibility: React.FC = () => {
  return (
    <section className="bg-black pt-24 pb-0 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">FLEXIBILITY BUILT IN</span>
          <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
            Switch between AI models instantly.
          </h2>
          <p className="mt-4 text-base text-gray-400 md:text-lg">
            Choose the best AI model for your workflow — GPT for reasoning, Claude for creativity, Gemini for research, and more. Swap anytime without losing context.
          </p>
        </div>

        {/* Logos row */}
        <div className="mt-10 flex flex-col items-center gap-4 md:mt-12 md:flex-row md:justify-center md:gap-6">
          {['OpenAI', 'Claude', 'Gemini'].map((name) => (
            <div
              key={name}
              className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-black shadow-sm transition-transform duration-200 ease-out hover:scale-105 hover:shadow-xl"
              aria-label={`${name} logo placeholder`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Image container below logos */}
        <div className="mt-10 md:mt-12">
          <div className="mx-auto max-w-4xl aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            <img
              src="/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg"
              alt="Model switching preview"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModelFlexibility
