'use client'

import React, { useState } from 'react';
import { Check, FileText, Zap, Clock, Star, Users } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const PricingSection = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    const stripePromise = loadStripe('pk_test_51RahXgRI3stGNGdnGofuT5TJOcgIfYzfrWweYjPW6yNuTj4AiRn4qOJJrGMDnFbHs2z7WbM2CikaEYXCKFV6x6EV00BBzcBkGp')
    const plans = [
        {
            id: 'free',
            name: 'Free',
            description: 'Perfect to get started',
            price: 0,
            priceLabel: '/ month',
            subtitle: 'No credit card required',
            icon: FileText,
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
            buttonText: 'Get Started Free',
            buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
            buttonLink: '/dashboard',
            cardStyle: 'bg-white rounded-xl border border-gray-200 p-8 shadow-sm',
            features: [
                "5 PDF uploads per month",
                "Up to 10 pages per PDF",
                "50 messages per month",
                "Basic chat functionality",
                "Standard processing speed"
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            description: 'For power users',
            price: isAnnual ? 8 : 10,
            priceLabel: `/ ${isAnnual ? 'month' : 'month'}`,
            subtitle: isAnnual ? `Billed annually (${(isAnnual ? 8 : 10) * 12}/year)` : null,
            icon: Zap,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            buttonText: 'Start Pro Trial',
            buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
            buttonLink: `/signup?plan=pro&billing=${isAnnual ? 'annual' : 'monthly'}`,
            cardStyle: 'bg-white rounded-xl border-2 border-blue-200 p-8 shadow-sm relative',
            popular: true,
            features: [
                "Unlimited PDF uploads",
                "No page limit per PDF",
                "Unlimited messages",
                "Advanced AI responses",
                "Priority processing",
                "Document summarization",
                "Export chat history",
                "Email support"
            ]
        }
    ];

    const billingOptions = [
        { value: false, label: 'Monthly' },
        { value: true, label: 'Annual', badge: 'Save 20%' }
    ];

    const faqs = [
        {
            question: "Can I change plans anytime?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
        },
        {
            question: "What file formats are supported?",
            answer: "We support PDF files of all types including scanned documents, forms, and text-based PDFs."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, all uploads are encrypted and processed securely. We never store your documents permanently."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 14-day money-back guarantee for all paid plans, no questions asked."
        }
    ];

    const trustBadges = [
        { icon: Clock, text: "Cancel anytime" },
        { icon: Star, text: "14-day money back" },
        { icon: Users, text: "Email support" }
    ];

    return (
        <div className="bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that works best for you. Start free and upgrade when you need more.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center mb-12">
                    <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            {billingOptions.map((option) => (
                                <button
                                    key={option.value.toString()}
                                    onClick={() => setIsAnnual(option.value)}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual === option.value
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                >
                                    {option.label}
                                    {option.badge && (
                                        <span className="bg-green-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-semibold">
                                            {option.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {plans.map((plan) => {
                        const IconComponent = plan.icon;
                        return (
                            <div key={plan.id} className={plan.cardStyle}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 ${plan.iconBg} rounded-lg flex items-center justify-center`}>
                                            <IconComponent className={`w-5 h-5 ${plan.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                                            <p className="text-gray-500">{plan.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-gray-500">{plan.priceLabel}</span>
                                    </div>
                                    {plan.subtitle && (
                                        <p className={`text-sm ${plan.id === 'pro' && isAnnual ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                            {plan.subtitle}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {plan.id === 'pro' ? (
                                    <button
                                        onClick={async () => {
                                            const stripe = await stripePromise;
                                            const res = await fetch('/api/create-checkout-session', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ billing: isAnnual ? 'annual' : 'monthly' }),
                                            });

                                            console.log('ddshk', res)
                                            if (!res.ok) {
                                                const errText = await res.text();
                                                console.error('API error:', errText);
                                                return;
                                            }

                                            const data = await res.json();


                                            if (stripe && data.id) {
                                                const { error } = await stripe.redirectToCheckout({
                                                    sessionId: data.id,
                                                });
                                                if (error) console.error('Stripe redirect error:', error.message);
                                            } else {
                                                console.error('Stripe or session ID missing');
                                            }
                                        }}
                                        className={`w-full ${plan.buttonStyle} font-medium py-3 px-4 rounded-lg transition-colors inline-block text-center`}
                                    >
                                        {plan.buttonText}
                                    </button>
                                ) : (
                                    <a
                                        href={plan.buttonLink}
                                        className={`w-full ${plan.buttonStyle} font-medium py-3 px-4 rounded-lg transition-colors inline-block text-center`}
                                    >
                                        {plan.buttonText}
                                    </a>
                                )}

                            </div>
                        );
                    })}
                </div>

                {/* FAQ/Additional Info */}
                <div className="mt-16 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {faqs.map((faq, index) => (
                            <div key={index}>
                                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                                <p className="text-gray-600 text-sm">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 mb-4">
                        Need help choosing?
                        <a href="https://siddik.site/#contacts" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                            Contact Us
                        </a>
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        {trustBadges.map((badge, index) => {
                            const IconComponent = badge.icon;
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span>{badge.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingSection;