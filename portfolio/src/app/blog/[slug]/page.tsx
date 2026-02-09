import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { Badge } from '@/components/ui'
import { TableOfContents } from '@/components/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  if (!result) return { title: 'Not Found' }

  return {
    title: `${result.post.title} | Max`,
    description: result.post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const result = await getPostBySlug(slug)

  if (!result) {
    notFound()
  }

  const { post, content } = result

  return (
    <main className="min-h-screen px-6 pt-24 pb-16 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto xl:mx-0 xl:max-w-none xl:grid xl:grid-cols-[1fr_220px] xl:gap-12">
        <div className="max-w-3xl">
          <Link
            href="/blog"
            className="text-sm no-underline inline-flex items-center gap-1 mb-8 transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
          >
            &larr; Back to Blog
          </Link>

          <header className="mb-10">
            <div
              className="flex items-center gap-3 mb-3 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <time>{post.date}</time>
              <span>&middot;</span>
              <span>{post.readingTime}</span>
            </div>
            <h1
              className="text-4xl font-bold leading-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {post.title}
            </h1>
            <p
              className="text-lg leading-relaxed mb-4"
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
          </header>

          <hr
            className="mb-10"
            style={{
              border: 'none',
              borderTop: '1px solid var(--border-default)',
            }}
          />

          <article className="max-w-none">
            {content}
          </article>
        </div>

        {post.content && (
          <aside className="hidden xl:block">
            <TableOfContents content={post.content} />
          </aside>
        )}
      </div>
    </main>
  )
}
