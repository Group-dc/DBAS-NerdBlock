import { supabase } from '@/app/lib/supabase';

export async function GET(req, context) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from('Subscription')
    .select(`
      subscription_id,
      subscription_genre_no,
      Genre(genre_name),
      subscription_start_date,
      subscription_end_date
    `)
    .eq('subscription_customer_id', id)
    .eq('subscription_active', true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
