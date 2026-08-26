'use client'

import { PLATFORMS } from '@/lib/platforms'
import { PlatformIcon } from '@/components/platform-icon'
import { motion } from 'framer-motion'

export function LandingPlatforms() {
  return (
    <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7">
      {PLATFORMS.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="flex flex-col items-center gap-2 rounded-xl bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${p.color}15` }}
          >
            <PlatformIcon icon={p.icon} platformId={p.id} color={p.color} size={24} />
          </div>
          <span className="text-xs font-medium text-center">{p.name}</span>
        </motion.div>
      ))}
    </div>
  )
}
