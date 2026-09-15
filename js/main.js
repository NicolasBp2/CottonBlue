/* =========================================================
   COTTON BLUE SHOP — main.js

   1. Configuración
   2. Productos temporales
   3. Menú móvil
   4. Buscador
   5. Catálogo dinámico
   6. Productos destacados
   7. Filtros + filtros desde URL
   8. Carrito
   9. Página dinámica de producto
   10. Página del carrito

   Los productos actuales son temporales.

   Más adelante serán reemplazados por productos
   obtenidos desde Supabase y administrados por
   el cliente desde su panel.
   ========================================================= */


/* =========================================================
   1. CONFIGURACIÓN
   ========================================================= */

const NUMERO_WHATSAPP =
    '573123346724';


/* =========================================================
   2. PRODUCTOS TEMPORALES
   ========================================================= */

const PRODUCTOS = [

    {
        id:
            'camiseta-oversize',

        nombre:
            'Camiseta Oversize',

        precio:
            89900,

        descripcion:
            'Camiseta oversize de algodón 100%, corte relajado y tela suave.',

        imagen:
            'https://picsum.photos/id/10/800/1000',

        categoria:
            'hombre-camisetas',

        oferta:
            false,

        tallas: [
            'XS',
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre:
                    'Negro',

                codigo:
                    '#111111'
            },

            {
                nombre:
                    'Blanco',

                codigo:
                    '#ffffff'
            },

            {
                nombre:
                    'Gris',

                codigo:
                    '#888888'
            }

        ]
    },


    {
        id:
            'pantalon-cargo',

        nombre:
            'Pantalón Cargo',

        precio:
            129900,

        descripcion:
            'Pantalón cargo de corte cómodo con bolsillos laterales.',

        imagen:
            'https://picsum.photos/id/20/800/1000',

        categoria:
            'hombre-pantalones',

        oferta:
            false,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre:
                    'Negro',

                codigo:
                    '#111111'
            },

            {
                nombre:
                    'Beige',

                codigo:
                    '#c9b18c'
            }

        ]
    },


    {
        id:
            'chaqueta-essential',

        nombre:
            'Chaqueta Essential',

        precio:
            179900,

        descripcion:
            'Chaqueta de estilo urbano para diferentes ocasiones.',

        imagen:
            'https://picsum.photos/id/30/800/1000',

        categoria:
            'hombre-chaquetas',

        oferta:
            false,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre:
                    'Negro',

                codigo:
                    '#111111'
            },

            {
                nombre:
                    'Gris',

                codigo:
                    '#777777'
            }

        ]
    },


    {
        id:
            'sudadera-classic',

        nombre:
            'Sudadera Classic',

        precio:
            99900,

        descripcion:
            'Sudadera cómoda de estilo clásico.',

        imagen:
            'https://picsum.photos/id/60/800/1000',

        categoria:
            'hombre-buzos',

        oferta:
            true,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre:
                    'Negro',

                codigo:
                    '#111111'
            },

            {
                nombre:
                    'Gris',

                codigo:
                    '#777777'
            }

        ]
    },


    {
        id:
            'short-deportivo',

        nombre:
            'Short Deportivo',

        precio:
            69900,

        descripcion:
            'Short ligero y cómodo para uso deportivo o casual.',

        imagen:
            'https://picsum.photos/id/70/800/1000',

        categoria:
            'hombre-shorts',

        oferta:
            true,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre:
                    'Negro',

                codigo:
                    '#111111'
            },

            {
                nombre:
                    'Azul',

                codigo:
                    '#294a7a'
            }

        ]
    },


    {
        id:
            'buzo-cerrado',

        nombre:
            'Buzo Cerrado',

        precio:
            119900,

        descripcion:
            'Buzo cerrado de tela suave y diseño cómodo.',

        imagen:
            'https://picsum.photos/id/80/800/1000',

        categoria:
            'mujer-chaquetas',

        oferta:
            false,

        tallas: [
            'XS',
            'S',
            'M',
            'L'
        ],

        colores: [

            {
                nombre:
                    'Negro',

                codigo:
                    '#111111'
            },

            {
                nombre:
                    'Blanco',

                codigo:
                    '#ffffff'
            }

        ]
    }

];


/* =========================================================
   3. MENÚ MÓVIL
   ========================================================= */

