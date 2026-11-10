// base dos dados 
const PRODUCTS_DATA = {
    pizza: {
        id: 1,
        name: 'Pizza de Frango com Catupiry',
        price: 75.00,
        description: 'Massa artesanal de fermentação natural, molho de tomate italiano, frango desfiado temperado com ervas finas, coberto com uma generosa camada do autêntico Catupiry e azeitonas pretas.',
        keywords: ['pizza', 'pizzas', 'frango', 'catupiry', 'pizza frango', 'pizza catupiry', 'frango com catupiry'],
        images: ['pizza-catupiry1.png', 'pizza-catupiry2.png', 'pizza-catupiry3.png']
    },
    pasta: {
        id: 2,
        name: 'Macarrão',
        price: 55.00,
        description: 'Massa fresca tipo fettuccine servida com nosso tradicional molho sugo de tomates italianos San Marzano, manjericão fresco, azeite de oliva extra virgem e queijo parmesão ralado na hora.',
        keywords: ['macarrao', 'macarrão', 'massa', 'massas', 'fettuccine', 'pasta', 'sugo', 'pomodoro'],
        images: ['macarrão1.png', 'macarrão2.png', 'macarrão3.png']
    },
    risotto: {
        id: 3,
        name: 'Risoto',
        price: 85.00,
        description: 'Risoto de arroz arbório cremoso preparado com cogumelos frescos, manteiga de emulsão, caldo artesanal de vegetais e finalizado com toque sutil de azeite trufado.',
        keywords: ['risoto', 'risotto', 'arroz', 'cogumelos', 'trufado'],
        images: ['risoto-1.png', 'risoto-2.png', 'risoto-3.png']
    },
    lasagna: {
        id: 4,
        name: 'Lasanha',
        price: 45.00,
        description: 'Camadas intercaladas de massa fresca artesanal, molho bolonhesa rico em carne bovina selecionada, molho bechamel aveludado e bastante queijo muçarela gratinado ao forno.',
        keywords: ['lasanha', 'lasagna', 'bolonhesa', 'massa'],
        images: ['https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80', 'lasanha-1.png', 'lasanha-2.png']
    },
    pepperoni: {
        id: 5,
        name: 'Pizza de Pepperoni',
        price: 70.00,
        description: 'Massa crocante por fora e macia por dentro, molho de tomate rústico, queijo muçarela derretido, fatias crocantes de pepperoni especial e salpicado de orégano fresco.',
        keywords: ['pizza', 'pizzas', 'pepperoni', 'calabresa', 'pizza pepperoni', 'pizza calabresa'],
        images: ['pizza-pepperoni-1.png', 'pizza-pepperoni-2.png', 'pizza-pepperoni-3.png']
    },
    gnocchi: {
        id: 6,
        name: 'Gnocchi',
        price: 50.00,
        description: 'Nhoque artesanal de batata macio que derrete na boca, servido com refinado molho de tomate pomodoro, manjericão e lascas de queijo parmesão ralado.',
        keywords: ['gnocchi', 'nhoque', 'massa', 'batata', 'pomodoro'],
        images: ['gnocchi-1.png', 'gnocchi-2.png', 'gnocchi-3.png']
    },
    agua: {
        id: 7,
        name: 'Água com gás',
        price: 4.50,
        description: 'Água mineral natural gaseificada garrafa 500ml, leve e refrescante.',
        keywords: ['agua', 'água', 'agua com gas', 'gás', 'mineral', 'bebida'],
        images: ['agua-3.png', 'agua.png']
    },
    vinho: {
        id: 8,
        name: 'Vinho Barbera',
        price: 120.00,
        description: 'Vinho tinto italiano Barbera d’Asti de acidez harmoniosa e notas de frutas vermelhas. Perfeito para acompanhar massas e pizzas.',
        keywords: ['vinho', 'vinho tinto', 'barbera', 'bebida', 'tinto'],
        images: ['vinho-barbera-1.png', 'vinho-barbera-2.png']
    },
    refri: {
        id: 9,
        name: 'Refrigerante Zero',
        price: 6.50,
        description: 'Lata 350ml bem gelada, zero açúcares.',
        keywords: ['refrigerante', 'refri', 'coca', 'coca cola', 'zero', 'bebida', 'lata'],
        images: ['coca-1.png', 'coca-2.png']
    },
    suco: {
        id: 10,
        name: 'Suco natural de maracujá',
        price: 5.69,
        description: 'Suco feito com a polpa natural da fruta no momento do pedido. Copo 400ml.',
        keywords: ['suco', 'suco natural', 'maracuja', 'maracujá', 'bebida'],
        images: ['sucu-1.png', 'suco-2.png']
    },
    gelato_pistache: {
        id: 11,
        name: 'Gelato de Pistache',
        price: 13.50,
        description: 'Autêntico gelato artesanal italiano elaborado com pistaches selecionados da Sicília.',
        keywords: ['gelato', 'sorvete', 'pistache', 'gelato pistache', 'sorvete pistache', 'sobremesa'],
        images: ['pistache-1.png', 'pistache-2.png']
    },
    tiramisu: {
        id: 12,
        name: 'Tiramisù',
        price: 55.61,
        description: 'Clássica sobremesa italiana com biscoitos champagne embebidos em café espresso, creme de queijo mascarpone e cacau em pó.',
        keywords: ['tiramisu', 'tiramisù', 'doce', 'cafe', 'mascarpone', 'sobremesa'],
        images: ['tiramisu-1.png', 'tiramisu-2.png']
    },
    maritozzo: {
        id: 13,
        name: 'Maritozzo',
        price: 20.42,
        description: 'Pão doce macio tradicional de Roma, recheado generosamente com chantilly leve e açúcar de confeiteiro.',
        keywords: ['maritozzo', 'pao doce', 'chantilly', 'sobremesa', 'doce'],
        images: ['maritozzo-1.png', 'maritozzo-2.png']
    },
    gelato_morango: {
        id: 14,
        name: 'Gelato de Morango',
        price: 14.67,
        description: 'Gelato cremoso preparado com morangos frescos e selecionados, sem corantes artificiais.',
        keywords: ['gelato', 'sorvete', 'morango', 'gelato morango', 'sorvete morango', 'sobremesa'],
        images: ['morango-1.png', 'morango-2.png']
    }
};

