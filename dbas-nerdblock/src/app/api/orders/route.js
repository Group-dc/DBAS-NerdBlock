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

export async function DELETE(req) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: "Order ID is required" }), { status: 400 });
    }

    const { error } = await supabase
      .from('Order')
      .delete()
      .eq('order_id', order_id);

    if (error) throw error;

    return new Response(JSON.stringify({ message: 'Order deleted' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { order_id, order_shipping_date, order_processed } = body;

    if (!order_id) {
      return new Response(JSON.stringify({ error: "Order ID is required" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Order')
      .update({
        order_shipping_date,
        order_processed,
      })
      .eq('order_id', order_id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Order updated", data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
