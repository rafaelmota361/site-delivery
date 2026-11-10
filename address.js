// ==========================================================================
// MÓDULO DE GERENCIAMENTO DE ENDEREÇOS DE ENTREGA — TRATTORIA VENEZIA
// ==========================================================================

const API_ENDERECOS_URL = `${window.location.origin}/api/enderecos`;

// Estado local do módulo de endereço
let userAddresses = [];
let selectedAddressId = null;
let editingAddressId = null;

// Recupera Usuário Logado via SessionStorage
function getLoggedUser() {
    try {
        const userStr = sessionStorage.getItem('usuarioLogado');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
}

// Recupera Endereço Selecionado Atual (LocalStorage ou Estado)
function getActiveAddress() {
    try {
        const addrStr = localStorage.getItem('trattoria_active_address');
        return addrStr ? JSON.parse(addrStr) : null;
    } catch {
        return null;
    }
}

// Salva Endereço Selecionado no LocalStorage
function setActiveAddress(addressObj) {
    if (addressObj) {
        localStorage.setItem('trattoria_active_address', JSON.stringify(addressObj));
    } else {
        localStorage.removeItem('trattoria_active_address');
    }
    updateHeaderAddressUI();
}

// Formata Endereço em Texto Curto para o Cabeçalho
function formatShortAddress(addr) {
    if (!addr) return 'Informe seu endereço';
    const ruaNum = `${addr.rua}, ${addr.numero}`;
    const bairro = addr.bairro ? ` - ${addr.bairro}` : '';
    return `${ruaNum}${bairro}`;
}

// Atualiza o Elemento Visual no Cabeçalho
function updateHeaderAddressUI() {
    const addressValueEl = document.querySelector('.address-value');
    if (!addressValueEl) return;

    const activeAddr = getActiveAddress();
    addressValueEl.textContent = formatShortAddress(activeAddr);
    addressValueEl.title = activeAddr ? `${activeAddr.rua}, ${activeAddr.numero} ${activeAddr.complemento || ''} - ${activeAddr.bairro}, ${activeAddr.cidade}/${activeAddr.uf}` : 'Informe seu endereço';
}

// Exibe Alerta no Modal
function showAddressAlert(message, isError = true) {
    const alertBox = document.getElementById('addressAlert');
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `address-alert ${isError ? 'error' : 'success'}`;
    alertBox.classList.remove('hidden');
}

function hideAddressAlert() {
    const alertBox = document.getElementById('addressAlert');
    if (alertBox) alertBox.classList.add('hidden');
}

// ==========================================================================
// CONSULTA AUTOMÁTICA DE CEP (ViaCEP)
// ==========================================================================

async function fetchCepAddress(cepValue) {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (!data.erro) {
            document.getElementById('addrRua').value = data.logradouro || '';
            document.getElementById('addrBairro').value = data.bairro || '';
            document.getElementById('addrCidade').value = data.localidade || '';
            document.getElementById('addrUF').value = data.uf || '';
            document.getElementById('addrNumero').focus();
            hideAddressAlert();
        } else {
            showAddressAlert('CEP não encontrado. Preencha os campos manualmente.');
        }
    } catch {
        // Falha silenciosa ou mantém preenchimento manual
    }
}

// ==========================================================================
// CONTROLE DE TELAS / VISÕES DO MODAL
// ==========================================================================

function openAddressModal() {
    const modal = document.getElementById('addressModal');
    if (!modal) return;

    hideAddressAlert();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const user = getLoggedUser();
    if (user) {
        loadUserAddresses(user.id || user.idUsuario);
    } else {
        showAddressFormView(true);
    }
}

function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function showAddressListView() {
    document.getElementById('addressListView').classList.remove('hidden');
    document.getElementById('addressFormView').classList.add('hidden');
    renderAddressList();
}

function showAddressFormView(isNew = true, addressData = null) {
    document.getElementById('addressListView').classList.add('hidden');
    document.getElementById('addressFormView').classList.remove('hidden');

    const formTitle = document.getElementById('addressFormTitle');
    const form = document.getElementById('addressForm');
    form.reset();

    document.querySelectorAll('.alias-chip').forEach(c => c.classList.remove('selected'));
    document.querySelector('.alias-chip[data-alias="Minha casa"]').classList.add('selected');
    document.getElementById('addrApelido').value = 'Minha casa';

    if (isNew || !addressData) {
        editingAddressId = null;
        if (formTitle) formTitle.textContent = 'Novo Endereço de Entrega';
    } else {
        editingAddressId = addressData.id_endereco;
        if (formTitle) formTitle.textContent = 'Editar Endereço';

        document.getElementById('addrCep').value = addressData.cep || '';
        document.getElementById('addrRua').value = addressData.rua || '';
        document.getElementById('addrNumero').value = addressData.numero || '';
        document.getElementById('addrComplemento').value = addressData.complemento || '';
        document.getElementById('addrBairro').value = addressData.bairro || '';
        document.getElementById('addrCidade').value = addressData.cidade || '';
        document.getElementById('addrUF').value = addressData.uf || '';
        document.getElementById('addrReferencia').value = addressData.referencia || '';

        const alias = addressData.apelido || 'Minha casa';
        document.getElementById('addrApelido').value = alias;

        const targetChip = document.querySelector(`.alias-chip[data-alias="${alias}"]`);
        if (targetChip) {
            document.querySelectorAll('.alias-chip').forEach(c => c.classList.remove('selected'));
            targetChip.classList.add('selected');
        }
    }
}

