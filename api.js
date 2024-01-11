function handlePostClick(postId) {
  window.location.href = `postDetails.html?postId=${postId}`;
}

function setupUI() {
  let reglogbiv = document.getElementById("reg_log_div");
  let logoutbtn = document.getElementById("logout-div");
  let profile = document.getElementById("profile");
  const token = localStorage.getItem("token");
  if (token == null) {
    reglogbiv.style.setProperty("display", "flex", "important");
    logoutbtn.style.setProperty("display", "none", "important");
    profile.style.setProperty("display", "none", "important");
  } else {
    reglogbiv.style.setProperty("display", "none", "important");
    logoutbtn.style.setProperty("display", "flex", "important");
    profile.style.setProperty("display", "block", "important");
  }
}

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

function showUser() {
  let userInformation = localStorage.getItem("user");
  let userInformationafter = JSON.parse(userInformation);

  let profile = `<div class="card-header"> 
    <img class="rounded-circle border border-2" src="${userInformationafter.profile_image}" class="img-fluid" alt="..." style="width: 40px; height: 40px;">
    <b>${userInformationafter.name}</b></div>`;
  if (userInformation != null) {
    document.getElementById("profile-display").style.display = "block";
    document.getElementById("add-post").style.display = "block";
  }

  document.getElementById("profile-display").innerHTML = profile;
}

// Authentication + login + logout + Register
function login() {
  const x = document.getElementById("username-name").value;
  const y = document.getElementById("password-name").value;
  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: x,
      password: y,
    })
    .then(function (response) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // hiding the page after login
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      show_alert("Nice, you login", "success");

      showUser();
      setupUI();
    })
    .catch(function (error) {
      let message = error.response.data.message;
      show_alert(message, "danger");
    });
}

function register() {
  const name = document.getElementById("namer-name").value;
  const username = document.getElementById("usernamer-name").value;
  const email = document.getElementById("emailr-name").value;
  const image = document.getElementById("imager-name").files[0];
  const password = document.getElementById("passwordr-name").value;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("image", image);
  formData.append("password", password);

  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData)
    .then(function (response) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setupUI();
      showUser();
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      show_alert("Nice, you register", "success");
    })
    .catch(function (error) {
      let message = error.response.data.message;
      show_alert(message, "danger");
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  show_alert("Nice, you logout", "warning");
  if (localStorage.getItem("token") == null) {
    document.getElementById("profile-display").style.display = "none";
    document.getElementById("add-post").style.display = "none";
  }
  setupUI();
  showUser();
}
// create post
function createPost() {
  let postid = document.getElementById("post-id-input").value;
  let isCreate = postid == null || postid == "";

  let title_post = document.getElementById("postTitle").value;
  let body_post = document.getElementById("postBody").value;
  let image_post = document.getElementById("postImage").files[0];

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

  let formData = new FormData();
  formData.append("title", title_post);
  formData.append("body", body_post);
  formData.append("image", image_post);

  if (isCreate) {
    axios
      .post("https://tarmeezacademy.com/api/v1/posts", formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenPart}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        show_alert("Post created successfully!", "success");
        getpost();

        document.querySelector("form").reset();
        getpost();

        const modal = document.getElementById("postModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        getpost();
      })
      .catch(function (error) {
        show_alert(
          `Failed to create the post: ${error.response.data.message}`,
          "danger"
        );
      });
  } else {
    formData.append("_method", "put");
    axios
      .post(`https://tarmeezacademy.com/api/v1/posts/${postid}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenPart}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        show_alert("Post edited successfully!", "success");
        getpost(true, 1);

        document.querySelector("form").reset();
        
        const modal = document.getElementById("postModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
      })
      .catch(function (error) {
        console.log("error", error);
        show_alert(
          `Failed to create the put: ${error.response.data.message}`,
          "danger"
        );
      });
  }
}

// ---S => Calling the function ---
setupUI();
showUser();
// ---E => Calling the function ---
// loading
function toggleLoader(show = true) {
  if (show) { 
    document.getElementById("loader").style.visibility = "visibility"
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
