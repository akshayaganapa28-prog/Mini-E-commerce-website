const products = [
    {
        id: 1,
        name: "Headphones",
        price: 999,
        category: "Electronics",
        image: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1499,
        category: "Electronics",
        image: "⌚"
    },
    {
        id: 3,
        name: "T-Shirt",
        price: 499,
        category: "Clothing",
        image: "👕"
    },
    {
        id: 4,
        name: "Shoes",
        price: 1299,
        category: "Clothing",
        image: "👟"
    },
    {
        id: 5,
        name: "Backpack",
        price: 799,
        category: "Accessories",
        image: "🎒"
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 399,
        category: "Accessories",
        image: "🕶️"
    }
];
let cart = [];
try {
    const savedCart = JSON.parse(
        localStorage.getItem("shopEasyCart") || "[]"
    );
    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            products.some(product =>
                product.id === item.id
            ) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 99
        );
    }
} catch (error) {
    cart = [];
}
const productList = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

// Display products
function displayProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchText);
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    productList.innerHTML = "";
    if (filteredProducts.length === 0) {
        productList.textContent = "No products found.";
        return;
    }
    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        const image = document.createElement("div");
        image.className = "product-image";
        image.textContent = product.image;
        const name = document.createElement("h3");
        name.textContent = product.name;
        const category = document.createElement("p");
        category.textContent = product.category;
        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "₹" + product.price.toFixed(2);
        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.addEventListener("click", function () {
            addToCart(product.id);
        });
        card.append(image, name, category, price, button);
        productList.appendChild(card);
    });
}
// Add product to cart
function addToCart(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (item.quantity >= 99) {
            alert("Maximum quantity reached.");
            return;
        }
        item.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }
    updateCart();
}
// Change product quantity
function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    } else if (item.quantity > 99) {
        item.quantity = 99;
        alert("Maximum quantity is 99.");
    }
    updateCart();
}
// Remove product from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}
// Display cart and calculate total
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;
    cart.forEach(item => {
        const product = products.find(
            product => product.id === item.id
        );
        if (!product) return;
        total += product.price * item.quantity;
        count += item.quantity;
        const row = document.createElement("div");
        row.className = "cart-item";
        const name = document.createElement("span");
        name.textContent = product.name + " - ₹" + product.price;
        const quantity = document.createElement("span");
        quantity.textContent = "Qty: " + item.quantity;
        const decrease = document.createElement("button");
        decrease.textContent = "-";
        decrease.setAttribute("aria-label", "Decrease quantity");
        decrease.addEventListener("click", function () {
            changeQuantity(item.id, -1);
        });
        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase quantity");
        increase.addEventListener("click", function () {
            changeQuantity(item.id, 1);
        });
        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.addEventListener("click", function () {
            removeFromCart(item.id);
        });
        row.append(name, quantity, decrease, increase, remove);
        cartItems.appendChild(row);
    });
    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }
    cartCount.textContent = count;
    cartTotal.textContent = total.toFixed(2);
    localStorage.setItem("shopEasyCart", JSON.stringify(cart));
}
// Search and category events
searchInput.addEventListener("input", displayProducts);
categorySelect.addEventListener("change", displayProducts);
// Simple demo checkout
document.getElementById("checkout").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Your cart is empty. Add a product first.");
        return;
    }
    const confirmed = confirm(
        "Place your demo order for ₹" +
        cartTotal.textContent + "?"
    );
    if (confirmed) {
        alert("Demo order placed successfully!");
        cart = [];
        updateCart();
    }
});
// Start the website
displayProducts();
updateCart();