// URL base da API 
const API_CART_URL = `${window.location.origin}/api/carrinho`;

let currentProductKey = null;
let currentProduct = null;
let currentImageIndex = 0;

// referencias DOM 
const productModal = document.getElementById('productModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalMainImage = document.getElementById('modalMainImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductDescription = document.getElementById('modalProductDescription');
const galleryPrevBtn = document.getElementById('galleryPrevBtn');
const galleryNextBtn = document.getElementById('galleryNextBtn');
const galleryDotsContainer = document.getElementById('galleryDots');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
const cartBadge = document.getElementById('cartBadge');
const headerCartTotal = document.getElementById('headerCartTotal');
const searchInput = document.getElementById('searchInput');


function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

function getLoggedUser() {
    try {
        const userStr = sessionStorage.getItem('usuarioLogado');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('trattoria_cart')) || [];
    } catch {
        return [];
    }
}

function saveCartState(cart) {
    localStorage.setItem('trattoria_cart', JSON.stringify(cart));
}

function getCartTotalUnits() {
    const cart = getCart();
    return cart.reduce((acc, item) => acc + item.quantity, 0);
}

function getCartTotalValue() {
    const cart = getCart();
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

function updateHeaderCartUI() {
    const totalUnits = getCartTotalUnits();
    const totalValue = getCartTotalValue();

    if (cartBadge) cartBadge.textContent = totalUnits;
    if (headerCartTotal) headerCartTotal.textContent = formatCurrency(totalValue);
}


function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-gold);"></i> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

