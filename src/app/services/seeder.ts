
import { SupabaseClient } from '@supabase/supabase-js';

const MOCK_PRODUCTS = [
    {
        id: 'prod_1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        description: 'Immersive sound with active noise cancellation.',
        detailedDescription: 'Experience audio like never before with our industry-leading noise cancellation technology. 30-hour battery life and plush ear cushions for all-day comfort.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        category: 'Electronics',
        stock: 'in-stock',
        specifications: { "Battery": "30h", "Connectivity": "Bluetooth 5.2" }
    },
    {
        id: 'prod_2',
        name: 'Minimalist Smart Watch',
        price: 199.50,
        description: 'Stay connected with style. Health tracking included.',
        detailedDescription: 'A sleek smartwatch that fits any occasion. Tracks heart rate, sleep, and steps. Receive notifications directly on your wrist.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        category: 'Electronics',
        stock: 'in-stock',
        specifications: { "Water Resistance": "5ATM", "Sensors": "HR, SpO2" }
    },
    {
        id: 'prod_3',
        name: 'Designer Denim Jacket',
        price: 89.00,
        description: 'Classic vintage wash using sustainable cotton.',
        detailedDescription: 'Handcrafted details and premium denim make this jacket a wardrobe staple. Sustainable wash process uses 50% less water.',
        image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop',
        category: 'Fashion',
        stock: 'in-stock',
        specifications: { "Material": "100% Cotton", "Fit": "Regular" }
    },
    {
        id: 'prod_4',
        name: 'Ergonomic Office Chair',
        price: 349.00,
        description: 'Work in comfort with full lumbar support.',
        detailedDescription: 'Designed for professionals who spend long hours at a desk. Fully adjustable armrests, height, and lumbar support.',
        image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop',
        category: 'Home',
        stock: 'low-stock',
        specifications: { "Material": "Mesh & Alloy", "Max Load": "150kg" }
    },
    {
        id: 'prod_5',
        name: 'Professional DSLR Camera',
        price: 1499.00,
        description: 'Capture life in stunning 4K detail.',
        detailedDescription: 'Professional-grade sensor and image processor. Includes 18-55mm kit lens. Perfect for photography enthusiasts.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
        category: 'Electronics',
        stock: 'in-stock',
        specifications: { "Iso": "100-25600", "Video": "4K 60fps" }
    },
    {
        id: 'prod_6',
        name: 'Italian Leather Handbag',
        price: 250.00,
        description: 'Timeless elegance for the modern woman.',
        detailedDescription: 'Made from genuine Italian leather. Features gold-tone hardware and multiple compartments for organization.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        category: 'Fashion',
        stock: 'in-stock',
        specifications: { "Material": "Leather", "Dimensions": "30x25x10cm" }
    }
];

export const seedProductsIfEmpty = async (supabase: SupabaseClient) => {
    try {
        const { count, error } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error("Error checking product count:", error);
            return;
        }

        if (count === 0) {
            console.log("Seeding mock products...");
            const { error: insertError } = await supabase
                .from('products')
                .insert(MOCK_PRODUCTS);

            if (insertError) {
                console.error("Error seeding products:", insertError);
            } else {
                console.log("Products seeded successfully!");
            }
        }
    } catch (err) {
        console.error("Seeder exception:", err);
    }
};
