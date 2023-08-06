function toCurrency(price) {
  return new Intl.NumberFormat("ua-UA", {
    currency: "uah",
    style: "currency",
  }).format(price);
}

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

// ToDo: refactor
const $cart = document.querySelector("#cart");
if ($cart) {
  $cart.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      fetch("/cart/remove/" + id, {
        method: "DELETE",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.products.length) {
            const html = cart.products
              .map(
                (product) =>
                  `<tr><td>${product.title}</td><td>${product.count}</td><td>${product.price}</td><td><button class="btn btn-small js-remove" data-id="${product.id}" data-csrf="${csrf}">Remove</button></td></tr>`,
              )
              .join("");
            $cart.querySelector("tbody").innerHTML = html;
            $cart.querySelector(".price").textContent = toCurrency(cart.price);
          } else {
            $cart.innerHTML = "<p>No items added.</p>";
          }
        });
    }
  });
}
