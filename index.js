const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3010;
app.use(cors());

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

function tot(p, t) {
  let totl = p + t;
  return totl.toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);

  res.send(tot(newItemPrice, cartTotal));
});

function memDisc(tot, mem) {
  if (mem === 'true') {
    let totwithdisc = tot * (1 - discountPercentage / 100);
    return totwithdisc.toString();
  } else {
    return tot.toString();
  }
}
app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;

  res.send(memDisc(cartTotal, isMember));
});

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let tottax = cartTotal * (taxRate / 100);

  res.send(tottax.toString());
});

function CalcShip(s, d) {
  if (s === 'Standard') {
    return (d / 50).toString;
  } else {
    return (d / 100).toString();
  }
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);

  res.send(CalcShip(shippingMethod, distance));
});

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);

  res.send((weight * distance * 0.1).toString());
});

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);

  res.send((purchaseAmount * loyaltyRate).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
