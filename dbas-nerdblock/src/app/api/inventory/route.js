import { supabase } from '@/app/lib/supabase';

// Read function
export async function GET() {
  const { data, error } = await supabase
    .from('Inventory')
    .select(`
      inventory_id,
      inventory_quantity,
      inventory_location,
      inventory_product_id,
      Product (
        product_id,
        product_name,
        product_description,
        product_price,
        product_shipment_month,
        product_genre_id
      )
    `);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

// Create function
export async function POST(req) {
  try {
    const body = await req.json();
    const { inventory_quantity, inventory_location, product_id } = body;

    if (!inventory_quantity || !inventory_location || !product_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Inventory')
      .insert([{
        inventory_quantity,
        inventory_location,
        inventory_product_id: product_id
      }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Inventory item added", data }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { inventory_id, inventory_quantity, inventory_location } = body;

    if (!inventory_id) {
      return new Response(JSON.stringify({ error: "Inventory ID is required" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Inventory')
      .update({
        inventory_quantity,
        inventory_location
      })
      .eq('inventory_id', inventory_id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Inventory item updated", data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { inventory_id } = body;

    if (!inventory_id) {
      return new Response(JSON.stringify({ error: "Inventory ID is required" }), { status: 400 });
    }

    const { error } = await supabase
      .from('Inventory')
      .delete()
      .eq('inventory_id', inventory_id);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Inventory item deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}