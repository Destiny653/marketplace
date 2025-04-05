import HeroSlider from '@/components/home/HeroSlider'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import SuperDeal from '@/components/home/SuperDeal'
import PromoBanners from '@/components/home/PromoBanners'
import CategoryBlocks from '@/components/home/CategoryBlocks'
import LatestBlog from '@/components/home/LatestBlog'

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section with Full-width Slider */}
      <section className="relative">
        <HeroSlider />
      </section>
      
      {/* Featured Products - Main Products Display */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <FeaturedProducts title="Featured Products" viewMoreLink="/products" limit={6} />
        </div>
      </section>
      
      {/* Super Deal Countdown Section */}
      <section className="py-8">
        <SuperDeal />
      </section>
      
      {/* Shop By Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">SHOP BY CATEGORIES</h2>
          </div>
          <CategoryBlocks />
        </div>
      </section>
      
      {/* Multiple Promo Banners */}
      <section className="py-8">
        <PromoBanners />
      </section>
      
      {/* Featured Categories - Visual Navigation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">
              FEATURED PRODUCT
            </h2>
            <div className="flex">
              <a href="/products" className="text-blue-600 hover:underline flex items-center">
                VIEW MORE →
              </a>
            </div>
          </div>
          <FeaturedCategories />
        </div>
      </section>
      
      {/* Latest Blog Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">LATEST BLOG</h2>
            <a href="/blog" className="text-blue-600 hover:underline flex items-center">
              VIEW MORE →
            </a>
          </div>
          <LatestBlog />
        </div>
      </section>
    </main>
  )
}