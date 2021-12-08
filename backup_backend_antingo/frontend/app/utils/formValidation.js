export const required = value => (value == null ? 'Required' : undefined);

export const shortenThan = size =>
    (value, previousValue) => value.length <= size ? value : previousValue

export const max = maxValue =>
    (value, previousValue) => value <= maxValue ? value : previousValue