const apiURL = "https://www.themealdb.com/api/json/v1/1/random.php";

// HTML elements
const mealName = document.getElementById("mealName") as HTMLHeadingElement;
const mealPhoto = document.getElementById("mealPhoto") as HTMLImageElement;
const ingredientsList = document.getElementById("ingredientsList") as HTMLDivElement;
const instructions = document.getElementById("instructions") as HTMLDivElement;
const source = document.getElementById("source") as HTMLDivElement;
const video = document.getElementById("video") as HTMLIFrameElement;
const archive = document.getElementById("archive") as HTMLDivElement;

// track current session's generated recipes
let recipeCollection = {};


// Get API data and update webpage
async function getRecipe() {
    const response = await fetch(apiURL);
    const json = await response.json()
    const data = json.meals[0]

    // if this is a recipe that has already been generated, then get a different one
    if (data["idMeal"] in recipeCollection) {
        getRecipe()
    } else {
        console.log(data)
        addRecipeToCollection(data);
        updateWebpage(data)
    }
}

// update the webpage to display a recipe
function updateWebpage(data: Object) {
    mealName.textContent = data["strMeal"]
    mealPhoto.src = data["strMealThumb"]
    instructions.textContent = data["strInstructions"]

    // if there's a source link, then update the link - otherwise, remove the button from display
    if (data["strSource"]) {
        source.style.display = "inline"
        source.setAttribute("href", data["strSource"])
    } else {
        source.style.display = "none"
    }

    // if there's a video, then update the link - otherwise, remove the video from display
    if (data["strYoutube"]) {
        video.style.display = "inline";
        let videoID = data["strYoutube"].substring(data["strYoutube"].indexOf("v=") + 2)
        video.src = "https://www.youtube.com/embed/" + videoID
    } else {
        video.style.display = "none";
    }

    // update list of ingredients
    ingredientsList.innerHTML = "";
    for (let i = 1; i < 21; i++) {
        let ingredient = data[`strIngredient${i}`]
        let measurement = data[`strMeasure${i}`]

        if (ingredient) {
            const newIngredient = document.createElement("p")
            newIngredient.setAttribute("class", "ingredient col-sm-6 col-xl-4")
            const newIngredientText = document.createTextNode(` ${measurement} ${ingredient}`);
            const checkbox = document.createElement("input") as HTMLInputElement
            checkbox.setAttribute("type", "checkbox")
            newIngredient.appendChild(checkbox);
            newIngredient.appendChild(newIngredientText)
            ingredientsList.appendChild(newIngredient)
        }
    }

    const disabledButtons = document.getElementsByClassName("currentRecipe")
    console.log(disabledButtons.length)
    disabledButtons.item(0)?.removeAttribute("disabled");
    disabledButtons.item(0)?.setAttribute("class", "archiveRecipe")
    console.log(disabledButtons.length)

    const thisRecipeButton = document.getElementById(data["idMeal"]) as HTMLButtonElement
    thisRecipeButton.setAttribute("disabled", "");
    thisRecipeButton.className = "currentRecipe"
}

function addRecipeToCollection(recipe: object) {
    // add recipe to temporary storage
    recipeCollection[recipe["idMeal"]] = recipe

    // create a button for the new recipe in archive
    const recipeButton = document.createElement("button");
    recipeButton.setAttribute("class", "archiveRecipe");
    recipeButton.setAttribute("type", "button");
    recipeButton.textContent = recipe["strMeal"];
    recipeButton.id = recipe["idMeal"];
    recipeButton.addEventListener("click", showArchivedRecipe);
    archive.appendChild(recipeButton)
}

function showArchivedRecipe() {
    const recipeID = this.id;
    updateWebpage(recipeCollection[recipeID]);
}

// need to create a function wrapper here so that I can attach it to the getRecipeButton
function getData() {
    getRecipe()
}

// give functionality to the "get a new recipe" button
var getRecipeButton = document.getElementById("getIdea") as HTMLButtonElement;
getRecipeButton.onclick = getData

// start off the page with a new idea
getData()