
// Função para alternar o menu hamburguer (você já deve ter)
function alternarMenu() {
    const menu = document.querySelector('.menu-navegacao');
    if (menu) {
        menu.classList.toggle('ativo');
    }
}

// --- INÍCIO: LÓGICA DE ATUALIZAÇÃO DA NAVEGAÇÃO E LOGIN ---

// Função para atualizar a barra de navegação baseada no status de login
function atualizarNavegacao() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const navRegistrar = document.getElementById('nav-registrar');
    const navLogin = document.getElementById('nav-login');
    const menuNavegacao = document.querySelector('ul.menu-navegacao');

    if (!menuNavegacao) {
        // Se não encontrar o menu principal, não faz nada.
        // Isso evita erros se o script for usado em páginas sem essa estrutura.
        return;
    }

    // Primeiro, remove qualquer item "Conta" que possa já existir para evitar duplicação
    const navContaExistente = document.getElementById('nav-conta');
    if (navContaExistente) {
        navContaExistente.remove();
    }

    if (usuarioLogado === 'true') {
        // Usuário está LOGADO
        if (navRegistrar) navRegistrar.style.display = 'none'; // Oculta "Registrar"
        if (navLogin) navLogin.style.display = 'none';       // Oculta "Login"

        // Cria e adiciona o link "Conta"
        const navConta = document.createElement('li');
        navConta.id = 'nav-conta';
        // O link "Conta" aqui também servirá como "Logout" por simplicidade
        navConta.innerHTML = '<a href="#" onclick="fazerLogout(); return false;">Conta (Sair)</a>';
        menuNavegacao.appendChild(navConta); // Adiciona ao final da lista

    } else {
        // Usuário NÃO está LOGADO
        if (navRegistrar) navRegistrar.style.display = ''; // Mostra "Registrar"
        if (navLogin) navLogin.style.display = '';       // Mostra "Login"
    }
}

// Função para fazer logout
function fazerLogout() {
    localStorage.removeItem('usuarioLogado'); // Remove o indicador de login
    alert('Você foi desconectado.');
    atualizarNavegacao(); // Atualiza a barra de navegação imediatamente
    window.location.reload(); // Recarrega a página para garantir que tudo seja resetado
    // Ou, se preferir, redirecione para a página de login:
    // window.location.href = '/Pagina de login/login.html'; 
}


// Executa estas funções quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    aplicarTemaSalvo();   // Aplica o tema
    atualizarNavegacao(); // Atualiza a barra de navegação

    // Lógica do formulário de login (só vai funcionar na página de login se o form existir)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');

            // Defina suas credenciais pré-existentes aqui
            const emailCorreto = "renove@gmail.com";
            const senhaCorreta = "renove";

            const emailDigitado = emailInput.value;
            const senhaDigitada = senhaInput.value;

            if (emailDigitado === emailCorreto && senhaDigitada === senhaCorreta) {
                alert("Login bem-sucedido! Redirecionando...");
                localStorage.setItem('usuarioLogado', 'true'); // << IMPORTANTE: Seta o status de login
                window.location.href = "../Pagina Inicial/inicio.html"; // Redireciona para a página inicial
            } else {
                alert("E-mail ou senha incorretos. Tente novamente.");
            }
        });
    }
});






// ------------------------------ FILTRO DE PRODUTOS ---------------------------


const produtosBasePaginaProdutos = [
    { id: 1, nome: "Far Away Original Deo Parfum", preco: 79.90, imagem: "/Imgs/P1 - Far away.png", descricao: "Deo Parfum feminino floral adocicado.", categoria: "Perfumaria" },
    { id: 2, nome: "Floratta Blue Desodorante Colônia", preco: 139.90, imagem: "/Imgs/P2 - Floratablue.png", descricao: "Fragrância feminina floral musk.", categoria: "Perfumaria" },
    { id: 3, nome: "Hypnôse L'eau de Parfum Lancôme", preco: 349.90, imagem: "/Imgs/P3 - hypnose.png", descricao: "Perfume feminino amadeirado oriental.", categoria: "Perfumaria" },
    { id: 4, nome: "Lily Leite Acetinado Hidratante", preco: 109.90, imagem: "/Imgs/P4 - lily.png", descricao: "Hidratação intensa com toque aveludado.", categoria: "Corpo" },
    // Adicione mais produtos base conforme sua home
    { id: 5, nome: "Creme Facial Anti-Sinais Renove", preco: 65.50, imagem: "/Imgs/P1 - Far away.png", descricao: "Reduz rugas e firma a pele.", categoria: "Rosto" }, // Use placeholders se necessário
    { id: 6, nome: "Shampoo Força Total", preco: 45.00, imagem: "/Imgs/P2 - Floratablue.png", descricao: "Para cabelos fortes e saudáveis.", categoria: "Cabelo" },
];


