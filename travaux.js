let works;

async function getAPI() {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
}

/* Importation photos gallerie */



export async function init() {
    works = await getAPI();
    const sectionPhotos = document.querySelector('.gallery');

    function genererPhotos(photos) {
        sectionPhotos.innerHTML = "";


        for (let i = 0; i < photos.length; i++) {
            const photo = photos[i];

            const emplacementPhoto = document.createElement("figure");
            emplacementPhoto.dataset.id = photo.id;

            const image = document.createElement("img");
            image.src = photo.imageUrl;

            const descriptionPhoto = document.createElement("figcaption");
            descriptionPhoto.innerText = photo.title;

            emplacementPhoto.appendChild(image);
            emplacementPhoto.appendChild(descriptionPhoto);
            sectionPhotos.appendChild(emplacementPhoto);
        }
    }



    function addFilterEventListener(buttonClass, categoryId) {
        const bouton = document.querySelector(buttonClass);
        if (bouton === null) {
            return;
        }
        bouton.addEventListener("click", function () {
            let filteredWorks;

            if (categoryId === 0) {
                filteredWorks = works;
            } else {
                filteredWorks = works.filter(function (objets) {
                    return objets.category.id === categoryId;
                });
            }

            const sectionPhotos = document.querySelector(".gallery");
            sectionPhotos.innerHTML = "";
            genererPhotos(filteredWorks);
        });
    }

    addFilterEventListener(".btn-objets", 1);
    addFilterEventListener(".btn-appartement", 2);
    addFilterEventListener(".btn-hotelresto", 3);
    addFilterEventListener(".btn-tous", 0);

    genererPhotos(works);
    addFilterEventListener();



}

init();


// affichage de la modale //

let modale = null

const toggleModale = function (e) {
    if (e === undefined) {
        return

    };
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"));

    if (modale === null) {
        target.style.display = null;
        target.removeAttribute("aria-hidden");
        target.setAttribute("aria-modal", "true");
        modale = target;

        modale.addEventListener("click", toggleModale);
        modale.querySelector(".js-modale-fermer").addEventListener("click", toggleModale);
        modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation);
        photosModale();
    } else {
        e.preventDefault();
        modale.style.display = "none";
        modale.setAttribute("aria-hidden", "true");
        modale.removeAttribute("aria-modal");

        modale.removeEventListener("click", toggleModale);
        modale.querySelector(".js-modale-fermer").removeEventListener("click", toggleModale);
        modale.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation);

        modale = null;
    }
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", toggleModale);
});

toggleModale()


// affichage des photos dans la modale // 

function photosModale() {
    const sectionPhotos = document.querySelector(".photos");

    sectionPhotos.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
        const photos = works[i];

        const imageModale = document.createElement("article");
        imageModale.dataset.id = works[i].id;

        const pictureModale = document.createElement("img");
        pictureModale.src = photos.imageUrl;

        const iconeCorbeille = document.createElement("i");
        iconeCorbeille.className = "fa-solid fa-trash";
        iconeCorbeille.style.cursor = "pointer";
        iconeCorbeille.setAttribute("id", works[i].id)

        iconeCorbeille.addEventListener("click", function (event) {
            event.stopPropagation();
            deleteWork(photos.id);
        });

        imageModale.appendChild(pictureModale);
        sectionPhotos.appendChild(imageModale);
        sectionPhotos.appendChild(iconeCorbeille);

    }
    deleteWork()

}

// Gestion de l'affichage des boutons admin
const token = localStorage.getItem("token");
const logout = document.querySelector(".logout");

adminPanel()
// Gestion de l'affichage des boutons admin
function adminPanel() {
    document.querySelectorAll(".pageAdmin").forEach(a => {
        console.log("adminpanel:%s", a)
        console.log("token:%s", token)
        if (token === null) {
            return;
        }
        else {
            console.log(a)
            a.style.display = "none"
            logout.innerHTML = "logout";
        }
    });
}

//suppression des projets dans la modale// 

function deleteWork() {
    let btnDelete = document.querySelectorAll(".photos");
    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", deleteProjects);
    }
}

async function deleteProjects() {

    console.log("debug suppression")
    console.log("id", this.id)
    console.log(token)

    await fetch(`http://localhost:5678/api/works/${this.dataset.id[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })

        .then(response => {
            console.log(response)
            // Token good
            if (response.status === 204) {
                console.log("DEBUG SUPPRESION DU PROJET " + this.classList[0])
                refreshPage(this.classList[0])
            }
            // Token inorrect
            else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé(e) à supprimer ce projet, merci de vous connecter avec un compte valide")
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            console.log(error)
        })
}

