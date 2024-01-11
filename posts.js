let currentPage = 1;
let lastPage = 1;

window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight;

  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getpost(false, currentPage);
  }
});

const userDataJSON = localStorage.getItem("user");
const userObject = JSON.parse(userDataJSON);

function getpost(reload = true, page = 1) {
  toggleLoader(true);
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`)
    .then(function (response) {
      toggleLoader(false);
      lastPage = response.data.meta.last_page;
      //if is null is object and if there is image is string then now show the image if is string and not show if is object
      console.log("posts", typeof response.data.data[0].image);

      if (reload) {
        document.getElementById("post").innerHTML = "";
      }

      let posts = response.data.data;
      for (post of posts) {
        let imageHTML = "";
        if (typeof post.image === "string") {
          imageHTML = `<img class="w-100" src="${post.image}" alt="Post Image">`;
        }
        let tagsContent = "";
        if (post.tags && post.tags.length > 0) {
          for (tag of post.tags) {
            tagsContent += `<span><button class="btn btn-sm rounded-5" style="background-color: #415a77; color: white;">${tag.name}</button></span>`;
          }
        }
        let editButton = "";
        let deleteButton = "";
        if (userObject && userObject.id === post.author.id) {
          editButton = `
          <button class="btn btn-outline-secondary" style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>`;

          deleteButton = `
          <button class="btn btn-outline-danger" style="float: right; margin-left: 5px;" onclick="showDeleteConfirmation('${post.id}')">Delete</button>`;
        }

        let content = `
          <div class="d-flex justify-content-center">
            <div class="col-9">
              <div class="card shadow-lg p-3 mb-5 bg-body-tertiary rounded postSingle" >
                  <div class="card-header">
                  <span onclick="handleProfileUser('${post.author.id}')" style="cursor: pointer">
                    <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="..." style="width: 40px; height: 40px;">
                    <b>${post.author.username}</b>
                  </span>
                    ${deleteButton}
                    ${editButton}
                    
                  </div>
                  <div class="card-body" onclick="handlePostClick(${post.id})">
                    <h5>${post.title}</h5>
                    <p>${post.body}</p>
                    ${imageHTML}
                    <h6 class="mt-1" style="color: rgb(122, 122, 122);">${post.created_at}</h6>
                    <hr>
                    <div>
                     <div>
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"></path>
                         </svg>
                         <span>
                          <span>${post.comments_count}<span>
                            command
                            ${tagsContent}
                         </span>

                     </div>
                  </div>
                  </div>
              </div>
            </div>
          </div>
        `;

        document.getElementById("post").innerHTML += content;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
getpost();
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
      getpost(true, 1);
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
