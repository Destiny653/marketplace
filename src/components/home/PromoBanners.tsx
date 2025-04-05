'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PromoBanners() {
  const banners = [
    {
      title: "55% OFF !",
      subtitle: "ELECTRONICS",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      buttonText: "SHOP NOW",
      buttonLink: "/categories/electronics",
      bgColor: "bg-red-100"
    },
    {
      title: "WARDROBE",
      subtitle: "SHOP NOW",
      price: "$150.00",
      priceLabel: "STARTING FROM",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop",
      buttonText: "SHOP NOW",
      buttonLink: "/categories/wardrobe",
      bgColor: "bg-blue-100"
    },
    {
      title: "FURNISH WEEK",
      subtitle: "SALE !!",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
      buttonText: "SHOP NOW",
      buttonLink: "/categories/furniture",
      bgColor: "bg-orange-100"
    },
    {
      title: "COSMETICS ITEM",
      subtitle: "OFFER",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
      buttonText: "SHOP NOW",
      buttonLink: "/categories/cosmetics",
      bgColor: "bg-purple-100"
    },
    {
      title: "MEN'S STYLE",
      subtitle: "UPTO 15%OFF !",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
      buttonText: "SHOP NOW",
      buttonLink: "/categories/mens",
      bgColor: "bg-pink-100"
    },
    {
      title: "SMART WATCH",
      subtitle: "SHOP NOW",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      buttonText: "SHOP NOW",
      buttonLink: "/categories/watch",
      bgColor: "bg-blue-100"
    }
  ]

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.slice(0, 6).map((banner, index) => (
          <div key={index} className={`${banner.bgColor} rounded-lg overflow-hidden relative`}>
            <div className="flex h-48">
              <div className="w-1/2 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                <h4 className="text-lg font-bold text-blue-700 mb-2">{banner.subtitle}</h4>
                {banner.priceLabel && (
                  <div className="mb-2">
                    <p className="text-sm mb-1">{banner.priceLabel}</p>
                    <p className="text-xl font-bold text-blue-600">{banner.price}</p>
                  </div>
                )}
                <Link 
                  href={banner.buttonLink}
                  className="inline-block text-blue-600 font-medium hover:underline mt-2"
                >
                  {banner.buttonText} →
                </Link>
              </div>
              <div className="w-1/2 relative">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}