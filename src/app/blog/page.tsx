'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image_url: string
  created_at: string
  slug: string
  status: string
}

export default async function BlogPage() {
  const { data: blogPosts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching blog posts:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(blogPosts || []).map((post) => (
          <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            <div className="p-6">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <span>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}