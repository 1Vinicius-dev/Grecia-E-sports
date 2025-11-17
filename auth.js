// auth.js - Sistema de Autenticação
const AuthSystem = {
    // Banco de dados de usuários (simulado)
    users: [
        {
            id: 1,
            name: "João Silva",
            email: "joao@example.com",
            password: "123456"
        },
        {
            id: 2,
            name: "Maria Santos",
            email: "maria@example.com",
            password: "senha123"
        },
        {
            id: 3,
            name: "Admin",
            email: "admin@grecia.com",
            password: "admin123"
        }
    ],

    // Inicializar o sistema
    init() {
        this.loadUsersFromStorage();
    },

    // Carregar usuários do localStorage
    loadUsersFromStorage() {
        const savedUsers = localStorage.getItem('greciaUsers');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        } else {
            // Salvar usuários padrão
            this.saveUsersToStorage();
        }
    },

    // Salvar usuários no localStorage
    saveUsersToStorage() {
        localStorage.setItem('greciaUsers', JSON.stringify(this.users));
    },

    // Registrar novo usuário
    register(name, email, password) {
        // Verificar se email já existe
        if (this.users.find(u => u.email === email)) {
            return { success: false, message: 'Este e-mail já está cadastrado!' };
        }

        // Criar novo usuário
        const newUser = {
            id: this.users.length + 1,
            name: name,
            email: email,
            password: password
        };

        this.users.push(newUser);
        this.saveUsersToStorage();

        return { success: true, message: 'Cadastro realizado com sucesso!' };
    },

    // Fazer login
    login(email, password, remember = false) {
        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            // Salvar sessão
            const sessionData = {
                id: user.id,
                name: user.name,
                email: user.email,
                loginTime: new Date().toISOString()
            };

            sessionStorage.setItem('greciaUser', JSON.stringify(sessionData));

            // Se "Lembrar-me" estiver marcado, salvar no localStorage
            if (remember) {
                localStorage.setItem('greciaUserRemember', JSON.stringify(sessionData));
            }

            return { success: true, message: 'Login realizado com sucesso!', user: sessionData };
        }

        return { success: false, message: 'E-mail ou senha incorretos!' };
    },

    // Fazer logout
    logout() {
        sessionStorage.removeItem('greciaUser');
        localStorage.removeItem('greciaUserRemember');
    },

    // Verificar se usuário está logado
    isLoggedIn() {
        const sessionUser = sessionStorage.getItem('greciaUser');
        const rememberUser = localStorage.getItem('greciaUserRemember');

        if (sessionUser) {
            return JSON.parse(sessionUser);
        }

        if (rememberUser) {
            // Restaurar sessão do localStorage
            const user = JSON.parse(rememberUser);
            sessionStorage.setItem('greciaUser', JSON.stringify(user));
            return user;
        }

        return null;
    },

    // Obter usuário atual
    getCurrentUser() {
        return this.isLoggedIn();
    },

    // Verificar se precisa fazer login
    requireLogin() {
        const user = this.isLoggedIn();
        if (!user) {
            // Salvar URL atual para redirecionar depois do login
            localStorage.setItem('greciaRedirectUrl', window.location.href);
            window.location.href = 'index-login.html';
            return false;
        }
        return true;
    }
};

// Inicializar sistema
AuthSystem.init();