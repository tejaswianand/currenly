export function sortRates(
    entries: { key: string; value: number }[],
    column: 'currency' | 'rate',
    direction: 'asc' | 'desc'
) {
    return entries.sort((a, b) => {
        let result = 0;

        if (column === 'currency') {
            result = a.key.localeCompare(b.key);
        } else {
            result = a.value - b.value;
        }

        return direction === 'asc' ? result : -result;
    });
}
