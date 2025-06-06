// Constantes e Funções Globais
const TODOS_OS_TEMAS = ["theme-claro", "theme-escuro", "theme-claro-azul", "theme-claro-roxo", "theme-escuro-azul", "theme-escuro-roxo"];

function aplicarTema(nomeTema) {
    document.body.classList.remove(...TODOS_OS_TEMAS);
    document.body.classList.add(nomeTema);
    localStorage.setItem('temaRenoveApp', nomeTema);
    const listaTemasOpcoes = document.querySelectorAll('#temasPopup .lista-temas li');
    listaTemasOpcoes.forEach(li => {
        li.classList.toggle('tema-ativo', li.dataset.tema === nomeTema);
    });
}

function alternarMenu() {
    const menu = document.querySelector('.menu-navegacao');
    menu?.classList.toggle('ativo');
}

function atualizarNavegacao() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const navRegistrar = document.getElementById('nav-registrar');
    const navLogin = document.getElementById('nav-login');
    const menuNavegacao = document.querySelector('ul.menu-navegacao');

    if (!menuNavegacao) return;

    const navContaExistente = document.getElementById('nav-conta');
    navContaExistente?.remove();

    if (usuarioLogado === 'true') {
        if (navRegistrar) navRegistrar.style.display = 'none';
        if (navLogin) navLogin.style.display = 'none';

        const navConta = document.createElement('li');
        navConta.id = 'nav-conta';
        navConta.innerHTML = '<a href="#" onclick="fazerLogout(); return false;">Conta (Sair)</a>';
        menuNavegacao.appendChild(navConta);
    } else {
        if (navRegistrar) navRegistrar.style.display = '';
        if (navLogin) navLogin.style.display = '';
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    alert('Você foi desconectado.');
    atualizarNavegacao();
    window.location.reload();
}

// Lógica de Filtros (Página de Produtos)
const produtosBasePaginaProdutos = [
    { id: 1, nome: "Far Away Original Deo Parfum", preco: 79.90, imagem: "/Imgs/P1 - Far away.png", descricao: "Deo Parfum feminino floral adocicado.", categoria: "Perfumaria" },
    { id: 2, nome: "Floratta Blue Desodorante Colônia", preco: 139.90, imagem: "/Imgs/P2 - Floratablue.png", descricao: "Fragrância feminina floral musk.", categoria: "Perfumaria" },
    { id: 3, nome: "Hypnôse L'eau de Parfum Lancôme", preco: 349.90, imagem: "/Imgs/P3 - hypnose.png", descricao: "Perfume feminino amadeirado oriental.", categoria: "Perfumaria" },
    { id: 4, nome: "Lily Leite Acetinado Hidratante", preco: 109.90, imagem: "/Imgs/P4 - lily.png", descricao: "Hidratação intensa com toque aveludado.", categoria: "Corpo" },
    { id: 5, nome: "Creme Facial Anti-Sinais Renove", preco: 65.50, imagem: "/Imgs/P1 - Far away.png", descricao: "Reduz rugas e firma a pele.", categoria: "Rosto" },
    { id: 6, nome: "Shampoo Força Total", preco: 45.00, imagem: "/Imgs/P2 - Floratablue.png", descricao: "Para cabelos fortes e saudáveis.", categoria: "Cabelo" },
];

let todosOsProdutosDaPagina = [];
if (produtosBasePaginaProdutos.length > 0) {
    todosOsProdutosDaPagina = [
        ...produtosBasePaginaProdutos,
        ...produtosBasePaginaProdutos.map((p, index) => ({
            ...p,
            id: p.id + produtosBasePaginaProdutos.length + index,
            nome: `${p.nome} (Edição Especial ${index + 1})`,
            preco: p.preco * (1 + (index % 3) * 0.1)
        }))
    ];
}

function renderizarProdutosNaPagina(produtosParaRenderizar) {
    const areaProdutosDiv = document.getElementById('areaProdutos');
    const contadorProdutosVisiveisEl = document.getElementById('contadorProdutosVisiveis');

    if (!areaProdutosDiv) return;

    areaProdutosDiv.innerHTML = '';

    if (produtosParaRenderizar.length === 0) {
        areaProdutosDiv.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum produto encontrado com os critérios selecionados.</p>';
        if (contadorProdutosVisiveisEl) contadorProdutosVisiveisEl.textContent = 'Exibindo 0 produtos';
        return;
    }

    produtosParaRenderizar.forEach(produto => {
        const cartaoHtml = `
            <div class="cartao-produto" data-id="${produto.id}">
                <img src="${produto.imagem}" alt="${produto.nome}" />
                <h3>${produto.nome}</h3>
                <p class="descricao">${produto.descricao}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                <a href="/Pagina Inicial/compra.html" class="botao">Comprar</a>
            </div>
        `;
        areaProdutosDiv.innerHTML += cartaoHtml;
    });

    if (contadorProdutosVisiveisEl) {
        contadorProdutosVisiveisEl.textContent = `Exibindo ${produtosParaRenderizar.length} de ${todosOsProdutosDaPagina.length} produtos`;
    }
}