let todosOsProdutosDaPagina = [];
if (produtosBasePaginaProdutos.length > 0) {
    todosOsProdutosDaPagina = [
        ...produtosBasePaginaProdutos,
        // Criando alguns "duplicados" com IDs e nomes ligeiramente diferentes para teste
        ...produtosBasePaginaProdutos.map((p, index) => ({
            ...p,
            id: p.id + produtosBasePaginaProdutos.length + index, // Novo ID único
            nome: `${p.nome} (Edição Especial ${index + 1})`, // Nome variado
            preco: p.preco * (1 + (index % 3) * 0.1) // Preço variado
        }))
    ];
}


// Função para renderizar os cartões de produto
function renderizarProdutosNaPagina(produtosParaRenderizar) {
    const areaProdutosDiv = document.getElementById('areaProdutos');
    const contadorProdutosVisiveisEl = document.getElementById('contadorProdutosVisiveis');

    if (!areaProdutosDiv) return; // Sai se não estiver na página de produtos

    areaProdutosDiv.innerHTML = ''; // Limpa a área antes de adicionar novos produtos

    if (produtosParaRenderizar.length === 0) {
        areaProdutosDiv.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum produto encontrado com os critérios selecionados.</p>';
        if (contadorProdutosVisiveisEl) contadorProdutosVisiveisEl.textContent = 'Exibindo 0 produtos';
        return;
    }

    produtosParaRenderizar.forEach(produto => {
        // Reutiliza a classe .cartao-produto do seu CSS existente
        const cartaoHtml = `
            <div class="cartao-produto" data-id="${produto.id}">
                <img src="${produto.imagem}" alt="${produto.nome}" />
                <h3>${produto.nome}</h3>
                <p class="descricao">${produto.descricao}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                <a href="/Pagina Inicial/compra.html" class="botao">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <path d="M2.08416 2.7512C2.22155 2.36044 2.6497 2.15503 3.04047 2.29242L3.34187 2.39838C3.95839 2.61511 4.48203 2.79919 4.89411 3.00139C5.33474 3.21759 5.71259 3.48393 5.99677 3.89979C6.27875 4.31243 6.39517 4.76515 6.4489 5.26153C6.47295 5.48373 6.48564 5.72967 6.49233 6H17.1305C18.8155 6 20.3323 6 20.7762 6.57708C21.2202 7.15417 21.0466 8.02369 20.6995 9.76275L20.1997 12.1875C19.8846 13.7164 19.727 14.4808 19.1753 14.9304C18.6236 15.38 17.8431 15.38 16.2821 15.38H10.9792C8.19028 15.38 6.79583 15.38 5.92943 14.4662C5.06302 13.5523 4.99979 12.5816 4.99979 9.64L4.99979 7.03832C4.99979 6.29837 4.99877 5.80316 4.95761 5.42295C4.91828 5.0596 4.84858 4.87818 4.75832 4.74609C4.67026 4.61723 4.53659 4.4968 4.23336 4.34802C3.91052 4.18961 3.47177 4.03406 2.80416 3.79934L2.54295 3.7075C2.15218 3.57012 1.94678 3.14197 2.08416 2.7512Z"></path> 
                            <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"></path> 
                            <path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"></path> 
                        </g>
                    </svg>
                    Comprar
                </a>
            </div>
        `;
        areaProdutosDiv.innerHTML += cartaoHtml;
    });

    if (contadorProdutosVisiveisEl) {
        contadorProdutosVisiveisEl.textContent = `Exibindo ${produtosParaRenderizar.length} de ${todosOsProdutosDaPagina.length} produtos`;
    }
}

