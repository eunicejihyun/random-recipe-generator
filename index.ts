const apiURL = "https://www.themealdb.com/api/json/v1/1/random.php";

// HTML elements
const mealName = document.getElementById("mealName") as HTMLHeadingElement;
const mealPhoto = document.getElementById("mealPhoto") as HTMLImageElement;
const ingredientsList = document.getElementById("ingredientsList") as HTMLDivElement;
const instructions = document.getElementById("instructions") as HTMLDivElement;
const source = document.getElementById("source") as HTMLDivElement;
const video = document.getElementById("video") as HTMLIFrameElement;


// Get API data and update webpage
async function getDinnerIdea() {
    const response = await fetch(apiURL);
    let data = await response.json()
    console.log(data.meals[0])
    updateWebpage(data.meals[0])
}

function updateWebpage(data: Object) {
    mealName.textContent = data["strMeal"]
    mealPhoto.src = data["strMealThumb"]
    instructions.textContent = data["strInstructions"]
    source.setAttribute("href", data["strSource"]) 

    // update list of ingredients
    ingredientsList.innerHTML = "";
    for (let i=1; i<21; i++) {
        let ingredient = data[`strIngredient${i}`] 
        let measurement = data[`strMeasure${i}`]

        if (ingredient === null || ingredient !== "") {
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

    // if there's a video, then update the link - otherwise, remove the video from display
    if (data["strYoutube"].trim !== "") {
        let videoID = data["strYoutube"].substring(data["strYoutube"].indexOf("v=")+2)
        video.src = "https://www.youtube.com/embed/"+videoID
    } else {
        video.style.display = "none";
    }
}

// need to create a function wrapper here so that I can attach it to the getIdeaButton
function getData() {
    getDinnerIdea()
}

// give functionality to the "view new recipe" button
var getIdeaButton = document.getElementById("getIdea") as HTMLButtonElement;
getIdeaButton ? getIdeaButton.onclick = getData : console.log("no button")

// start off the page with a new idea
getData()