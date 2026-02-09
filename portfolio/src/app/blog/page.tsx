import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { BlogCard } from '@/components/blog'

export const metadata: Metadata = {
  title: 'Blog | Max',
  description: 'Development insights, AI engineering, and creative coding.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen px-6 pt-24 pb-16 max-w-3xl mx-auto">
      <h1
        className="text-4xl font-bold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Blog
      </h1>
      <p
        className="text-lg mb-12"
        style={{ color: 'var(--text-secondary)' }}
      >
        Development insights, AI engineering, and creative coding.
      </p>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
