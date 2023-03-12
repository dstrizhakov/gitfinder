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

  //запос репозиториев по поисковой строке
  let repos = searchRepo(search);
  repos.then((res) => {
    console.log(res);
    showRepos(res);
  });
});

searchform.addEventListener("input", function () {
  searchEl.classList.remove("error");
});

async function searchRepo(search, perPage = 10) {
  const queryString =
    "?q=" + encodeURIComponent(search) + `&per_page=${perPage}`;
  let url = new URL(queryString, "https://api.github.com/search/repositories");
  console.log(url);
  let response = await fetch(url);
  let json = await response.json();
  return json;
}

function showRepos(repos) {
  clearResults();
  if (repos.items.length) {
    repos.items.forEach((repo) => {
      console.dir(repo);
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
      repoAuthorEl.innerText = `Автор: ${repo.owner.login}`;
      repoDetailsEl.append(repoAuthorEl);
      let repoCreatedEl = document.createElement("p");
      repoCreatedEl.innerText = `Создано: ${repo.created_at}`;
      repoDetailsEl.append(repoCreatedEl);

      resultsEl.append(repoEl);
    });
  } else {
    const noResultsTitle = document.createElement("h3");
    noResultsTitle.innerText = "По вашему запросу ничего не найдено...";
    resultsEl.prepend(noResultsTitle);
  }
}

function clearResults() {
  while (resultsEl.firstChild) {
    resultsEl.removeChild(resultsEl.firstChild);
  }
}