function toggleMenuMovil() {

    const menu =
        document.getElementById(
            'menu-principal'
        );


    if (!menu) return;


    menu.classList.toggle(
        'menu-abierto'
    );

}


/* =========================================================
   4. BUSCADOR
   ========================================================= */

function toggleBuscador() {

    const barra =
        document.getElementById(
            'buscador-barra'
        );

    const input =
        document.getElementById(
            'buscador-input'
        );

    if (!barra) return;


    barra.classList.toggle(
        'buscador-visible'
    );


    if (
        barra.classList.contains(
            'buscador-visible'
        )
    ) {

        if (input) {

            input.focus();

        }

    }

    else {

        if (input) {

            input.value = '';

        }


        /*
           Si estamos en catálogo,
           vuelve a mostrar el filtro actual.
        */

        if (
            document.getElementById(
                'catalogo-productos'
            )
        ) {

            aplicarFiltroDesdeURL();

        }

    }

}


/* =========================================================
   BUSCAR PRODUCTOS
   ========================================================= */

function filtrarBusqueda() {

    const input =
        document.getElementById(
            'buscador-input'
        );


    if (!input) return;


    const termino =
        input.value
            .trim()
            .toLowerCase();


    /*
       Si estamos en INDEX no filtramos todavía.

       El usuario escribe y al presionar ENTER
       lo mandamos al catálogo.
    */

    const catalogo =
        document.getElementById(
            'catalogo-productos'
        );


    if (!catalogo) {

        return;

    }


    /*
       Si estamos en catalogo.html,
       filtramos los productos directamente.
    */

    buscarEnCatalogo(
        termino
    );

}


/* =========================================================
   BUSCAR DENTRO DEL CATÁLOGO
   ========================================================= */

function buscarEnCatalogo(termino) {

    const productos =
        document.querySelectorAll(
            '#catalogo-productos .producto'
        );


    if (
        productos.length === 0
    ) return;


    let visibles =
        0;


    productos.forEach(
        producto => {

            const titulo =
                producto.querySelector(
                    'h3'
                );


            if (!titulo) return;


            const nombre =
                titulo.textContent
                    .trim()
                    .toLowerCase();


            const categoria =
                (
                    producto.dataset.categoria ||
                    ''
                )
                    .replaceAll(
                        '-',
                        ' '
                    )
                    .toLowerCase();


            /*
               Busca tanto por nombre como por categoría.

               Ejemplos:

               camiseta
               pantalon
               hombre
               chaqueta
               short
            */

            const coincide =
                nombre.includes(
                    termino
                ) ||

                categoria.includes(
                    termino
                );


            producto.style.display =
                coincide
                    ? ''
                    : 'none';


            if (coincide) {

                visibles++;

            }

        }
    );


    mostrarMensajeSinResultados(

        termino !== '' &&
        visibles === 0

    );

}


/* =========================================================
   ENVIAR BÚSQUEDA AL CATÁLOGO
   ========================================================= */

function enviarBusqueda() {

    const input =
        document.getElementById(
            'buscador-input'
        );


    if (!input) return;


    const termino =
        input.value.trim();


    if (!termino) return;


    /*
       Si ya estamos en el catálogo,
       simplemente buscamos.
    */

    if (
        document.getElementById(
            'catalogo-productos'
        )
    ) {

        buscarEnCatalogo(
            termino.toLowerCase()
        );


        actualizarBusquedaURL(
            termino
        );


        return;

    }


    /*
       Si estamos en index, producto o carrito,
       enviamos al usuario al catálogo.
    */

    window.location.href =
        `catalogo.html?buscar=${encodeURIComponent(
            termino
        )}`;

}


/* =========================================================
   DETECTAR ENTER EN EL BUSCADOR
   ========================================================= */

function inicializarBuscador() {

    const input =
        document.getElementById(
            'buscador-input'
        );


    if (!input) return;


    input.addEventListener(
        'keydown',
        evento => {

            if (
                evento.key === 'Enter'
            ) {

                evento.preventDefault();

                enviarBusqueda();

            }

        }
    );


    /*
       Si llegamos al catálogo mediante:

       catalogo.html?buscar=camiseta

       rellenamos el buscador y mostramos
       automáticamente los resultados.
    */

    const catalogo =
        document.getElementById(
            'catalogo-productos'
        );


    if (!catalogo) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const busqueda =
        parametros.get(
            'buscar'
        );


    if (!busqueda) return;


    input.value =
        busqueda;


    buscarEnCatalogo(
        busqueda
            .trim()
            .toLowerCase()
    );

}


/* =========================================================
   ACTUALIZAR URL DE BÚSQUEDA
   ========================================================= */

function actualizarBusquedaURL(
    termino
) {

    const url =
        new URL(
            window.location.href
        );


    if (!termino) {

        url.searchParams.delete(
            'buscar'
        );

    }

    else {

        url.searchParams.set(
            'buscar',
            termino
        );


        /*
           Si hacemos una búsqueda textual,
           quitamos el filtro anterior para evitar
           conflictos.
        */

        url.searchParams.delete(
            'filtro'
        );

    }


    window.history.replaceState(
        {},
        '',
        url
    );

}


/* =========================================================
   MENSAJE SIN RESULTADOS
   ========================================================= */

function mostrarMensajeSinResultados(
    mostrar
) {

    const grid =
        document.querySelector(
            '.productos-grid'
        );


    if (!grid) return;


    let mensaje =
        document.getElementById(
            'sin-resultados'
        );


    if (
        mostrar &&
        !mensaje
    ) {

        mensaje =
            document.createElement(
                'p'
            );


        mensaje.id =
            'sin-resultados';


        mensaje.className =
            'sin-resultados';


        mensaje.textContent =
            'No encontramos productos que coincidan con tu búsqueda.';


        grid.insertAdjacentElement(
            'afterend',
            mensaje
        );

    }


    if (mensaje) {

        mensaje.style.display =
            mostrar
                ? 'block'
                : 'none';

    }

}

/* =========================================================
   5. GENERAR CATÁLOGO
   ========================================================= */

