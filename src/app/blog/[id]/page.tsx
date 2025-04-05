import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

interface Props {
  params: {
    id: string  // This is actually the slug
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-500 text-sm mb-6">
            <span className="mr-4">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="mb-8 relative aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id} 
                  href={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {relatedPost.excerpt}
                      </p>
                    </div>
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
