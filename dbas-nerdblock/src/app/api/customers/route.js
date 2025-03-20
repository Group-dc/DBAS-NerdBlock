import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('Customer')
    .select('customer_id, customer_first_name, customer_last_name, customer_email, customer_country');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
