import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('Product')
    .select('product_id, product_genre_id, product_name, product_description, product_price, product_shipment_month, product_created');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      product_name,
      product_description,
      product_price,
      product_shipment_month,
      product_genre_id,
    } = body;

    // Basic validation
    if (!product_name || !product_price || !product_shipment_month || !product_genre_id) {
      return new Response(JSON.stringify({ error: 'Missing required product fields' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Product')
      .insert([
        {
          product_name,
          product_description,
          product_price,
          product_shipment_month,
          product_genre_id,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Product created', data }), { status: 201 });
  } catch (error) {
    console.error('POST error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
