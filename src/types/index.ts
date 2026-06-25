export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  active: number;
}

export interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  neighborhood?: string;
  category_id: number;
  category_name?: string;
  description: string;
  experience_years: number;
  status: 'pending' | 'approved' | 'rejected';
  avg_rating?: number;
  review_count?: number;
  created_at: string;
}

export interface ServiceRequest {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  city: string;
  neighborhood?: string;
  category_id: number;
  category_name?: string;
  description: string;
  urgency: 'urgent' | 'normal' | 'flexible';
  status: 'open' | 'matched' | 'closed';
  created_at: string;
}

export interface Review {
  id: number;
  provider_id: number;
  client_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}
