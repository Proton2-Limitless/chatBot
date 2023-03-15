const commands = [
  { key: "1" },
  { key: "99" },
  { key: "98" },
  { key: "97" },
]
const initialMessage = ["1:check list of orders. ", "98:check order history. ", "97:check your current order."]
const addedMessage = ["98:check order history. ", "97:check your current order."]
const seedOrder = [
  {
    uniqueID: 11,
    name: 'Latte Tea',
    price: 2000
  },
  {
    uniqueID: 12,
    name: 'Ice cream',
    price: 3000
  },
  {
    uniqueID: 13,
    name: 'Berbeque',
    price: 3000
  },
  {
    uniqueID: 14,
    name: 'Chicken Roulette',
    price: 3000
  }
]
const createOrderCommand = seedOrder.reduce((previousObject, currentObject) => {
  return Object.assign(previousObject, {
    [currentObject.uniqueID]: currentObject.name
  })
}, {});
module.exports = {
  commands,
  initialMessage,
  createOrderCommand,
  seedOrder,
  addedMessage,
}