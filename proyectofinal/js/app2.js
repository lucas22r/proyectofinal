// librerias

import Swal from "sweetalert2";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

// Selectores
let productosFilter = document.querySelector("#productosFilter");
let buscar = document.querySelector("#buscar");
let productosContainer = document.querySelector("#productosContainer");
let canvasBody = document.querySelector("#canvasBody");
let carritoContainer = document.querySelector("#carritoContainer");
let botonCarrito = document.querySelector("#botonCarrito");
let botonCarritoNotificacion = document.querySelector(
  "#botonCarritoNotificacion"
);




// Arrays

let productosFiltrados = [];
let productosData = [];
let carritoCompra = JSON.parse(localStorage.getItem("carrito")) || [];

//fetch

const importarProductos = async () => {
  const resp = await fetch("/data/productos.json");
  productosData = await resp.json();
  mostrarProductos(productosData);
};

// Funciones globales

const crearBoton = (texto, ...estilos) => {
  let button = document.createElement("button");
  button.innerText = texto;
  button.classList.add(...estilos);
  return button;
};

// Funciones Tienda:

const mostrarProductos = (listaproductos) => {
  productosContainer.innerHTML = " ";
  listaproductos.forEach((producto) => {
    let card = document.createElement("div");
    card.className = "card col-4 g-4 text-center";
    card.style.width = "18rem";
    card.innerHTML = `
      <img src="../Assets/img/tienda/${producto.imagen}" class="card-img-top mt-2">
      <div class="card-body">
        <h5 class="card-title fs-4">${producto.nombre}</h5>
        <p class="card-text fs-5">${producto.descripcion}</p>
        <p class="card-text fs-4 badge bg-success">$ ${producto.precio} USD</p>
      </div>
    `;
    let botonCompraContainer = document.createElement("div");
    botonCompraContainer.className = "text-center pt-2";
    card.appendChild(botonCompraContainer);
    let botonCompra = crearBoton(
      "Comprar",
      "btn",
      "btn-primary",
      "shadow",
      "fs-4",
      "mb-3",
      "botonComprar"
    );
    botonCompraContainer.appendChild(botonCompra);
    productosContainer.appendChild(card);
    botonCompra.onclick = () => agregarAlCarrito(producto.id);
  });
};

const verCarrito = (carritoCompra) => {
  if (carritoCompra.length > 0) {
    canvasBody.classList.remove("text-center");
    carritoContainer.innerHTML = " ";
    carritoCompra.forEach((producto) => {
      let cardCarrito = document.createElement("li");
      cardCarrito.className = "cardCanvasCarrito list-group-item fs-4";
      cardCarrito.innerText = `${producto.nombre}`;
      let cardCarritoPrecioyEliminar = document.createElement("div");
      cardCarritoPrecioyEliminar.className = "row";
      cardCarritoPrecioyEliminar.innerHTML = `<p class="card-text col-6"> $ ${producto.precio} USD</p>`;
      cardCarrito.appendChild(cardCarritoPrecioyEliminar);
      let botonEliminarCarrito = crearBoton(
        "Eliminar",
        "btn",
        "col-3",
        "btn-danger"
      );
      cardCarritoPrecioyEliminar.appendChild(botonEliminarCarrito);
      carritoContainer.appendChild(cardCarrito);
      botonEliminarCarrito.onclick = () => {
        eliminarProductoCarrito(producto.index);
      };
    });
  } else {
    canvasBody.className = "offcanvas-body text-center";
    carritoContainer.innerHTML = `<h3 class="offcanvas-title text-center" >¡Tu Carrito está Vacío!</h3>   
    <h4 class="offcanvas-title text-center">¿Por qué no revisas nuestra tienda y agregas algunos productos?</h4>
     `;
  }
};

const verTotal = (carrito) => {
  const total = carrito
    .reduce((acumulador, producto) => {
      return acumulador + producto.precio;
    }, 0)
    .toFixed(2);

  if (carrito.length > 0) {

    let totalyPagar = document.createElement("div");
    totalyPagar.className = "row";
    totalyPagar.innerHTML = `
    <div class="fontTitulo badge border shadow rounded text-decoration-none mt-1 fs-4">
    Total a Pagar: $${total} USD
    </div>
    <button type="button" href="www.mercadopago.com" class="btn fontTitulo mt-1 shadow btn-success fs-4">Pagar</button>        
    `;
    carritoContainer.appendChild(totalyPagar);
  } 
};

