//Clases
class Controler {
	constructor() {
		this.articles = new Array();
	}

	//Metodos de annadir y eliminar articulos usando promesas
	addArticulo(nombre, categoria, cantidad, precio) {
		return new Promise( (resolve, reject)=> {
			let art = new Articulo(nombre, categoria, cantidad, precio);
			this.articles.push(art)
			resolve(art);
		})
		
	}
	delArticulo(nombre) {
		return new Promise((resolve,reject)=> {
			const index = this.articles.findIndex(art => art.nombre === nombre);
			if(index!== -1){
				this.articles.splice(index,1);
				resolve(`Articulo ${nombre} eliminado`);}
				else{
					reject(`Articulo ${nombre} no encontrado`);
				}
		});
		
	}

	
	incCantidad(name) {
		let art = null;
		let i = 0;
		while (art == null) {
			if (this.articles[i].nombre === name) art = this.articles[i];
			i++;
		}
		art.incCantidad();
		return art;
	}

	subCantidad(name) {
		let art = null;
		let i = 0;
		while (art == null) {
			if (this.articles[i].nombre === name) art = this.articles[i];
			i++;
		}
		art.subCantidad();
		return art;
	}

	paint(id) {
		const filas = Object.values(this.articles)
			.map((articulo) => articulo.renderFilaArt())
			.join("");
		document.getElementById(id).innerHTML = filas;
	}
	paintCat(id, categoria) {
		const filas = Object.values(this.articles.filter((articulo) => articulo.categoria === categoria))
			.map((articulo) => articulo.renderFilaCat())
			.join("");
		let element = document.querySelector(id);
		element.innerHTML = filas;
	}
}

class ArticuloBase {
	constructor(nombre, categoria) {
		this.nombre = nombre;
		this.categoria = categoria;
	}
}

class Articulo extends ArticuloBase {
	constructor(nombre, categoria, cantidad, precio) {
		super(nombre, categoria);
		this.cantidad = cantidad;
		this.precio = precio;
	}

	incCantidad() {
		this.cantidad++;
	}
	subCantidad() {
		return this.cantidad > 0 ? this.cantidad-- : this.cantidad;
	}
	renderFilaArt() {
		return `
		<ul class="encabezado">
			<li class="liTag encabezadoItem">${this.nombre}</li>
			<li class="liTag encabezadoItem">${this.categoria}</li>
			<li class="liTag encabezadoItem">${this.precio}</li>
			<li class="liTag encabezadoItem">${this.cantidad}</li>
			<li class="liTag encabezadoItem nButton add">+</li>
			<li class="liTag encabezadoItem nButton sub">-</li>
			<li class="liTag encabezadoItem nButton delete"><img src="../Assests/trash_bin_icon-icons.com_67981.png"></img></li>
		</ul>`;
	}
	renderFilaCat() {
		return `
		<ul class="encabezado">
			<li class="liTag encabezadoItem">${this.nombre}</li>
			<li class="liTag encabezadoItem">${this.categoria}</li>
			<li class="liTag encabezadoItem">${this.precio}</li>
			<li class="liTag encabezadoItem">${this.cantidad}</li>
		</ul>`;
	}
}

//APP
//Logica
//Uso de las promesas
const controlador = new Controler();
controlador.addArticulo("Escoba", "Limpieza", 100, 800)

.then(art => console.log(`articulo annadido: ${art.nombre}`))
.catch(error => console.error("error",))

controlador.delArticulo("Escoba")
.then(message => console.log(message))
.catch(error => console.error(error))

controlador.addArticulo("Refresco", "Bebida", 200, 180);


//Elementos DOM
const tablaArticulos = document.querySelector("#tablaArticulos");
const aceptarForm = document.querySelector("#aceptarForm");
const agregarButton = document.querySelector("#agregarButton");
const articulosButton = document.querySelector("#Articulos");
const categoriasButton = document.querySelector("#Categorias");
const entradaButton = document.querySelector("#Entrada");
const mainPanel = document.querySelector("#mainPanel");
const categoryPanel = document.querySelector("#categoryPanel");
const addPanel = document.querySelector("#addPanel");

