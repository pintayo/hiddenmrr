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
      const userId = data.meta.custom_data?.user_id;
      const buyerEmail = data.data.attributes?.user_email;

      if (userId) {
        const { data: updated, error } = await supabaseAdmin
          .from('profiles')
          .update({
            has_paid: true,
            lemon_squeezy_order_id: orderId,
          })
          .eq('id', String(userId))
          .select('id');

        if (error || !updated?.length) {
          // Paid order that failed to unlock — never swallow this silently.
          console.error(
            `PAYMENT NOT FULFILLED: order ${orderId} for user_id ${userId} (${buyerEmail}) — profile update failed`,
            error
          );
        }
      } else if (buyerEmail) {
        // No user_id in custom data (e.g. bought via a direct store link).
        // Fall back to matching the buyer's email against profiles.
        const { data: updated, error } = await supabaseAdmin
          .from('profiles')
          .update({
            has_paid: true,
            lemon_squeezy_order_id: orderId,
          })
          .eq('email', buyerEmail)
          .select('id');

        if (error || !updated?.length) {
          console.error(
            `PAYMENT NOT FULFILLED: order ${orderId} has no user_id and no profile matches email ${buyerEmail} — manual follow-up needed`
          );
        }
      } else {
        console.error(
          `PAYMENT NOT FULFILLED: order ${orderId} arrived with no user_id and no email — manual follow-up needed`
        );
      }
    }

    if (eventName === 'order_refunded') {
      const orderId = data.data.id;
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ has_paid: false })
        .eq('lemon_squeezy_order_id', orderId);

      if (error) {
        console.error(`Refund revoke failed for order ${orderId}:`, error);
      }
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
