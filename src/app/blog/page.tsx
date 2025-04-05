'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
}

export default function BlogPage() {
  // Blog posts with high-quality online images
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Grab the New Year 2023 summer sale products',
      excerpt: 'Ultricies! Impedit commodi semper metus accusamus. Ultrices minus luctus facilis fuga harum!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
      date: '2023-03-27T10:00:00Z',
      author: 'Admin'
    },
    {
      id: '2',
      title: 'Happy customer after buying goods from us.',
      excerpt: 'Ultricies! Impedit commodi semper metus accusamus. Ultrices minus luctus facilis fuga harum!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      image: 'https://images.unsplash.com/photo-1529720317453-c8da503f2051?q=80&w=1000&auto=format&fit=crop',
      date: '2023-03-27T09:00:00Z',
      author: 'Admin'
    },
    {
      id: '3',
      title: 'Let\'s the world know how much stylish you are !',
      excerpt: 'Ultricies! Impedit commodi semper metus accusamus. Ultrices minus luctus facilis fuga harum!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop',
      date: '2023-03-27T08:00:00Z',
      author: 'Admin'
    },
    {
      id: '4',
      title: 'Brand new summer update for fashionable wear',
      excerpt: 'Ultricies! Impedit commodi semper metus accusamus. Ultrices minus luctus facilis fuga harum!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      image: 'https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?q=80&w=1000&auto=format&fit=crop',
      date: '2023-03-27T07:00:00Z',
      author: 'Admin'
    },
    {
      id: '5',
      title: 'Top fashion trends for the upcoming season',
      excerpt: 'Ultricies! Impedit commodi semper metus accusamus. Ultrices minus luctus facilis fuga harum!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
      date: '2023-03-26T10:00:00Z',
      author: 'Admin'
    },
    {
      id: '6',
      title: 'How to choose the perfect watch for your style',
      excerpt: 'Ultricies! Impedit commodi semper metus accusamus. Ultrices minus luctus facilis fuga harum!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop',
      date: '2023-03-26T09:00:00Z',
      author: 'Admin'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/blog/${post.id}`} className="block">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            <div className="p-6">
              <Link href={`/blog/${post.id}`}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <span className="mr-4">
                  <span className="font-medium">By:</span> {post.author}
                </span>
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
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
                href={`/blog/${post.id}`}
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