const searchform = document.forms.searchform;
const searchEl = document.querySelector(".search");
const resultsEl = document.querySelector(".results");

searchform.addEventListener("submit", function (event) {
  event.preventDefault();

  let search = searchform.searchInput.value.trim();

  // валидация формы
  if (search.length < 3) {
    searchEl.classList.add("error");
    return;
  }

  searchRepo(search, 10)
    .then((repos) => showRepos(repos))
    .catch((error) => showError(error));
});

searchform.addEventListener("input", function () {
  searchEl.classList.remove("error");
});

function searchRepo(search, perPage = 10) {
  const queryString =
    "?q=" + encodeURIComponent(search) + `&per_page=${perPage}`;
  let url = new URL(queryString, "https://api.github.com/search/repositories");

  return fetch(url).then((response) => {
    return response.json();
  });
}

function showRepos(repos) {
  clearResults();

  if (repos.items.length) {
    repos.items.forEach((repo) => {
      resultsEl.append(createRepo(repo));
    });
  } else {
    showText("По вашему запросу ничего не найдено...");
  }
}

function showText(text) {
  clearResults();
  const titleEl = document.createElement("h3");
  titleEl.innerText = text;
  resultsEl.append(titleEl);
}

function clearResults() {
  while (resultsEl.firstChild) {
    resultsEl.removeChild(resultsEl.firstChild);
  }
}

function createRepo(repo) {
  let repoEl = document.createElement("div");
  repoEl.className = "repo";
  let repoTitleEl = document.createElement("a");
  repoTitleEl.className = "repo-title";
  repoTitleEl.href = repo.html_url;
  repoTitleEl.innerText = repo.name;
  repoTitleEl.target = "_blank";
  repoEl.append(repoTitleEl);
  let repoDetailsEl = document.createElement("div");
  repoDetailsEl.className = "repo-details";
  repoEl.append(repoDetailsEl);
  let repoAuthorEl = document.createElement("p");
  repoAuthorEl.innerHTML = `Автор: <b>${repo.owner.login}<b>`;
  repoDetailsEl.append(repoAuthorEl);
  let repoCreatedEl = document.createElement("p");
  repoCreatedEl.innerText = `Создано: ${repo.created_at
    .replace("T", ", ")
    .replace("Z", "")}`;
  repoDetailsEl.append(repoCreatedEl);
  return repoEl;
}
