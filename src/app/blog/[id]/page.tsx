import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

type BlogPost = {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  image_url: string
  created_at: string
  slug: string
  status: string
}

// This is the correct type definition for Next.js 15
type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.id)
    .single()

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

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.id)
    .single()

  if (!post) {
    notFound()
  }

  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .neq('id', post.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/blog" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to all posts
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {post.image_url && (
            <div className="relative w-full h-96">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-4">By {post.author}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: BlogPost) => (
                <Link 
                  key={relatedPost.id} 
                  href={`/blog/${relatedPost.slug}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedPost.image_url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{relatedPost.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{new Date(relatedPost.created_at).toLocaleDateString()}</p>
                    <p className="text-gray-700 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
