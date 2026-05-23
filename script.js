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

// --- 2. MECANISMO DE PESQUISA (NOVO) ---
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

// --- 4. LÓGICA DO CARRINHO DE COMPRAS COM ANIMAÇÃO (ADAPTADO) ---
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

// Captura de Cliques nos botões "Adicionar"
document.querySelectorAll(".btn-add").forEach((button) => {
  button.addEventListener("click", (e) => {
    const card = e.target.closest(".item-card");

    const nome = card.querySelector("h3").innerText;
    const descricaoElement = card.querySelector(".desc");
    const descricao = descricaoElement ? descricaoElement.innerText : "";

    const precoTexto = card.querySelector(".preco").innerText;
    const preco = parseFloat(
      precoTexto.replace("R$", "").replace(",", ".").trim(),
    );

    const obsInput = card.querySelector(".obs-input");
    const observacao = obsInput ? obsInput.value : "";

    // --- NOVA ANIMAÇÃO DE CARREGAMENTO (2 SEGUNDOS) ---
    iniciarAnimacaoCozinha(() => {
      adicionarAoCarrinho(nome, descricao, preco, observacao);

      // Limpa o campo de observação após adicionar
      if (obsInput) obsInput.value = "";

      // Feedback visual no botão após a animação
      const originalText = e.target.innerText;
      e.target.innerText = "Adicionado! ✓";
      e.target.style.background = "#25d366";
      setTimeout(() => {
        e.target.innerText = originalText;
        e.target.style.background = "";
      }, 800);
    });
  });
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
    }, 2000); // Exatos 2 segundos conforme solicitado
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
  cartContainer.classList.add("active"); // Abre o carrinho automaticamente
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
      // Estilização inline mantida conforme seu código original de render
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
