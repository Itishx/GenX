import React from 'react'

const CustomAgentsIntro: React.FC = () => {
  return (
    <section className="bg-black py-24 text-white mt-16 md:mt-[5.5rem]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-y-10 md:flex-row md:items-center md:gap-x-12">
          {/* Left: Headline + Description */}
          <div className="w-full md:flex-1">
            <h3 className="text-5xl font-bold leading-tight">
              Create Custom AI agents that help you with all your end-to-end needs
            </h3>
            <p className="mt-4 max-w-md text-lg text-gray-400">
              From ideation to execution, AgentX gives you specialized AI agents to handle coding, marketing, business planning, and more.
            </p>
          </div>

          {/* Right: Image container */}
          <div className="w-full md:flex-1">
            <div className="mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
              <img
                src="/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg"
                alt="AgentX capabilities preview"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomAgentsIntro
