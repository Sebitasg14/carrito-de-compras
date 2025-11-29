import { products } from "./products.js";

let cart = JSON.parse(localStorage.getItem('cart')) || []

const gridContainer = document.querySelector('.cards-container')
const header = document.querySelector('.header')
const totalProducts = document.querySelector('.total-products')
const cartButton = document.querySelector('.cart-button')
const asidePanel = document.querySelector('.panel-cart')
const closeAside = document.querySelector('.close-aside')
const overlayAside = document.querySelector('.overlay')
const body = document.body
const productsSale = document.querySelector('.products-shopping')
const buyCart = document.querySelector('.buy-cart')
const clearCart = document.querySelector('.clear-cart')
const overlayModal = document.querySelector('.modal-overlay')
const modal = document.querySelector('.modal')
const modal2 = document.querySelector('.modal-2');
const textError = document.querySelector('.text-error')
const totalPrice = document.querySelector('.total-price')
const buttonNav = document.querySelector('.button-nav')
const overlayMobile = document.querySelector('.overlay-mobile');
const mobileNav = document.querySelector('.mobile-nav');
const closeNavMobile = document.querySelector('.close-nav-mobile')

function calculateTotal(){
    return cart.reduce((total, item) => total + item.quantity, 0)
}

function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart))
}

function updateAmount(){
    const total = calculateTotal()
    totalProducts.textContent = total
}

function priceTotal(){
    if(cart.length > 0){
        const price = cart.reduce(
            (total, item) => total + item.quantity * item.price,
            0
        );
        totalPrice.textContent = `Total Price: $${price.toFixed(2)}`;
    } else {
        totalPrice.textContent = 'Total Price: $0.00'
    }
}

function renderProducts() {
    gridContainer.innerHTML = ''

    products.forEach(product => {
        const card = document.createElement('article')
        card.classList.add('card')

        card.innerHTML = `
        <div class="img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="text">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
                <div class="price">
                    <span class="amount">$${product.price.toFixed(2)}</span>
                    <button class="add" data-id="${product.id}">Add to Cart</button>
                </div>
        `;
        gridContainer.appendChild(card)
    })
}

function renderProductsSale(){
    productsSale.innerHTML = ''
    cart.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('carts-products');
        const total = item.quantity * item.price;
        row.innerHTML = `
        <div class = "name-img">
        <img src = "${item.img}"/>
        <span>${item.name}</span>
        </div>
        <div class = "quantity-price">  
        <span class= "item-price">$${item.price.toFixed(2)}</span>
        <span>Quantity: ${item.quantity} = $${total.toFixed(2)}</span>
        </div>
        <button class="remove-product" data-id="${item.id}">
        <svg id="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </button>
        `;
        productsSale.appendChild(row)
    })
    priceTotal()
}

function clearCartShopping(){
    cart = []
    saveCart()
    updateAmount()
    renderProductsSale()
}

function buyShopping(){
    if (cart.length > 0){
        buyCart.textContent = 'Finishing buy...';
        setTimeout(() => {
            closeAside.click();
            clearCartShopping();
            buyCart.textContent = 'Buy';
        }, 2000);
    } else {
        textError.style.display = 'block';
        totalPrice.style.display = 'none'
        setTimeout(() => {
            textError.style.display = 'none';
            totalPrice.style.display = 'block';
        }, 2500);
    }
}

function openCart(){
    asidePanel.classList.add('active');
    overlayAside.classList.add('active');
    body.classList.add('no-scroll');
    renderProductsSale()

    header?.setAttribute('inert', '');
    gridContainer?.setAttribute('inert', '');
    asidePanel.focus()
}

function closeCart(){
    asidePanel.classList.remove('active');
    overlayAside.classList.remove('active');
    body.classList.remove('no-scroll');
    header?.removeAttribute('inert');
    gridContainer?.removeAttribute('inert');

    cartButton?.focus()
}

function openModal(){
    overlayModal.classList.add('active')
    modal.classList.add('active')
    body.classList.add('no-scroll')
    header?.setAttribute('inert', '')
    gridContainer?.setAttribute('inert', '');
    asidePanel?.setAttribute('inert', '')

    modal.focus()
}

function openSecondModal(productId){
    asidePanel.dataset.pendingDelete = productId;
    overlayModal.classList.add('active');
    modal2.classList.add('active');
    body.classList.add('no-scroll');
    header?.setAttribute('inert', '');
    gridContainer?.setAttribute('inert', '');
    asidePanel?.setAttribute('inert', '');

    modal2.focus();
}

