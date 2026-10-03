export default function Reducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD": {
      const existingProduct = state.find(
        (product) => product.id === action.payload.id,
      );

      if (existingProduct) {
        return state.map((product) =>
          product.id === action.payload.id
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "REMOVE":
      return state.filter((product) => product.id !== action.payload.id);

    case "INCREASE":
      return state.map((product) =>
        product.id === action.payload.id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

    case "DECREASE":
      return state
        .map((product) =>
          product.id === action.payload.id
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        )
        .filter((product) => product.quantity > 0);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}
