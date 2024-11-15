// live server
// alt + l + o -->
//////////////
// REFERENCIES AND GLOBAL VARIABLES
//////////////
let recetas = []
let tablaRecetasBody = document.querySelector("#tabla>tbody")
let formulario = document.querySelector("form")
let editMode = false
let queryMode = false
let saveButton = document.querySelector("#saveButton")
let cancelButton = document.querySelector("#cancelButton")
let createEditRecipeDialog = document.querySelector("#crearReceta")
let idRecipe = document.querySelector("#idReceta")
let nameRecipe = document.querySelector("#nombre")
let typeRecipe = document.querySelector("#tipo")
let ingredientsRecipe = document.querySelector("#ingredientes")
let performanceRecipe = document.querySelector("#preparacion")
let difficultyRecipe = document.querySelector("#dificultad")
let timeRecipe = document.querySelector("#tiempo")
let photoRecipe = document.querySelector("#foto")
let dishType = ["", "Primer plato", "Segundo plato", "Postre"]
//////////////
// Filling table if there are key data stargint with "Recipe" in locastorage
// They will be only ones used for table data
//////////////
if (localStorage.getItem("Recetas") != null){
    // alert("HAY RECETAS!!!")
    recetas =JSON.parse(localStorage.getItem("Recetas"))
}

/////////////
// Table refresh
/////////////
refreshTable()

//*******************
// fin de programa **
//*******************
/////////////////////////////////////////
// functions: exportRecipe, importRecipe
/////////////////////////////////////////
function exportRecipe() {
    // convertimos el array recetas a una string Json
    let cadena = JSON.stringify(recetas)
    // copia al portapapeles para luego pegar donde se quiera
    // a lo font awesome que te copia un icono al portatapeles
    //navigator.clipboard.writeText(cadena)

    // buscar tipos de datos MIME
    // creamos un objeto blob (se usa para almacenar datos en cualquier formato)
    // lo convertimos a url, creamos un <a> virtual, le ponems una url en el href,
    // le indicamos un ombre de archivo para descargar y sumulamos un click en el
    // enlace
    let contenido = new Blob(
        [cadena],
        {type: "text/plain"}
    )
    // Creamos un objeto URL de js a partir de "contenido"
    let url = window.URL.createObjectURL(contenido)
    // Creamos una URL virtual
    let enlace = document.createElement("a")
    enlace.href = url // el href apunta a url creada
    enlace.download = "recetas.json" // nombre del achivo a descargar
    enlace.click()
    alert("Recipe EXPORT finished")
}

function importRecipe() {
    // Virtual input creation
    let archivo = document.createElement("input")
    archivo.type = "file"
    archivo.click()
    archivo.onchange = function() {
        // alert("Fichero importado correctamente")
        // Creamos una variable con un objeto, el primer archivo del input file
        // en caso de tener varios ("multiple" en el input)
        // cosa que ahora no es así pero igualmente cogermos el primer fichero
        let fichero = this.files[0]
        // ojeto JS para leer los contenidos de un archivo
        let lector = new FileReader()
        // leemos los contenidos del archivo como una cadena
        lector.readAsText(fichero)
        // una vez cargado
        lector.onload = function(evento){
            let contenidos = evento.target.result
            if (contenidos == "") {
                alert("Empty file!!")
                return
            }
            let confirmText = "This WILL override actual values?\nSelect Accept or Cancel.";
            if (confirm(confirmText) == true) {
                // Delete all Receta + id
                recetas = []
                recetas = JSON.parse(contenidos)
                // Save new item on storage
                localStorage.setItem("Recetas", JSON.stringify(recetas))
                refreshTable()
            }
        }
    }
}
////////////////////////////////////////////////////////////////
// functions: refreshTable, disableFormFields, fillUpFormRecipe
////////////////////////////////////////////////////////////////
/**
* Refresh Table function
*/
function refreshTable() {
    tablaRecetasBody.innerHTML = null
    for(let recipe of recetas) {
        tablaRecetasBody.innerHTML += `
            <tr>
                <td>${recipe.id_recipe}</td>
                <td>${recipe.name}</td>
                <td>${dishType[recipe.type]}</td>
                <td><meter min="1" max="10" value="${recipe.difficulty}"></meter></td>
                <td>${recipe.time} min.</td>
                <td class="actionButtons">
                    <button class="tableIcon" onclick="details(${recipe.id_recipe})" title="Details"><i class="fa-regular fa-eye fa-2xl"></i></button>
                    <button class="tableIcon" onclick="createEditRecipe(${recipe.id_recipe})" title="Edit"><i class="fa-regular fa-pen-to-square fa-2xl"></i></button>
                    <button class="tableIcon" onclick="deleteRecipe(${recipe.id_recipe})" title="Delete"><i class="fa-solid fa-trash fa-2xl"></i></button>
                </td>
            </tr>
            `
    }
}
/**
* Disable form fields function
* @param {boolean} disableField - boolean value passed to disable field or not 
*/
function disableFormFields(disableField) {
    nameRecipe.disabled = disableField
    typeRecipe.disabled = disableField
    ingredientsRecipe.disabled = disableField
    performanceRecipe.disabled = disableField
    difficultyRecipe.disabled = disableField
    timeRecipe.disabled = disableField
    photoRecipe.disabled = disableField
}
/**
* To fillup form fields with recipe item passed
* @param {object} receta                 - object to fill up form fields
*/
function fillUpFormRecipe(receta) {
    idReceta.value = receta.id_recipe
    nombre.value = receta.name
    tipo.value = receta.type
    ingredientes.value = receta.ingredients
    preparacion.value = receta.performance
    dificultad.value = receta.difficulty
    outputValue.innerHTML = receta.difficulty
    tiempo.value = receta.time
    // foto.value = receta.photo       
}
///////////////////////////////////////////////////////
// functions: details, createEditRecipe y deleteRecipe
//////////////////////////////////////////////////////

