import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section id="home" className="relative flex min-h-[100vh] items-start justify-center bg-black text-white pt-28 pb-32 md:pt-40 md:pb-40">
      <div className="container px-6 text-center">
        <motion.h1
          className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Build custom agentic AI agents that do specific tasks for you
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-2xl text-base/7 text-zinc-300 md:text-lg/8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          Specialized AI agents for code, business, marketing, and diet.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-6 flex justify-center gap-x-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        >
          <a
            href="/login"
            className="inline-flex items-center rounded-full border border-white bg-black px-4 py-2 font-medium text-white transition-colors duration-300 ease-in-out hover:border-black hover:bg-white hover:text-black active:border-black active:bg-white active:text-black"
          >
            Get Started — It's Free
          </a>
          <a
            href="/#pricing"
            className="inline-flex items-center rounded-full border border-white bg-black px-4 py-2 font-medium text-white transition-colors duration-300 ease-in-out hover:border-black hover:bg-white hover:text-black active:border-black active:bg-white active:text-black"
          >
            See Pricing
          </a>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 w-full max-w-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            <div
              className="aspect-[16/9] w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg')" }}
            />
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-20" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero