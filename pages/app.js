let contador = 0;
let articulosCarrito = [];
let valorAnterior = 0;
const contenedorCarrito = document.querySelector('#listaCarrito tbody');



document.addEventListener('DOMContentLoaded', () => {

  fetch("./pages/data.json")
  .then((data)=>{
    //console.log(data)
    return data.json()
  })
  .then((productos)=>{
    //console.log(productos)
    renderProductos(productos)
  })
  .catch((err)=>{
    console.log(err)
  })

  articulosCarrito = JSON.parse(localStorage.getItem('datosCarrito')) || []
  carritoHTML()
  calcularTotal()
  calcularContador()

});




function renderProductos (productos) {
  const contenido = document.querySelector("#listaProductos")
  let html = ""

  productos.forEach(producto => {
    html += `
      <div class="cart">
        <a href="#"><img src="./img/${producto.img}" alt="${producto.titulo}"></a>
        <h2>${producto.titulo}</h2>
        <p class="precio">$ ${producto.precio}</p>
        <a href="#" class="botonCompra agregarCarrito">Agregar al carrito</a>
      </div>  
    `
  });

  contenido.innerHTML = html

  // seleccionar todos los botones "Agregar al carrito"
  const agregarCarrito = document.querySelectorAll('.agregarCarrito');
  agregarCarrito.forEach(boton => {
    boton.addEventListener("click", agregarProducto);
    boton.addEventListener("click", calcularTotal);
    boton.addEventListener("click", localSt);
    boton.addEventListener("click", alerta)
  });
  
}


const cartDrawer = document.querySelector("#carrito")
const abrirCarrito = document.querySelector(".submenu")
const cerrarCarrito = document.querySelector(".closeButton")


abrirCarrito.addEventListener("mousedown", openCart);
cerrarCarrito.addEventListener("click", closeCart);

function openCart(evt) {
  cartDrawer.classList.add("open");
}

function closeCart(evt) {
  cartDrawer.classList.remove("open");
}



function alerta (){
    Toastify({
        text: "producto agregado al carrito",     
        duration: 700,
        offset: {
            x: 15, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: 55 // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        style:{
            background: "white",
            color: "black"
        }
    }).showToast();
}


// ---------------- CARRITO DE COMPRAS ---------------- 

function carritoHTML(){
    articulosCarrito.forEach( producto => {
    // crear un nuevo elemento para el producto en el carrito
    const nuevoProducto = document.createElement('tr');
    nuevoProducto.innerHTML = `
      <td><img class="imgCart" src="${producto.imagen}" width="65" alt="${producto.nombre}" /></td>
      <td class="nombre">${producto.nombre}</td>
      <td class="precio">${producto.precio}</td>
      <td><input class="cantidad" type="number" inputmode="none" min="1" value="${producto.cantidad}"></td>
      <td>
      <a href="#" class="borrarProducto"> X </a>
      </td>
    `;

    // agregar el nuevo elemento del producto al carrito
    contenedorCarrito.appendChild(nuevoProducto);


    // Eventos boton Eliminar
    const botonEliminar = nuevoProducto.querySelector('.borrarProducto');
    botonEliminar.addEventListener('click', eliminarProducto);
    botonEliminar.addEventListener('click', calcularTotal)
    botonEliminar.addEventListener('click', localSt)

    // Eventos boton cantidad
    const botonCantidad = nuevoProducto.querySelector('.cantidad');
    botonCantidad.addEventListener('click', calcularTotal)
    botonCantidad.addEventListener('click', localSt)  
  })
}

// función para agregar un producto al carrito
function agregarProducto(evento) {
  evento.preventDefault();
  const boton = evento.target;
  const producto = boton.parentElement;

  //NUEVO
  const productosDatos = {
    nombre: producto.querySelector('h2').innerText,
    imagen: producto.querySelector('img').src,
    precio: producto.querySelector('.precio').innerText,
    cantidad: 1
    }
  
  // buscar si el producto ya existe en el carrito
  const productosEnCarrito = contenedorCarrito.querySelectorAll('tr');
  let productoExistente = false;

  productosEnCarrito.forEach(productoEnCarrito => {
    const nombreEnCarrito = productoEnCarrito.querySelector('.nombre').innerText;
    const precioEnCarrito = productoEnCarrito.querySelector('.precio').innerText;
    if (productosDatos.nombre === nombreEnCarrito && productosDatos.precio === precioEnCarrito) {
      // si el producto ya existe, aumentar cantidad
      const cantidadEnCarrito = productoEnCarrito.querySelector('.cantidad');
      cantidadEnCarrito.value = parseInt(cantidadEnCarrito.value) + 1;
      productosDatos.cantidad = cantidadEnCarrito
      productoExistente = true;
    }
  });


  articulosCarrito = [productosDatos]
  // si el producto no existe en el carrito, agregarlo
  if (!productoExistente) {

    carritoHTML()
  }
}

