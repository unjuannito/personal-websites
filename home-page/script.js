document.addEventListener("keydown", (e) => {
  if (e.key == " ") {
    document.getElementById(classBrowser).click();
  } else if (e.key == "Tab") {
    document.getElementById(searchBar).click();
  }
});

var nA = document.querySelectorAll(".grid > a").length;
for (let index = 0; index < nA; index++) {
  var aName = "a" + (1 + index);
  var a = document.getElementById(aName);
  var img = a.getElementsByTagName("img")[0];
  var imgUrl =
    "https://s2.googleusercontent.com/s2/favicons?domain=" +
    a.getAttribute("href") +
    "/&sz=128"; // Llama a la función que devuelve la URL de la imagen
  img.src = imgUrl; // Cambia el valor del atributo src al de la URL de la imagen
}

//apretar teclas
document.addEventListener("keydown", (e) => {
  if (e.key == " " || e.key == "Enter") {
    miCheck.click();
    manejarChecKbox();
  } else if (e.key >= 1 && e.key <= 6)
    location.href = linkclases[clases.indexOf(clasesdehoy[e.key - 1])];
});

document
  .querySelector(".grid")
  .style.setProperty("--minwidth", (screen.width / 100) * 7 + "px");