function details(id) {
    let indice = 0
    queryMode = true
    document.querySelector("#h1Receta").innerHTML = "QUERY RECIPY"
    saveButton.classList.add("ocultarBoton")
    cancelButton.innerHTML = "Cerrar"
    indice = recetas.findIndex(receta => receta.id_recipe == id)
    let receta = recetas[indice]
    nameRecipe.focus()
    fillUpFormRecipe(receta)
    disableFormFields("true")
    createEditRecipeDialog.showModal()
}

function createEditRecipe(id = 0) {
    formulario.reset()
    saveButton.classList.remove("ocultarBoton")
    cancelButton.innerHTML = "Cerrar"
    queryMode = false
    if (id == 0) {
        editMode = false
        id = ""
        document.querySelector("#h1Receta").innerHTML = "CREATE RECIPE"
    } else {
        // console.log(indice)
        editMode = true
        document.querySelector("#h1Receta").innerHTML = "MODIFY RECIPE"
        // localizamos la receta en la tabla
        let indice = 0
        indice = recetas.findIndex(receta => receta.id_recipe == id)
        // indice = recetas.findIndex(function(elemento) {
        //     return elemento.id == id 
        // })
        let receta = recetas[indice]    
        // metemos los datos de la receta en los campos del formulario
        fillUpFormRecipe(receta)
    }
    nameRecipe.focus()
    // form parsing
    disableFormFields("")
    createEditRecipeDialog.showModal()
}

function deleteRecipe(id){
    // debugger
    let respuesta = confirm ("Confirm recipe DELETING")
    if(respuesta == false) return
    // Localizamos la receta a borrar
    console.log("Deleting: "+ id)
    let indice = 0
    indice = recetas.findIndex(receta => receta.id_recipe == id)
    console.log("Index: " + indice)
    
    // Borramos la receta
    localStorage.removeItem("Recipe "+id)
    
    // Borramos la receta del array
    // borrar 1 elemento de una determinada posicion
    recetas.splice(indice, 1)    // Ponemos el "cursor" en la posición indice del array, y borramos 1 elementos
    
    // reimprimir tabla
    tablaRecetasBody.innerHTML = null
    refreshTable()
}
function deleteAll() {
    let confirmText = "This WILL DELETE ALL actual values?\nSelect Accept or Cancel.";
    if (confirm(confirmText) == false) return
    if (localStorage.getItem("Recetas") != null){
        recetas = []
        // Guardar el key en el storage esta vez vacio
        localStorage.setItem("Recetas", JSON.stringify(recetas))
        refreshTable()
    }
    
}

///////////////////////////////////////////////////////
// functions: cancel, save
///////////////////////////////////////////////////////

function cancel() {
    createEditRecipeDialog.close()
    if (queryMode) {
        saveButton.classList.remove("ocultarBoton")
        cancelButton.innerHTML = "Cerrar"
        queryMode = false
    }
}

function save() {
    // 1 validar datos
    let errores= ""
    if (nameRecipe.value == "") errores += "Recipe name missing\n"
    if (typeRecipe.value == "") errores += "Recipe dish type missing\n"
    if (ingredientsRecipe.value == "") errores += "Recipe ingredients details missing\n"
    if (performanceRecipe.value == "") errores += "Recipe performance details missing\n"
    if (difficultyRecipe.value == "") errores += "Recipe difficulty missing\n"
    if (timeRecipe.value == "") errores += "Recipe time missing\n"
    if (errores != "") {
        alert(errores)
        return
    }
    if (!editMode){
        idRecipe.value = Math.random()
    }
    let recipe = {
        id_recipe: idRecipe.value,
        name: nameRecipe.value,
        type: typeRecipe.value,
        ingredients: ingredientsRecipe.value,
        performance: performanceRecipe.value,
        difficulty: difficultyRecipe.value,
        time: timeRecipe.value,
        photo: photoRecipe.value,
    }
    if (!editMode) {
        // Añadimos la receta al array
        recetas.push(recipe)
    }
    else {
        // Localizamos la receta a editar en el array recetas
        let indice = 0
        indice = recetas.findIndex(receta => receta.id_recipe == idRecipe.value)
        console.log(indice)
        // Modificamos la receta en el array
        recetas[indice] = recipe
    }
    // Guardar el key en el storage
    localStorage.setItem("Recetas", JSON.stringify(recetas))
    createEditRecipeDialog.close()
    refreshTable()
    editMode = false
}
