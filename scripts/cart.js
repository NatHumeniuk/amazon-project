export const cart = [];

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
}
