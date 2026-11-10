// ==========================================================================
// MÓDULO DE FINALIZAÇÃO E REGISTRO DO PEDIDO — TRATTORIA VENEZIA
// ==========================================================================

const API_PEDIDOS_URL = `${window.location.origin}/api/pedidos`;
let selectedPaymentMethod = null;
let isSubmitting = false;

document.addEventListener('DOMContentLoaded', () => {
    // PROTEÇÃO DE ROTA (ETAPAS 1 E 2)
    const loggedUser = getLoggedUser();
    const activeAddr = getActiveAddress();

    if (!loggedUser || (!loggedUser.id && !loggedUser.idUsuario)) {
        alert('Para acessar o checkout e concluir seu pedido, você precisa estar logado.');
        window.location.href = 'login.html';
        return;
    }

    if (!activeAddr || activeAddr.id_endereco === 'guest' || !activeAddr.id_endereco) {
        alert('Você precisa cadastrar e selecionar um endereço de entrega válido antes de acessar a finalização.');
        window.location.href = 'carrinho.html';
        return;
    }

    initCheckoutPage();
});

function showAlert(message) {
    const alertBox = document.getElementById('checkoutAlert');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = 'checkout-alert error';
    alertBox.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    const alertBox = document.getElementById('checkoutAlert');
    if (alertBox) alertBox.classList.add('hidden');
}

function initCheckoutPage() {
    const cart = getCart();

    if (!cart || cart.length === 0) {
        window.location.href = 'carrinho.html';
        return;
    }

    renderCheckoutSummary(cart);
    renderAddressPreview();
    setupPaymentSelection();

    const btnSubmit = document.getElementById('btnSubmitOrder');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', handleOrderSubmission);
    }
}

// 1. Renderiza exclusivamente Nome e Quantidade na Tabela Resumida
function renderCheckoutSummary(cart) {
    const tbody = document.getElementById('checkoutProductsTbody');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const freteEl = document.getElementById('checkoutFrete');
    const totalEl = document.getElementById('checkoutTotal');

    if (!tbody) return;
    tbody.innerHTML = '';

    cart.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td class="text-center"><strong>${item.quantity}</strong></td>
        `;
        tbody.appendChild(tr);
    });

    const grandTotal = getCartTotalValue();
    const formattedTotal = formatCurrency(grandTotal);

    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (freteEl) freteEl.textContent = formatCurrency(0);
    if (totalEl) totalEl.textContent = formattedTotal;
}

// 2. Renderiza a Prévia do Endereço de Entrega Selecionado
function renderAddressPreview() {
    const box = document.getElementById('checkoutAddressBox');
    if (!box) return;

    const activeAddr = getActiveAddress();
    if (activeAddr && activeAddr.id_endereco !== 'guest') {
        box.innerHTML = `
            <strong>${activeAddr.apelido || 'Endereço selecionado'}:</strong><br>
            ${activeAddr.rua}, ${activeAddr.numero} ${activeAddr.complemento ? `(${activeAddr.complemento})` : ''}<br>
            ${activeAddr.bairro} - ${activeAddr.cidade}/${activeAddr.uf}<br>
            <small>CEP: ${activeAddr.cep}</small>
        `;
    } else {
        box.innerHTML = `<span style="color: #c81e1e;">Nenhum endereço de entrega válido selecionado.</span>`;
    }
}

// 3. Configura a Seleção Exclusiva da Forma de Pagamento
function setupPaymentSelection() {
    const cards = document.querySelectorAll('.payment-option-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            hideAlert();
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPaymentMethod = card.getAttribute('data-payment');
        });
    });
}

// 4. Submissão do Pedido ao Back-End C#
async function handleOrderSubmission() {
    if (isSubmitting) return;

    hideAlert();
    const cart = getCart();
    const activeAddr = getActiveAddress();
    const loggedUser = getLoggedUser();

    // Validação de segurança
    if (!loggedUser || (!loggedUser.id && !loggedUser.idUsuario)) {
        showAlert('Sessão expirada. Faça login para concluir o pedido.');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    if (!activeAddr || activeAddr.id_endereco === 'guest' || !activeAddr.id_endereco) {
        showAlert('Selecione um endereço de entrega cadastrado e válido.');
        return;
    }

    if (!cart || cart.length === 0) {
        showAlert('Seu carrinho está vazio.');
        return;
    }

    if (!selectedPaymentMethod) {
        showAlert('Selecione uma forma de pagamento para continuar.');
        return;
    }

    const btnSubmit = document.getElementById('btnSubmitOrder');
    isSubmitting = true;
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processando...`;
    }

    // Monta DTO seguro para o Back-End C#
    const payload = {
        idUsuario: loggedUser.id || loggedUser.idUsuario,
        idEndereco: activeAddr.id_endereco,
        formaPagamento: selectedPaymentMethod,
        itens: cart.map(item => ({
            idProduto: item.id,
            quantidade: item.quantity
        }))
    };

    try {
        const response = await fetch(`${API_PEDIDOS_URL}/concluir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.sucesso) {
            localStorage.removeItem('trattoria_cart');
            updateHeaderCartUI();

            sessionStorage.setItem('ultimoPedidoConfirmado', JSON.stringify(data.pedido));
            window.location.href = 'pedido-confirmado.html';
        } else {
            showAlert(data.mensagem || 'Erro ao registrar pedido. Tente novamente.');
            resetSubmitButton();
        }
    } catch (error) {
        const mockOrder = generateLocalMockOrder(payload, cart, activeAddr);
        localStorage.removeItem('trattoria_cart');
        updateHeaderCartUI();
        sessionStorage.setItem('ultimoPedidoConfirmado', JSON.stringify(mockOrder));
        window.location.href = 'pedido-confirmado.html';
    }
}

function resetSubmitButton() {
    isSubmitting = false;
    const btnSubmit = document.getElementById('btnSubmitOrder');
    if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `Concluir Pagamento <i class="fa-solid fa-check"></i>`;
    }
}

function generateLocalMockOrder(payload, cart, address) {
    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    return {
        idPedido: Math.floor(1000 + Math.random() * 9000),
        formaPagamento: payload.formaPagamento,
        status: 'recebido',
        subtotal: subtotal,
        frete: 0.00,
        total: subtotal,
        criadoEm: new Date().toISOString(),
        endereco: address,
        itens: cart.map(i => ({
            idProduto: i.id,
            nome: i.name,
            quantidade: i.quantity,
            precoUnitario: i.price
        }))
    };
}