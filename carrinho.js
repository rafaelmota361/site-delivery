// Lógica de Renderização e Alternância Mutuamente Exclusiva de Estados
document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

function renderCartPage() {
    const emptyState = document.getElementById('cartEmptyState');
    const filledState = document.getElementById('cartFilledState');
    const itemsListContainer = document.getElementById('cartItemsList');
    const subtotalText = document.getElementById('cartSubtotalText');
    const totalText = document.getElementById('cartTotalText');

    if (!emptyState || !filledState || !itemsListContainer) return;

    const cart = getCart();

    // ESTADO 1: Carrinho Vazio
    if (!cart || cart.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.style.display = 'block';

        filledState.classList.add('hidden');
        filledState.style.display = 'none';

        updateHeaderCartUI();
        return;
    }

    // ESTADO 2: Carrinho Com Produtos
    emptyState.classList.add('hidden');
    emptyState.style.display = 'none';

    filledState.classList.remove('hidden');
    filledState.style.display = 'grid';

    itemsListContainer.innerHTML = '';

    cart.forEach(item => {
        const productInfo = PRODUCTS_DATA[item.key];
        if (!productInfo) return;

        const mainImage = productInfo.images[0];
        const itemTotal = item.price * item.quantity;

        const itemCard = document.createElement('div');
        itemCard.className = 'cart-item-card';
        itemCard.innerHTML = `
            <img src="${mainImage}" alt="${productInfo.name}" class="cart-item-img">
            <div class="cart-item-info">
                <span class="cart-item-title">${productInfo.name}</span>
                <span class="cart-item-price">${formatCurrency(item.price)} (Total: ${formatCurrency(itemTotal)})</span>
                <div class="cart-item-qty-control">
                    <button class="qty-btn" onclick="changeQuantity('${item.key}', -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.key}', 1)">+</button>
                </div>
            </div>
            <button class="btn-remove-item" onclick="handleRemoveItem('${item.key}')" title="Remover produto">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;

        itemsListContainer.appendChild(itemCard);
    });

    const grandTotal = getCartTotalValue();
    const formattedTotal = formatCurrency(grandTotal);

    if (subtotalText) subtotalText.textContent = formattedTotal;
    if (totalText) totalText.textContent = formattedTotal;

    updateHeaderCartUI();
}

// Alteração de Quantidade (+ e -)
window.changeQuantity = function (productKey, delta) {
    let cart = getCart();
    const existing = cart.find(item => item.key === productKey);
    if (!existing) return;

    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
        handleRemoveItem(productKey);
    } else {
        existing.quantity = newQty;
        saveCartState(cart);
        syncCartBackend('UPDATE', productKey, newQty);
        renderCartPage();
    }
};

// Remoção Direta por Lixeira
window.handleRemoveItem = function (productKey) {
    removeFromCart(productKey);
    renderCartPage();
};

// Handler do Botão "Continuar para Compra" com bloqueio de 3 etapas
const btnCheckout = document.getElementById('btnCheckout');
if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        const cart = getCart();
        if (!cart || cart.length === 0) {
            showToast('Adicione produtos ao carrinho antes de continuar.');
            return;
        }

        // ETAPA 1: Verificar Autenticação
        const loggedUser = getLoggedUser();
        if (!loggedUser || (!loggedUser.id && !loggedUser.idUsuario)) {
            alert('Para continuar com sua compra, você precisa primeiro criar uma conta ou fazer login na Trattoria Venezia.');
            window.location.href = 'login.html';
            return;
        }

        // ETAPA 2: Verificar Endereço Cadastrado e Selecionado
        const activeAddr = getActiveAddress();
        if (!activeAddr || activeAddr.id_endereco === 'guest' || !activeAddr.id_endereco) {
            alert('Quase lá! Para continuar com seu pedido, primeiro informe e cadastre seu endereço de entrega.');
            openAddressModal();
            return;
        }

        // ETAPA 3: Liberar Avanço para Checkout
        window.location.href = 'finalizar-pedido.html';
    });
}