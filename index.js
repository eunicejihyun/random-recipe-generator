var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var apiURL = "https://www.themealdb.com/api/json/v1/1/random.php";
// HTML elements
var mealName = document.getElementById("mealName");
var mealPhoto = document.getElementById("mealPhoto");
var ingredientsList = document.getElementById("ingredientsList");
var instructions = document.getElementById("instructions");
var source = document.getElementById("source");
var video = document.getElementById("video");
var archive = document.getElementById("archive");
// track current session's generated recipes
var recipeCollection = {};
// Get API data and update webpage
function getRecipe() {
    return __awaiter(this, void 0, void 0, function () {
        var response, json, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(apiURL)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _a.sent();
                    data = json.meals[0];
                    // if this is a recipe that has already been generated, then get a different one
                    if (data["idMeal"] in recipeCollection) {
                        getRecipe();
                    }
                    else {
                        console.log(data);
                        addRecipeToCollection(data);
                        updateWebpage(data);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// update the webpage to display a recipe
function updateWebpage(data) {
    var _a, _b;
    mealName.textContent = data["strMeal"];
    mealPhoto.src = data["strMealThumb"];
    instructions.textContent = data["strInstructions"];
    // if there's a source link, then update the link - otherwise, remove the button from display
    if (data["strSource"]) {
        source.style.display = "inline";
        source.setAttribute("href", data["strSource"]);
    }
    else {
        source.style.display = "none";
    }
    // if there's a video, then update the link - otherwise, remove the video from display
    if (data["strYoutube"]) {
        video.style.display = "inline";
        var videoID = data["strYoutube"].substring(data["strYoutube"].indexOf("v=") + 2);
        video.src = "https://www.youtube.com/embed/" + videoID;
    }
    else {
        video.style.display = "none";
    }
    // update list of ingredients
    ingredientsList.innerHTML = "";
    for (var i = 1; i < 21; i++) {
        var ingredient = data["strIngredient".concat(i)];
        var measurement = data["strMeasure".concat(i)];
        if (ingredient) {
            var newIngredient = document.createElement("p");
            newIngredient.setAttribute("class", "ingredient col-sm-6 col-xl-4");
            var newIngredientText = document.createTextNode(" ".concat(measurement, " ").concat(ingredient));
            var checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            newIngredient.appendChild(checkbox);
            newIngredient.appendChild(newIngredientText);
            ingredientsList.appendChild(newIngredient);
        }
    }
    var disabledButtons = document.getElementsByClassName("currentRecipe");
    console.log(disabledButtons.length);
    (_a = disabledButtons.item(0)) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
    (_b = disabledButtons.item(0)) === null || _b === void 0 ? void 0 : _b.setAttribute("class", "archiveRecipe");
    console.log(disabledButtons.length);
    var thisRecipeButton = document.getElementById(data["idMeal"]);
    thisRecipeButton.setAttribute("disabled", "");
    thisRecipeButton.className = "currentRecipe";
}
function addRecipeToCollection(recipe) {
    // add recipe to temporary storage
    recipeCollection[recipe["idMeal"]] = recipe;
    // create a button for the new recipe in archive
    var recipeButton = document.createElement("button");
    recipeButton.setAttribute("class", "archiveRecipe");
    recipeButton.setAttribute("type", "button");
    recipeButton.textContent = recipe["strMeal"];
    recipeButton.id = recipe["idMeal"];
    recipeButton.addEventListener("click", showArchivedRecipe);
    archive.appendChild(recipeButton);
}
function showArchivedRecipe() {
    var recipeID = this.id;
    updateWebpage(recipeCollection[recipeID]);
}
// need to create a function wrapper here so that I can attach it to the getRecipeButton
function getData() {
    getRecipe();
}
// give functionality to the "get a new recipe" button
var getRecipeButton = document.getElementById("getIdea");
getRecipeButton.onclick = getData;
// start off the page with a new idea
getData();