//Eventos

aceptarForm.addEventListener("click", () => {
	const categoria = aceptarForm.previousElementSibling.value;
	controlador.paintCat(".tablaCategoria", categoria);
});

agregarButton.addEventListener("click", () => {
	const nombreElem = document.querySelector("#nombre");
	const categoriaElem = document.querySelector("#categoria");
	const precioElem = document.querySelector("#precio");
	const cantidadElem = document.querySelector("#cantidad");
	const mensaje = document.querySelector(".mensaje");
	let nombre = nombreElem.value;
	let categoria = categoriaElem.value;
	let precio = precioElem.value;
	let cantidad = cantidadElem.value;

	controlador.addArticulo(nombre, categoria, cantidad, precio);
	mensaje.innerText = `Se ha añadido con éxito el artículo ${nombre}`;
	setTimeout(() => {
		nombreElem.value = "";
		categoriaElem.value = "";
		precioElem.value = "";
		cantidadElem.value = "";
		mensaje.innerText = "";
	}, 1500);
});

articulosButton.addEventListener("click", () => {
	// controlador.paint("tablaArticulos");
	mainPanel.classList.remove("ocultar");
	mainPanel.classList.add("mostrar");

	if (!addPanel.classList.contains("ocultar")) addPanel.classList.add("ocultar");
	if (addPanel.classList.contains("mostrar")) addPanel.classList.remove("mostrar");

	if (!categoryPanel.classList.contains("ocultar")) categoryPanel.classList.add("ocultar");
	if (categoryPanel.classList.contains("mostrar")) categoryPanel.classList.remove("mostrar");

	controlador.paint("tablaArticulos");

	const addButtons = document.querySelectorAll(".add");
	const subButtons = document.querySelectorAll(".sub");
	const deleteButtons = document.querySelectorAll(".delete");

	addButtons.forEach((obj) =>
		obj.addEventListener("click", () => {
			const element = obj.parentElement.firstElementChild.innerText;
			const art = controlador.incCantidad(element);
			obj.previousElementSibling.innerHTML = art.cantidad;
		})
	);

	subButtons.forEach((obj) =>
		obj.addEventListener("click", () => {
			const element = obj.parentElement.firstElementChild.innerText;
			const art = controlador.subCantidad(element);
			obj.previousElementSibling.previousElementSibling.innerHTML = art.cantidad;
		})
	);

	deleteButtons.forEach((obj) => 
	obj.addEventListener("click", () => {
		const tabla = obj.parentElement.parentElement;
		if(confirm("¿Estas seguro que desea eliminar este articulo?")){
		controlador.delArticulo(obj.parentElement.firstElementChild.innerText);
		tabla.removeChild(obj.parentElement)
		}
	}))
});

categoriasButton.addEventListener("click", () => {
	categoryPanel.classList.remove("ocultar");
	categoryPanel.classList.add("mostrar");

	if (!addPanel.classList.contains("ocultar")) addPanel.classList.add("ocultar");
	if (addPanel.classList.contains("mostrar")) addPanel.classList.remove("mostrar");

	if (!mainPanel.classList.contains("ocultar")) mainPanel.classList.add("ocultar");
	if (mainPanel.classList.contains("mostrar")) mainPanel.classList.remove("mostrar");
});

entradaButton.addEventListener("click", () => {
	addPanel.classList.remove("ocultar");
	addPanel.classList.add("mostrar");

	if (!categoryPanel.classList.contains("ocultar")) categoryPanel.classList.add("ocultar");
	if (categoryPanel.classList.contains("mostrar")) categoryPanel.classList.remove("mostrar");

	if (!mainPanel.classList.contains("ocultar")) mainPanel.classList.add("ocultar");
	if (mainPanel.classList.contains("mostrar")) mainPanel.classList.remove("mostrar");
});
