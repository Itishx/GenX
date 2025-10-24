import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FiCheck, FiX, FiZap, FiAward, FiStar, FiArrowRight } from 'react-icons/fi'

interface Subscription {
  id: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelledAt?: string
}

const Subscriptions: React.FC = () => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // In a real app, this would query your subscriptions table
        // For now, we'll show a demo state
        // const { data, error } = await supabase
        //   .from('subscriptions')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .eq('status', 'active')
        //   .maybeSingle()

        // For demo purposes, assume user is on free plan
        setSubscription(null)
      } catch (error) {
        console.error('Error fetching subscription:', error)
        setSubscription(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  const planDetails = {
    starter: {
      name: 'Starter',
      price: 0,
      icon: <FiZap className="w-6 h-6" />,
      color: 'blue',
      features: [
        { name: 'Up to 2 agents', included: true },
        { name: '100 API calls/month', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Community support', included: true },
      ],
    },
    professional: {
      name: 'Professional',
      price: 49,
      icon: <FiAward className="w-6 h-6" />,
      color: 'orange',
      features: [
        { name: 'Unlimited agents', included: true },
        { name: '10,000 API calls/month', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced workflows', included: true },
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: 999,
      icon: <FiStar className="w-6 h-6" />,
      color: 'purple',
      features: [
        { name: 'Unlimited everything', included: true },
        { name: 'Unlimited API calls', included: true },
        { name: 'Custom analytics', included: true },
        { name: 'Dedicated support', included: true },
      ],
    },
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="mt-3 text-lg text-gray-600">Manage your subscription and billing information</p>
        </motion.div>

        {/* Current Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {subscription ? (
            // User has active subscription
            <div className="rounded-2xl border-2 border-green-400 bg-gradient-to-br from-white to-green-50 shadow-lg p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
                  <p className="mt-4 text-gray-600">You are currently subscribed to:</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <FiCheck className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className={`rounded-lg p-3 ${
                  subscription.plan === 'professional' ? 'bg-orange-100 text-orange-600' :
                  subscription.plan === 'enterprise' ? 'bg-purple-100 text-purple-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {planDetails[subscription.plan].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{planDetails[subscription.plan].name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ${planDetails[subscription.plan].price}/month
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Period Start</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Renewal Date</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
                  Manage Subscription
                </button>
                <button className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-white font-semibold hover:bg-gray-800 transition-colors">
                  Download Invoice
                </button>
              </div>
            </div>
          ) : (
            // User is on free plan or not subscribed
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border-2 border-gray-300 bg-white shadow-lg p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Free Plan</h2>
                  <p className="mt-2 text-gray-600">You're currently on our free plan with basic features.</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <FiZap className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                {planDetails.starter.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FiCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature.name}</span>
                  </div>
                ))}
              </div>

              {/* Upgrade CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-6"
              >
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiZap className="h-5 w-5 text-orange-600" />
                  Ready to unlock more features?
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  Upgrade to Professional or Enterprise to get unlimited agents, advanced analytics, priority support, and more.
                </p>
                <Link
                  to="/#pricing"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-2.5 text-white font-semibold hover:bg-orange-700 transition-colors"
                >
                  Explore Plans
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Plan Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Plans</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {(Object.entries(planDetails) as Array<[keyof typeof planDetails, typeof planDetails.starter]>).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-2xl border-2 transition-all ${
                  key === 'professional'
                    ? 'border-orange-400 bg-gradient-to-br from-white via-orange-50 to-white shadow-xl'
                    : 'border-gray-300 bg-white shadow-md hover:shadow-lg'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`rounded-lg p-2.5 ${
                      key === 'professional' ? 'bg-orange-100 text-orange-600' :
                      key === 'enterprise' ? 'bg-purple-100 text-purple-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>

                  <button
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all mb-6 ${
                      key === 'professional'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : key === 'starter'
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {subscription?.plan === key ? 'Current Plan' : 'Select Plan'}
                  </button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <FiCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-300 bg-white shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900">Can I change my plan?</h4>
              <p className="mt-2 text-gray-600">Yes, you can upgrade or downgrade at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">What payment methods do you accept?</h4>
              <p className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and wire transfers for enterprise.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Is there a refund policy?</h4>
              <p className="mt-2 text-gray-600">We offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">How do I cancel?</h4>
              <p className="mt-2 text-gray-600">You can cancel anytime from your subscription settings. Your access continues until the end of your billing period.</p>
            </div>
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            Need help?{' '}
            <a href="mailto:support@aviate.app" className="font-semibold text-orange-600 hover:text-orange-700">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Subscriptions
