/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID af184603ad37dc33770b3a355dff7d27132633d3160d9c8b8d7c44d4a939abd2'
            }
        }).done(addImage);

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=f96f1ffc032d46c2a870a152e83ad7ff`
        }).done(addArticles);
    });

    function addImage(images) {
        let htmlContent = '';

        if (images.total > 0 && images.total_pages > 0) {
            const firstImage = images.results[0];

            htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(data) {
        let htmlContent = '';

        if (data.response.docs.length > 0) {
            const articles = data.response.docs;
            htmlContent = '<ul>' + articles.map(article => `<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">Sorry, no articles to show.</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
})();
