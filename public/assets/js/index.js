$(document).ready(function(){
  $(document).on("click", "#save_article", function() {
    var url  = $(this).attr("article-url")
    var title = $(this).attr("article-title")
    var summary = $(this).attr("article-summary")
    var a = $(this).attr("article-a")
    console.log('a.title: ', a.title)
    var article = {url, title, summary}
    axios.post("/article", article)
      .then(res => {
        console.log("Article saved. res: ", res)
        $(this).parents(".card").remove()
      })
      .catch(err => {
        console.log("Failed to save article. err: ", err)
      })
  })
  $("#btn_scrape").on("click", function(){
    console.log("scrape clicked");
    // use Axios to prepend articles to the dom
    axios.get("/scrape")
      .then(res => {
        var articles = res.data.articles
        console.log(articles);
        if (articles) {
          articles.forEach(a => {
            $("#articles").prepend(
              `<div class="container">
                <div class="card article-item">
                  <h5 class="card-header title">${a.title}</h5>
                  <div class="card-body">
                    <p class="card-text summary">${a.summary}</p>
                    <p class="card-text url">${a.url}</p>
                  </div>
                  <button id="save_article"
                  article-url="${a.url}"
                  article-summary="${a.summary}"
                  article-title="${a.title}"
                  // article-time="${a.time}"
                  article-a="${a}"
                  type="button" class="btn btn-success index-btn">Save Article!</button>
                </div>
              </div>`
            )
          })
        }
        // Modal shows how many articles were scrapped
        $("#scrape_results_label").text(`Added ${articles.length} new Articles!`)
        $('#scrape_results_modal').modal('show'); 
        console.log("got this far!?");
      })
      .catch(err => {
       console.log(err)
      })
  })
})