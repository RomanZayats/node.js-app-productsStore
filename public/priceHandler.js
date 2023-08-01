function toCurrency(price) {
  return new Intl.NumberFormat("ua-UA", {
    currency: "uah",
    style: "currency",
  }).format(price);
}

(function priceHandler() {
  document.querySelectorAll(".price").forEach((node) => {
    node.textContent = toCurrency(node.textContent);
  });
})();

module.exports = toCurrency;