function eliminarProducto(evento) {
  evento.preventDefault();
  const boton = evento.target;
  const producto = boton.parentElement.parentElement;
  producto.remove();
}

function vaciarCarrito(){
  Swal.fire({
    title: '¿Seguro de querer vaciar el carrito?',
    icon: 'warning',
    iconColor: "red",
    showCancelButton: true,
    confirmButtonColor: 'gray',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, vaciar',
    cancelButtonText: 'Nooo, ups!'
  }).then((result) => {
    if (result.isConfirmed) {
      while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
      calcularTotal();
      localSt();
      formularioHtml.style.display = 'none'
      
      Swal.fire(
        'Carrito Vacio'
      )
    }
  })
}



// Eventos bontonVaciarCarrito
const botonVaciarCarrito = document.querySelector('#vaciarCarrito');
botonVaciarCarrito.addEventListener('click', vaciarCarrito);
botonVaciarCarrito.addEventListener('click', calcularTotal)
botonVaciarCarrito.addEventListener('click', localSt)


// -------------- CALCULAR TOTAL  --------------
function calcularTotal() {
    const productosCarrito = document.querySelectorAll('#listaCarrito tbody tr');
    let precioTotal = 0;

    productosCarrito.forEach(producto => {
      const cantidad = parseFloat(producto.querySelector('.cantidad').value);
      const precio = parseFloat(producto.querySelector('.precio').innerText.replace('$', ''));
      precioTotal += precio * cantidad ;

    });
  
    // actualizar el precio total en el HTML
    const precioTotalHTML = document.querySelector('#totalCarrito');
    precioTotalHTML.textContent = `Total a pagar: $${precioTotal}`;
}

// obtener todos los elementos de producto en el carrito
function guardarProdCarrito(){
  const productosCarrito = document.querySelectorAll('#listaCarrito tbody tr');
  articulosCarrito = [];
  productosCarrito.forEach(producto => {
    const nombre = producto.querySelector('.nombre').textContent;
    const imagen = producto.querySelector('img').src;
    const precio = producto.querySelector('.precio').textContent;
    const cantidad = parseFloat(producto.querySelector('.cantidad').value);
  
    // crear un objeto con la información del producto
    const productoCarritoGuardado = {
    nombre: nombre,
    imagen: imagen,
    precio: precio,
    cantidad: cantidad
    };
  
    // agregar el objeto del producto al array de productos en el carrito
    articulosCarrito.push(productoCarritoGuardado);
    }); 
}

// ---------------- CONTADOR ---------------- 
const contadorHTML = document.querySelector('#contadorCarrito');
const botonesCarrito = document.querySelector(".botonesCarritos")

function ocultarContador(){
    if (contadorHTML.innerHTML > 0) {
      contadorHTML.style.display = 'block';
      botonesCarrito.style.display = 'flex'
    } else {
      contadorHTML.style.display = 'none';
      botonesCarrito.style.display = 'none'
    }
}

function calcularContador() {
    const productosCarrito = document.querySelectorAll('#listaCarrito tbody tr');
    contador = 0;

    productosCarrito.forEach(producto => {
      const cantidad = parseFloat(producto.querySelector('.cantidad').value);
      contador += cantidad ;
    });

    
    contadorHTML.textContent = contador;
    ocultarContador()
}


// --------------------- LOCAL STORAGE --------------------
function localSt(){
  guardarProdCarrito()
  calcularContador()
  localStorage.setItem('datosCarrito', JSON.stringify(articulosCarrito));
}


// --------------------- FORMULARIO --------------------

const formularioHtml = document.querySelector(".formulario")
const finalizarCompra = document.querySelector(".irComprar")
finalizarCompra.addEventListener("click", formulario)

function formulario(evt){
  evt.preventDefault()
  closeCart()
  formularioHtml.style.display = 'block'
  formularioHtml.scrollIntoView({behavior: "smooth"})
}; 



/* const submitFormulario = document.querySelector(".botonProductoCompra")
let todosInputs = document.querySelectorAll(".inputObligatorio")
submitFormulario.addEventListener("click", validarForm)



function validarForm() {
  if (todosInputs !== ""){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Gracias por compra en unapatilla',
      showConfirmButton: false,
      timer:2500
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor completa todo los campos solicitados',
    })
  }
  
} */

const form = document.querySelector('.needs-validation');
const inputs = document.querySelectorAll('.inputObligatorio');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            //input.nextElementSibling.classList.add('invalid-feedback');
            //input.nextElementSibling.innerText = 'Este campo es obligatorio';
        } else {
            input.classList.remove('is-invalid');
            input.nextElementSibling.classList.remove('invalid-feedback');

            Swal.fire({

              icon: 'success',
              title: 'Gracias por comprar en unapatilla',
              footer: '<p>Nos estaremos comunicando por mail para concretar el pago y coordinar el envio.</p>',
              showConfirmButton: true
            })

        }
    });
});


