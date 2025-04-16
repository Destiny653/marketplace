export interface CartItem {
    id: string;                
    product_id: string;        
    name: string;              
    description?: string; 
    price: number;            
    original_price?: number;   
    image: string;            
    quantity: number;         
    stock: number;             
    sku?: string;             
    slug: string; 
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;         
    variant?: {        
      id: string;
      name: string;
      price?: number;
    };
    metadata?: Record<string, any>;  
  }