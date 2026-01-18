// ===============================
// Theme handling
// ===============================
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

applyTheme(getPreferredTheme());

toggle?.addEventListener("click", () => {
  applyTheme(
    document.body.classList.contains("dark") ? "light" : "dark"
  );
});

// ===============================
// App version (cache busting)
// ===============================
const VERSION = window.APP_VERSION || "dev";

// ===============================
// Recipes list page
// ===============================
const list = document.getElementById("list");
const search = document.getElementById("search");
const category = document.getElementById("category");

function renderSkeletonList(count = 6) {
  if (!list) return;

  list.innerHTML = "";
  for (let i = 0; i < count; i++) {
    list.innerHTML += `
      <div class="card skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text long"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `;
  }
}

function renderList(items) {
  if (!list) return;

  list.innerHTML = "";
  items.forEach(r => {
    list.innerHTML += `
      <a class="card fade-in" href="recipe.html#${r.id}">
        <img src="${r.image}?v=${VERSION}" loading="lazy" alt="${r.title}">
        <h3>${r.title}</h3>
        <p>${r.category}</p>
      </a>
    `;
  });
}

function filterRecipes() {
  if (!search || !category) return;

  const q = search.value.toLowerCase();
  const c = category.value;

  renderList(
    recipes.filter(r =>
      (!c || r.category === c) &&
      r.title.toLowerCase().includes(q)
    )
  );
}

// Show skeleton immediately
if (list) {
  renderSkeletonList();

  // Slight delay so skeleton is visible even with local data
  setTimeout(() => {
    renderList(recipes);
  }, 600);
}

search && (search.oninput = filterRecipes);
category && (category.onchange = filterRecipes);

// ===============================
// Recipe detail page
// ===============================
const article = document.getElementById("recipe");
const SKELETON_DELAY = 500;

if (article) {
  const id = location.hash.replace("#", "");

  if (!id) {
    article.innerHTML = "<p>❌ No recipe selected.</p>";
  } else {
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
      article.innerHTML = "<p>❌ Recipe not found.</p>";
    } else {
      // Show skeleton immediately
      article.innerHTML = `
        <div class="recipe-skeleton skeleton skeleton-article">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton skeleton-text long"></div>
          <div class="skeleton skeleton-text long"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      `;

      // Fixed delay before loading content
      setTimeout(() => {
        fetch(`${recipe.markdown}?v=${VERSION}`)
          .then(res => {
            if (!res.ok) throw new Error("Failed to load markdown");
            return res.text();
          })
          .then(md => {
            article.classList.add("fade-in");
            article.innerHTML = `
              <div style="min-height: 300px"><img src="${recipe.image}?v=${VERSION}" loading="lazy" alt="${recipe.title}"></div>
              ${parseMarkdown(md)}
            `;
          })
          .catch(err => {
            console.error(err);
            article.innerHTML = "<p>❌ Failed to load recipe.</p>";
          });
      }, SKELETON_DELAY);
    }
  }
}


// ===============================
// Footer version display
// ===============================
const footerVersion = document.getElementById("version");
if (footerVersion) {
  footerVersion.textContent =
    VERSION === "dev" ? "dev" : `v${VERSION}`;
}
