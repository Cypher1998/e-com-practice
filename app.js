/*
 LS = localsTorage
 */

//fetch from external file
fetch('folder.json')
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  })
  .then((products) => {
    let output = '';
    products.forEach((product) => {
      output += `<div class="display">
                  <img src="${product.image}" class="images"/>
                  <span>${product.discount}</span>
                  <h3>${product.name}</h3>
                  <p>${product.price}</p>
                  <button>BUY</button>
                </div>
      `;
    });
    document.querySelector('.display-body').innerHTML = output;
  })
  .catch((err) => console.log(err));

//DOM EVENT reload
document.addEventListener('DOMContentLoaded', persistCart);

function persistCart() {
  //display cart from localStorage
  let items;
  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  items.forEach((item) => {
    const img = document.createElement('img');
    img.setAttribute('src', item.source);
    const span = document.createElement('span');
    span.textContent = item.price;
    const button = document.createElement('button');
    button.className = 'remove-me';
    button.append(document.createTextNode('X'));
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.append(img, span, button);

    document.querySelector('.my-cart').append(div);
  });

  //initialize number of items in cart
  let cartPrice = 0;
  document.querySelector('.cart').textContent = cartPrice;

  //number of items in cart LS
  const number = localStorage.getItem('number');
  const cart = document.querySelector('.cart');
  cart.textContent = Number(cartPrice + number);

  //total cost of items
  let min = 0;
  document.querySelector('.price-action').textContent = min;

  //get total cost in LS
  const price = localStorage.getItem('totalPrice');
  const anoda = JSON.parse(price);
  document.querySelector('.price-action').textContent = min + anoda;
}

//event that add item to cart
document.querySelector('.display-body').addEventListener('click', buyMe);

//initialize number of items in cart
let cartPrice = 0;
document.querySelector('.price-action').textContent = cartPrice;

function buyMe(e) {
  if (e.target.textContent === 'BUY') {
    /* imgPri is used to store image(source) and price in LS */
    const imgPri = {};

    //set the image in cart
    const img = document.createElement('img');
    const source =
      e.target.previousElementSibling.previousElementSibling
        .previousElementSibling.previousElementSibling.src;
    img.src = source;
    const price = document.createElement('span');

    //price of individual item
    const realPrice = parseFloat(e.target.previousElementSibling.textContent);
    price.textContent = realPrice;

    //initial total cost of items
    const total = document.querySelector('.price-action').textContent;
    const totals = parseFloat(total);

    /* adding the prices of items to initial total cost */
    const anod = totals + realPrice;
    const button = document.createElement('button');
    button.className = 'remove-me';
    button.append(document.createTextNode('X'));

    //create and append elements to div
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.append(img, price, button);

    /* this return a number of element(s) in ('.my-cart) */
    let x = document.querySelector('.my-cart').childElementCount;

    document.querySelector('.my-cart').append(div);
    document.querySelector('.price-action').textContent = anod;

    //add one to the number of items in cart
    if (x < 1000) {
      x++;
      document.querySelector('.cart').textContent = x;

      //store number of items in LS
      const number = x;
      localStorage.setItem('number', number);
    }

    //setting the elements of the object
    imgPri.source = source;
    imgPri.price = realPrice;

    //function that add the object to LS
    addItemToLS(imgPri);

    //function that add the total price to LS
    addTotalPriceToLS(anod);
  }

  e.preventDefault();
}

//callback func that add object to LS
function addItemToLS(item) {
  let items;
  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  items.push(item);
  localStorage.setItem('items', JSON.stringify(items));
}

//callback func that add total price to LS
function addTotalPriceToLS(totalPrice) {
  localStorage.setItem('totalPrice', totalPrice);
}

//event that expand the item(image) clicked
document.querySelector('.display-body').addEventListener('click', expandImage);

//callback function that expands image
function expandImage(e) {
  if (e.target.className === 'images') {
    document.querySelector('.backdrop').style.display = 'block';
    setTimeout(function () {
      document.querySelector('.backdrop').style.opacity = 1;
    }, 200);

    output = `<img src="${e.target.src}" class="show-img">`;
    document.querySelector('.display-image').innerHTML = output;
    document.querySelector('.display-image').style.transform = 'scale(1)';
  }
}

const backdrop = document.querySelector('.backdrop');
const display = document.querySelector('.display-image');

//event that closes backdrop
backdrop.addEventListener('click', closeBackDrop);

//call back func that closes backdrop
function closeBackDrop() {
  if (backdrop.style.display === 'block') {
    setTimeout(function () {
      backdrop.style.display = 'none';
    }, 500);

    backdrop.style.opacity = 0;
    display.style.transform = 'scale(0)';
  } else {
    backdrop.style.display = 'none';
  }
}

const show = document.querySelector('.show_hide-cart');

//event that hides/shows cart
show.addEventListener('click', function () {
  if (show.textContent === 'Show Cart') {
    document.querySelector('.my-cart').style.display = 'block';
    show.textContent = 'Hide Cart';
  } else {
    document.querySelector('.my-cart').style.display = 'none';
    show.textContent = 'Show Cart';
  }
});

//event that delete items from cart
document.querySelector('.my-cart').addEventListener('click', function (e) {
  if (e.target.className === 'remove-me') {
    /* this return a number of element(s) in ('.my-cart) */
    let x = document.querySelector('.my-cart').childElementCount;

    //confirms deletion
    if (confirm('Do you want to remove item from cart?')) {
      //remove item from cart
      e.target.parentElement.remove();

      /* calculating the total price of items in cart */
      const price = parseFloat(e.target.previousElementSibling.textContent);
      const priceBody = document.querySelector('.price-action');
      const pie = parseFloat(priceBody.textContent);

      //substract item price from total cost
      const anod = pie - price;
      document.querySelector('.price-action').textContent = anod;

      /* subtract one from the number of items in cart */
      if (x > 0) {
        x--;
        document.querySelector('.cart').innerHTML = x;

        //store number of items in LS
        const itemLeft = x;
        localStorage.setItem('number', itemLeft);
      }

      //function that removes item from LS
      removeItemsFromLS(e.target.parentElement);

      /* function that subtract item from total cost in LS */
      removeFromTotalPriceLS(anod);
    }
  }
});

//callback func that remove an object to LS
function removeItemsFromLS(UIitem) {
  let items;
  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  items.forEach((item, index) => {
    if (UIitem.firstElementChild.src === item.source) {
      items.splice(index, 1);
    }
  });
  localStorage.setItem('items', JSON.stringify(items));
}

/* callback func that substarct item price from total cost in LS */
function removeFromTotalPriceLS(UItotalPrice) {
  localStorage.setItem('totalPrice', UItotalPrice);
}
