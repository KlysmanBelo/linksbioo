const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const resources = [
  {name:"Instagram",category:"Redes sociais",symbol:"◎",description:"Perfil, publicações e acesso ao seu conteúdo."},
  {name:"TikTok",category:"Redes sociais",symbol:"♪",description:"Perfil e vídeos para seus visitantes."},
  {name:"YouTube",category:"Redes sociais",symbol:"▶",description:"Canal, vídeos e playlists."},
  {name:"Facebook",category:"Redes sociais",symbol:"f",description:"Página, perfil ou comunidade."},
  {name:"LinkedIn",category:"Redes sociais",symbol:"in",description:"Perfil profissional e página da empresa."},
  {name:"Pinterest",category:"Redes sociais",symbol:"P",description:"Perfil e painéis de inspiração."},
  {name:"WhatsApp",category:"Redes sociais",symbol:"◔",description:"Conversa direta com mensagem personalizada."},
  {name:"Spotify",category:"Música e vídeo",symbol:"≋",description:"Playlist, álbum, artista ou música."},
  {name:"Apple Music",category:"Música e vídeo",symbol:"♫",description:"Álbuns, artistas e playlists."},
  {name:"SoundCloud",category:"Música e vídeo",symbol:"☁",description:"Faixas e perfil musical."},
  {name:"Vídeo incorporado",category:"Música e vídeo",symbol:"▷",description:"Vídeo compatível reproduzido na página."},
  {name:"Podcast",category:"Música e vídeo",symbol:"◉",description:"Episódios e plataformas de áudio."},
  {name:"Catálogo digital",category:"Negócios",symbol:"▤",description:"Produtos, serviços e preços organizados."},
  {name:"Cardápio digital",category:"Negócios",symbol:"☷",description:"Categorias, itens e informações do estabelecimento."},
  {name:"Formulário de orçamento",category:"Negócios",symbol:"▧",description:"Receba pedidos e detalhes de potenciais clientes."},
  {name:"Agendamento",category:"Negócios",symbol:"▦",description:"Link para marcar horários."},
  {name:"Portfólio",category:"Negócios",symbol:"▣",description:"Projetos, trabalhos e cases."},
  {name:"Marcas parceiras",category:"Negócios",symbol:"✧",description:"Logotipos, patrocinadores e links de parceiros."},
  {name:"Google Maps",category:"Localização e eventos",symbol:"⌖",description:"Endereço, mapa ou rota para chegar."},
  {name:"Calendário de eventos",category:"Localização e eventos",symbol:"▦",description:"Divulgue datas e inscrições."},
  {name:"Ingressos",category:"Localização e eventos",symbol:"▱",description:"Acesso à plataforma de ingressos."},
  {name:"Contagem regressiva",category:"Localização e eventos",symbol:"◷",description:"Temporizador para uma data especial."},
  {name:"Galeria de fotos",category:"Experiências",symbol:"▧",description:"Imagens organizadas em uma galeria."},
  {name:"QR Code",category:"Experiências",symbol:"▦",description:"Código para compartilhar sua página impressa."},
  {name:"Temas personalizados",category:"Experiências",symbol:"◐",description:"Paletas, fundos, fontes e estilos de botão."},
  {name:"Modo escuro",category:"Experiências",symbol:"☾",description:"Alternância entre tema claro e escuro."},
  {name:"Estatísticas de cliques",category:"Experiências",symbol:"↗",description:"Métricas com infraestrutura de análise."},
  {name:"Domínio personalizado",category:"Experiências",symbol:"⌘",description:"Use seu próprio domínio, conforme configuração."},
  {name:"SEO e compartilhamento",category:"Experiências",symbol:"✳",description:"Título, descrição e imagem de prévia."},
  {name:"Newsletter",category:"Experiências",symbol:"✉",description:"Capte inscrições para novidades."},
  {name:"FAQ interativo",category:"Experiências",symbol:"?",description:"Perguntas frequentes expansíveis."},
  {name:"Automação de contatos",category:"Experiências",symbol:"⤴",description:"Conecte formulários a planilhas ou CRM."}
];
let selectedResources = new Set();
let activeFilter = "Todos";
let currentColor = "#1e1163";
let links = [
  {name:"Instagram",url:"https://instagram.com/"},
  {name:"TikTok",url:"https://tiktok.com/"},
  {name:"Meu WhatsApp",url:"https://wa.me/"}
];
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function renderResources() {
  const query = $("#resourceSearch").value.trim().toLocaleLowerCase("pt-BR");
  const filtered = resources.filter(item => {
    const matchesCategory = activeFilter === "Todos" || item.category === activeFilter;
    const matchesQuery = `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase("pt-BR").includes(query);
    return matchesCategory && matchesQuery;
  });
  const grid = $("#resourceGrid");
  grid.innerHTML = "";
  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">Nenhum recurso encontrado. Tente outra palavra.</p>';
  }
  filtered.forEach(item => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `resource-card${selectedResources.has(item.name) ? " selected" : ""}`;
    card.setAttribute("aria-pressed", String(selectedResources.has(item.name)));
    const symbol = document.createElement("span");
    symbol.className = "resource-symbol"; symbol.textContent = item.symbol;
    const mark = document.createElement("span");
    mark.className = "select-mark"; mark.textContent = selectedResources.has(item.name) ? "✓" : "+";
    const name = document.createElement("strong"); name.textContent = item.name;
    const desc = document.createElement("p"); desc.textContent = item.description;
    card.append(symbol, mark, name, desc);
    card.addEventListener("click", () => {
      if (selectedResources.has(item.name)) selectedResources.delete(item.name);
      else selectedResources.add(item.name);
      renderResources();
      updateSelectedCount();
    });
    grid.append(card);
  });
  updateSelectedCount();
}
function updateSelectedCount() {
  const n = selectedResources.size;
  $("#selectedCount").textContent = `${n} recurso${n === 1 ? "" : "s"} selecionado${n === 1 ? "" : "s"}`;
  $("#sendResources").disabled = n === 0;
  $("#sendResources").style.opacity = n === 0 ? ".55" : "1";
}
$("#resourceSearch").addEventListener("input", renderResources);
$("#filterPills").addEventListener("click", e => {
  const button = e.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  $$(".filter-pill").forEach(p => p.classList.toggle("active", p === button));
  renderResources();
});
$("#sendResources").addEventListener("click", () => {
  if (!selectedResources.size) return showToast("Selecione pelo menos um recurso primeiro.");
  const body = `Olá! Gostaria de conversar sobre um projeto Linksbioo com estes recursos:\n\n${[...selectedResources].map(x => `• ${x}`).join("\n")}\n\nPodemos conversar sobre possibilidades e orçamento?`;
  openEmailDraft("Solicitação de recursos Linksbioo", body);
});

function renderLinkEditor() {
  const editor = $("#linkEditor");
  editor.innerHTML = "";
  links.forEach((link, index) => {
    const row = document.createElement("div"); row.className = "link-editor-row";
    const nameInput = document.createElement("input");
    nameInput.value = link.name; nameInput.maxLength = 50; nameInput.setAttribute("aria-label", `Nome do botão ${index + 1}`);
    nameInput.placeholder = "Nome do botão";
    nameInput.addEventListener("input", () => { links[index].name = nameInput.value; updatePreview(); });
    const remove = document.createElement("button"); remove.className = "remove-link"; remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", `Remover ${link.name}`);
    remove.addEventListener("click", () => { links.splice(index, 1); renderLinkEditor(); updatePreview(); });
    row.append(nameInput, remove);
    editor.append(row);
  });
}
$("#addLink").addEventListener("click", () => {
  if (links.length >= 8) return showToast("Nesta prévia, você pode adicionar até 8 botões.");
  links.push({name:"Novo link",url:"https://"});
  renderLinkEditor(); updatePreview();
});
function setColor(color) {
  currentColor = color;
  $$(".color-swatch").forEach(b => b.classList.toggle("selected", b.dataset.color === color));
  $("#customColor").value = color;
  updatePreview();
}
$("#colorOptions").addEventListener("click", e => {
  const swatch = e.target.closest("[data-color]");
  if (swatch) setColor(swatch.dataset.color);
});
$("#customColor").addEventListener("input", e => setColor(e.target.value));
["profileName", "profileBio", "profileTheme", "buttonStyle"].forEach(id => $(`#${id}`).addEventListener("input", updatePreview));

function initials(text) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SN";
  return (parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function updatePreview() {
  const name = $("#profileName").value.trim() || "Seu Nome";
  $("#liveName").textContent = name;
  $("#liveBio").textContent = $("#profileBio").value.trim() || "Sua biografia aparecerá aqui.";
  $(".live-avatar").textContent = initials(name);
  const profile = $("#liveProfile");
  profile.style.setProperty("--profile-color", currentColor);
  profile.classList.toggle("theme-dark", $("#profileTheme").value === "dark");
  profile.classList.toggle("desktop-preview", $(".device-button.active").dataset.device === "desktop");
  const liveLinks = $("#liveLinks");
  liveLinks.innerHTML = "";
  links.forEach(link => {
    const a = document.createElement("a");
    a.className = `live-link${$("#buttonStyle").value === "square" ? " square" : ""}`;
    a.href = safeUrl(link.url) || "#";
    a.target = "_blank"; a.rel = "noopener noreferrer";
    a.innerHTML = '<span>↗</span>';
    const text = document.createElement("span"); text.textContent = link.name || "Seu link";
    a.append(text);
    liveLinks.append(a);
  });
}
$$(".device-button").forEach(button => button.addEventListener("click", () => {
  $$(".device-button").forEach(b => b.classList.toggle("active", b === button));
  updatePreview();
}));
$("#previewButton").addEventListener("click", () => { updatePreview(); showToast("Prévia atualizada!"); });
function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function makeProjectBrief() {
  const name = $("#profileName").value.trim() || "Não informado";
  const bio = $("#profileBio").value.trim() || "Não informada";
  const linkList = links.map(l => `• ${l.name || "Link sem nome"} — ${l.url || "URL não informada"}`).join("\n") || "Nenhum link adicionado";
  return `Olá! Gostaria de solicitar um projeto de link na bio com os Serviços Digitais do Klys.\n\nNome do perfil: ${name}\nBiografia: ${bio}\nCor principal: ${currentColor}\nTema: ${$("#profileTheme").value === "dark" ? "Escuro" : "Claro"}\nBotões: ${$("#buttonStyle").value === "square" ? "Quadrados" : "Arredondados"}\n\nLinks:\n${linkList}\n\nRecursos adicionais selecionados: ${[...selectedResources].join(", ") || "A combinar"}\n\nGostaria de receber informações sobre prazo, possibilidades e orçamento.`;
}
$("#requestProject").addEventListener("click", () => openEmailDraft("Solicitação de projeto Linksbioo", makeProjectBrief()));

function openEmailDraft(subject, body) {
  // Substitua pelo e-mail profissional real antes de publicar.
  const businessEmail = "contato@servicosdigitaisklys.rf.gd";
  const mailto = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  showToast("Abrindo seu aplicativo de e-mail. Revise os dados antes de enviar.");
}
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#contactName").value.trim();
  const email = $("#contactEmail").value.trim();
  const service = $("#contactService").value;
  const message = $("#contactMessage").value.trim();
  const body = `Olá! Meu nome é ${name}.\nE-mail para retorno: ${email}\nServiço de interesse: ${service}\n\nMinha ideia:\n${message}`;
  openEmailDraft(`Contato pelo Linksbioo — ${service}`, body);
});
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#nav");
  const isOpen = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});
