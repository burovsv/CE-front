export function currencyFormat(n) {
  return Math.floor(n)
    ?.toFixed(0)
    ?.replace(/./g, function (c, i, a) {
      return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ' ' + c : c;
    })
    .replace('- ', '-');
}
