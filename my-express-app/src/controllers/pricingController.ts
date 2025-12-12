import { Request, Response } from 'express';
import axios from 'axios';

const BASE_PLANS = {
    foundryos: [
        { name: 'Monthly', subheading: 'Flexible billing for FoundryOS', price: 21, period: 'month' },
        { name: 'Annual', subheading: 'Best value for FoundryOS', price: 222, period: 'year', savings: 12 },
    ],
    launchos: [
        { name: 'Monthly', subheading: 'Flexible billing for LaunchOS', price: 21, period: 'month' },
        { name: 'Annual', subheading: 'Best value for LaunchOS', price: 222, period: 'year', savings: 12 },
    ],
    bundle: [
        { name: 'Monthly', subheading: 'All agents included, billed monthly', price: 42, period: 'month' },
        { name: 'Annual', subheading: 'Save 20% with annual billing', price: 403, period: 'year', savings: 20 },
    ],
};

const INDIA_MULTIPLIER = 90; // multiply USD by 90 for INR pricing

function extractClientIp(req: Request): string | null {
    const xf = (req.headers['x-forwarded-for'] as string) || '';
    let ip = xf.split(',')[0].trim();
    if (!ip) {
        ip = (req.socket && req.socket.remoteAddress) || req.ip || '';
    }
    if (!ip) return null;
    // strip IPv6 prefix for IPv4-mapped addresses
    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
    // handle localhost addresses
    if (ip === '::1' || ip === '127.0.0.1' || ip === '::') return null;
    return ip;
}

export default class PricingController {
    public async getPricing(req: Request, res: Response) {
        try {
            // allow a dev override via query param ?country=IN
            const overrideCountry = (req.query.country as string || '').trim().toUpperCase() || null;

            let countryCode: string | null = null;

            if (overrideCountry) {
                countryCode = overrideCountry;
                console.log('[pricing] using override country from query:', countryCode);
            } else {
                const clientIp = extractClientIp(req);
                const url = clientIp ? `https://ipapi.co/${clientIp}/json/` : 'https://ipapi.co/json/';

                // Call ipapi.co to detect location
                const resp = await axios.get(url, { timeout: 3000 });
                countryCode = (resp.data && resp.data.country_code) ? resp.data.country_code.toUpperCase() : '';
                console.log('[pricing] ipapi response country:', countryCode, 'from url:', url);
            }

            const isIndia = countryCode === 'IN';
            const currency = isIndia ? 'INR' : 'USD';
            const multiplier = isIndia ? INDIA_MULTIPLIER : 1;
            const symbol = isIndia ? '₹' : '$';

            // Build localized plans
            const localizedPlans: Record<string, any[]> = {};
            for (const key of Object.keys(BASE_PLANS)) {
                localizedPlans[key] = (BASE_PLANS as any)[key].map((p: any) => ({
                    ...p,
                    localizedPrice: Math.round(p.price * multiplier * 100) / 100,
                }));
            }

            res.json({
                countryCode,
                currency,
                symbol,
                multiplier,
                plans: localizedPlans,
            });
        } catch (err: any) {
            console.error('Failed to detect location via ipapi:', err?.message || err);
            // Fallback to USD pricing
            const localizedPlans: Record<string, any[]> = {};
            for (const key of Object.keys(BASE_PLANS)) {
                localizedPlans[key] = (BASE_PLANS as any)[key].map((p: any) => ({
                    ...p,
                    localizedPrice: p.price,
                }));
            }

            res.json({
                countryCode: null,
                currency: 'USD',
                symbol: '$',
                multiplier: 1,
                plans: localizedPlans,
            });
        }
    }
}
