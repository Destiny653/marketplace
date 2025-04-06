'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getLatestBlogPosts, MockBlogPost } from '@/lib/mockData/blogData'

export default function LatestBlog() {
  const [posts, setPosts] = useState<MockBlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use the mock data instead of fetching from the database
    const fetchPosts = () => {
      try {
        const latestPosts = getLatestBlogPosts(4)
        setPosts(latestPosts)
        setLoading(false)
      } catch (error) {
        console.error('Error getting blog posts:', error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg aspect-[16/9] mb-4"></div>
            <div className="space-y-3 p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          
          <div className="p-4">
            <Link href={`/blog/${post.slug}`}>
              <h3 className="font-medium text-lg text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
            </Link>
            
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <span className="mr-2">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              {post.excerpt}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}