$$(".nav a").forEach(a => a.addEventListener("click", () => {
  $("#nav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));
function showInfo(title, content) {
  $("#dialogContent").innerHTML = `<h2>${title}</h2>${content}`;
  $("#infoDialog").showModal();
}
$("#termsLink").addEventListener("click", e => {
  e.preventDefault();
  showInfo("Termos de uso", "<p>Este protótipo apresenta os serviços e possibilidades do Linksbioo. A contratação, os valores, os prazos, a propriedade dos materiais, o suporte e os recursos incluídos devem ser definidos em uma proposta ou contrato específico.</p><p>Links para serviços de terceiros dependem da disponibilidade e das condições de cada plataforma. Não publique este texto como documento jurídico final sem revisão apropriada.</p>");
});
$("#privacyLink").addEventListener("click", e => {
  e.preventDefault();
  showInfo("Privacidade", "<p>Este protótipo não envia os dados dos formulários para um servidor nem os salva em uma base de dados. Ao preparar uma mensagem, ele abre o aplicativo de e-mail do dispositivo.</p><p>Antes de publicar uma versão real, informe quais dados serão coletados, para qual finalidade, por quanto tempo serão guardados, com quem poderão ser compartilhados e como o titular poderá exercer seus direitos.</p>");
});
$("#closeDialog").addEventListener("click", () => $("#infoDialog").close());
$("#infoDialog").addEventListener("click", e => { if (e.target === $("#infoDialog")) $("#infoDialog").close(); });
$("#year").textContent = new Date().getFullYear();

renderResources();
renderLinkEditor();
updatePreview();