function closeSecondModal(button){
    if (button === 'yes') {
        overlayModal.classList.remove('active');
        modal2.classList.remove('active');
        body.classList.remove('no-scroll');
        header?.removeAttribute('inert');
        gridContainer?.removeAttribute('inert');
        asidePanel?.removeAttribute('inert');
        const productId = asidePanel.dataset.pendingDelete;
        const productRow = document
            .querySelector(`.remove-product[data-id="${productId}"]`)
            ?.closest('.carts-products');

        if (productRow) {
            productRow.classList.add('remove');
        }

        setTimeout(() => {
            removeProduct(productId);
            delete asidePanel.dataset.pendingDelete;
        }, 300);
    } else {
        overlayModal.classList.remove('active');
        modal2.classList.remove('active');
        header?.removeAttribute('inert');
        gridContainer?.removeAttribute('inert');
        asidePanel?.removeAttribute('inert');
        delete asidePanel.dataset.pendingDelete;
        asidePanel.focus();
    }
}

function removeProduct(productId){
    cart = cart.filter(item => item.id !== parseInt(productId))
    saveCart()
    renderProductsSale()
    updateAmount()
}

function closeModal(button){
    if (button === 'yes'){
        overlayModal.classList.remove('active');
        modal.classList.remove('active');
        body.classList.remove('no-scroll');
        header?.removeAttribute('inert', '');
        gridContainer?.removeAttribute('inert', '');
        asidePanel?.removeAttribute('inert', '');

        clearCartShopping()
        closeAside.click()
    } else {
        overlayModal.classList.remove('active');
        modal.classList.remove('active');
        header?.removeAttribute('inert', '');
        gridContainer?.removeAttribute('inert', '');
        asidePanel?.removeAttribute('inert', '');

        asidePanel.focus()
    }
}

gridContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains('add')){
        const button = e.target
        const productsId = button.dataset.id

        button.classList.add('shake')
        setTimeout(() => {
            button.classList.remove('shake')
        }, 500)
        addProduct(productsId)
    }
})

function addProduct(ProductId) {
    const product = products.find(p => p.id === parseInt(ProductId))
    
    const existingProduct = cart.find(item => item.id === product.id)
    if (existingProduct){
        existingProduct.quantity++
        updateAmount()
    } else {
        cart.push({...product, quantity:1})
        updateAmount()
    }
    saveCart()
    console.log("Cart: ", cart)
}

window.addEventListener("scroll", () => {
    if(window.scrollY > 50){
        header.classList.add('scrolled')
    } else {
        header.classList.remove('scrolled')
    }
})

cartButton.addEventListener("click", openCart)
closeAside.addEventListener("click", closeCart)
buyCart.addEventListener("click", buyShopping)

clearCart.addEventListener("click", () => {
    if(cart.length > 0){
        openModal()
    } else {
        totalPrice.style.display = 'none'
        textError.style.display = 'block'
        setTimeout(() => {
            textError.style.display = 'none';
            totalPrice.style.display = 'block';
        }, 2500)
    }
})

document.addEventListener("keydown", (e) => {
    if(e.key === 'Escape' && asidePanel.classList.contains('active')){
        closeAside.click()
    }
})

modal.addEventListener("click", (e) => {
    const button = e.target
    if (button.classList.contains('btn-yes')){
        closeModal('yes')
    } else if(button.classList.contains('btn-no')){
        closeModal('no')
    }
})

modal2.addEventListener('click', (e) => {
    const button = e.target;
    if (button.classList.contains('btn-yes')) {
        closeSecondModal('yes');
    } else if (button.classList.contains('btn-no')) {
        closeSecondModal('no');
    }
});

productsSale.addEventListener("click", (e) => {
    const deleteButton = e.target.closest('.remove-product')
    if(deleteButton){
        const productId = deleteButton.dataset.id
        openSecondModal(productId)
    }
})

buttonNav.addEventListener("click", () => {
    overlayMobile.classList.add('active')
    mobileNav.classList.add('active')
    body.classList.add('no-scroll')
})

closeNavMobile.addEventListener("click", () => {
    overlayMobile.classList.remove('active');
    mobileNav.classList.remove('active');
    body.classList.remove('no-scroll');
})

updateAmount()
renderProducts()
renderProductsSale()