let userParams = new URLSearchParams(window.location.search);
let id = userParams.get("userId");
console.log("userParams", userParams);
function getProfileLink(id) {
  window.location.href = "profile.html";
  return id;
}
let user = localStorage.getItem("user");
let userObj = JSON.parse(user);
let myprofile = id ? id : userObj.id;

function getProfile(userId) {
  toggleLoader(true)
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${userId}`)
    .then(function (response) {
      toggleLoader(false);
      let user_info = response.data.data;
      document.getElementById("card-username").innerHTML =
        "@" + user_info.username;
      document.getElementById("card-name").innerHTML = user_info.name;
      document.getElementById("card-email").innerHTML = user_info.email;
      document.getElementById("card-image").src = user_info.profile_image;
      document.getElementById("card-comments_count").innerHTML =
        user_info.comments_count + " Comments";
      document.getElementById("card-posts_count").innerHTML =
        user_info.posts_count + " Posts";
    })
    .catch(function (error) {
      console.log(error);
    });
}
function myprofilePosts(userId) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
    .then(function (response) {
      let posts = response.data.data;
      let postsContent = "";
      for (post of posts) {
        let editButton = "";
        let deleteButton = "";
        if (userObj && userObj.id === post.author.id) {
          editButton = `
          <button class="btn btn-outline-secondary" style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>`;

          deleteButton = `
          <button class="btn btn-outline-danger" style="float: right; margin-left: 5px;" onclick="showDeleteConfirmation('${post.id}')">Delete</button>`;
        }
        let tagsContent = "";
        if (post.tags && post.tags.length > 0) {
          for (tag of post.tags) {
            tagsContent += `<span><button class="btn btn-sm rounded-5" style="background-color: #415a77; color: white;">${tag.name}</button></span>`;
          }
        }
        let content = `
          <div class="d-flex justify-content-center">
            <div class="col-12">
              <div class="card shadow-lg p-3 mb-5 bg-body-tertiary rounded postSingle">
                <div class="card-header">
                   <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="Author's image" style="width: 40px; height: 40px;">
                  <b>${post.author.username}</b>
                        ${deleteButton}
                    ${editButton}
                </div>
                <div class="card-body" onclick="handlePostClick('${post.id}')">
                  <h5>${post.title}</h5>
                  <p>${post.body}</p>
                  <img class="w-100" src="${post.image}" alt="Post image">
                  <h6 class="mt-1" style="color: rgb(122, 122, 122);">${post.created_at}</h6>
                  <hr>
                  <div>
                    <div>
                      <!-- Your icons and other elements here -->
                      <span>${post.comments_count} comments</span>
                      ${tagsContent}
                      <!-- Include tagsContent here if defined -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        postsContent += content;
      }

      document.getElementById("post_users").innerHTML = postsContent;
    })
    .catch(function (error) {
      console.error("Error fetching user posts: ", error);
    });
}
getProfile(myprofile);
myprofilePosts(myprofile);
function handlePostClick(postId) {
  window.location.href = `postDetails.html?postId=${postId}`;
}
function editPostBtnClicked(posts) {
  document.getElementById("post-model-title").innerHTML = "Update Post";
  document.getElementById("savechange").innerHTML = "Update";

  let post = JSON.parse(decodeURIComponent(posts));
  document.getElementById("post-id-input").value = post.id;

  document.getElementById("postTitle").value = post.title || "";
  document.getElementById("postBody").value = post.body || "";

  let idpostModal = document.getElementById("postModal");
  let editModel = new bootstrap.Modal(idpostModal, {});
  editModel.toggle();


  idpostModal.addEventListener("hidden.bs.modal", function (event) {
    document.getElementById("post-model-title").innerHTML = "Create Post";
    document.getElementById("savechange").innerHTML = "Create";
    document.getElementById("postTitle").value = "";
    document.getElementById("postBody").value = "";
  });
}
function showDeleteConfirmation(postid) {
  document.getElementById("titleOfDelete").innerHTML = postid;
  let idpostModal = document.getElementById("deletePostModal");
  let deleteModel = new bootstrap.Modal(idpostModal, {});
  deleteModel.toggle();
  window.currentlyDeletingPostId = postid;
}
function deletePostBtnClicked() {
  let postid = window.currentlyDeletingPostId;

  const fullToken = localStorage.getItem("token");
  let tokenPart;
  if (fullToken) {
    tokenPart = fullToken.split("|")[1];
    if (tokenPart && tokenPart.length > 0) {
      tokenPart = tokenPart.slice(0, -1);
    }
  } else {
    console.log("Token not found in local storage.");
    alert("No authentication token found. Please log in again.");
    return;
  }
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${postid}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tokenPart}`,
      },
    })
    .then(function (response) {
      // myprofilePosts(myprofile);
      show_alert("Post deleted successfully!", "success");
      let deleteModal = bootstrap.Modal.getInstance(
        document.getElementById("deletePostModal")
      );
      deleteModal.hide();
    })
    .catch(function (error) {
      show_alert(
        `Failed to deleted the post: ${error.response.data.message}`,
        "danger"
      );
    });
}
