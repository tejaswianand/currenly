export function computeConversion(
    quotes: Record<string, number>,
    from: string,
    to: string,
    amount: number
):
    | { valid: true; amount: number; display: string }
    | { valid: false } {

    const usdToFrom = from === 'USD' ? 1 : quotes['USD' + from];
    const usdToTo = to === 'USD' ? 1 : quotes['USD' + to];

    if (!usdToFrom || !usdToTo) {
        return { valid: false };
    }

    const rate = (1 / usdToFrom) * usdToTo;

    return {
        valid: true,
        amount: amount * rate,
        display: `1 ${from} = ${rate.toFixed(4)} ${to}`
    };
}


export function computeRebasedRates(
    quotes: Record<string, number>,
    base: string
):
    | { valid: true; rates: Record<string, number> }
    | { valid: false } {

    const usdToBase = base === 'USD' ? 1 : quotes['USD' + base];

    if (!usdToBase) {
        return { valid: false };
    }

    const rates: Record<string, number> = {};

    Object.keys(quotes).forEach(key => {
        const currency = key.replace('USD', '');
        rates[currency] = (1 / usdToBase) * quotes[key];
    });

    rates[base] = 1;

    return { valid: true, rates };
}
