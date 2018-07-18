(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    const responseContainer = document.querySelector('#response-container');
    let searchedForText = '';
    const unsplashRequest = new XMLHttpRequest();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID af184603ad37dc33770b3a355dff7d27132633d3160d9c8b8d7c44d4a939abd2');
        unsplashRequest.send();
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=f96f1ffc032d46c2a870a152e83ad7ff`);
        articleRequest.send();
    });

    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];

            htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">Sorry, no images that match your search criteria.</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">Sorry, no articles are available.</div>';
        }

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

})();
