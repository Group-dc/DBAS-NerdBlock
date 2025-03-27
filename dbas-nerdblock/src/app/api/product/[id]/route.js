import { supabase } from '@/app/lib/supabase';

export async function GET(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  const { data, error } = await supabase
    .from('Product')
    .select('product_id, product_genre_id, product_name, product_description, product_price, product_shipment_month, product_created')
    .eq('product_id', id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function PUT(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();
  const body = await req.json();

  const { data, error } = await supabase
    .from('Product')
    .update(body)
    .eq('product_id', id)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Product updated', data }), { status: 200 });
}

export async function DELETE(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  const { error } = await supabase
    .from('Product')
    .delete()
    .eq('product_id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
}
