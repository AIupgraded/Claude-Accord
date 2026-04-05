import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-03-31.basil' as any });
}
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig || !WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const tier = session.metadata?.tier;

        if (!userId || !tier) break;

        // Activate subscription in user metadata
        const { data: { user } } = await supabase.auth.admin.getUserById(userId);
        const activeWorlds: string[] = user?.user_metadata?.active_worlds || [user?.user_metadata?.tier || 'personal'];
        if (!activeWorlds.includes(tier)) activeWorlds.push(tier);

        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            subscription_active: true,
            subscription_tier: tier,
            active_worlds: activeWorlds,
            stripe_customer_id: session.customer,
          },
        });

        // Generate MCP API key
        const apiKey = `accord_${crypto.randomBytes(24).toString('hex')}`;
        const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

        // Check if key already exists
        const { data: existingKey } = await supabase
          .from('accord_keys')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'active')
          .limit(1);

        if (!existingKey || existingKey.length === 0) {
          await supabase.from('accord_keys').insert({
            user_id: userId,
            key_hash: keyHash,
            status: 'active',
          } as any);

          // Store the actual key in user metadata (so they can see it once)
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { mcp_api_key: apiKey },
          });
        }

        // Record in subscriptions table
        await supabase.from('subscriptions').insert({
          user_id: userId,
          email: user?.email || '',
          status: 'active',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'gbp',
        } as any);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        // Deactivate subscription
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            subscription_active: false,
            mcp_api_key: null,
          },
        });

        // Revoke MCP key
        await supabase.from('accord_keys')
          .update({ status: 'revoked' } as any)
          .eq('user_id', userId)
          .eq('status', 'active');

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user by stripe customer id
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const user = users?.find(u => u.user_metadata?.stripe_customer_id === customerId);

        if (user) {
          // Could send notification email here
          console.log(`Payment failed for user ${user.email}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
