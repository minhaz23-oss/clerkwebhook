// import { Webhook } from 'svix'
// import { headers } from 'next/headers'
// import { WebhookEvent } from '@clerk/nextjs/server'

// export async function POST(req) {

//   // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
//   const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

//   if (!WEBHOOK_SECRET) {
//     throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
//   }

//   // Get the headers
//   const headerPayload = headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error occured -- no svix headers', {
//       status: 400
//     })
//   }

//   // Get the body
//   const payload = await req.json()
//   const body = JSON.stringify(payload);

//   // Create a new Svix instance with your secret.
//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt

//   // Verify the payload with the headers
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     })
//   } catch (err) {
//     console.error('Error verifying webhook:', err);
//     return new Response('Error occured', {
//       status: 400
//     })
//   }

//   // Do something with the payload
//   // For this guide, you simply log the payload to the console
//   const { id } = evt.data;
//   const eventType = evt.type;
//   console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
//   console.log('Webhook body:', body)

//   return new Response('', { status: 200 })
// }
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createUser } from '@/lib/actions/user.actions';

export async function POST(req) {
  // Ensure WEBHOOK_SECRET is set in environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get headers from the request
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // Validate headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing svix headers' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse request body as JSON
  let payload;
  try {
    payload = await req.json();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid JSON payload' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const body = JSON.stringify(payload);

  // Create a Svix instance with the webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  // Verify the webhook payload using headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Error verifying webhook' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Log webhook details
  const { id } = evt.data;
  const eventType = evt.type;
  if(eventType === 'user.created'){
    const {email_addresses,username} = evt.data;
    const user = {
        email: email_addresses[0].email_address,
        username: username
    }
    await createUser(user);
    return NextResponse.json({message: 'user created successfully',user})
  }
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle the payload (additional processing can be added here)

  return new NextResponse(
    JSON.stringify({ message: 'Webhook processed successfully' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
