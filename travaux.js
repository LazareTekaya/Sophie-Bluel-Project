let works;

async function getAPI() {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
}

/* importation photos gallerie */

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

    // fonction tri de photos

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


// quitte la modale après click //

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
    const modale2 = document.getElementById('modale2');
    if (modale2) {
        modale2.style.display = "none";
        modale2.setAttribute("aria-hidden", "true");
        modale2.removeAttribute("aria-modal");

        modale = target;

        modale.addEventListener("click", toggleModale);
        modale.querySelector(".js-modale-fermer").addEventListener("click", toggleModale);
        modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation);
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
        iconeCorbeille.id = works[i].id;

        iconeCorbeille.addEventListener("click", function (event) {
            event.stopPropagation();
            deleteProjects(iconeCorbeille.id);

            const parentElement = iconeCorbeille.parentElement;
            if (parentElement) {
                parentElement.remove();

            }
        });

        imageModale.appendChild(pictureModale);
        imageModale.appendChild(iconeCorbeille);
        sectionPhotos.appendChild(imageModale);
    }
    deleteWork();
}



// gestion de l'affichage des boutons admin
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

async function deleteWork(projectId) {
    const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    response.then((data) => {
        if (data.status === 204) {
            document.querySelector('.photos').textContent = 'Aucune photo';
        } else if (data.status === 401) {
            alert('Vous n\'êtes pas autorisé à supprimer ce projet');
            window.location.href = 'login.html';
        } else {
            alert('Une erreur s\'est produite lors de la suppression du projet');
        }
    });
}

function deleteProjects(projectId) {
    deleteWork(projectId);
}

// lance la modale ajout photo après click sur ajouter photo



function lanceModale2() {
    const btnAjouterPhoto = document.getElementById("btnAjouterPhoto");
    if (btnAjouterPhoto) {
        btnAjouterPhoto.addEventListener("click", lanceModale2);
        const modale2 = document.getElementById("modale2");

        if (modale2) {
            modale.style.display = "none";
            modale.setAttribute("aria-hidden", "true");
            modale.removeAttribute("aria-modal");

            modale2.style.display = null;
            modale2.removeAttribute("aria-hidden");
            modale2.setAttribute("aria-modal", "true");

            const ajoutImageInput = document.querySelector('.ajout-image');
            ajoutImageInput.addEventListener('change', previewImage);
        }
    }
}

// preview de l'image dans le module d'ajout photo

function previewImage(event) {
    const input = event.target;
    const preview = document.querySelector('#photo-preview');
    const formGroupPhoto = document.querySelector('.form-group-photo');

    const file = input.files[0];

    if (file) {
        if (file.size > 4194304) {
            alert("Please upload an image with a maximum size of 4MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';

            formGroupPhoto.innerHTML = '';
            formGroupPhoto.appendChild(preview);
            formGroupPhoto.appendChild(input);
        };

        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';

        formGroupPhoto.innerHTML = '<i class="fa-regular fa-image"></i> <label for="photo">+ Ajouter une photo</label> <input type="file" name="photo" id="photo" class="ajout-image"> <p>jpg, png : 4mo max</p>';
    }
}

const btnAjoutProjet = document.querySelector(".btn-ajout");
btnAjoutProjet.addEventListener("click", ajouterPhoto);


// ajout d'une photo via d'admin

async function ajouterPhoto(event) {
    event.preventDefault();
    console.log('ajouterPhoto called');

    const title = document.querySelector(".ajout-titre").value;
    const categoryId = document.querySelector(".ajout-categoryId").value;
    const image = document.querySelector(".ajout-image").files[0];


    if (title === "" || categoryId === "" || image === undefined) {
        alert("Veuillez compléter les champs");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Merci de sélectionner une catégorie");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                alert("Votre photo a bien été ajouté");
                photosModale(dataAdmin);
                genererPhotos(data, null);

            } else if (response.status === 400) {
                alert("Merci de compléter tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Non habilité à ajouter une photo");
                window.location.href = "login.html";
                //else ?
            }
        }

        catch (error) {
            console.log(error);
        }
    }
}