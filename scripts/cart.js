import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
    },
  ];
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

let cartSummaryHTML = "";

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  const quantitySelected = Number(quantitySelector.value);

  const addedToCartMessage = document.querySelector(
    `.js-added-cart-message-${productId}`
  );

  addedToCartMessage.classList.add("is-visible");
  let addedMessageTimeoutId;

  if (addedMessageTimeoutId) {
    clearTimeout(addedMessageTimeoutId);
  }

  const timeoutId = setTimeout(() => {
    addedToCartMessage.classList.remove("is-visible");
  }, 2000);

  addedMessageTimeoutId = timeoutId;

  if (matchingItem) {
    matchingItem.quantity += quantitySelected;
  } else {
    cart.push({
      productId,
      quantity: quantitySelected,
    });
  }
  saveToStorage();
}

function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (productId === product.id) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
   <div class="item-wrapper js-cart-item-wrapper-${matchingProduct.id}">
              <div class="delivery-date-title">
                Delivery date: <span>Tuesday, June 21</span>
              </div>
              <div class="item-details-grid">
                <img
                  src="${matchingProduct.image}"
                  alt="Product image"
                  class="product-img"
                />

                <div class="item-ditails-wrapper">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">$${formatCurrency(
                    matchingProduct.priceCents
                  )}</div>
                  <div class="product-quantity">
                    <span
                      >Quantity:
                      <span class="quantity-counter">${cartItem.quantity}</span>
                      <span class="upd-quantity-link">Update</span>
                      <span class="delete-quantity-link js-delete-link" data-product-id="${
                        matchingProduct.id
                      }">Delete</span>
                    </span>
                  </div>
                </div>
                <div class="delivery-options">
                  <div class="delivery-title">Choose a delivery option:</div>
                  <div class="delivery-option">
                    <input type="radio" class="delivery-input" name="delivery-option-${
                      matchingProduct.id
                    }" checked/>
                    <div>
                      <div class="delivery-date">Tuesday, June 21</div>
                      <div class="delivery-price">FREE Shipping</div>
                    </div>
                  </div>
                  <div class="delivery-option">
                    <input type="radio" class="delivery-input" name="delivery-option-${
                      matchingProduct.id
                    }" />
                    <div>
                      <div class="delivery-date">Wednesday, June 15</div>
                      <div class="delivery-price">$4.99 - Shipping</div>
                    </div>
                  </div>
                  <div class="delivery-option">
                    <input type="radio" class="delivery-input" name="delivery-option-${
                      matchingProduct.id
                    }"/>
                    <div>
                      <div class="delivery-date">Monday, June 13</div>
                      <div class="delivery-price">$9.99 - Shipping</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  `;
});

const orderSummaryElement = document.querySelector(".js-order-summary");
if (orderSummaryElement) {
  orderSummaryElement.innerHTML = cartSummaryHTML;
}

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-wrapper-${productId}`
    );
    container.remove();
  });
});
