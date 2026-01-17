const toggle = document.getElementById("darkToggle");

function getPreferredTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  if (!toggle) return;
  toggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// Initialize
applyTheme(getPreferredTheme());

// User toggle
toggle?.addEventListener("click", () => {
  applyTheme(
    document.body.classList.contains("dark") ? "light" : "dark"
  );
});



// Recipes list page
const list = document.getElementById("list");
const search = document.getElementById("search");
const category = document.getElementById("category");

function renderList(items) {
  if (!list) return;
  list.innerHTML = "";
  items.forEach(r => {
    list.innerHTML += `
      <a class="card" href="recipe.html#${r.id}">
        <img src="${r.image}" loading="lazy">
        <h3>${r.title}</h3>
        <p>${r.category}</p>
      </a>
    `;
  });
}

function filterRecipes() {
  const q = search.value.toLowerCase();
  const c = category.value;

  renderList(recipes.filter(r =>
    (!c || r.category === c) &&
    r.title.toLowerCase().includes(q)
  ));
}

search && (search.oninput = filterRecipes);
category && (category.onchange = filterRecipes);

renderList(recipes);

// ===============================
// Recipe detail page
// ===============================
const article = document.getElementById("recipe");

if (article) {
  const id = location.hash.replace("#", "");

  if (!id) {
    article.innerHTML = "<p>❌ No recipe selected.</p>";
    throw new Error("No recipe id in URL");
  }

  console.log(recipes);
  const recipe = recipes.find(r => r.id === id);
  console.log(recipe);
  if (!recipe) {
    article.innerHTML = "<p>❌ Recipe not found.</p>";
    throw new Error("Recipe not found: " + id);
  }

  fetch(recipe.markdown)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load markdown");
      return res.text();
    })
    .then(md => {
      article.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
        ${parseMarkdown(md)}
      `;
    })
    .catch(err => {
      article.innerHTML = "<p>❌ Failed to load recipe.</p>";
      console.error(err);
    });
}
