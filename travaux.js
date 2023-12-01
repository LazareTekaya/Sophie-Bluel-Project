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
    photosModale();
    lanceModale2();
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
        iconeCorbeille.id = works[i].id;  // Ajoute l'ID à l'attribut id de l'icône

        iconeCorbeille.addEventListener("click", function (event) {
            event.stopPropagation();
            deleteProjects(iconeCorbeille.id);  // Utilise l'ID depuis l'attribut id

            // Si l'élément parent de l'icône est généré dynamiquement, vous pouvez le supprimer de la modale
            const parentElement = iconeCorbeille.parentElement;
            if (parentElement) {
                parentElement.remove();
            }
        });

        imageModale.appendChild(pictureModale);
        imageModale.appendChild(iconeCorbeille);  // Ajoute l'icône à l'article
        sectionPhotos.appendChild(imageModale);
    }
    deleteWork();
}


// Gestion de l'affichage des boutons admin
const token = localStorage.getItem("token");
const logout = document.querySelector(".logout");

function adminPanel() {
    document.querySelectorAll(".authElements").forEach(a => {
        console.log("adminpanel:%s", a)
        console.log("token:%s", token)
        if (token === null) {
            a.style.display = "none";
        } else {
            a.style.display = "inline-block";
            logout.innerHTML = "logout";
        }
    });

    document.querySelectorAll(".unauthElements").forEach(a => {
        console.log("adminpanel:%s", a)
        console.log("token:%s", token)
        if (token === null) {
            a.style.display = "flex";
        } else {
            a.style.display = "none";
        }
    });
}

adminPanel();

//suppression des projets dans la modale// 

function deleteWork() {
    let btnDelete = document.querySelectorAll(".photos i.fa-trash");
    for (let i = 0; i < btnDelete.length; i++) {
        const projectId = btnDelete[i].id; 
        btnDelete[i].addEventListener("click", function () {
            deleteProjects(projectId);
        });
    }
}

async function deleteProjects(projectId) {
    console.log("debug suppression");
    console.log("id", projectId);
    console.log(token);

    await fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(response => {
            console.log(response);
            // Token good
            if (response.status === 204) {
                console.log("DEBUG SUPPRESSION DU PROJET " + projectId);
                refreshPage(projectId);
            }
            // Token incorrect
            else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé(e) à supprimer ce projet, merci de vous connecter avec un compte valide");
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            console.log(error);
        });
}


function lanceModale2() {
    const btnAjouterPhoto = document.getElementById('btnAjouterPhoto');

    if (btnAjouterPhoto) {
        btnAjouterPhoto.addEventListener('click', function () {
            const modale2 = document.getElementById('modale2');

            if (modale2) {
                modale.style.display = "none";
                modale.setAttribute("aria-hidden", "true");
                modale.removeAttribute("aria-modal");

                modale2.style.display = null;
                modale2.removeAttribute("aria-hidden");
                modale2.setAttribute("aria-modal", "true");
            }
        });
    }
}

