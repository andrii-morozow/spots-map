export const getFormInputs = (spot: object) => {
  const inputs = Object.keys(spot);
  return inputs.filter((key) => inputs.includes(key));
};
