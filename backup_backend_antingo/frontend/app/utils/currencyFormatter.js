export default function currencyFormatter(value, digito) {
    if (!Number(value)) return "";

    const format = digito ? {style: 'currency', currency: 'BRL' } : { minimumFractionDigits: 2 }
    const divider = digito ? 1 : 100;
    const amount = new Intl.NumberFormat("pt-BR", format).format(value / divider);

    return `${amount}`;
}