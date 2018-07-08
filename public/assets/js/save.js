$(document).ready(function(){
  function fetchSavedArticles() {
    axios.get("/articles")
    .then(res => {
        var articles = res.data.articles
        $("#saved_articles").html("")
        if (articles.length >= 1) {
          $("#empty_saved_articles").hide()
        } else {
          $("#empty_saved_articles").show()
        }
        articles.forEach(a => {
          $("#saved_articles").prepend(
            `<div class="container">
              <div class="card">
                <h5 class="card-header title">${a.title}</h5>
                <div class="card-body">
                  <p class="card-text summary">${a.summary}</p>
                  <p class="card-text url">${a.url}</p>
                </div>
                <div class="row saved-btn-alignment">
                <div class="col-xs-6">
                  <button id="view_notes" article-id="${a._id}" type="button" class="btn btn-success saved-btn">
                    Article Notes
                  </button>
                </div>
                <div class="col-xs-6">
                  <button id="delete_article" article-id="${a._id}" type="button" class="btn btn-danger saved-btn">
                    Delete From Saved
                  </button>
                </div>
                </div>
              </div>
            </div>`
        )
      })
    })
  }

  // After document.ready, fetch already saved articles
  fetchSavedArticles()

  $(document).on("click", "#delete_article", function() {
    var id  = $(this).attr("article-id")
    axios.delete(`/article/${id}`)
      .then(res => {
        fetchSavedArticles()
      })
  })

  // display modal with article notes
  $(document).on("click", "#view_notes", function(){
    $("#modalCommentTextBox").val("")
    $("#commentsContainer").html("")
    $("#article_comments_modal").modal('show')
    var id  = $(this).attr("article-id")
    $("#article_comments_modal").data("articleId", id)
    $("#artile_modal_title").text(`Notes for Article: ${id}`)
    axios.get(`/article/${id}/comments`)
      .then(res => {
        var notes = res.data.comments
        notes.forEach((note, i) => {
          $("#commentsContainer").append(`
            <div class="container">
              <li class="comment-item">
                ${i + 1} - <strong>${note.body}</strong> <span id="delete-comment" class="delete-comment-button" note-id="${note._id}">&times</span>
              </li>
            </div>
          `)
        })
      })
  })

// Deleting old comments
  $(document).on("click", "#delete-comment", function() {
    var id = $(this).attr("note-id")
    console.log('deleteId: ', id)
    axios.delete(`/comment/${id}`)
      $("#article_comments_modal").modal('hide')
  })

// Adding new comments
  $(document).on("click", "#saveComment", function() {
    var body = $("#modalCommentTextBox").val()
    var articleId = $("#article_comments_modal").data().articleId
    console.log("body: ", body, "articleId", articleId)
    axios.post("/comment", { body, articleId })
    $("#article_comments_modal").modal('hide')
  })
})