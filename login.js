const alreadyLoggedError = document.querySelector(".alreadyLogged__error");
const loginEmailError = document.querySelector(".loginEmail__error");
const loginMdpError = document.querySelector(".loginMdp__error");

const email = document.getElementById("email");
const password = document.getElementById("password");

const submit = document.getElementById("submit");

const logout = document.getElementsByClassName("logout")

console.log(logout)
if (logout.length > 0) {
    logout[0].addEventListener("click", (event) => {
        if (localStorage.getItem("token")) {
            console.log("logoutcliquer")
            localStorage.removeItem("token");

            const p = document.createElement("p");
            p.innerHTML = "<br><br><br>Vous avez été déconnecté, veuillez vous reconnecter";
            return;
        }
    })
}

// Au clic, on envoie les valeurs de connexion

if (submit !== null) {
    submit.addEventListener("click", (event) => {
        event.preventDefault();
        const user = {
            email: email.value,
            password: password.value
        };
        login(user);
    })
}
// Fonction de connexion
function login(id) {
    console.log(id);
    console.log("step-1")
    loginEmailError.innerHTML = "";
    loginMdpError.innerHTML = "";

    // véeification de l'email
    if (!id.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Veuillez entrer une adresse e-mail valide";
        loginEmailError.appendChild(p);
        return;
    }

    console.log("step-2")

    // vérifcation du mot de passe
    if (id.password.length < 5 && !id.password.match(/^[a-zA-Z0-9]+$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Veuillez entrer un mot de passe valide";
        loginMdpError.appendChild(p);
        return;
    }
    console.log("step-3")

    // verification de l'email et du mot de passe


    console.log("step-4")
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            "accept": "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    })

        .then(response => {
            console.log("step-5:", response)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        // ...

        .then(result => {
            console.log(result);

            if (result.error || result.message) {
                const p = document.createElement("p");
                p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte";
                loginMdpError.appendChild(p);
            }
            else if (result.token) {
                localStorage.setItem("token", result.token);

                // Ajoutez la ligne suivante pour stocker le rôle de l'utilisateur
                localStorage.setItem("userRole", result.role);

                window.location.href = "index.html";
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });

    // ...

}
