export function getChangeArray(totalPrice, availableDeposit) {
  const sizes = [100, 50, 20, 10, 5];
  const changeMap = Array(5);

  let change = availableDeposit - totalPrice;
  for (let i = 0; i < sizes.length; i++) {
    changeMap[i] = Math.floor(change / sizes[i]);
    change = change % sizes[i];
  }

  return changeMap.reverse();
}
