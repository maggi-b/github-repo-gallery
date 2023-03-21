//Global Variables//

//div with overview class
const overview = document.querySelector(".overview");
//username
const username = "maggi-b";
//ul to display the repos list
const repoList = document.querySelector(".repo-list");
//section with repos class (all repo information)
const reposSection = document.querySelector(".repos");
//section with repo-data class (individual repo data)
const repoDataSection = document.querySelector(".repo-data");
//back to repos gallery button 
const backToReposButton = document.querySelector(".view-repos");
//input with the "Search by name" placholder
const filterInput = document.querySelector(".filter-repos")



//API function to get user info from GitHub profile
const gitUserInfo = async function () {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    displayUserInfo(data);
};

gitUserInfo();

//Display user info fetched from API function above
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `<figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div> `

    overview.append(div);
    gitRepoList();
};

//API function to get list of repos from GitHub
const gitRepoList = async function () {
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();
    displayRepoInfo(repoData);
};

//function to display repo info
const displayRepoInfo = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

//event listener for when the user clicks on a repo name
repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    };
});

//function to get specific repo info
const getRepoInfo = async function (repoName) {
    const fetchRepo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepo.json();

    console.log(repoInfo);

    //Grab languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    //Making list of languages
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    displaySpecificRepoInfo(repoInfo, languages);
};

//function to display specific repo information
const displaySpecificRepoInfo = function (repoInfo, languages) {
    repoDataSection.innerHTML = "";
    const div = document.createElement("div");
    div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`

    repoDataSection.append(div);
    repoDataSection.classList.remove("hide");
    reposSection.classList.add("hide");
    backToReposButton.classList.remove("hide");
};

//event listener for back to repos button click
backToReposButton.addEventListener("click", function () {
    reposSection.classList.remove("hide");
    repoDataSection.classList.add("hide");
    backToReposButton.classList.add("hide");
});

//event listener for filtering input 
filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerCase = searchText.toLowerCase();

    for (const repo of repos) {
        const repoLowerCase = repo.innerText.toLowerCase();
        if (repoLowerCase.includes(searchLowerCase)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    };
});