// sincronização com back-end (C#)
async function syncCartBackend(action, productKey, quantity = 1) {
    const user = getLoggedUser();
    if (!user) return; // se for visitante não chama a API

    const product = PRODUCTS_DATA[productKey];
    if (!product) return;

    try {
        await fetch(`${API_CART_URL}/${action.toLowerCase()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idUsuario: user.id || user.idUsuario,
                idProduto: product.id,
                quantidade: quantity
            })
        });
    } catch (err) {
        console.warn('Backend C# indisponível, mantendo apenas estado local temporário.');
    }
}

// adicionar/incrementar produto no carrinho
function addToCart(productKey) {
    const product = PRODUCTS_DATA[productKey];
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.key === productKey);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            key: productKey,
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCartState(cart);
    updateHeaderCartUI();
    syncCartBackend('ADD', productKey, 1);
    showToast('Produto adicionado ao carrinho!');
}

// remover produto 
function removeFromCart(productKey) {
    let cart = getCart();
    cart = cart.filter(item => item.key !== productKey);
    saveCartState(cart);
    updateHeaderCartUI();
    syncCartBackend('REMOVE', productKey, 0);
}


function updateGalleryImage() {
    if (!currentProduct) return;
    modalMainImage.src = currentProduct.images[currentImageIndex];
    modalMainImage.alt = `${currentProduct.name} - Imagem ${currentImageIndex + 1}`;

    const dots = galleryDotsContainer.querySelectorAll('.gallery-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentImageIndex);
    });
}

function renderGalleryDots(count) {
    galleryDotsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
        galleryDotsContainer.appendChild(dot);
    }
}

function openProductModal(productKey) {
    const data = PRODUCTS_DATA[productKey];
    if (!data) return;

    currentProductKey = productKey;
    currentProduct = data;
    currentImageIndex = 0;

    modalProductName.textContent = currentProduct.name;
    modalProductDescription.textContent = currentProduct.description;

    renderGalleryDots(currentProduct.images.length);
    updateGalleryImage();

    productModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    if (!productModal) return;
    productModal.classList.add('hidden');
    document.body.style.overflow = '';
    currentProductKey = null;
    currentProduct = null;
}

document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
        const productKey = card.getAttribute('data-product');
        openProductModal(productKey);
    });
});

if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!currentProduct) return;
        currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
        updateGalleryImage();
    });
}

if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!currentProduct) return;
        currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length;
        updateGalleryImage();
    });
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);

if (productModal) {
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal && !productModal.classList.contains('hidden')) {
        closeProductModal();
    }
});

// botão adicionar no carrinho 
if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
        if (!currentProductKey) return;
        
        addToCart(currentProductKey);
        
        modalAddToCartBtn.style.backgroundColor = '#54131D';
        setTimeout(() => {
            modalAddToCartBtn.style.backgroundColor = '';
            closeProductModal();
        }, 250);
    });
}


// buscar os produtos na barra de pesquisa

function normalizeText(text) {
    if (!text) return '';
    return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function handleSearch() {
    if (!searchInput) return;

    const searchTerms = normalizeText(searchInput.value).split(/\s+/).filter(t => t.length > 0);
    const displayedProductIds = new Set();
    let totalMatches = 0;

    document.querySelectorAll('.product-card').forEach(card => {
        const key = card.getAttribute('data-product');
        const prod = PRODUCTS_DATA[key];

        if (!prod || searchTerms.length === 0) {
            card.style.display = '';
            return;
        }

        const searchableText = normalizeText(`${prod.name} ${prod.description} ${(prod.keywords || []).join(' ')}`);
        const matches = searchTerms.every(term => searchableText.includes(term));

        if (matches && !displayedProductIds.has(prod.id)) {
            card.style.display = '';
            displayedProductIds.add(prod.id);
            totalMatches++;
        } else {
            card.style.display = 'none';
        }
    });

    if (searchTerms.length > 0) {
        document.querySelectorAll('section.most-requested, section.menu-section').forEach(sec => {
            const hasVisible = sec.querySelectorAll('.product-card:not([style*="display: none"])').length > 0;
            sec.style.display = hasVisible ? '' : 'none';
        });
    } else {
        document.querySelectorAll('section.most-requested, section.menu-section').forEach(sec => sec.style.display = '');
    }
}

if (searchInput) searchInput.addEventListener('input', handleSearch);

// inicialização da interface
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderCartUI();
});