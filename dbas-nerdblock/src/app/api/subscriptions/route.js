import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('Subscription')
    .select('subscription_id, subscription_start_date, subscription_end_date, subscription_active, Customer(customer_first_name, customer_last_name), Genre(genre_name)');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
