const apiURL = "https://www.themealdb.com/api/json/v1/1/random.php";

// HTML elements
const mealName = document.getElementById("mealName") as HTMLHeadingElement;
const mealPhoto = document.getElementById("mealPhoto") as HTMLImageElement;
const ingredientsList = document.getElementById("ingredientsList") as HTMLDivElement;
const instructions = document.getElementById("instructions") as HTMLDivElement;
const source = document.getElementById("source") as HTMLDivElement;
const video = document.getElementById("video") as HTMLIFrameElement;


// Defining async function
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
    ingredientsList.innerHTML = "";

    for (let i=1; i<21; i++) {
        let ingredient = data[`strIngredient${i}`] 
        let measurement = data[`strMeasure${i}`]

        if (ingredient.trim() !== "") {
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

    
    source.setAttribute("href", data["strSource"]) 

    if (data["strYoutube"].trim !== "") {
        let videoID = data["strYoutube"].substring(data["strYoutube"].indexOf("v=")+2)
        video.src = "https://www.youtube.com/embed/"+videoID
    } else {
        video.style.display = "none";
    }
}



function getData() {
    getDinnerIdea()
}

var getIdeaButton = document.getElementById("getIdea") as HTMLButtonElement;
getIdeaButton ? getIdeaButton.onclick = getData : console.log("no button")


getData()