// --- 1. CONFIGURAÇÃO DO MENU MOBILE ---
const mobileMenu = document.getElementById("mobile-menu");
const navList = document.getElementById("nav-list");

if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    navList.classList.toggle("active");
    const icon = mobileMenu.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    }
  });
}

// Fechar o menu automaticamente ao clicar em um link
document.querySelectorAll(".nav-list a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navList.classList.contains("active")) {
      navList.classList.remove("active");
      const icon = mobileMenu.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    }
  });
});

// --- 2. MECANISMO DE PESQUISA ---
const searchInput = document.getElementById("search-input");
const pratosCards = document.querySelectorAll(".item-card");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();

    pratosCards.forEach((card) => {
      const nome = card.querySelector("h3").innerText.toLowerCase();
      const descricao = card.querySelector(".desc").innerText.toLowerCase();

      // Se o termo bater com o nome ou a descrição, mostra o card
      if (nome.includes(termo) || descricao.includes(termo)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// --- 3. ANIMAÇÕES (ScrollReveal) ---
if (typeof ScrollReveal !== "undefined") {
  ScrollReveal().reveal(".reveal", {
    distance: "50px",
    duration: 1000,
    easing: "ease-in-out",
    origin: "bottom",
    interval: 200,
  });
}

// --- 4. LÓGICA DO CARRINHO DE COMPRAS COM ANIMAÇÃO ---
let carrinho = [];

const cartContainer = document.getElementById("carrinho");
const btnCartToggle = document.querySelector(".cart-toggle");
const btnCloseCart = document.querySelector(".close-cart");
const listaItensCart = document.querySelector(".itens-lista");
const valorTotalElement = document.querySelector(".total-valor");
const btnFinalizar = document.querySelector(".btn-finalizar");
const loadingOverlay = document.getElementById("loading-overlay");

// Abrir e Fechar Carrinho
if (btnCartToggle) {
  btnCartToggle.addEventListener("click", () => {
    cartContainer.classList.add("active");
  });
}

if (btnCloseCart) {
  btnCloseCart.addEventListener("click", () => {
    cartContainer.classList.remove("active");
  });
}

// Captura de Cliques nos botões "Adicionar" (Itens normais + Combo Promocional)
document.addEventListener("click", (e) => {
  // Verifica se o clique foi em um botão de adicionar padrão ou no botão do combo
  if (
    e.target.classList.contains("btn-add") ||
    e.target.classList.contains("promo-btn")
  ) {
    // Identifica se o clique veio do card promocional ou de um card comum
    const isPromo = e.target.classList.contains("promo-btn");
    const containerSecao = isPromo
      ? e.target.closest(".promo-card")
      : e.target.closest(".item-card");

    if (!containerSecao) return;

    // Seleção dinâmica dos dados baseada na estrutura do container correspondente
    const nome = isPromo
      ? containerSecao.querySelector("h2").innerText
      : containerSecao.querySelector("h3").innerText;

    const descricaoElement = isPromo
      ? containerSecao.querySelector(".promo-desc")
      : containerSecao.querySelector(".desc");
    const descricao = descricaoElement ? descricaoElement.innerText : "";

    const precoElement = isPromo
      ? containerSecao.querySelector(".preco-promo")
      : containerSecao.querySelector(".preco");
    const precoTexto = precoElement.innerText;
    const preco = parseFloat(
      precoTexto.replace("R$", "").replace(".", "").replace(",", ".").trim(),
    );

    // O banner de combo não possui input de observação, trata essa diferença de forma segura
    const obsInput = containerSecao.querySelector(".obs-input");
    const observacao = obsInput ? obsInput.value : "";

    // --- TEXTO DE LOADING CUSTOMIZADO PARA O PRODUTO ---
    const textoLoadingOriginal = loadingOverlay
      ? loadingOverlay.querySelector("p")
      : null;
    if (textoLoadingOriginal) {
      textoLoadingOriginal.innerText = "Enviando para a cozinha...";
    }

    // --- ANIMAÇÃO DE CARREGAMENTO (2 SEGUNDOS) ---
    iniciarAnimacaoCozinha(() => {
      adicionarAoCarrinho(nome, descricao, preco, observacao);

      // Limpa o campo de observação após adicionar (se existir)
      if (obsInput) obsInput.value = "";

      // Feedback visual no botão após a animação
      const originalText = e.target.innerHTML;
      e.target.innerText = "Adicionado! ✓";
      const corOriginal = e.target.style.background;
      e.target.style.background = "#25d366";

      setTimeout(() => {
        e.target.innerHTML = originalText;
        e.target.style.background = corOriginal;
      }, 800);
    });
  }
});

// Função para controlar o overlay de carregamento
function iniciarAnimacaoCozinha(callback) {
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // Desabilita scroll durante o blur

    setTimeout(() => {
      loadingOverlay.style.display = "none";
      document.body.style.overflow = "auto"; // Reabilita scroll
      callback(); // Executa a adição ao carrinho de fato
    }, 2000); // Exatos 2 segundos
  } else {
    // Caso o HTML do overlay não exista, executa direto
    callback();
  }
}

function adicionarAoCarrinho(nome, descricao, preco, observacao) {
  carrinho.push({
    nome,
    descricao,
    preco,
    observacao: observacao || "Nenhuma",
  });

  renderCarrinho();
  if (cartContainer) {
    cartContainer.classList.add("active"); // Abre o carrinho automaticamente
  }
}

// Função global para remover item
window.removerItem = function (index) {
  carrinho.splice(index, 1);
  renderCarrinho();
};

function renderCarrinho() {
  if (!listaItensCart) return;

  listaItensCart.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    listaItensCart.innerHTML = `
            <div style="text-align: center; color: #666; margin-top: 50px;">
                <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 10px; opacity: 0.2;"></i>
                <p>Seu carrinho está vazio.</p>
            </div>`;
  } else {
    carrinho.forEach((item, index) => {
      total += item.preco;
      const div = document.createElement("div");
      div.classList.add("item-carrinho");

      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.style.marginBottom = "15px";
      div.style.borderBottom = "1px solid #eee";
      div.style.paddingBottom = "10px";

      div.innerHTML = `
                <div style="flex: 1; padding-right: 10px;">
                    <strong style="display:block; color:#4a040d; font-size: 1rem;">${item.nome}</strong>
                    <small style="display:block; color:#777; font-size: 0.75rem; margin-bottom: 4px;">${item.descricao}</small>
                    <small style="display:block; color:#7a0d1a; font-style: italic; background: #fff0f1; padding: 2px 8px; border-radius: 4px; margin-bottom: 5px;">
                        <i class="fas fa-comment-dots" style="font-size: 0.7rem;"></i> Obs: ${item.observacao}
                    </small>
                    <span style="font-weight: 600; color: #2d2d2d;">R$ ${item.preco.toFixed(2).replace(".", ",")}</span>
                </div>
                <button onclick="removerItem(${index})" style="background:none; border:none; color:#7a0d1a; cursor:pointer; font-size: 1.1rem; padding: 10px;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
      listaItensCart.appendChild(div);
    });
  }

  if (valorTotalElement) {
    valorTotalElement.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }
}

// --- 5. FINALIZAR PEDIDO VIA WHATSAPP ---
if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    if (carrinho.length === 0) {
      alert(
        "Seu carrinho está vazio! Adicione algum prato antes de finalizar.",
      );
      return;
    }

    let mensagem = " *NOVO PEDIDO - CASEIRINHAS DA CRIS* \n";
    mensagem += "------------------------------------------\n\n";

    let total = 0;

    carrinho.forEach((item, index) => {
      mensagem += `*${index + 1}. ${item.nome}*\n`;
      mensagem += `   • Valor: R$ ${item.preco.toFixed(2).replace(".", ",")}\n`;
      mensagem += `   • Obs: ${item.observacao}\n\n`;
      total += item.preco;
    });

    mensagem += `------------------------------------------\n`;
    mensagem += ` *TOTAL DO PEDIDO: R$ ${total.toFixed(2).replace(".", ",")}*\n`;
    mensagem += `------------------------------------------\n\n`;
    mensagem += ` *Por favor, informe seu endereço abaixo:* \n`;
    mensagem += `(Rua, Número, Bairro e Cidade)`;

    const encodedMsg = encodeURIComponent(mensagem);
    const fone = "5511988468854";

    // Abre o WhatsApp em uma nova aba
    window.open(`https://wa.me/${fone}?text=${encodedMsg}`, "_blank");
  });
}

// --- 6. SISTEMA DE TRANSIÇÃO ENTRE PÁGINAS COM DELAY DE 1.5s ---

// Injeta ou padroniza o texto do loading para "Cozinhando com amor..."
function garantirEstruturaLoading() {
  const overlay = document.getElementById("loading-overlay");

  if (!overlay) {
    // Se não existir (Index), cria o HTML do zero com a frase correta
    const novoOverlay = document.createElement("div");
    novoOverlay.id = "loading-overlay";
    novoOverlay.className = "loading-overlay";
    novoOverlay.innerHTML = `
      <div class="logo-loading-container">
        <img src="Imagens Logo/Logo PNG.png" alt="Logo Central" class="logo-central">
        <div class="spinner"></div>
      </div>
      <p id="loading-text">Cozinhando com amor...</p>
    `;
    document.body.appendChild(novoOverlay);
  } else {
    // Se já existir (Cardápio), força o texto a ser "Cozinhando com amor..." ao invés de enviar para a cozinha
    const textoLoading = overlay.querySelector("p");
    if (textoLoading) {
      textoLoading.innerText = "Cozinhando com amor...";
    }
  }
}

// Controla a transição forçada com delay
function transicaoComDelay(e, url) {
  e.preventDefault(); // Impede a mudança instantânea de página
  garantirEstruturaLoading();

  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // Bloqueia o scroll durante o efeito
  }

  // Aguarda exatos 1.5 segundos (1500ms) antes de redirecionar
  setTimeout(() => {
    window.location.href = url;
  }, 1500);
}

// Aplica o delay em todos os links que vão ou voltam do cardápio
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");

    if (href) {
      // Se o link aponta para a página do cardápio
      if (href.includes("cardapio.html")) {
        link.addEventListener("click", (e) =>
          transicaoComDelay(e, "cardapio.html"),
        );
      }
      // Se estamos no cardápio e o link tenta voltar para a index.html (ou para uma seção dela)
      else if (
        window.location.pathname.includes("cardapio.html") &&
        (href.includes("index.html") || href.startsWith("#"))
      ) {
        link.addEventListener("click", (e) => {
          // Ajusta a rota caso seja apenas uma âncora (ex: #home vira index.html#home)
          const destino = href.startsWith("#") ? `index.html${href}` : href;
          transicaoComDelay(e, destino);
        });
      }
    }
  });
});
