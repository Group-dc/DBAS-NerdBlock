import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('Customer')
    .select('customer_id, customer_created, customer_first_name, customer_last_name, customer_email, customer_address, customer_active, customer_country');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const formattedData = data.map((customer, index) => ({
    customer_number: index + 1, 
    customer_id: customer.customer_id, 
    customer_created: customer.customer_created,
    customer_first_name: customer.customer_first_name,
    customer_last_name: customer.customer_last_name,
    customer_email: customer.customer_email,
    customer_address: customer.customer_address,
    customer_active: customer.customer_active,
    customer_country: customer.customer_country
  }));

  return new Response(JSON.stringify(formattedData), { status: 200 });
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { customer_first_name, customer_last_name, customer_email, customer_address, customer_active, customer_country } = body;

    if (!customer_first_name || !customer_last_name || !customer_email || !customer_country) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Customer')
      .insert([{
        customer_created: new Date().toISOString().split('T')[0], 
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_address: customer_address || "Not Provided", 
        customer_active: customer_active ?? true, 
        customer_country
      }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Customer added", data }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { customer_id, customer_first_name, customer_last_name, customer_email, customer_address, customer_active, customer_country } = body;

    if (!customer_id) {
      return new Response(JSON.stringify({ error: "Customer ID is required" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('Customer')
      .update({
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_address,
        customer_active,
        customer_country
      })
      .eq('customer_id', customer_id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Customer updated", data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { customer_id } = body;

    if (!customer_id) {
      return new Response(JSON.stringify({ error: "Customer ID is required" }), { status: 400 });
    }

    const { error } = await supabase
      .from('Customer')
      .delete()
      .eq('customer_id', customer_id);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Customer deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
