import { supabase } from '@/app/lib/supabase';

export async function GET(req, { params }) {
  const { id } = params;
  console.log("Fetching product with ID:", id); // ✅ Good for debugging

  const { data, error } = await supabase
    .from('Product') // match case from Supabase
    .select('product_id, product_genre_id, product_name, product_description, product_price, product_shipment_month, product_created')
    .eq('product_id', id)
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
