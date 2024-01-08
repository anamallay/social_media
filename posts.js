// document.getElementById("profile-display").innerHTML = "";

// Infinite Scrolling
// Pagingation
// let currentPage = 1;
// let lastPage = 1;
// window.addEventListener("scroll", () => {
//   const endOfPage =
//     window.innerHeight + window.scrollY >= document.body.offsetHeight;
//   console.log("lastPage: " + lastPage, "currentPage: " + currentPage, "endOfPage: " + endOfPage);
//   if (endOfPage && currentPage < lastPage) {
//     currentPage += 1;
//     getpost(false, currentPage);
//   }
//   console.log(endOfPage);
// });

const userDataJSON = localStorage.getItem("user");
const userObject = JSON.parse(userDataJSON);
console.log(userObject.id); //id os 
function getpost(reload = true, page = 1) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=30`)
    .then(function (response) {
      lastPage = response.data.meta.last_page;

      // if (reload) {
      // document.getElementById("post").innerHTML = "";
      // }

      let posts = response.data.data;
      for (post of posts) {
        console.log("post.tags", post.tags);
        let tagsContent = "";
        if (post.tags && post.tags.length > 0) {
          for (tag of post.tags) {
            tagsContent += `<span><button class="btn btn-sm rounded-5" style="background-color: #415a77; color: white;">${tag.name}</button></span>`;
          }
        }

        let content = `
          <div class="d-flex justify-content-center">
            <div class="col-9">
              <div class="card shadow-lg p-3 mb-5 bg-body-tertiary rounded postSingle" >
                  <div class="card-header">
                    <img class="rounded-circle border border-2" src="${
                      post.author.profile_image
                    }" alt="..." style="width: 40px; height: 40px;">
                    <b>${post.author.username}</b>
                    <button class="btn btn-outline-secondary" style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                  </div>
                  <div class="card-body" onclick="handlePostClick(${post.id})">
                    <h5>${post.title}</h5>
                    <p>${post.body}</p>
                    <img class="w-100" src="${post.image}" alt="...">
                    <h6 class="mt-1" style="color: rgb(122, 122, 122);">${
                      post.created_at
                    }</h6>
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
function editPostBtnClicked(post) {
  console.log(JSON.parse(decodeURIComponent(post)));
  // return
    axios.put(`https://tarmeezacademy.com/api/v1/posts/${post.id}`);

  // postModal
  // post-model-title
  document.getElementById("post-model-title").innerHTML = "Edit Post"
  let idpostModal = document.getElementById("postModal");
  let editModel = new bootstrap.Modal(idpostModal, {});
  editModel.toggle();
}






