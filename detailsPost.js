let userParams = new URLSearchParams(window.location.search);
let id = userParams.get("postId") || localStorage.getItem("postId");

getSinglePost(id);
// Show the alert function
function show_alert(massage, theme) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(`${massage}`, `${theme}`);
  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance("#liveAlertPlaceholder");
    alert.close();
  }, 5000);
}

function getSinglePost(IDPost) {
  toggleLoader(true)
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${IDPost}`)
    .then(function (response) {
      toggleLoader(false)
      let post = response.data.data;

      let content = `
        <div class="d-flex justify-content-center">
          <div class="col-9">
            <div class="card shadow-lg p-3 mb-5 bg-body-tertiary rounded">
                <div class="card-header">
                <span onclick="handleProfileUser('${post.author.id}')" style="cursor: pointer">
                  <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="..." style="width: 40px; height: 40px;">
                  <b>${post.author.username}</b>
                </span>
                </div>
                <div class="card-body">
                  <h5>${post.title}</h5>
                  <p>${post.body}</p>
                  <img class="w-100" src="${post.image}" alt="...">
                  <h6 class="mt-1" style="color: rgb(122, 122, 122);">${post.created_at}</h6>
                  <hr>
      `;

      if (post.comments && post.comments.length > 0) {
        content += `<div class="comments-section">`;
        post.comments.forEach((comment) => {
          content += `
            <div class="card mb-2">
              <div class="card-body">
                <div class="comment-header shadow">
                  <img class="rounded-circle" src="${comment.author.profile_image}" alt="..." style="width: 30px; height: 30px;">
                  <b>${comment.author.username}</b>
                  <hr>
                </div>
                <p>${comment.body}</p>
              </div>
            </div>
          `;
        });
        content += `</div>`;
      }

      const fullToken = localStorage.getItem("token");
      if (fullToken) {
        content += `
               <!-- Create Comment Section -->
                <div class="create-comment-section mt-4">
                  <h5>Add a Comment</h5>
                  <form id="commentForm">
                    <div class="mb-3">
                      <textarea class="form-control" id="commentText" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-outline-success">Submit</button>
                  </form>
                </div>
        `;
      }

      content += `
                  </div>
                </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById("post").innerHTML = content;

      document
        .getElementById("commentForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          let commentText = document.getElementById("commentText").value;
          console.log(commentText);
          createComment(IDPost, commentText);
          document.getElementById("commentText").value = "";
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

function createComment(postId, commentText) {
  let commentData = { body: commentText };
  const fullToken = localStorage.getItem("token");

  if (!fullToken) {
    show_alert("No authentication token found. Please log in again", "warning");
    return;
  }

  const tokenPart = fullToken.split("|")[1]?.slice(0, -1);


  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
      commentData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenPart}`,
        },
      }
    )
    .then((response) => {
      console.log("Comment created:", response.data);
      show_alert("Comment created successfully!", "success");
      getSinglePost(postId);
    })
    .catch((error) => {
      console.error("Error creating comment:", error.response.data.message);
      show_alert(error.response.data.message, "danger");
    });
}
function handleProfileUser(userId) {
  window.location.href = `profile.html?userId=${userId}`;
}
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visibility";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}