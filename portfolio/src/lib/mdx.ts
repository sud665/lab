import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { mdxComponents } from '@/components/blog/MdxComponents'
import type { BlogPost } from '@/types'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return []
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts: BlogPost[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const filePath = path.join(BLOG_DIR, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ?? '',
      tags: data.tags ?? [],
      readingTime: data.readingTime ?? calculateReadingTime(content),
    }
  })

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content: rawContent } = matter(fileContent)

  const { content } = await compileMDX({
    source: rawContent,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode, { theme: 'github-dark' }],
        ],
      },
    },
  })

  const post: BlogPost = {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    readingTime: data.readingTime ?? calculateReadingTime(rawContent),
    content: rawContent,
  }

  return { post, content }
}
