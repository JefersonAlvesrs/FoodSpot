const restaurants = [
  {
    id: 1,
    name: "Forno & Alma",
    type: "Italiana",
    emoji: "🍕",
    price: 65,
    rating: 4.9,
    location: "Centro",
    badge: "Mais amado",
    desc: "Pizzas artesanais e receitas italianas em um ambiente acolhedor.",
    image: "assets/images/pizza.webp",
  },
  {
    id: 2,
    name: "Brasa Nobre",
    type: "Churrasco",
    emoji: "🥩",
    price: 89,
    rating: 4.8,
    location: "São Pelegrino",
    badge: "Destaque",
    desc: "Cortes especiais, fogo de chão e muito sabor em cada detalhe.",
    image: "assets/images/churrasco.webp",
  },
  {
    id: 3,
    name: "Sakura House",
    type: "Japonesa",
    emoji: "🍣",
    price: 79,
    rating: 4.9,
    location: "Exposição",
    badge: "Queridinho",
    desc: "Uma experiência japonesa contemporânea, delicada e cheia de personalidade.",
    image: "assets/images/sushi.webp",
  },
  {
    id: 4,
    name: "Burger District",
    type: "Hambúrguer",
    emoji: "🍔",
    price: 42,
    rating: 4.7,
    location: "Panazzolo",
    badge: "Popular",
    desc: "Hambúrgueres suculentos, pão macio e combinações irresistíveis.",
    image: "assets/images/hamburguer.webp",
  },
  {
    id: 5,
    name: "Doce Encanto",
    type: "Cafeteria",
    emoji: "☕",
    price: 32,
    rating: 4.8,
    location: "Centro",
    badge: "Aconchegante",
    desc: "Cafés especiais, doces artesanais e um lugar para desacelerar.",
    image: "assets/images/cafe.webp",
  },
  {
    id: 6,
    name: "Taco Fiesta",
    type: "Mexicana",
    emoji: "🌮",
    price: 49,
    rating: 4.6,
    location: "Madureira",
    badge: "Novidade",
    desc: "Temperos vibrantes e clássicos mexicanos em versões cheias de cor.",
    image: "assets/images/mexicano.webp",
  },
];
const types = [
  ["Todos", "✨"],
  ["Italiana", "🍕"],
  ["Churrasco", "🥩"],
  ["Japonesa", "🍣"],
  ["Hambúrguer", "🍔"],
  ["Cafeteria", "☕"],
  ["Mexicana", "🌮"],
];
let active = "Todos",
  term = "";
const $ = (id) => document.getElementById(id);
let favorites = [];
try {
  favorites = JSON.parse(localStorage.getItem("foodspot-favorites") || "[]");
  if (!Array.isArray(favorites)) favorites = [];
} catch {
  favorites = [];
}
function selectType(type) {
  active = type;
  render();
  $("explorar").scrollIntoView({ behavior: "smooth" });
}
function renderCategories() {
  $("categoryGrid").innerHTML = types
    .slice(1)
    .map(
      ([t, e]) =>
        `<button class="category ${active === t ? "active" : ""}" data-category="${t}"><span class="emoji">${e}</span><strong>${t}</strong></button>`,
    )
    .join("");
  $("filters").innerHTML = types
    .map(
      ([t]) =>
        `<button class="${active === t ? "active" : ""}" data-category="${t}">${t}</button>`,
    )
    .join("");
}
function render() {
  renderCategories();
  let items = restaurants.filter(
    (r) =>
      (active === "Todos" || r.type === active) &&
      `${r.name} ${r.type} ${r.location} ${r.desc}`
        .toLocaleLowerCase("pt-BR")
        .includes(term),
  );
  let sort = $("sort").value;
  if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
  if (sort === "priceAsc") items.sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") items.sort((a, b) => b.price - a.price);
  $("restaurantGrid").innerHTML = items
    .map(
      (r) =>
        `<article class="restaurant-card"><div class="card-image"><img src="${r.image}" alt="Prato ilustrativo de ${r.type}" loading="lazy"><span class="tag">${r.badge}</span><button class="fav ${favorites.includes(r.id) ? "active" : ""}" data-fav="${r.id}" aria-label="${favorites.includes(r.id) ? "Remover dos" : "Adicionar aos"} favoritos" aria-pressed="${favorites.includes(r.id)}">${favorites.includes(r.id) ? "♥" : "♡"}</button></div><div class="card-body"><div class="card-meta"><span>📍 ${r.location} · ${r.type}</span><span class="rating">★ ${r.rating.toFixed(1)}</span></div><h3>${r.name}</h3><p>${r.desc}</p><div class="card-bottom"><strong>R$ ${r.price}<span> / pessoa*</span></strong><button data-detail="${r.id}">Ver detalhes ↗</button></div></div></article>`,
    )
    .join("");
  $("empty").hidden = items.length > 0;
}
document.addEventListener("click", (e) => {
  let cat = e.target.closest("[data-category]");
  if (cat) selectType(cat.dataset.category);
  let fav = e.target.closest("[data-fav]");
  if (fav) {
    let id = Number(fav.dataset.fav);
    favorites = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    try {
      localStorage.setItem("foodspot-favorites", JSON.stringify(favorites));
    } catch {}
    render();
  }
  let detail = e.target.closest("[data-detail]");
  if (detail) {
    let r = restaurants.find((x) => x.id === Number(detail.dataset.detail));
    $("dialogContent").innerHTML =
      `<img class="dialog-img" src="${r.image}" alt="Prato ilustrativo de ${r.type}"><div class="dialog-body"><h2>${r.name}</h2><p>${r.desc}</p><div class="dialog-info"><span>📍 ${r.location}</span><span>${r.emoji} ${r.type}</span><span>⭐ ${r.rating.toFixed(1)}</span><span>💰 A partir de R$ ${r.price}*</span></div><p class="dialog-note">*Preços, avaliações, nomes e localizações são ilustrativos. Este projeto não realiza reservas ou pedidos.</p></div>`;
    $("detailDialog").showModal();
  }
});
$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  term = $("heroSearch").value.trim().toLocaleLowerCase("pt-BR");
  active = "Todos";
  render();
  $("explorar").scrollIntoView({ behavior: "smooth" });
});
$("sort").addEventListener("change", render);
$("clearSearch").addEventListener("click", () => {
  term = "";
  active = "Todos";
  $("heroSearch").value = "";
  render();
});
$("closeDialog").addEventListener("click", () => $("detailDialog").close());
$("detailDialog").addEventListener("click", (e) => {
  if (e.target === $("detailDialog")) $("detailDialog").close();
});
$("menuBtn").addEventListener("click", () => {
  let open = $("menu").classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded", String(open));
});
$("menu").addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    $("menu").classList.remove("open");
    $("menuBtn").setAttribute("aria-expanded", "false");
  }
});
$("year").textContent = new Date().getFullYear();
render();