// Função para popular os filtros de categoria dinamicamente
function popularFiltrosDeCategoria() {
    const containerFiltroCategoria = document.getElementById('containerFiltroCategoria');
    if (!containerFiltroCategoria || todosOsProdutosDaPagina.length === 0) return;

    // Pega todas as categorias únicas dos produtos
    const categoriasUnicas = [...new Set(todosOsProdutosDaPagina.map(p => p.categoria))].sort();

    let htmlFiltrosCategoria = '<h3>Categoria</h3>'; // Mantém o título
    categoriasUnicas.forEach(categoria => {
        const idCategoria = `cat-${categoria.toLowerCase().replace(/\s+/g, '-')}`; // Cria um ID amigável
        htmlFiltrosCategoria += `
            <div>
                <input type="checkbox" id="${idCategoria}" name="categoria" value="${categoria}">
                <label for="${idCategoria}">${categoria}</label>
            </div>
        `;
    });
    containerFiltroCategoria.innerHTML = htmlFiltrosCategoria;
}

// Função principal que filtra e ordena os produtos
function filtrarEOrdenarProdutos() {
    if (todosOsProdutosDaPagina.length === 0) return; // Se não há produtos, não faz nada

    let produtosProcessados = [...todosOsProdutosDaPagina];

    // 1. Filtrar por busca de texto
    const termoBusca = document.getElementById('buscaLocalProdutos')?.value.toLowerCase() || '';
    if (termoBusca) {
        produtosProcessados = produtosProcessados.filter(p =>
            p.nome.toLowerCase().includes(termoBusca) ||
            p.descricao.toLowerCase().includes(termoBusca)
        );
    }

    // 2. Filtrar por categoria
    const categoriasSelecionadas = [];
    document.querySelectorAll('#containerFiltroCategoria input[name="categoria"]:checked').forEach(checkbox => {
        categoriasSelecionadas.push(checkbox.value);
    });
    if (categoriasSelecionadas.length > 0) {
        produtosProcessados = produtosProcessados.filter(p => categoriasSelecionadas.includes(p.categoria));
    }

    // 3. Filtrar por faixa de preço
    const faixasPrecoSelecionadas = [];
    document.querySelectorAll('#containerFiltroPreco input[name="preco"]:checked').forEach(checkbox => {
        faixasPrecoSelecionadas.push({
            min: parseFloat(checkbox.dataset.min),
            max: parseFloat(checkbox.dataset.max)
        });
    });

    if (faixasPrecoSelecionadas.length > 0) {
        produtosProcessados = produtosProcessados.filter(p => {
            return faixasPrecoSelecionadas.some(faixa => p.preco >= faixa.min && p.preco <= faixa.max);
        });
    }

    // 4. Ordenar
    const criterioOrdenacao = document.getElementById('ordenarPor')?.value || 'padrao';
    if (criterioOrdenacao !== 'padrao') {
        switch (criterioOrdenacao) {
            case 'nome-asc':
                produtosProcessados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'nome-desc':
                produtosProcessados.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
            case 'preco-asc':
                produtosProcessados.sort((a, b) => a.preco - b.preco);
                break;
            case 'preco-desc':
                produtosProcessados.sort((a, b) => b.preco - a.preco);
                break;
        }
    }
    // Se for 'padrao', mantém a ordem original (após filtros) ou a ordem do array todosOsProdutosDaPagina

    renderizarProdutosNaPagina(produtosProcessados);
}

// Função para limpar todos os filtros
function limparTodosOsFiltros() {
    document.getElementById('buscaLocalProdutos').value = '';
    document.querySelectorAll('#containerFiltroCategoria input[name="categoria"]:checked').forEach(cb => cb.checked = false);
    document.querySelectorAll('#containerFiltroPreco input[name="preco"]:checked').forEach(cb => cb.checked = false);
    document.getElementById('ordenarPor').value = 'padrao';

    filtrarEOrdenarProdutos();
}



