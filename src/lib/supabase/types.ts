export interface Database {
    public: {
      Tables: {
        products: {
          Row: {
            id: string
            created_at: string
            name: string
            description: string
            price: number
            image_url: string
            category_id: string
            stock_quantity: number
            avg_rating: number
            is_featured: boolean
            is_on_sale: boolean
            sale_price?: number
          }
          Insert: {
            name: string
            description: string
            price: number
            image_url: string
            category_id: string
            stock_quantity?: number
            is_featured?: boolean
            is_on_sale?: boolean
            sale_price?: number
          }
        }
        categories: {
          Row: {
            id: string
            name: string
            description?: string
            image_url?: string
          }
        }
        wishlists: {
          Row: {
            id: string
            user_id: string
            product_id: string
            created_at: string
          }
          Insert: {
            user_id: string
            product_id: string
          }
        }
      }
    }
  }
  
  export type Product = Database['public']['Tables']['products']['Row']
  export type Category = Database['public']['Tables']['categories']['Row']
  export type WishlistItem = Database['public']['Tables']['wishlists']['Row']
  