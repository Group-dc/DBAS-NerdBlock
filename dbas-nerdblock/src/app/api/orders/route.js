import { supabase } from '@/app/lib/supabase';

// Fetch all orders with basic customer info
export async function GET() {
  const { data, error } = await supabase
    .from('Order')
    .select('order_id, order_created, order_shipping_date, order_processed, Customer(customer_first_name, customer_last_name)');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

// Delete an order and its linked subscriptions
export async function DELETE(req) {
  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "Order ID is required" }), { status: 400 });
    }

    // Remove any linked entries in Order_Subscriptions
    const { error: subDeleteError } = await supabase
      .from('Order_Subscriptions')
      .delete()
      .eq('order_subscription_order_id', order_id);
    if (subDeleteError) throw subDeleteError;

    // Then delete the order itself
    const { error: orderDeleteError } = await supabase
      .from('Order')
      .delete()
      .eq('order_id', order_id);
    if (orderDeleteError) throw orderDeleteError;

    return new Response(JSON.stringify({ message: 'Order and linked subscriptions deleted' }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Update an existing order (shipping date or status)
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

// Create a new order and link subscriptions to it
export async function POST(req) {
  try {
    const body = await req.json();
    const { customer_id, subscription_ids, order_processed, order_shipping_date } = body;

    if (
      !customer_id ||
      !Array.isArray(subscription_ids) ||
      subscription_ids.length === 0 ||
      order_processed === undefined
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const finalDate = order_shipping_date || new Date().toISOString().split('T')[0];

    // Insert the order
    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .insert([
        {
          order_customer_id: customer_id,
          order_shipping_date: finalDate,
          order_processed,
        },
      ])
      .select()
      .single();
    if (orderError) throw orderError;

    // Insert the linked subscriptions
    const orderSubEntries = subscription_ids.map((subId) => ({
      order_subscription_order_id: orderData.order_id,
      order_subscription_subscription_id: subId,
    }));

    const { error: subError } = await supabase
      .from('Order_Subscriptions')
      .insert(orderSubEntries);
    if (subError) throw subError;

    return new Response(
      JSON.stringify({ message: "Order created", order_id: orderData.order_id }),
      { status: 201 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
