import { cart, addToCart } from "./cart.js";
import { products } from "../data/products.js";

let productsHTML = "";

products.forEach((product) => {
  productsHTML =
    productsHTML +
    `<div class="product-wrap">
              <div class="img-wrapper">
                <img
                  src="${product.image}"
                  alt="Cotton socks"
                  class="product-img"
                />
              </div>

              <div class="product-name-wrapper">
                ${product.name}
              </div>

              <div class="rating-wrapper">
                <img
                  src="./images/ratings/rating-${product.rating.stars * 10}.png"
                  alt="Rating stars"
                  class="rating-stars-img"
                />

                <div class="rating-count">${product.rating.count}</div>
              </div>
              <div class="product-price">$${(product.priceCents / 100).toFixed(
                2
              )}</div>
              <div class="product-quantity-wrapper">
                <select class="select-quantity js-quantity-selector-${
                  product.id
                }">
                  <option selected value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div class="added-to-cart js-added-cart-message-${product.id} ">
                <img
                  src="./images/icons/checkmark.png"
                  class="checkmark-icon"
                />
                Added
              </div>
              <button class="added-to-cart-btn js-add-to-cart" data-product-id="${
                product.id
              }">Add to cart</button>
            </div>`;
});

document.querySelector(".js-products-grid").innerHTML = productsHTML;

function updCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}
document.querySelectorAll(".js-add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { productId } = btn.dataset;
    addToCart(productId);
    updCartQuantity();
  });
});
