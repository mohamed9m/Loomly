const formatCartProducts = (apiCart) => {
  if (!apiCart?.products) return [];
  return apiCart.products.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));
};
export default formatCartProducts;