const agregarAlCarrito = (productoID) => {
  const productoAgregado = productosData.find(
    (producto) => producto.id === productoID
  );

  Swal.fire({
    title: `¿Agregar ${productoAgregado.nombre} al carrito?`,
    icon: "question",
    background: "#d09b71",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "No",
    cancelButtonColor: "red",
    confirmButtonColor: "green",
  }).then((resp) => {
    if (resp.isConfirmed) {
      productoAgregado.index = Date.now().toString(36);
      carritoCompra.push(productoAgregado);
      localStorage.setItem("carrito", JSON.stringify(carritoCompra));
      Toastify({
        text: `Nuevo producto en Carrito: " ${productoAgregado.nombre}" `,
        position: "right",
        gravity: "bottom",
        offset: {
          y: 95,
        },
        style: {
          background: "linear-gradient(258deg, #85FFBD 0%, #FFFB7D 100%)",
          color: "#000000",
          borderRadius: "10px",
        },
      }).showToast();

      Swal.fire({
        icon: "success",
        background: "#d09b71",
        title: "¡Porducto agregado!",
        showConfirmButton: false,
        timer: 1000,
      });

      verCarrito(carritoCompra);
      verCarritoNotificacion();
      verTotal(carritoCompra);
    } else {
      Swal.fire({
        icon: "error",
        background: "#d09b71",
        title: "¡Compra Cancelada!",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  });
};

const eliminarProductoCarrito = (productoIndex) => {
  let index = carritoCompra.findIndex(
    (producto) => producto.index === productoIndex
  );

  Swal.fire({
    title: `¿Estás seguiro que deseas eliminar ${carritoCompra[index].nombre} del carrito?`,
    icon: "warning",
    background: "#d09b71",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "No",
    cancelButtonColor: "green",
    confirmButtonColor: "orange",
  }).then((resp) => {
    if (resp.isConfirmed) {
      Toastify({
        text: `Producto Eliminado: " ${carritoCompra[index].nombre}" `,
        position: "right",
        gravity: "bottom",
        offset: {
          y: 95,
        },
        style: {
          background:
            "linear-gradient(111deg, #FBAB7E 0%, #F7CE68 33%, #f20e0e 100%)",
          color: "#000000",
          borderRadius: "10px",
        },
      }).showToast();

      if (index !== -1) {
        carritoCompra.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carritoCompra));
        Swal.fire({
          icon: "success",
          background: "#d09b71",
          title: "¡Porducto Eliminado!",
          showConfirmButton: false,
          timer: 1000,
        });

        verCarrito(carritoCompra);
        verTotal(carritoCompra);
        verCarritoNotificacion();
      }
    } else {
      Swal.fire({
        icon: "error",
        background: "#d09b71",
        title: "¡Porducto no Eliminado!",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  });
};

const verCarritoNotificacion = () => {
  botonCarritoNotificacion.innerHTML = " ";

  if (carritoCompra !== undefined) {
    let notificacion = document.createElement("div");
    notificacion.className = "notificacionCarrito";
    notificacion.innerText = `${carritoCompra.length}`;

    if (carritoCompra.length > 0) {
      console.log("hay objetos en el carrito");
      botonCarritoNotificacion.appendChild(notificacion);
    }
  }
};

const filtrarProductos = (categoriaProducto) => {
  switch (categoriaProducto) {
    case "Música":
      productosFiltrados = productosData.filter(
        (producto) => producto.categoria === "discografia"
      );
      mostrarProductos(productosFiltrados);
      break;
    case "Indumentaria":
      productosFiltrados = productosData.filter(
        (producto) => producto.categoria === "indumentaria"
      );
      mostrarProductos(productosFiltrados);
      break;
    case "Peliculas/Documentales":
      productosFiltrados = productosData.filter(
        (producto) => producto.categoria === "DVD"
      );
      mostrarProductos(productosFiltrados);
      break;
    case "Libros":
      productosFiltrados = productosData.filter(
        (producto) => producto.categoria === "libros"
      );
      mostrarProductos(productosFiltrados);
      break;
    case "Todo":
      mostrarProductos(productosData);
      break;
    default:
      mostrarProductos(productosData);
  }
};


buscar.oninput = (event) => {
  if (event.target.value === " ") {
    mostrarProductos(productosData);
  } else {
    productosFiltrados = productosData.filter((producto) =>
      producto.nombre.toLowerCase().includes(event.target.value.toLowerCase())
    );
    mostrarProductos(productosFiltrados);
  }
};

productosFilter.onchange = () => {
  filtrarProductos(productosFilter.value);
};

botonCarrito.onclick = () => {
  verCarrito(carritoCompra);
  verTotal(carritoCompra);
};


importarProductos();
verCarritoNotificacion();
verCarrito(carritoCompra);