function popularFiltrosDeCategoria() {
    const containerFiltroCategoria = document.getElementById('containerFiltroCategoria');
    if (!containerFiltroCategoria || todosOsProdutosDaPagina.length === 0) return;

    const categoriasUnicas = [...new Set(todosOsProdutosDaPagina.map(p => p.categoria))].sort();
    let htmlFiltrosCategoria = '<h3>Categoria</h3>';
    categoriasUnicas.forEach(categoria => {
        const idCategoria = `cat-${categoria.toLowerCase().replace(/\s+/g, '-')}`;
        htmlFiltrosCategoria += `
            <div>
                <input type="checkbox" id="${idCategoria}" name="categoria" value="${categoria}">
                <label for="${idCategoria}">${categoria}</label>
            </div>
        `;
    });
    containerFiltroCategoria.innerHTML = htmlFiltrosCategoria;
}

function filtrarEOrdenarProdutos() {
    if (todosOsProdutosDaPagina.length === 0) return;

    let produtosProcessados = [...todosOsProdutosDaPagina];

    const termoBusca = document.getElementById('buscaLocalProdutos')?.value.toLowerCase() || '';
    if (termoBusca) {
        produtosProcessados = produtosProcessados.filter(p =>
            p.nome.toLowerCase().includes(termoBusca) || p.descricao.toLowerCase().includes(termoBusca)
        );
    }

    const categoriasSelecionadas = Array.from(document.querySelectorAll('#containerFiltroCategoria input:checked')).map(cb => cb.value);
    if (categoriasSelecionadas.length > 0) {
        produtosProcessados = produtosProcessados.filter(p => categoriasSelecionadas.includes(p.categoria));
    }
    
    // ... (restante da lógica de filtro de preço e ordenação) ...

    renderizarProdutosNaPagina(produtosProcessados);
}

function limparTodosOsFiltros() {
    document.getElementById('buscaLocalProdutos').value = '';
    document.querySelectorAll('#containerFiltroCategoria input:checked').forEach(cb => cb.checked = false);
    document.querySelectorAll('#containerFiltroPreco input:checked').forEach(cb => cb.checked = false);
    document.getElementById('ordenarPor').value = 'padrao';
    filtrarEOrdenarProdutos();
}

// --- Evento Principal que inicializa tudo ---
document.addEventListener('DOMContentLoaded', function () {
    // 1. Aplica Tema
    const temaSalvo = localStorage.getItem('temaRenoveApp');
    aplicarTema(temaSalvo || 'theme-claro');

    // 2. Atualiza Navegação (Login/Logout)
    atualizarNavegacao();

    // 3. Lógica do Formulário de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            if (emailInput.value === "renove@gmail.com" && senhaInput.value === "renove") {
                alert("Login bem-sucedido! Redirecionando...");
                localStorage.setItem('usuarioLogado', 'true');
                window.location.href = "../Pagina Inicial/inicio.html";
            } else {
                alert("E-mail ou senha incorretos. Tente novamente.");
            }
        });
    }

    // 4. Lógica dos Pop-ups (Carrinho e Temas)
    const iconeCarrinho = document.getElementById('iconeCarrinhoParaPopup');
    const popupCarrinho = document.getElementById('carrinhoPopupExemplo');
    const btnFecharPopupCarrinho = document.getElementById('fecharCarrinhoPopupExemplo');
    const botaoAbrirTemas = document.getElementById('botaoAbrirTemasPopup');
    const popupTemas = document.getElementById('temasPopup');
    const listaTemasOpcoes = document.querySelectorAll('#temasPopup .lista-temas li');

    if (iconeCarrinho && popupCarrinho) {
        iconeCarrinho.addEventListener('click', function (event) {
            event.preventDefault();
            popupCarrinho.classList.toggle('ativo');
            popupTemas?.classList.remove('ativo'); // Fecha o outro popup se estiver aberto
        });
    }

    btnFecharPopupCarrinho?.addEventListener('click', () => popupCarrinho.classList.remove('ativo'));

    if (botaoAbrirTemas && popupTemas) {
        botaoAbrirTemas.addEventListener('click', function (event) {
            event.stopPropagation();
            popupTemas.classList.toggle('ativo');
            popupCarrinho?.classList.remove('ativo'); // Fecha o outro popup se estiver aberto
        });
    }

    listaTemasOpcoes.forEach(opcao => {
        opcao.addEventListener('click', function () {
            aplicarTema(this.dataset.tema);
            popupTemas.classList.remove('ativo');
        });
    });

    // Fechar popups ao clicar fora
    document.addEventListener('click', function (event) {
        if (popupCarrinho && !popupCarrinho.contains(event.target) && !iconeCarrinho.contains(event.target)) {
            popupCarrinho.classList.remove('ativo');
        }
        if (popupTemas && !popupTemas.contains(event.target) && !botaoAbrirTemas.contains(event.target)) {
            popupTemas.classList.remove('ativo');
        }
    });


    // 5. Lógica da Página de Produtos (Filtros)
    if (document.querySelector('.pagina-produtos')) {
        popularFiltrosDeCategoria();
        renderizarProdutosNaPagina(todosOsProdutosDaPagina);

        document.getElementById('buscaLocalProdutos')?.addEventListener('input', filtrarEOrdenarProdutos);
        document.getElementById('containerFiltroCategoria')?.addEventListener('change', filtrarEOrdenarProdutos);
        document.getElementById('containerFiltroPreco')?.addEventListener('change', filtrarEOrdenarProdutos);
        document.getElementById('ordenarPor')?.addEventListener('change', filtrarEOrdenarProdutos);
        document.getElementById('btnLimparFiltros')?.addEventListener('click', limparTodosOsFiltros);
    }

    // 6. Animação de Loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500);
    }
});