// Renderiza Lista de Endereços Cadastrados
function renderAddressList() {
    const container = document.getElementById('addressListContainer');
    if (!container) return;

    container.innerHTML = '';
    const active = getActiveAddress();

    if (userAddresses.length === 0) {
        showAddressFormView(true);
        return;
    }

    userAddresses.forEach(addr => {
        const isSelected = active && active.id_endereco && active.id_endereco === addr.id_endereco;

        const card = document.createElement('div');
        card.className = `address-card-item ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="address-card-info">
                <span class="address-badge-tag">
                    <i class="fa-solid fa-location-dot"></i> ${addr.apelido || 'Endereço'}
                </span>
                <span class="address-card-text">${addr.rua}, ${addr.numero} ${addr.complemento ? `(${addr.complemento})` : ''}</span>
                <span class="address-card-subtext">${addr.bairro} - ${addr.cidade}/${addr.uf} • CEP: ${addr.cep}</span>
            </div>
            <div class="address-card-actions">
                <button type="button" class="btn-edit-address" title="Editar Endereço" onclick="event.stopPropagation(); handleEditAddressClick('${addr.id_endereco}')">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <div class="address-radio-indicator"></div>
            </div>
        `;

        card.addEventListener('click', () => {
            setActiveAddress(addr);
            renderAddressList();
            setTimeout(closeAddressModal, 200);
        });

        container.appendChild(card);
    });
}

// ==========================================================================
// COMUNICAÇÃO COM O BACK-END C# / MYSQL
// ==========================================================================

async function loadUserAddresses(userId) {
    try {
        const response = await fetch(`${API_ENDERECOS_URL}?idUsuario=${userId}`);
        if (response.ok) {
            userAddresses = await response.json();
            if (userAddresses.length > 0) {
                const active = getActiveAddress();
                if (!active || active.id_endereco === 'guest') {
                    setActiveAddress(userAddresses[0]);
                }
                showAddressListView();
            } else {
                showAddressFormView(true);
            }
        } else {
            showAddressFormView(true);
        }
    } catch {
        const active = getActiveAddress();
        if (active && active.id_endereco !== 'guest') {
            userAddresses = [active];
            showAddressListView();
        } else {
            showAddressFormView(true);
        }
    }
}

async function saveAddress(dto) {
    const user = getLoggedUser();

    if (!user) {
        showAddressAlert('Você precisa estar conectado para salvar um endereço.');
        return;
    }

    dto.idUsuario = user.id || user.idUsuario;
    const endpoint = editingAddressId 
        ? `${API_ENDERECOS_URL}/atualizar/${editingAddressId}` 
        : `${API_ENDERECOS_URL}/cadastrar`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });

        if (response.ok) {
            const savedData = await response.json();
            const addressObj = savedData.endereco || savedData || dto;
            if (!addressObj.id_endereco && editingAddressId) {
                addressObj.id_endereco = editingAddressId;
            }
            setActiveAddress(addressObj);
            closeAddressModal();
        } else {
            showAddressAlert('Erro ao salvar endereço no servidor.');
        }
    } catch {
        // Fallback local caso a API C# esteja offline
        dto.id_endereco = editingAddressId || Date.now();
        setActiveAddress(dto);
        closeAddressModal();
    }
}

window.handleEditAddressClick = function (addressId) {
    const target = userAddresses.find(a => a.id_endereco == addressId) || getActiveAddress();
    if (target) {
        showAddressFormView(false, target);
    }
};

// ==========================================================================
// EVENT LISTENERS & INICIALIZAÇÃO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAddressUI();

    const headerAddressBtn = document.querySelector('.header-address') || document.getElementById('headerAddressBtn');
    if (headerAddressBtn) {
        headerAddressBtn.addEventListener('click', openAddressModal);
    }

    const closeBtn = document.getElementById('closeAddressModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeAddressModal);

    const overlay = document.getElementById('addressModal');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAddressModal();
        });
    }

    const cepInput = document.getElementById('addrCep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 5) {
                val = val.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = val;
            if (val.replace(/\D/g, '').length === 8) {
                fetchCepAddress(val);
            }
        });
    }

    document.querySelectorAll('.alias-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.alias-chip').forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            document.getElementById('addrApelido').value = chip.getAttribute('data-alias');
        });
    });

    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const dto = {
                apelido: document.getElementById('addrApelido').value || 'Minha casa',
                cep: document.getElementById('addrCep').value,
                rua: document.getElementById('addrRua').value,
                numero: document.getElementById('addrNumero').value,
                complemento: document.getElementById('addrComplemento').value,
                bairro: document.getElementById('addrBairro').value,
                cidade: document.getElementById('addrCidade').value,
                uf: document.getElementById('addrUF').value,
                referencia: document.getElementById('addrReferencia').value,
                frete: 0.00
            };

            if (!dto.cep || !dto.rua || !dto.numero || !dto.bairro || !dto.cidade || !dto.uf) {
                showAddressAlert('Por favor, preencha todos os campos obrigatórios (*).');
                return;
            }

            saveAddress(dto);
        });
    }

    const btnAddNew = document.getElementById('btnAddNewAddress');
    if (btnAddNew) {
        btnAddNew.addEventListener('click', () => showAddressFormView(true));
    }

    const btnBackToList = document.getElementById('btnBackToAddressList');
    if (btnBackToList) {
        btnBackToList.addEventListener('click', showAddressListView);
    }
});