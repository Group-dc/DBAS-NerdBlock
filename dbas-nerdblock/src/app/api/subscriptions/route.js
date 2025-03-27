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

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      subscription_start_date,
      subscription_end_date,
      subscription_customer_id,
      subscription_genre_no,
      subscription_active
    } = body;

    if (!subscription_start_date || !subscription_customer_id || !subscription_genre_no) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Subscription')
      .insert([{
        subscription_start_date,
        subscription_end_date: subscription_end_date || null,
        subscription_customer_id,
        subscription_genre_no,
        subscription_active: subscription_active ?? true
      }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Subscription added", data }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      subscription_id,
      subscription_start_date,
      subscription_end_date,
      subscription_customer_id,
      subscription_genre_no,
      subscription_active
    } = body;

    if (!subscription_id) {
      return new Response(JSON.stringify({ error: "Subscription ID is required" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Subscription')
      .update({
        subscription_start_date,
        subscription_end_date,
        subscription_customer_id,
        subscription_genre_no,
        subscription_active
      })
      .eq('subscription_id', subscription_id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Subscription updated", data }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { subscription_id } = await req.json();

    if (!subscription_id) {
      return new Response(JSON.stringify({ error: "Missing subscription_id" }), { status: 400 });
    }

    const { error } = await supabase
      .from('Subscription')
      .delete()
      .eq('subscription_id', subscription_id);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Subscription deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
