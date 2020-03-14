module.exports = {
  getTotal: (records) => {
    var totalAmount = 0
    for (pay of records) {
      totalAmount += pay.amount
    }
    return totalAmount
  }
}