document.addEventListener('DOMContentLoaded', function () {


    // Lógica específica para a página de produtos
    if (document.querySelector('.pagina-produtos')) { // Executa somente se estiver na página de produtos
        if (todosOsProdutosDaPagina.length === 0 && produtosBasePaginaProdutos.length > 0) {
            // Recalcula todosOsProdutosDaPagina se por algum motivo não foi populado antes do DOMContentLoaded
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


        popularFiltrosDeCategoria(); // Popula os checkboxes de categoria
        renderizarProdutosNaPagina(todosOsProdutosDaPagina); // Renderização inicial de todos os produtos

        // Adiciona listeners para os controles de filtro e ordenação
        document.getElementById('buscaLocalProdutos')?.addEventListener('input', filtrarEOrdenarProdutos);
        document.getElementById('containerFiltroCategoria')?.addEventListener('change', filtrarEOrdenarProdutos);
        document.getElementById('containerFiltroPreco')?.addEventListener('change', filtrarEOrdenarProdutos);
        document.getElementById('ordenarPor')?.addEventListener('change', filtrarEOrdenarProdutos);
        document.getElementById('btnLimparFiltros')?.addEventListener('click', limparTodosOsFiltros);
    }
});





//CARRINHO
document.addEventListener('DOMContentLoaded', function () {
    const iconeCarrinho = document.getElementById('iconeCarrinhoParaPopup');
    const popupCarrinho = document.getElementById('carrinhoPopupExemplo');
    const btnFecharPopup = document.getElementById('fecharCarrinhoPopupExemplo');

    if (iconeCarrinho && popupCarrinho) {
        iconeCarrinho.addEventListener('click', function (event) {
            event.preventDefault();
            popupCarrinho.classList.toggle('ativo');
        });
    }

    if (btnFecharPopup && popupCarrinho) {
        btnFecharPopup.addEventListener('click', function () {
            popupCarrinho.classList.remove('ativo');
        });
    }

    document.addEventListener('click', function (event) {
        if (popupCarrinho && popupCarrinho.classList.contains('ativo')) {
            const isClickInsidePopup = popupCarrinho.contains(event.target);
            const isClickOnCartIcon = iconeCarrinho.contains(event.target);
            if (!isClickInsidePopup && !isClickOnCartIcon) {
                popupCarrinho.classList.remove('ativo');
            }
        }
    });
});



// Adicionar no início do script.js ou onde defines as tuas variáveis globais
const TODOS_OS_TEMAS = ["theme-claro", "theme-escuro", "theme-claro-azul", "theme-claro-roxo", "theme-escuro-azul", "theme-escuro-roxo"];

// Função para aplicar tema (nova ou modificada)
function aplicarTema(nomeTema) {
    const body = document.body;
    TODOS_OS_TEMAS.forEach(t => body.classList.remove(t));
    body.classList.add(nomeTema);
    localStorage.setItem('temaRenoveApp', nomeTema);

    // Atualiza a classe 'tema-ativo' na lista do pop-up de temas
    const listaTemasOpcoes = document.querySelectorAll('#temasPopup .lista-temas li');
    if (listaTemasOpcoes) {
        listaTemasOpcoes.forEach(li => {
            if (li.dataset.tema === nomeTema) {
                li.classList.add('tema-ativo');
            } else {
                li.classList.remove('tema-ativo');
            }
        });
    }
}


// Dentro do teu listener `DOMContentLoaded` principal:
document.addEventListener('DOMContentLoaded', function () {
    const body = document.body; // Já deves ter esta

    // Seletor para o pop-up do carrinho (existente)
    const iconeCarrinho = document.getElementById('iconeCarrinhoParaPopup');
    const popupCarrinho = document.getElementById('carrinhoPopupExemplo');
    const btnFecharPopupCarrinho = document.getElementById('fecharCarrinhoPopupExemplo');

    // NOVOS seletores para o pop-up de temas
    const botaoAbrirTemas = document.getElementById('botaoAbrirTemasPopup');
    const popupTemas = document.getElementById('temasPopup');
    const listaTemasOpcoes = document.querySelectorAll('#temasPopup .lista-temas li'); // Seleciona aqui

    // Elementos Gemini (existentes, mantém como estão)
    const btnGerarDescricao = document.getElementById('btnGerarDescricaoGemini');
    const geminiLoadingEl = document.getElementById('geminiLoading');
    // ...e os outros elementos Gemini

    // --- INÍCIO: Lógica de Carregar Tema Salvo (Modificada/Nova) ---
    const temaSalvo = localStorage.getItem('temaRenoveApp');
    if (temaSalvo && TODOS_OS_TEMAS.includes(temaSalvo)) {
        aplicarTema(temaSalvo);
    } else {
        aplicarTema('theme-claro'); // Define um tema padrão se nenhum estiver salvo ou for inválido
    }
    // --- FIM: Lógica de Carregar Tema Salvo ---

    // Lógica para pop-up do carrinho (existente, mas ajustada para fechar o outro pop-up)
    if (iconeCarrinho && popupCarrinho) {
        iconeCarrinho.addEventListener('click', function (event) {
            event.preventDefault();
            popupCarrinho.classList.toggle('ativo');
            if (popupTemas && popupTemas.classList.contains('ativo')) {
                popupTemas.classList.remove('ativo'); // Fecha pop-up de temas
            }
            // Resetar estado Gemini ao abrir/fechar (existente)
            if (!popupCarrinho.classList.contains('ativo') && geminiLoadingEl && geminiErrorEl && geminiDescricaoContainerEl) {
                geminiLoadingEl.style.display = 'none';
                geminiErrorEl.style.display = 'none';
                geminiDescricaoContainerEl.style.display = 'none';
                if (geminiDescricaoTextoEl) geminiDescricaoTextoEl.textContent = '';
            }
        });
    }
    if (btnFecharPopupCarrinho && popupCarrinho) {
        btnFecharPopupCarrinho.addEventListener('click', function () {
            popupCarrinho.classList.remove('ativo');
            // Resetar estado Gemini (existente)
            if (geminiLoadingEl && geminiErrorEl && geminiDescricaoContainerEl) {
                geminiLoadingEl.style.display = 'none';
                geminiErrorEl.style.display = 'none';
                geminiDescricaoContainerEl.style.display = 'none';
                if (geminiDescricaoTextoEl) geminiDescricaoTextoEl.textContent = '';
            }
        });
    }

    // --- INÍCIO: Nova Lógica para Pop-up de Temas ---
    if (botaoAbrirTemas && popupTemas) {
        botaoAbrirTemas.addEventListener('click', function (event) {
            event.stopPropagation();
            popupTemas.classList.toggle('ativo');
            if (popupCarrinho && popupCarrinho.classList.contains('ativo')) {
                popupCarrinho.classList.remove('ativo'); // Fecha pop-up do carrinho
                // Resetar estado Gemini (existente)
                if (geminiLoadingEl && geminiErrorEl && geminiDescricaoContainerEl) {
                    geminiLoadingEl.style.display = 'none';
                    geminiErrorEl.style.display = 'none';
                    geminiDescricaoContainerEl.style.display = 'none';
                    if (geminiDescricaoTextoEl) geminiDescricaoTextoEl.textContent = '';
                }
            }
        });

        listaTemasOpcoes.forEach(opcao => {
            opcao.addEventListener('click', function () {
                const temaSelecionado = this.dataset.tema;
                if (temaSelecionado) {
                    aplicarTema(temaSelecionado);
                }
                popupTemas.classList.remove('ativo');
            });
        });
    }
    // --- FIM: Nova Lógica para Pop-up de Temas ---

    // Fechar pop-ups ao clicar fora (Modificado para incluir ambos os pop-ups)
    document.addEventListener('click', function (event) {
        // Fechar pop-up do carrinho
        if (popupCarrinho && popupCarrinho.classList.contains('ativo')) {
            const isClickInsideCarrinho = popupCarrinho.contains(event.target);
            const isClickOnIconeCarrinho = iconeCarrinho ? (iconeCarrinho.contains(event.target) || iconeCarrinho === event.target) : false;
            if (!isClickInsideCarrinho && !isClickOnIconeCarrinho) {
                popupCarrinho.classList.remove('ativo');
                // Resetar estado Gemini (existente)
                if (geminiLoadingEl && geminiErrorEl && geminiDescricaoContainerEl) {
                    geminiLoadingEl.style.display = 'none';
                    geminiErrorEl.style.display = 'none';
                    geminiDescricaoContainerEl.style.display = 'none';
                    if (geminiDescricaoTextoEl) geminiDescricaoTextoEl.textContent = '';
                }
            }
        }
        // Fechar pop-up de temas
        if (popupTemas && popupTemas.classList.contains('ativo')) {
            const isClickInsideTemas = popupTemas.contains(event.target);
            const isClickOnBotaoTemas = botaoAbrirTemas ? (botaoAbrirTemas.contains(event.target) || botaoAbrirTemas === event.target) : false;
            if (!isClickInsideTemas && !isClickOnBotaoTemas) {
                popupTemas.classList.remove('ativo');
            }
        }
    });

    // Funcionalidade Gemini (existente, mantém como está)
    // async function gerarDescricaoComGemini() { ... }
    // if (btnGerarDescricao) { btnGerarDescricao.addEventListener('click', gerarDescricaoComGemini); }

    // NOTA: O antigo código de modo escuro/claro com `localStorage.setItem('temaRenove', ...)` e a alternância de `body.classList.toggle('modo-escuro'); body.classList.toggle('modo-claro');` deve ser REMOVIDO ou substituído pela nova função `aplicarTema`.
    // A função `botaoModo.addEventListener` antiga foi removida.
});




//LOADING
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(function() {
            loadingOverlay.classList.add('hidden');
        }, 500); 
    }
});