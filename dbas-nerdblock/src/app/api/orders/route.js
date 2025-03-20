import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('Order')
    .select('order_id, order_created, order_shipping_date, order_processed, Customer(customer_first_name, customer_last_name)');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}