function generarCatalogo() {

    const contenedor =
        document.getElementById(
            'catalogo-productos'
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        '';


    PRODUCTOS.forEach(
        producto => {


            const articulo =
                document.createElement(
                    'article'
                );


            articulo.className =
                'producto';


            articulo.dataset.categoria =
                producto.categoria;


            articulo.dataset.oferta =
                producto.oferta
                    ? 'true'
                    : 'false';


            articulo.innerHTML = `

                <a
                    href="producto.html?id=${producto.id}"
                    class="producto-link"
                >

                    <div
                        class="producto-imagen"
                        style="background-image: url('${producto.imagen}');"
                    >

                        ${
                            producto.oferta
                                ? '<span class="etiqueta">Oferta</span>'
                                : ''
                        }

                    </div>


                    <h3>
                        ${producto.nombre}
                    </h3>


                    <p>
                        ${formatearPrecio(
                            producto.precio
                        )}
                    </p>


                </a>

            `;


            contenedor.appendChild(
                articulo
            );

        }
    );

}


/* =========================================================
   6. PRODUCTOS DESTACADOS
   ========================================================= */

function generarProductosDestacados() {

    const contenedor =
        document.getElementById(
            'productos-destacados'
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        '';


    /*
       TEMPORAL:

       Los primeros 3 son destacados.

       Más adelante el cliente podrá elegirlos
       desde el panel administrativo.
    */

    const destacados =
        PRODUCTOS.slice(
            0,
            3
        );


    destacados.forEach(
        (producto, indice) => {


            const articulo =
                document.createElement(
                    'article'
                );


            articulo.className =
                'producto';


            articulo.innerHTML = `

                <a
                    href="producto.html?id=${producto.id}"
                    class="producto-link"
                >

                    <div
                        class="producto-imagen"
                        style="background-image: url('${producto.imagen}');"
                    >

                        ${
                            indice === 0
                                ? '<span class="etiqueta">Nuevo</span>'
                                : ''
                        }

                    </div>


                    <h3>
                        ${producto.nombre}
                    </h3>


                    <p>
                        ${formatearPrecio(
                            producto.precio
                        )}
                    </p>


                </a>

            `;


            contenedor.appendChild(
                articulo
            );

        }
    );

}


/* =========================================================
   7. FILTROS DEL CATÁLOGO
   ========================================================= */

function inicializarFiltros() {

    const botones =
        document.querySelectorAll(
            '.filtro, .filtro-sub'
        );


    botones.forEach(
        boton => {


            boton.addEventListener(
                'click',
                () => {


                    aplicarFiltro(
                        boton.dataset.filtro
                    );


                    marcarFiltroActivo(
                        boton.dataset.filtro
                    );


                    /*
                       Actualizamos la URL sin recargar.
                    */

                    actualizarFiltroURL(
                        boton.dataset.filtro
                    );

                }
            );


        }
    );

}


/* =========================================================
   APLICAR FILTRO
   ========================================================= */

function aplicarFiltro(filtro) {

    const productos =
        document.querySelectorAll(
            '#catalogo-productos .producto'
        );


    if (
        productos.length === 0
    ) {

        return;

    }


    productos.forEach(
        producto => {


            const categoria =
                producto.dataset.categoria;


            const esOferta =
                producto.dataset.oferta ===
                'true';


            let mostrar =
                true;


            /* TODOS */

            if (
                !filtro ||
                filtro === 'todos'
            ) {

                mostrar =
                    true;

            }


            /* HOMBRE */

            else if (
                filtro === 'hombre'
            ) {

                mostrar =
                    categoria.startsWith(
                        'hombre-'
                    );

            }


            /* MUJER */

            else if (
                filtro === 'mujer'
            ) {

                mostrar =
                    categoria.startsWith(
                        'mujer-'
                    );

            }


            /* OFERTAS */

            else if (
                filtro === 'ofertas'
            ) {

                mostrar =
                    esOferta;

            }


            /* SUBCATEGORÍA */

            else {

                mostrar =
                    categoria === filtro;

            }


            producto.style.display =
                mostrar
                    ? ''
                    : 'none';

        }
    );


    const input =
        document.getElementById(
            'buscador-input'
        );


    if (input) {

        input.value =
            '';

    }


    mostrarMensajeSinResultados(
        false
    );

}


/* =========================================================
   MARCAR FILTRO ACTIVO
   ========================================================= */

function marcarFiltroActivo(filtro) {

    const botones =
        document.querySelectorAll(
            '.filtro, .filtro-sub'
        );


    botones.forEach(
        boton => {

            boton.classList.remove(
                'filtro-activo'
            );

        }
    );


    const botonActivo =
        document.querySelector(
            `[data-filtro="${filtro}"]`
        );


    if (botonActivo) {

        botonActivo.classList.add(
            'filtro-activo'
        );

    }

}


/* =========================================================
   ACTUALIZAR URL DEL FILTRO
   ========================================================= */

function actualizarFiltroURL(filtro) {

    const url =
        new URL(
            window.location.href
        );


    if (
        !filtro ||
        filtro === 'todos'
    ) {

        url.searchParams.delete(
            'filtro'
        );

    }

    else {

        url.searchParams.set(
            'filtro',
            filtro
        );

    }


    window.history.replaceState(
        {},
        '',
        url
    );

}


/* =========================================================
   LEER FILTRO DESDE LA URL
   ========================================================= */

function aplicarFiltroDesdeURL() {

    const contenedor =
        document.getElementById(
            'catalogo-productos'
        );


    /*
       Solo debe ejecutarse en catalogo.html.
    */

    if (!contenedor) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const filtro =
        parametros.get(
            'filtro'
        );


    if (!filtro) {

        aplicarFiltro(
            'todos'
        );


        marcarFiltroActivo(
            'todos'
        );


        return;

    }


    aplicarFiltro(
        filtro
    );


    marcarFiltroActivo(
        filtro
    );


    /*
       Si el filtro pertenece a Hombre o Mujer,
       abrimos automáticamente el <details>.
    */

    if (
        filtro.startsWith(
            'hombre-'
        )
    ) {

        const grupos =
            document.querySelectorAll(
                '.filtro-grupo'
            );


        if (grupos[0]) {

            grupos[0].open =
                true;

        }

    }


    if (
        filtro.startsWith(
            'mujer-'
        )
    ) {

        const grupos =
            document.querySelectorAll(
                '.filtro-grupo'
            );


        if (grupos[1]) {

            grupos[1].open =
                true;

        }

    }

}


/* =========================================================
   8. CARRITO
   ========================================================= */

function obtenerCarrito() {

    return (

        JSON.parse(

            localStorage.getItem(
                'cottonCarrito'
            )

        ) || []

    );

}


/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function guardarCarrito(carrito) {

    localStorage.setItem(

        'cottonCarrito',

        JSON.stringify(
            carrito
        )

    );


    actualizarContadorCarrito();

}


/* =========================================================
   CONTADOR
   ========================================================= */

function actualizarContadorCarrito() {

    const contador =
        document.getElementById(
            'carrito-contador'
        );


    if (!contador) return;


    const carrito =
        obtenerCarrito();


    const total =
        carrito.reduce(

            (suma, item) =>
                suma + item.cantidad,

            0

        );


    contador.textContent =
        total;


    contador.style.display =
        total > 0
            ? 'inline-flex'
            : 'none';

}


/* =========================================================
   AGREGAR AL CARRITO
   ========================================================= */

function agregarAlCarrito(producto) {

    const carrito =
        obtenerCarrito();


    const existente =
        carrito.find(
            item =>

                item.id ===
                    producto.id &&

                item.talla ===
                    producto.talla &&

                item.color ===
                    producto.color
        );


    if (existente) {

        existente.cantidad++;

    }

    else {

        carrito.push({

            ...producto,

            cantidad:
                1

        });

    }


    guardarCarrito(
        carrito
    );


    mostrarAvisoCarrito();

}


/* =========================================================
   AVISO
   ========================================================= */

function mostrarAvisoCarrito() {

    const aviso =
        document.getElementById(
            'aviso-carrito'
        );


    if (!aviso) return;


    aviso.classList.add(
        'aviso-visible'
    );


    clearTimeout(
        aviso._temporizador
    );


    aviso._temporizador =
        setTimeout(
            () => {


                aviso.classList.remove(
                    'aviso-visible'
                );


            },
            2200
        );

}


/* =========================================================
   PRECIO
   ========================================================= */

function formatearPrecio(numero) {

    return (

        '$' +

        Number(numero)
            .toLocaleString(
                'es-CO'
            )

    );

}


/* =========================================================
   9. PÁGINA DINÁMICA DE PRODUCTO
   ========================================================= */

function inicializarProducto() {

    const detalle =
        document.getElementById(
            'producto-detalle'
        );


    if (!detalle) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get(
            'id'
        );


    const producto =
        PRODUCTOS.find(
            item =>
                item.id === id
        );


    if (!producto) {


        const nombre =
            document.getElementById(
                'producto-nombre'
            );


        const precio =
            document.getElementById(
                'producto-precio'
            );


        const descripcion =
            document.getElementById(
                'producto-descripcion'
            );


        const imagen =
            document.getElementById(
                'producto-imagen'
            );


        if (nombre) {

            nombre.textContent =
                'Producto no encontrado';

        }


        if (precio) {

            precio.textContent =
                '';

        }


        if (descripcion) {

            descripcion.textContent =
                'El producto que intentas abrir no existe o ya no está disponible.';

        }


        if (imagen) {

            imagen.style.backgroundImage =
                'none';

        }


        return;

    }


    detalle.dataset.productoId =
        producto.id;


    detalle.dataset.productoNombre =
        producto.nombre;


    detalle.dataset.productoPrecio =
        producto.precio;


    detalle.dataset.productoImagen =
        producto.imagen;


    /* NOMBRE */

    const nombre =
        document.getElementById(
            'producto-nombre'
        );


    if (nombre) {

        nombre.textContent =
            producto.nombre;

    }


    /* MIGA */

    const miga =
        document.getElementById(
            'miga-producto'
        );


    if (miga) {

        miga.textContent =
            producto.nombre;

    }


    /* PRECIO */

    const precio =
        document.getElementById(
            'producto-precio'
        );


    if (precio) {

        precio.textContent =
            formatearPrecio(
                producto.precio
            );

    }


    /* DESCRIPCIÓN */

    const descripcion =
        document.getElementById(
            'producto-descripcion'
        );


    if (descripcion) {

        descripcion.textContent =
            producto.descripcion;

    }


    /* IMAGEN */

    const imagen =
        document.getElementById(
            'producto-imagen'
        );


    if (imagen) {

        imagen.style.backgroundImage =
            `url('${producto.imagen}')`;

    }


    document.title =
        `${producto.nombre} - Cotton Blue Shop`;


    /* =====================================================
       COLORES
       ===================================================== */

    const contenedorColores =
        document.getElementById(
            'producto-colores'
        );


    if (contenedorColores) {


        contenedorColores.innerHTML =
            '';


        producto.colores.forEach(
            (color, indice) => {


                const input =
                    document.createElement(
                        'input'
                    );


                input.type =
                    'radio';


                input.name =
                    'color';


                input.id =
                    `color-${indice}`;


                input.className =
                    'color-input';


                input.value =
                    color.nombre;


                if (
                    indice === 0
                ) {

                    input.checked =
                        true;

                }


                const label =
                    document.createElement(
                        'label'
                    );


                label.htmlFor =
                    input.id;


                label.className =
                    'color-opcion';


                label.setAttribute(
                    'aria-label',
                    color.nombre
                );


                label.style.backgroundColor =
                    color.codigo;


                contenedorColores.appendChild(
                    input
                );


                contenedorColores.appendChild(
                    label
                );


            }
        );

    }


    /* =====================================================
       TALLAS
       ===================================================== */

    const contenedorTallas =
        document.getElementById(
            'producto-tallas'
        );


    if (contenedorTallas) {


        contenedorTallas.innerHTML =
            '';


        producto.tallas.forEach(
            (talla, indice) => {


                const input =
                    document.createElement(
                        'input'
                    );


                input.type =
                    'radio';


                input.name =
                    'talla';


                input.id =
                    `talla-${indice}`;


                input.className =
                    'talla-input';


                input.value =
                    talla;


                if (
                    indice === 0
                ) {

                    input.checked =
                        true;

                }


                const label =
                    document.createElement(
                        'label'
                    );


                label.htmlFor =
                    input.id;


                label.className =
                    'talla-opcion';


                label.textContent =
                    talla;


                contenedorTallas.appendChild(
                    input
                );


                contenedorTallas.appendChild(
                    label
                );


            }
        );

    }


    /* =====================================================
       AGREGAR AL CARRITO
       ===================================================== */

    const botonComprar =
        document.querySelector(
            '.producto-comprar'
        );


    if (botonComprar) {


        botonComprar.addEventListener(
            'click',
            evento => {


                evento.preventDefault();


                const talla =
                    document.querySelector(
                        'input[name="talla"]:checked'
                    );


                const color =
                    document.querySelector(
                        'input[name="color"]:checked'
                    );


                agregarAlCarrito({

                    id:
                        producto.id,

                    nombre:
                        producto.nombre,

                    precio:
                        producto.precio,

                    imagen:
                        producto.imagen,

                    talla:
                        talla
                            ? talla.value
                            : '',

                    color:
                        color
                            ? color.value
                            : ''

                });


            }
        );

    }


    /* =====================================================
       WHATSAPP DEL PRODUCTO
       ===================================================== */

    const botonWhatsapp =
        document.querySelector(
            '.producto-whatsapp'
        );


    if (botonWhatsapp) {


        botonWhatsapp.addEventListener(
            'click',
            evento => {


                evento.preventDefault();


                const talla =
                    document.querySelector(
                        'input[name="talla"]:checked'
                    );


                const color =
                    document.querySelector(
                        'input[name="color"]:checked'
                    );


                const mensaje =

                    `Hola, quiero consultar por ${producto.nombre}. ` +

                    `Talla: ${
                        talla
                            ? talla.value
                            : 'Sin seleccionar'
                    }. ` +

                    `Color: ${
                        color
                            ? color.value
                            : 'Sin seleccionar'
                    }.`;


                abrirWhatsapp(
                    mensaje
                );


            }
        );

    }

}


/* =========================================================
   ABRIR WHATSAPP
   ========================================================= */

function abrirWhatsapp(mensaje) {

    const url =

        `https://wa.me/${NUMERO_WHATSAPP}` +

        `?text=${encodeURIComponent(
            mensaje
        )}`;


    window.open(
        url,
        '_blank'
    );

}


/* =========================================================
   10. CARRITO.HTML
   ========================================================= */

function renderizarCarrito() {

    const contenedor =
        document.getElementById(
            'carrito-items'
        );


    if (!contenedor) return;


    const vacio =
        document.getElementById(
            'carrito-vacio'
        );


    const resumen =
        document.getElementById(
            'carrito-resumen'
        );


    const carrito =
        obtenerCarrito();


    contenedor.innerHTML =
        '';


    if (
        carrito.length === 0
    ) {


        if (vacio) {

            vacio.style.display =
                'block';

        }


        if (resumen) {

            resumen.style.display =
                'none';

        }


        return;

    }


    if (vacio) {

        vacio.style.display =
            'none';

    }


    if (resumen) {

        resumen.style.display =
            'flex';

    }


    let total =
        0;


    carrito.forEach(
        (item, indice) => {


            total +=

                item.precio *
                item.cantidad;


            const fila =
                document.createElement(
                    'div'
                );


            fila.className =
                'carrito-item';


            fila.innerHTML = `

                <div
                    class="carrito-item-imagen"
                    style="background-image: url('${item.imagen}')"
                >
                </div>


                <div class="carrito-item-info">

                    <h3>
                        ${item.nombre}
                    </h3>


                    <p>
                        Talla ${item.talla}
                        ·
                        Color ${item.color}
                    </p>


                    <p class="carrito-item-precio">

                        ${formatearPrecio(
                            item.precio
                        )}

                    </p>


                </div>


                <div class="carrito-item-cantidad">


                    <button
                        type="button"
                        class="boton-menos"
                    >
                        -
                    </button>


                    <span>
                        ${item.cantidad}
                    </span>


                    <button
                        type="button"
                        class="boton-mas"
                    >
                        +
                    </button>


                </div>


                <button
                    type="button"
                    class="carrito-item-eliminar"
                >
                    Eliminar
                </button>

            `;


            fila
                .querySelector(
                    '.boton-menos'
                )
                .addEventListener(
                    'click',
                    () => {


                        cambiarCantidad(
                            indice,
                            -1
                        );


                    }
                );


            fila
                .querySelector(
                    '.boton-mas'
                )
                .addEventListener(
                    'click',
                    () => {


                        cambiarCantidad(
                            indice,
                            1
                        );


                    }
                );


            fila
                .querySelector(
                    '.carrito-item-eliminar'
                )
                .addEventListener(
                    'click',
                    () => {


                        eliminarDelCarrito(
                            indice
                        );


                    }
                );


            contenedor.appendChild(
                fila
            );


        }
    );


    const totalElemento =
        document.getElementById(
            'carrito-total'
        );


    if (totalElemento) {

        totalElemento.textContent =
            formatearPrecio(
                total
            );

    }

}


/* =========================================================
   CAMBIAR CANTIDAD
   ========================================================= */

function cambiarCantidad(
    indice,
    cantidad
) {

    const carrito =
        obtenerCarrito();


    if (!carrito[indice]) {

        return;

    }


    carrito[indice].cantidad +=
        cantidad;


    if (
        carrito[indice].cantidad <= 0
    ) {

        carrito.splice(
            indice,
            1
        );

    }


    guardarCarrito(
        carrito
    );


    renderizarCarrito();

}


/* =========================================================
   ELIMINAR
   ========================================================= */

function eliminarDelCarrito(indice) {

    const carrito =
        obtenerCarrito();


    carrito.splice(
        indice,
        1
    );


    guardarCarrito(
        carrito
    );


    renderizarCarrito();

}


/* =========================================================
   FINALIZAR PEDIDO
   ========================================================= */

function finalizarPedidoPorWhatsapp() {

    const carrito =
        obtenerCarrito();


    if (
        carrito.length === 0
    ) return;


    let total =
        0;


    let mensaje =
        'Hola, quiero hacer este pedido:\n\n';


    carrito.forEach(
        item => {


            const subtotal =

                item.precio *
                item.cantidad;


            total +=
                subtotal;


            mensaje +=

                `• ${item.nombre}\n` +

                `Talla: ${item.talla}\n` +

                `Color: ${item.color}\n` +

                `Cantidad: ${item.cantidad}\n` +

                `Subtotal: ${formatearPrecio(
                    subtotal
                )}\n\n`;


        }
    );


    mensaje +=

        `Total: ${formatearPrecio(
            total
        )}`;


    abrirWhatsapp(
        mensaje
    );

}


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        actualizarContadorCarrito();


        /* Generamos catálogo */

        generarCatalogo();


        /* Generamos destacados del index */

        generarProductosDestacados();


        /* Activamos filtros */

        inicializarFiltros();


        /* Aplicamos filtro desde URL */

        aplicarFiltroDesdeURL();


        /* Activamos el buscador */

        inicializarBuscador();


        /* Página individual */

        inicializarProducto();


        /* Carrito */

        renderizarCarrito();


        /* Finalizar pedido */

        const botonFinalizar =
            document.getElementById(
                'boton-finalizar-whatsapp'
            );


        if (botonFinalizar) {

            botonFinalizar.addEventListener(
                'click',
                finalizarPedidoPorWhatsapp
            );

        }

    }
);