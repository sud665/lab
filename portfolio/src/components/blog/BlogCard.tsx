'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import type { BlogPost } from '@/types'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="no-underline block">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-6 cursor-pointer">
          <div
            className="flex items-center gap-3 mb-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <time>{post.date}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h2>
          <p
            className="text-[0.9375rem] leading-relaxed mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}
