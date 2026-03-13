import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';

    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const data = JSON.parse(rawBody);
    const eventName = data.meta.event_name;

    if (eventName === 'order_created') {
      const orderId = data.data.id;
      // It's expected that you pass the user's GitHub ID in Lemon Squeezy custom data
      const userId = data.meta.custom_data?.user_id;

      if (userId) {
        await supabaseAdmin
          .from('profiles')
          .update({
            has_paid: true,
            lemon_squeezy_order_id: orderId,
          })
          .eq('id', String(userId));
      }
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
