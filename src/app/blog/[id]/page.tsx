import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/mockData/blogData'

// This is the correct type definition for Next.js 15
type Props = {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostBySlug(params.id)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: `${post.title} | Your Marketplace Blog`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.id)
  const relatedPosts = getRelatedBlogPosts(params.id, 3)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline flex items-center">
          ← Back to Blog
        </Link>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md mb-12">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-4">By {post.author}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/blog/${relatedPost.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <h3 className="font-medium text-lg text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <span>
                      {new Date(relatedPost.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
