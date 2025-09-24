/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar a tabela HTML do carrinho
parte 1 - vamos adicionar +1 no icone do carrinho
    passo 1 - pegar os botões de adicionar ao carrinho do html
    passo 2 - adicionar um evento de escuta nesses botões para quando clicar disparar uma ação
    passo 3 - pega as informações do produto clicado e adicionar no localStorage
    passo 4 - atualizar o contador do carrinho de compras
    passo 5 - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho
    passo 1 - pegar o botão de deletar do html
    passo 2 - adicionar evento de escuta no tbody
    passo 3 - remover o produto do localStorage
    paso 4 - atualizar o html do carrinho retirando o produto

Objetivo 3 - atualizar os valores do carrinho:
    passo 1 adicionar evento de escuta no input do tbody
    passo 2 -atualizar o valor total do produto
    passo 3 - atualizar o valor total do carrinho

*/

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar a tabela HTML do carrinho
// parte 1 - vamos adicionar +1 no icone do carrinho
//     passo 1 - pegar os botões de adicionar ao carrinho do html

const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");
// passo 2 - adicionar um evento de escuta nesses botões para quando clicar disparar uma ação
const SELECTORS = {
    botoesAdicionar: '.adicionar-ao-carrinho',
    contador: '#contador-carrinho',
    tabelaCorpo: '#modal-1-content tbody',
    tabelaCorpoTable: '#modal-1-content table tbody',
    total: '#total-carrinho',
};

document.querySelectorAll(SELECTORS.botoesAdicionar).forEach(botao => {
    botao.addEventListener('click', handleAdicionarAoCarrinho);

function handleAdicionarAoCarrinho(evento) {
    const elementoProduto = evento.target.closest('.produto');
    if (!elementoProduto) return;

    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector('.nome')?.textContent || '';
    const produtoImagem = elementoProduto.querySelector('img')?.getAttribute('src') || '';
    const precoTexto = elementoProduto.querySelector('.preco')?.textContent || '0';
    const produtoPreco = parseFloat(precoTexto.replace('R$', '').replace('.', '').replace(',', '.'));

    const carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(produto => produto.id === produtoId);
    if (existeProduto) {
        existeProduto.quantidade += 1;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            imagem: produtoImagem,
            preco: produtoPreco,
            quantidade: 1,
        });
    }
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho');
    return produtos ? JSON.parse(produtos) : [];
}

// passo 4 - atualizar o contador do carrinho de compras
function atualizarContadorDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((acc, produto) => acc + produto.quantidade, 0);
    const contador = document.querySelector(SELECTORS.contador);
    if (contador) contador.textContent = total;
}


//passo 5 - renderizar a tabela do carrinho de compras
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector(SELECTORS.tabelaCorpo);
    if (!corpoTabela) return;
    corpoTabela.innerHTML = '';
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1">
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
            <td>
                <button class="btn-remover" data-id="${produto.id}" id="deletar"></button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}


// Objetivo 2 - remover produtos do carrinho
// passo 1 - pegar o botão de deletar do html
const corpoTabelaTable = document.querySelector(SELECTORS.tabelaCorpoTable);
if (corpoTabelaTable) {
    corpoTabelaTable.addEventListener('click', evento => {
        if (evento.target.classList.contains('btn-remover')) {
            const id = evento.target.dataset.id;
            removerProdutoDoCarrinho(id);
        }
    });

    corpoTabelaTable.addEventListener('input', evento => {
        if (evento.target.classList.contains('input-quantidade')) {
            const produtos = obterProdutosDoCarrinho();
            const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
            const novaQuantidade = parseInt(evento.target.value);
            if (produto && novaQuantidade > 0) {
                produto.quantidade = novaQuantidade;
                salvarProdutosNoCarrinho(produtos);
                atualizarCarrinhoETabela();
            }
        }
    });
}
// passo 4 - atualizar o html do carrinho retirando o produto
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

// passo 3 - atualizar o valor total do carrinho
function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((acc, produto) => acc + produto.preco * produto.quantidade, 0);
    const totalEl = document.querySelector(SELECTORS.total);
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorDoCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}

// Inicialização
atualizarCarrinhoETabela();
