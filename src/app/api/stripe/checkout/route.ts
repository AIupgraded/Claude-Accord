import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-03-31.basil' as any });
}
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const PRICES: Record<string, { name: string; amount: number }> = {
  personal: { name: 'Claude Accord Personal', amount: 500 },
  business: { name: 'Claude Accord Business', amount: 1500 },
  creative: { name: 'Claude Accord Creative', amount: 1000 },
};

export async function POST(request: Request) {
  try {
    const { tier, userId } = await request.json();

    if (!tier || !userId || !PRICES[tier]) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get user email
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    if (!user?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find or create Stripe customer
    const customers = await getStripe().customers.list({ email: user.email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: userId, tier },
      });
      customerId = customer.id;
    }

    // Check if user has an approved subsidy with a coupon
    const { data: subsidy } = await supabase
      .from('subsidy_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1);

    // Create checkout session
    const sessionParams: any = {
      customer: customerId,
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { name: PRICES[tier].name },
          unit_amount: PRICES[tier].amount,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://getaccord.online'}/account?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://getaccord.online'}/subscribe`,
      metadata: { supabase_user_id: userId, tier },
      subscription_data: {
        metadata: { supabase_user_id: userId, tier },
      },
    };

    // Apply subsidy discount if approved
    if (subsidy && subsidy.length > 0 && subsidy[0].approved_discount_percent) {
      const coupon = await getStripe().coupons.create({
        percent_off: subsidy[0].approved_discount_percent,
        duration: 'repeating',
        duration_in_months: subsidy[0].approved_months || 12,
        metadata: { subsidy_request_id: subsidy[0].id, user_id: userId },
      });
      sessionParams.discounts = [{ coupon: coupon.id }];
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
