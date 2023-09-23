document.getElementById("profile-display").innerHTML = ""
function getpost()
{
    
    axios.get('https://tarmeezacademy.com/api/v1/posts')
    .then(function (response) {

        let posts = response.data.data
        // console.log(posts)
        // let tage = response.data.data.tags
        for (post of posts) 
        {
            let author = post.author
            let postTile = ""
            // todo: make the image not appear if it is null 
            if(post.title =! null)
            {
                postTile == post.title
            }
        
            
            let content = `
            <div class="d-flex justify-content-center">
                <div class="col-9">
                <div class="card shadow-lg p-3 mb-5 bg-body-tertiary rounded">
                    <div class="card-header">
                    <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="..." style="width: 40px; height: 40px;">
                    <b>${post.author.username}</b>
                    </div>
                    <div class="card-body">
                    <h5>${postTile}</h5>
                    <p>${post.body}</p>
                    <img class="w-100" src="${post.image}" alt="...">
                    <h6 class="mt-1" style="color: rgb(122, 122, 122);">${post.created_at}</h6>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"></path>
                        </svg>
                        <span>
                        <span>${post.comments_count}<span>
                         command
                        </span>

                    <span id="">

                    <span id="tags-${post.id}">

                    </span>

                    </span>
                        
                    </div>
                    </div>
                </div>
                </div>
            </div>
            `
      
            document.getElementById("post").innerHTML += content
            let currentTag = `tags-${post.id}`
            document.getElementById(currentTag).innerHTML += ""
            for(tag of post.tags)
            {
                let tagsContent = 
                `<span>
                    <button class="btn btn-sm rounded-5" style="background-color: #415a77; color: white;">${tag.name}</button>
                </span>`
                document.getElementById(currentTag).innerHTML += tagsContent
                
        
            }
          

          
        }
          
          
    })
    .catch(function (error) {
      console.log(error);
    })
    
}

function getOnPost()
{
    axios.get('https://tarmeezacademy.com/api/v1/posts/1')
   .then(function (response)
   {
    
    let posts = response.data.data

 
        let postTile = ""
        if(posts.title =! null)
        {
            postTile == posts.title
        }
  

                
    let content = 
    `<div id="post" class="container" style="height: 1000px;">
    <div class="d-flex justify-content-center">
        <div class="col-9">
        <div class="card shadow-lg p-3 mb-5 bg-body-tertiary rounded">
            <div class="card-header">
            <img class="rounded-circle border border-2" src="${posts.author.profile_image}" alt="..." style="width: 40px; height: 40px;">
            <b>${posts.author.username}</b>
            </div>
            <div class="card-body">
            <h5>${postTile}</h5>
            <p>${posts.body}</p>
            <img class="w-100" src="${posts.image}" alt="...">
            <h6 class="mt-1" style="color: rgb(122, 122, 122);">${posts.created_at}</h6>
            <hr>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"></path>
                </svg>
                <span>
                <span>${posts.comments_count}<span>
                 command
                </span>

            <span id="tags-${posts.id}">

            </span>
                
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    `
    document.getElementById("post").innerHTML += content
    let currentTag = `tags-${posts.id}`
    document.getElementById(currentTag).innerHTML += ""
    for(tag of posts.tags)
    {
        let tagsContent = `                
        <span>
            <button class="btn btn-sm rounded-5" style="background-color: #415a77; color: white;">${tag.name}</button>
        </span>`
        document.getElementById(currentTag).innerHTML += tagsContent
        

    }

   }).catch(function (error){

   })
} // testing function

function login()
{
    const x = document.getElementById("username-name").value
    const y = document.getElementById("password-name").value
    axios.post('https://tarmeezacademy.com/api/v1/login', {
    username: x,
    password: y
     })
    .then(function (response) {
        // Save the Username & Password on localStoeage
        localStorage.setItem("token",JSON.stringify(response.data.token))
        localStorage.setItem("user",JSON.stringify(response.data.user))
        // Save the Username & Password on localStoeage
        // hiding the page after login 
        const modal = document.getElementById("login-modal")
        const modalInstance  = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        showUser()
        // hiding the page after login 
        setupNavBar()
   
    })
    .catch(function (error) {
        console.log(error);
    });
}
function register()
{
    const name = document.getElementById("namer-name").value
    const username = document.getElementById("usernamer-name").value
    const email = document.getElementById("emailr-name").value
    // const image = document.getElementById("imager-name")
    const password = document.getElementById("passwordr-name").value
    
    axios.post('https://tarmeezacademy.com/api/v1/register', {
    name: name,
    username: username,
    email: email,
    // image: image,
    password: password
     })
    .then(function (response) {
        localStorage.setItem("token",JSON.stringify(response.data.token))
        localStorage.setItem("user",JSON.stringify(response.data.user))

        const modal = document.getElementById("register-modal")
        const modalInstance  = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        show_alert("Nice, you register","success")
        setupNavBar()
       
        
   
    })
    .catch(function (error) {
        alert(error.response.data.message)
    });

}
function setupNavBar()
{
    let reglogbiv = document.getElementById("reg_log_div")
    let logoutbtn = document.getElementById("logout-div")
    const token = localStorage.getItem("token")
    if(token == null)
    {
        reglogbiv.style.setProperty("display","flex","important")
        logoutbtn.style.setProperty("display","none","important")        
       
    }
    else
    {
        reglogbiv.style.setProperty("display","none","important")
        logoutbtn.style.setProperty("display","flex","important")
        show_alert("Nice, you login","success")
    }

}
function showUser()
{
    let userInformation = localStorage.getItem("user")
    let userInformationafter = JSON.parse(userInformation)

    let profile = 
    `<div class="card-header"> 
    <img class="rounded-circle border border-2" src="${userInformationafter.profile_image}" class="img-fluid" alt="..." style="width: 40px; height: 40px;">
    <b>${userInformationafter.name}</b>
    </div>`
    if(userInformation != null)
    {
        document.getElementById('profile-display').style.display = "block"
        document.getElementById('add-post').style.display = "block"
    }

   
    document.getElementById("profile-display").innerHTML = profile

}
function logout()
{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    show_alert("Nice, you logout","warning")
    setupNavBar() 
    if(localStorage.getItem("token") == null)
    {
        document.getElementById('profile-display').style.display = "none"
        document.getElementById('add-post').style.display = "none"
    }
    
    
}
function show_alert(massage,theme)
{
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}
    appendAlert(`${massage}`, `${theme}`)
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        alert.close()
    }, 5000);

}  

getpost()
setupNavBar()
login()
// register()
// getOnPost()

showUser()