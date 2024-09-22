import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { calculateQuantity } from "../utils/quantity.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
      deliveryOptionId: "1",
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: "2",
    },
  ];
}

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
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function renderOrderSummary() {
  let cartSummaryHTML = "";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
   <div class="item-wrapper js-cart-item-wrapper-${matchingProduct.id}">
        <div class="delivery-date-title">
          Delivery date: <span>${dateString}</span>
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
            )}
            </div>
            <div class="product-quantity">
              <span>Quantity:
                <span class="quantity-counter js-quantity-counter-${
                  matchingProduct.id
                } 
                  data-product-id="${matchingProduct.id}">${cartItem.quantity}
                </span>
                     
                <span class="upd-quantity-link js-upd-link"    data-product-id="${
                  matchingProduct.id
                }">Update
                </span>
                <input type="number" value="1" class="quatity-input js-quantity-input-${
                  matchingProduct.id
                }" 
                />
                <span class="save-quantity-link js-save-link" data-product-id="${
                  matchingProduct.id
                }">Save
                </span>
                <span class="delete-quantity-link js-delete-link" data-product-id="${
                  matchingProduct.id
                }">Delete
                </span>
              </span>
            </div>
          </div>
          <div class="delivery-options">
              <div class="delivery-title">Choose a delivery option:
              </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
  `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let deliveryHTML = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      deliveryHTML += `
      <div class="delivery-option js-delivery-option" data-product-id="${
        matchingProduct.id
      }" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" class="delivery-input" name="delivery-option-${
          matchingProduct.id
        }" ${isChecked ? "checked" : ""}/>
        <div>
          <div class="delivery-date">${dateString}
          </div>
          <div class="delivery-price">${priceString} Shipping
          </div>
        </div>
      </div>`;
    });
    return deliveryHTML;
  }

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
      updateCartQuantity();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-upd-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-wrapper-${productId}`
      );
      container.classList.add("is-upd-quantity");
    });
  });

  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const updQuantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(updQuantityInput.value);

      if (newQuantity < 0 || newQuantity >= 1000) {
        alert("Quantity must be at least 0 and less than 1000");
        return;
      }
      updQuantity(productId, newQuantity);

      const container = document.querySelector(
        `.js-cart-item-wrapper-${productId}`
      );
      container.classList.remove("is-upd-quantity");

      const quantityText = document.querySelector(
        `.js-quantity-counter-${productId}`
      );
      quantityText.innerHTML = newQuantity;
      updateCartQuantity();
      renderPaymentSummary();
    });
  });

  updateCartQuantity();

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updDeliveryOptions(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
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

function updDeliveryOptions(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

function updQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;
  saveToStorage();
}
function updateCartQuantity() {
  const cartQuantity = calculateQuantity(cart);

  const returnHomeLink = document.querySelector(".js-return-home-link");
  if (returnHomeLink) {
    returnHomeLink.innerHTML = `${cartQuantity} items`;
  }
}
