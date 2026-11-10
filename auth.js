// 1. URL dinâmica que funciona em qualquer porta do C#
const API_URL = `${window.location.origin}/api/auth`;

function showAlert(message, isError = true) {
    const alertBox = document.getElementById('authAlert');
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `auth-alert ${isError ? 'error' : 'success'}`;
    alertBox.classList.remove('hidden');
}

// Handler de Cadastro
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dto = {
            nome: document.getElementById('nome').value,
            sobrenome: document.getElementById('sobrenome').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            telefone: document.getElementById('telefone').value,
            senha: document.getElementById('senha').value
        };

        try {
            const response = await fetch(`${API_URL}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto)
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Cadastro realizado com sucesso! Redirecionando para login...', false);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showAlert(data.mensagem || 'Erro ao realizar cadastro.');
            }
        } catch (error) {
            showAlert('Erro de conexão com o servidor em C#.');
        }
    });
}

// Handler de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dto = {
            email: document.getElementById('loginEmail').value,
            senha: document.getElementById('loginSenha').value
        };

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto)
            });

            const data = await response.json();

            if (response.ok) {
                // Salva a sessão ativa do usuário
                sessionStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
                window.location.href = 'index.html';
            } else {
                showAlert(data.mensagem || 'E-mail ou senha incorretos. Tente novamente.');
            }
        } catch (error) {
            showAlert('Erro de conexão com o servidor em C#.');
        }
    });
}

// Handler para o botão do menu do usuário (protegido contra erro de elemento nulo)
const userMenuBtn = document.getElementById('userMenuBtn');
if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}