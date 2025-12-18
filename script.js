window.onload = function() {
    // ----- Data Storage -----
    let products = JSON.parse(localStorage.getItem('products')) || [
        {name:"Notebook", category:"Stationery", price:5},
        {name:"Pen Set", category:"Stationery", price:3},
        {name:"Laptop", category:"Electronics", price:500},
        {name:"Backpack", category:"Accessories", price:30},
        {name:"Snacks Pack", category:"Food", price:10}
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // ----- Dark Mode -----
    const darkToggle = document.getElementById('darkToggle');
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // ----- Page Navigation -----
    window.showPage = function(pageId) {
        document.querySelectorAll('.page').forEach(p => p.style.display='none');
        document.getElementById(pageId).style.display='block';
        renderProducts();
        renderCart();
        renderAdminProducts();
        renderAdminOrders();
    }

    // ----- Product Rendering -----
    function renderProducts() {
        const container = document.getElementById('products');
        if(!container) return;
        container.innerHTML = '';
        products.forEach((p, i) => {
            let card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<h4>${p.name}</h4>
                              <p>Category: ${p.category}</p>
                              <p>Price: $${p.price}</p>
                              <button onclick="addToCart(${i})">Add to Cart</button>`;
            container.appendChild(card);
        });
    }

    // ----- Cart -----
    window.addToCart = function(index) {
        cart.push(products[index]);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        const container = document.getElementById('cart-items');
        if(!container) return;
        container.innerHTML = '';
        let total = 0;
        cart.forEach((item, i) => {
            let div = document.createElement('div');
            div.innerHTML = `${item.name} - $${item.price} <button onclick="removeCart(${i})">Remove</button>`;
            container.appendChild(div);
            total += item.price;
        });
        container.innerHTML += `<h3>Total: $${total}</h3>`;
        document.getElementById('cart-count').innerText = cart.length;
    }

    window.removeCart = function(i) {
        cart.splice(i,1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    window.checkout = function() {
        if(cart.length === 0) { alert("Cart is empty"); return; }
        orders.push({items: [...cart], date: new Date().toLocaleString()});
        localStorage.setItem('orders', JSON.stringify(orders));
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        alert("Order placed successfully!");
        renderCart();
    }

    // ----- User Login/Register -----
    window.register = function() {
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        if(users.find(u => u.username === username)) { alert("Username exists"); return; }
        users.push({username, password});
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registered successfully!");
    }

    window.login = function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const user = users.find(u => u.username===username && u.password===password);
        if(user) { alert("Login successful"); showPage('home'); }
        else { alert("Invalid credentials"); }
    }

    // ----- Admin -----
    const ADMIN_PASSWORD = "admin123";

    window.adminLogin = function() {
        const pass = document.getElementById('admin-password').value;
        if(pass === ADMIN_PASSWORD) {
            document.getElementById('adminPanel').style.display = 'block';
            alert("Admin logged in");
        } else { alert("Wrong password"); }
    }

    window.addProduct = function() {
        const name = document.getElementById('new-name').value;
        const category = document.getElementById('new-category').value;
        const price = parseFloat(document.getElementById('new-price').value);
        if(!name || !category || isNaN(price)) { alert("Fill all fields"); return; }
        products.push({name, category, price});
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        renderAdminProducts();
    }

    function renderAdminProducts() {
        const container = document.getElementById('admin-products');
        if(!container) return;
        container.innerHTML = '';
        products.forEach((p, i) => {
            let div = document.createElement('div');
            div.innerHTML = `${p.name} - $${p.price} <button onclick="deleteProduct(${i})">Delete</button>`;
            container.appendChild(div);
        });
    }

    window.deleteProduct = function(i) {
        products.splice(i,1);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        renderAdminProducts();
    }

    function renderAdminOrders() {
        const container = document.getElementById('admin-orders');
        if(!container) return;
        container.innerHTML = '';
        orders.forEach((o, i) => {
            let div = document.createElement('div');
            div.innerHTML = `<strong>Order ${i+1}</strong> (${o.date}): ${o.items.map(it=>it.name).join(', ')}`;
            container.appendChild(div);
        });
    }

    // Initial Render
    showPage('home');
}