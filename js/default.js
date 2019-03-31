// **********************************************************************
// Shopping card

var spendingCart = {};

spendingCart.Item = function(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
};

spendingCart.addItemToCart = function(name, price, count) {
    for (var i in this.cart) {
        if (this.cart[i].name === name) {
            this.cart[i].count += count;
            this.saveCart();
            return;
        }
    }
    var item = new this.Item(name, price, count);
    if ((localStorage.getItem('spendingCart')) === null) {
        spendingCart.cart = [];
    } else {
        if (JSON.parse(localStorage.getItem("spendingCart")).length > 0) {
            spendingCart.loadCart();
        } else {
            spendingCart.cart = [];
        }
    }

    this.cart.push(item);
    this.saveCart();
};

spendingCart.setCountForItem = function(name, count) {
    for (var i in this.cart) {
        if (this.cart[i].name === name) {
            this.cart[i].count = count;
            if (this.cart[i].count === 0) {
                this.cart.splice(i, 1);
            }
            break;
        }
    }

    this.saveCart();
};

spendingCart.removeItemFromCart = function(name) { // Remove one item
    for (var i in this.cart) {
        if (this.cart[i].name === name) {
            this.cart[i].count--;
            if (this.cart[i].count === 0) {
                this.cart.splice(i, 1);
            }
            break;
        }

    }
    this.saveCart();
};

spendingCart.removeItemFromCartAll = function(name) { // Removes all item name

    for (var i in this.cart) {
        if (this.cart[i].name === name) {
            this.cart.splice(i, 1);
            break;
        }
    }
    this.saveCart();
};

spendingCart.emptyCart = function() {

    this.cart = [];
    this.saveCart();
};

spendingCart.countCart = function() { // -> return total count
    var totalCount = 0;
    for (var i in this.cart) {
        totalCount += this.cart[i].count;
    }
    return totalCount;
};

spendingCart.listCart = function ()  {//-> return array of Items
    var cartCopy = [];
    for (var i in this.cart) {
        var item = this.cart[i];
        var itemCopy = {};
        for (var p in item) {
            itemCopy[p] = item[p];
        }
        itemCopy.total = (item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy);
    }
    return cartCopy;
};

spendingCart.totalCart = function() { //-> return total cost
    var totalCost = 0;
    for (var i in this.cart) {
        totalCost += this.cart[i].price * this.cart[i].count;
    }
    return totalCost.toFixed(2);
};

spendingCart.saveCart = function() {

    localStorage.setItem("spendingCart", JSON.stringify(this.cart));
};

spendingCart.loadCart = function() {
    this.cart = JSON.parse(localStorage.getItem("spendingCart"));
};

spendingCart.loadCart();

$(".add-to-cart").on('click', function(event) {
    var name = $(this).attr("data-name");
    var price = Number($(this).attr("data-price"));
    spendingCart.addItemToCart(name, price, 1);
    displayCart();
});

$("#clear-cart").on('click', function(event) {
    spendingCart.emptyCart();
    displayCart();
});

$("#cart-follow").on('click', function(event) {
    $('html, body').animate({ scrollTop: 0 }, '300');
});

/***************************************/
function displayCart() {
    var cartDisplay = spendingCart.listCart();
    if (cartDisplay.length === 0) { $('#table-cart').css('display', "none") } else { $('#table-cart').css('display', "block") };
    var output = "";
    for (var i in cartDisplay) {
        output += "<tr><td class='col-sm-8 col-md-6'><div class='media'><h4 class='media-heading'><p class='cart-shop-product'>" +
            cartDisplay[i].name +
            "</p></h4></div></td>" +
            "<td class='col-sm-1 col-md-1' style='text-align: center'>" +
            "<input class='item-count' type='number' data-name='" +
            cartDisplay[i].name +
            "'value= '" + cartDisplay[i].count + "'>" +
            "</td><td class='col-sm-1 col-md-1 text-center'><strong>" +
            cartDisplay[i].price +
            "</strong></td><td class='col-sm-1 col-md-1 text-center'><strong>" +
            cartDisplay[i].total +
            "</strong></td>" +
            "<td class='col-sm-1 col-md-1'>" +
            "<button class='add-item' data-name='" + cartDisplay[i].name + "'>+</button> " +
            "</td><td class='col-sm-1 col-md-1'>" +
            "<button class='subtract-item' data-name='" + cartDisplay[i].name + "'>-</button> " +
            "</td><td class='col-sm-1 col-md-1'>" +
            "<button class='delete-item' data-name='" + cartDisplay[i].name + "'>X</button>" +
            "</td><td class='col-sm-1 col-md-1'></tr>";
    }

    $("#show-cart").html(output);
    $("#count-cart").html(spendingCart.countCart());
    $('#total-cart').html(spendingCart.totalCart());
    $('.count-cart-bar').html(spendingCart.countCart());
}

$('#show-cart').on('click', '.delete-item', function(event) {
    var name = $(this).attr("data-name");
    spendingCart.removeItemFromCartAll(name);
    displayCart();
});

$('#show-cart').on('click', '.subtract-item', function(event) {
    var name = $(this).attr("data-name");
    spendingCart.removeItemFromCart(name);
    displayCart();
});
$('#show-cart').on('click', '.add-item', function(event) {
    var name = $(this).attr("data-name");
    spendingCart.addItemToCart(name, 0, 1);
    displayCart();
});

$('#show-cart').on("change", '.item-count', function(event) {
    var name = $(this).attr("data-name");
    var count = Number($(this).val());
    spendingCart.setCountForItem(name, count);
    displayCart();
});

displayCart();