/* =========================================================
   COTTON BLUE SHOP — main.js
   =========================================================

   FUNCIONES PRINCIPALES

   1. Configuración
   2. Productos locales de respaldo
   3. Menú móvil
   4. Buscador
   5. Catálogo
   6. Productos destacados
   7. Filtros
   8. Carrito
   9. Producto individual
   10. Variantes
   11. WhatsApp
   12. Página carrito
   13. Inicialización

   IMPORTANTE:

   Los productos locales todavía existen como respaldo.

   La fuente principal de productos es Supabase.
   ========================================================= */


/* =========================================================
   1. CONFIGURACIÓN
   ========================================================= */

const NUMERO_WHATSAPP = '573126881081';

const CLAVE_CARRITO = 'cottonCarrito';


/* =========================================================
   2. PRODUCTOS LOCALES DE RESPALDO
   ========================================================= */

const PRODUCTOS = [

    {
        id: 'camiseta-oversize',

        nombre: 'Camiseta Oversize',

        precio: 89900,

        descripcion:
            'Camiseta oversize de algodón 100%, corte relajado y tela suave.',

        imagen:
            'https://picsum.photos/id/10/800/1000',

        categoria:
            'hombre-camisetas',

        oferta: false,

        tallas: [
            'XS',
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre: 'Negro',
                codigo: '#111111'
            },

            {
                nombre: 'Blanco',
                codigo: '#ffffff'
            },

            {
                nombre: 'Gris',
                codigo: '#888888'
            }

        ]
    },


    {
        id: 'pantalon-cargo',

        nombre: 'Pantalón Cargo',

        precio: 129900,

        descripcion:
            'Pantalón cargo de corte cómodo con bolsillos laterales.',

        imagen:
            'https://picsum.photos/id/20/800/1000',

        categoria:
            'hombre-pantalones',

        oferta: false,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre: 'Negro',
                codigo: '#111111'
            },

            {
                nombre: 'Beige',
                codigo: '#c9b18c'
            }

        ]
    },


    {
        id: 'chaqueta-essential',

        nombre: 'Chaqueta Essential',

        precio: 179900,

        descripcion:
            'Chaqueta de estilo urbano para diferentes ocasiones.',

        imagen:
            'https://picsum.photos/id/30/800/1000',

        categoria:
            'hombre-chaquetas',

        oferta: false,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre: 'Negro',
                codigo: '#111111'
            },

            {
                nombre: 'Gris',
                codigo: '#777777'
            }

        ]
    },


    {
        id: 'sudadera-classic',

        nombre: 'Sudadera Classic',

        precio: 99900,

        descripcion:
            'Sudadera cómoda de estilo clásico.',

        imagen:
            'https://picsum.photos/id/60/800/1000',

        categoria:
            'hombre-buzos',

        oferta: true,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre: 'Negro',
                codigo: '#111111'
            },

            {
                nombre: 'Gris',
                codigo: '#777777'
            }

        ]
    },


    {
        id: 'short-deportivo',

        nombre: 'Short Deportivo',

        precio: 69900,

        descripcion:
            'Short ligero y cómodo para uso deportivo o casual.',

        imagen:
            'https://picsum.photos/id/70/800/1000',

        categoria:
            'hombre-shorts',

        oferta: true,

        tallas: [
            'S',
            'M',
            'L',
            'XL'
        ],

        colores: [

            {
                nombre: 'Negro',
                codigo: '#111111'
            },

            {
                nombre: 'Azul',
                codigo: '#294a7a'
            }

        ]
    },


    {
        id: 'buzo-cerrado',

        nombre: 'Buzo Cerrado',

        precio: 119900,

        descripcion:
            'Buzo cerrado de tela suave y diseño cómodo.',

        imagen:
            'https://picsum.photos/id/80/800/1000',

        categoria:
            'mujer-chaquetas',

        oferta: false,

        tallas: [
            'XS',
            'S',
            'M',
            'L'
        ],

        colores: [

            {
                nombre: 'Negro',
                codigo: '#111111'
            },

            {
                nombre: 'Blanco',
                codigo: '#ffffff'
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


    const catalogo =
        document.getElementById(
            'catalogo-productos'
        );


    /*
       Si estamos en index, no filtramos ahí.
       El usuario puede presionar Enter y será
       enviado al catálogo.
    */

    if (!catalogo) return;


    buscarEnCatalogo(
        termino
    );

}


/* =========================================================
   BUSCAR DENTRO DEL CATÁLOGO
   ========================================================= */

function buscarEnCatalogo(
    termino
) {

    const productos =
        document.querySelectorAll(
            '#catalogo-productos .producto'
        );


    if (
        productos.length === 0
    ) {

        return;

    }


    let visibles = 0;


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


            const coincide =
                termino === '' ||

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
   ENVIAR BÚSQUEDA
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
       Si estamos en catálogo,
       buscamos directamente.
    */

    if (
        document.getElementById(
            'catalogo-productos'
        )
    ) {

        actualizarBusquedaURL(
            termino
        );


        buscarEnCatalogo(
            termino.toLowerCase()
        );


        return;

    }


    /*
       Desde index, producto o carrito
       mandamos al catálogo.
    */

    window.location.href =

        `catalogo.html?buscar=${encodeURIComponent(
            termino
        )}`;

}


/* =========================================================
   INICIALIZAR BUSCADOR
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
   URL DEL BUSCADOR
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
            '#catalogo-productos'
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
   5. CATÁLOGO DESDE SUPABASE
   ========================================================= */

async function generarCatalogo() {

    const contenedor =
        document.getElementById(
            'catalogo-productos'
        );


    if (!contenedor) return;


    contenedor.innerHTML = `

        <p class="catalogo-cargando">
            Cargando productos...
        </p>

    `;


    let productos = null;


    if (
        typeof window.obtenerProductosSupabase ===
        'function'
    ) {

        productos =
            await window
                .obtenerProductosSupabase();

    }


    /*
       Si Supabase falla,
       usamos productos locales.
    */

    if (
        !productos ||
        productos.length === 0
    ) {

        console.warn(
            'Usando productos locales como respaldo.'
        );


        productos =
            PRODUCTOS;

    }


    contenedor.innerHTML = '';


    productos.forEach(
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

articulo.dataset.destacado =
    producto.destacado
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

                                ? `
                                    <span class="etiqueta">
                                        Oferta
                                    </span>
                                `

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


    /*
       Si existe búsqueda,
       priorizamos búsqueda.
    */

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const busqueda =
        parametros.get(
            'buscar'
        );


    if (busqueda) {

        buscarEnCatalogo(
            busqueda
                .trim()
                .toLowerCase()
        );

    }

    else {

        aplicarFiltroDesdeURL();

    }

}


/* =========================================================
   6. PRODUCTOS DESTACADOS
   ========================================================= */

async function generarProductosDestacados() {

    const contenedor =
        document.getElementById(
            'productos-destacados'
        );


    if (!contenedor) return;


    contenedor.innerHTML = `

        <p class="catalogo-cargando">
            Cargando productos...
        </p>

    `;


    let destacados = null;


    if (
        typeof window.obtenerProductosDestacadosSupabase ===
        'function'
    ) {

        destacados =
            await window
                .obtenerProductosDestacadosSupabase();

    }


    /*
       Respaldo local.
    */

    if (
        !destacados ||
        destacados.length === 0
    ) {

        console.warn(
            'No se encontraron destacados en Supabase. Usando respaldo local.'
        );


        destacados =
            PRODUCTOS.slice(
                0,
                3
            );

    }


    contenedor.innerHTML = '';


    destacados.forEach(
        producto => {

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

                        <span class="etiqueta">
                            Destacado
                        </span>

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
   7. FILTROS
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

                    const filtro =
                        boton.dataset.filtro;


                    aplicarFiltro(
                        filtro
                    );


                    marcarFiltroActivo(
                        filtro
                    );


                    actualizarFiltroURL(
                        filtro
                    );

                }
            );

        }
    );

}


/* =========================================================
   APLICAR FILTRO
   ========================================================= */
function aplicarFiltro(
    filtro
) {

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
                producto.dataset.categoria ||
                '';


            const esOferta =
                producto.dataset.oferta ===
                'true';


            const esDestacado =
                producto.dataset.destacado ===
                'true';


            let mostrar = true;


            /* =====================================================
               TODOS
               ===================================================== */

            if (
                !filtro ||
                filtro === 'todos'
            ) {

                mostrar = true;

            }


            /* =====================================================
               HOMBRE
               Incluye productos de hombre + unisex
               ===================================================== */

            else if (
                filtro === 'hombre'
            ) {

                mostrar =
                    categoria.startsWith('hombre-') ||
                    categoria.startsWith('unisex-');

            }


            /* =====================================================
               MUJER
               Incluye productos de mujer + unisex
               ===================================================== */

            else if (
                filtro === 'mujer'
            ) {

                mostrar =
                    categoria.startsWith('mujer-') ||
                    categoria.startsWith('unisex-');

            }


            /* =====================================================
               UNISEX
               ===================================================== */

            else if (
                filtro === 'unisex'
            ) {

                mostrar =
                    categoria.startsWith('unisex-');

            }


            /* =====================================================
               OFERTAS GENERALES
               ===================================================== */

            else if (
                filtro === 'ofertas'
            ) {

                mostrar =
                    esOferta;

            }


            /* =====================================================
               DESTACADOS GENERALES
               ===================================================== */

            else if (
                filtro === 'destacados'
            ) {

                mostrar =
                    esDestacado;

            }


            /* =====================================================
               DESTACADOS HOMBRE
               Hombre + unisex
               ===================================================== */

            else if (
                filtro === 'hombre-destacados'
            ) {

                mostrar =
                    (
                        categoria.startsWith('hombre-') ||
                        categoria.startsWith('unisex-')
                    ) &&
                    esDestacado;

            }


            /* =====================================================
               DESTACADOS MUJER
               Mujer + unisex
               ===================================================== */

            else if (
                filtro === 'mujer-destacados'
            ) {

                mostrar =
                    (
                        categoria.startsWith('mujer-') ||
                        categoria.startsWith('unisex-')
                    ) &&
                    esDestacado;

            }


            /* =====================================================
               OFERTAS HOMBRE
               Hombre + unisex
               ===================================================== */

            else if (
                filtro === 'hombre-ofertas'
            ) {

                mostrar =
                    (
                        categoria.startsWith('hombre-') ||
                        categoria.startsWith('unisex-')
                    ) &&
                    esOferta;

            }


            /* =====================================================
               OFERTAS MUJER
               Mujer + unisex
               ===================================================== */

            else if (
                filtro === 'mujer-ofertas'
            ) {

                mostrar =
                    (
                        categoria.startsWith('mujer-') ||
                        categoria.startsWith('unisex-')
                    ) &&
                    esOferta;

            }


            /* =====================================================
               SUBCATEGORÍAS
               Ejemplo:
               hombre-camisetas
               mujer-chaquetas
               unisex-buzos
               ===================================================== */

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

        input.value = '';

    }


    mostrarMensajeSinResultados(
        false
    );

}
/* =========================================================
   MARCAR FILTRO ACTIVO
   ========================================================= */

function marcarFiltroActivo(
    filtro
) {

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
   ACTUALIZAR URL DE FILTRO
   ========================================================= */

function actualizarFiltroURL(
    filtro
) {

    const url =
        new URL(
            window.location.href
        );


    url.searchParams.delete(
        'buscar'
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
   FILTRO DESDE URL
   ========================================================= */

function aplicarFiltroDesdeURL() {

    const contenedor =
        document.getElementById(
            'catalogo-productos'
        );


    if (!contenedor) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const filtro =
        parametros.get(
            'filtro'
        );


    const busqueda =
        parametros.get(
            'buscar'
        );


    /*
       Si estamos buscando,
       no aplicamos otro filtro.
    */

    if (busqueda) return;


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
       Abrir automáticamente
       grupo Hombre o Mujer.
    */

    const grupos =
        document.querySelectorAll(
            '.filtro-grupo'
        );


    if (
        filtro.startsWith(
            'hombre-'
        )
    ) {

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

    try {

        return (

            JSON.parse(

                localStorage.getItem(
                    CLAVE_CARRITO
                )

            ) || []

        );

    }

    catch (error) {

        console.error(
            'Error leyendo el carrito:',
            error
        );


        return [];

    }

}


/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function guardarCarrito(
    carrito
) {

    localStorage.setItem(

        CLAVE_CARRITO,

        JSON.stringify(
            carrito
        )

    );


    actualizarContadorCarrito();

}


/* =========================================================
   CONTADOR DEL CARRITO
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

            (
                suma,
                item
            ) =>

                suma +
                Number(
                    item.cantidad || 0
                ),

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

function agregarAlCarrito(
    producto
) {

    /*
       Si sabemos el stock y está agotado,
       bloqueamos la acción.
    */

    if (
        typeof producto.stock ===
        'number' &&

        producto.stock <= 0
    ) {

        mostrarNotificacion(
            'Esta combinación está agotada.'
        );

        return;

    }


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

        if (
            typeof producto.stock ===
            'number' &&

            existente.cantidad >=
                producto.stock
        ) {

            mostrarNotificacion(
                'Ya agregaste todas las unidades disponibles de esta variante.'
            );

            return;

        }


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
   NOTIFICACIÓN GENERAL
   ========================================================= */

function mostrarNotificacion(
    mensaje
) {

    let aviso =
        document.getElementById(
            'notificacion-tienda'
        );


    if (!aviso) {

        aviso =
            document.createElement(
                'div'
            );


        aviso.id =
            'notificacion-tienda';


        aviso.className =
            'notificacion-tienda';


        document.body.appendChild(
            aviso
        );

    }


    aviso.textContent =
        mensaje;


    aviso.classList.add(
        'notificacion-visible'
    );


    clearTimeout(
        aviso._temporizador
    );


    aviso._temporizador =
        setTimeout(
            () => {

                aviso.classList.remove(
                    'notificacion-visible'
                );

            },
            2800
        );

}


/* =========================================================
   AVISO PRODUCTO AGREGADO
   ========================================================= */

function mostrarAvisoCarrito() {

    const aviso =
        document.getElementById(
            'aviso-carrito'
        );


    /*
       Si producto.html tiene su propio aviso,
       usamos ese.
    */

    if (aviso) {

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


        return;

    }


    /*
       Si no existe,
       usamos toast general.
    */

    mostrarNotificacion(
        'Producto agregado al carrito.'
    );

}


/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

function formatearPrecio(
    numero
) {

    return (

        '$' +

        Number(
            numero || 0
        )
            .toLocaleString(
                'es-CO'
            )

    );

}


/* =========================================================
   9. PRODUCTO INDIVIDUAL
   ========================================================= */

async function inicializarProducto() {

    const detalle =
        document.getElementById(
            'producto-detalle'
        );


    if (!detalle) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const slug =
        parametros.get(
            'id'
        );


    if (!slug) {

        mostrarProductoNoEncontrado();

        return;

    }


    let producto = null;


    /* =====================================================
       PRODUCTO DESDE SUPABASE
       ===================================================== */

    if (
        typeof window.obtenerProductoPorSlugSupabase ===
        'function'
    ) {

        producto =
            await window
                .obtenerProductoPorSlugSupabase(
                    slug
                );

    }


    /* =====================================================
       RESPALDO LOCAL
       ===================================================== */

    if (!producto) {

        console.warn(
            'Producto no encontrado en Supabase. Usando respaldo local.'
        );


        producto =
            PRODUCTOS.find(
                item =>
                    item.id === slug
            );

    }


    if (!producto) {

        mostrarProductoNoEncontrado();

        return;

    }


    /* =====================================================
       OBTENER VARIANTES
       ===================================================== */

    let variantes = [];


    if (
        producto.idSupabase &&

        typeof window.obtenerVariantesProductoSupabase ===
        'function'
    ) {

        const resultado =
            await window
                .obtenerVariantesProductoSupabase(
                    producto.idSupabase
                );


        if (
            Array.isArray(
                resultado
            )
        ) {

            variantes =
                resultado;

        }

    }


    /* =====================================================
       INFORMACIÓN GENERAL
       ===================================================== */

    detalle.dataset.productoId =
        producto.id;


    detalle.dataset.productoNombre =
        producto.nombre;


    detalle.dataset.productoPrecio =
        producto.precio;


    detalle.dataset.productoImagen =
        producto.imagen;


    const nombre =
        document.getElementById(
            'producto-nombre'
        );


    if (nombre) {

        nombre.textContent =
            producto.nombre;

    }


    const miga =
        document.getElementById(
            'miga-producto'
        );


    if (miga) {

        miga.textContent =
            producto.nombre;

    }


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


    const descripcion =
        document.getElementById(
            'producto-descripcion'
        );


    if (descripcion) {

        descripcion.textContent =
            producto.descripcion ||
            '';

    }


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
       OPCIONES DE PRODUCTO
       ===================================================== */

    if (
        variantes.length > 0
    ) {

        generarOpcionesVariantes(
            variantes
        );

    }

    else {

        generarOpcionesLocalesProducto(
            slug
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


                if (
                    variantes.length > 0 &&
                    (!talla || !color)
                ) {

                    mostrarNotificacion(
                        'Selecciona un color y una talla disponibles.'
                    );

                    return;

                }


                let stock = null;


                if (
                    variantes.length > 0
                ) {

                    const variante =
                        variantes.find(
                            item =>

                                item.talla ===
                                    talla.value &&

                                item.color_nombre ===
                                    color.value
                        );


                    if (
                        !variante ||
                        Number(
                            variante.stock
                        ) <= 0
                    ) {

                        mostrarNotificacion(
                            'Esta combinación está agotada.'
                        );

                        return;

                    }


                    stock =
                        Number(
                            variante.stock
                        );

                }


                agregarAlCarrito({

                    id:
                        producto.id,

                    nombre:
                        producto.nombre,

                    precio:
                        Number(
                            producto.precio
                        ),

                    imagen:
                        producto.imagen,

                    talla:
                        talla
                            ? talla.value
                            : '',

                    color:
                        color
                            ? color.value
                            : '',

                    stock:
                        stock

                });

            }
        );

    }


    /* =====================================================
       CONSULTAR POR WHATSAPP
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

                    `Hola, quiero consultar por ${producto.nombre}.\n\n` +

                    `Precio: ${formatearPrecio(producto.precio)}\n` +

                    `Talla: ${
                        talla
                            ? talla.value
                            : 'Sin seleccionar'
                    }\n` +

                    `Color: ${
                        color
                            ? color.value
                            : 'Sin seleccionar'
                    }`;


                abrirWhatsapp(
                    mensaje
                );

            }
        );

    }

}


/* =========================================================
   10. VARIANTES — COLORES Y TALLAS
   ========================================================= */

function generarOpcionesVariantes(
    variantes
) {

    const contenedorColores =
        document.getElementById(
            'producto-colores'
        );


    const contenedorTallas =
        document.getElementById(
            'producto-tallas'
        );


    if (
        !contenedorColores ||
        !contenedorTallas
    ) {

        return;

    }


    contenedorColores.innerHTML = '';

    contenedorTallas.innerHTML = '';


    /* =====================================================
       COLORES ÚNICOS
       ===================================================== */

    const coloresMap =
        new Map();


    variantes.forEach(
        variante => {

            const nombreColor =
                variante.color_nombre;


            if (!nombreColor) return;


            if (
                !coloresMap.has(
                    nombreColor
                )
            ) {

                coloresMap.set(

                    nombreColor,

                    {
                        nombre:
                            nombreColor,

                        codigo:
                            variante.color_codigo ||
                            '#cccccc'
                    }

                );

            }

        }
    );


    const colores =
        Array.from(
            coloresMap.values()
        );


    /* =====================================================
       GENERAR COLORES
       ===================================================== */

    colores.forEach(
        (
            color,
            indice
        ) => {

            const variantesColor =
                variantes.filter(
                    item =>
                        item.color_nombre ===
                        color.nombre
                );


            const stockTotal =
                variantesColor.reduce(
                    (
                        suma,
                        item
                    ) =>

                        suma +
                        Number(
                            item.stock || 0
                        ),

                    0
                );


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
                stockTotal <= 0
            ) {

                input.disabled =
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


            label.style.backgroundColor =
                color.codigo;


            label.title =
                stockTotal > 0

                    ? color.nombre

                    : `${color.nombre} - Agotado`;


            label.setAttribute(
                'aria-label',
                label.title
            );


            if (
                stockTotal <= 0
            ) {

                label.style.opacity =
                    '0.35';


                label.style.cursor =
                    'not-allowed';

            }


            input.addEventListener(
                'change',
                () => {

                    generarTallasPorColor(
                        variantes,
                        color.nombre
                    );

                }
            );


            contenedorColores.appendChild(
                input
            );


            contenedorColores.appendChild(
                label
            );

        }
    );


    /* =====================================================
       PRIMER COLOR DISPONIBLE
       ===================================================== */

    const primerColorDisponible =
        contenedorColores.querySelector(
            'input[name="color"]:not(:disabled)'
        );


    if (primerColorDisponible) {

        primerColorDisponible.checked =
            true;


        generarTallasPorColor(

            variantes,

            primerColorDisponible.value

        );

    }

}


/* =========================================================
   TALLAS SEGÚN COLOR
   ========================================================= */

function generarTallasPorColor(
    variantes,
    colorSeleccionado
) {

    const contenedorTallas =
        document.getElementById(
            'producto-tallas'
        );


    if (!contenedorTallas) return;


    contenedorTallas.innerHTML = '';


    const variantesColor =
        variantes.filter(
            item =>
                item.color_nombre ===
                colorSeleccionado
        );


    variantesColor.forEach(
        (
            variante,
            indice
        ) => {

            const stock =
                Number(
                    variante.stock || 0
                );


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
                variante.talla;


            if (
                stock <= 0
            ) {

                input.disabled =
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
                variante.talla;


            label.title =
                stock > 0

                    ? `Stock disponible: ${stock}`

                    : 'Agotado';


            if (
                stock <= 0
            ) {

                label.style.opacity =
                    '0.35';


                label.style.textDecoration =
                    'line-through';


                label.style.cursor =
                    'not-allowed';

            }


            contenedorTallas.appendChild(
                input
            );


            contenedorTallas.appendChild(
                label
            );

        }
    );


    const primeraTallaDisponible =
        contenedorTallas.querySelector(
            'input[name="talla"]:not(:disabled)'
        );


    if (primeraTallaDisponible) {

        primeraTallaDisponible.checked =
            true;

    }

}


/* =========================================================
   OPCIONES LOCALES DE RESPALDO
   ========================================================= */

function generarOpcionesLocalesProducto(
    slug
) {

    const productoLocal =
        PRODUCTOS.find(
            item =>
                item.id === slug
        );


    const contenedorColores =
        document.getElementById(
            'producto-colores'
        );


    const contenedorTallas =
        document.getElementById(
            'producto-tallas'
        );


    if (
        !contenedorColores ||
        !contenedorTallas
    ) {

        return;

    }


    contenedorColores.innerHTML = '';

    contenedorTallas.innerHTML = '';


    if (!productoLocal) {

        contenedorColores.innerHTML =
            '<p>Sin colores disponibles.</p>';


        contenedorTallas.innerHTML =
            '<p>Sin tallas disponibles.</p>';


        return;

    }


    /* =====================================================
       COLORES LOCALES
       ===================================================== */

    productoLocal.colores.forEach(
        (
            color,
            indice
        ) => {

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


            label.style.backgroundColor =
                color.codigo;


            label.title =
                color.nombre;


            label.setAttribute(
                'aria-label',
                color.nombre
            );


            contenedorColores.appendChild(
                input
            );


            contenedorColores.appendChild(
                label
            );

        }
    );


    /* =====================================================
       TALLAS LOCALES
       ===================================================== */

    productoLocal.tallas.forEach(
        (
            talla,
            indice
        ) => {

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


/* =========================================================
   PRODUCTO NO ENCONTRADO
   ========================================================= */

function mostrarProductoNoEncontrado() {

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


    const colores =
        document.getElementById(
            'producto-colores'
        );


    const tallas =
        document.getElementById(
            'producto-tallas'
        );


    if (nombre) {

        nombre.textContent =
            'Producto no encontrado';

    }


    if (precio) {

        precio.textContent = '';

    }


    if (descripcion) {

        descripcion.textContent =
            'El producto que intentas abrir no existe o ya no está disponible.';

    }


    if (imagen) {

        imagen.style.backgroundImage =
            'none';

    }


    if (colores) {

        colores.innerHTML = '';

    }


    if (tallas) {

        tallas.innerHTML = '';

    }

}


/* =========================================================
   11. WHATSAPP
   ========================================================= */

function abrirWhatsapp(
    mensaje
) {

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
   12. PÁGINA DEL CARRITO
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


    contenedor.innerHTML = '';


    /* =====================================================
       CARRITO VACÍO
       ===================================================== */

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


    let total = 0;


    /* =====================================================
       PRODUCTOS
       ===================================================== */

    carrito.forEach(
        (
            item,
            indice
        ) => {

            const precio =
                Number(
                    item.precio || 0
                );


            const cantidad =
                Number(
                    item.cantidad || 0
                );


            total +=
                precio *
                cantidad;


            const llegoAlMaximo =

                typeof item.stock ===
                    'number' &&

                cantidad >=
                    item.stock;


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
                            precio
                        )}

                    </p>


                    ${
                        typeof item.stock ===
                            'number'

                            ? `

                                <p class="carrito-stock">

                                    Stock disponible:
                                    ${item.stock}

                                </p>

                            `

                            : ''
                    }

                </div>


                <div class="carrito-item-cantidad">


                    <button
                        type="button"
                        class="boton-menos"
                        aria-label="Restar una unidad"
                    >
                        -
                    </button>


                    <span>
                        ${cantidad}
                    </span>


                    <button
                        type="button"
                        class="boton-mas"
                        aria-label="Agregar una unidad"

                        ${
                            llegoAlMaximo
                                ? 'disabled'
                                : ''
                        }
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


            /* =================================================
               BOTÓN MENOS
               ================================================= */

            const botonMenos =
                fila.querySelector(
                    '.boton-menos'
                );


            if (botonMenos) {

                botonMenos.addEventListener(
                    'click',
                    () => {

                        cambiarCantidad(
                            indice,
                            -1
                        );

                    }
                );

            }


            /* =================================================
               BOTÓN MÁS
               ================================================= */

            const botonMas =
                fila.querySelector(
                    '.boton-mas'
                );


            if (botonMas) {

                botonMas.addEventListener(
                    'click',
                    () => {

                        cambiarCantidad(
                            indice,
                            1
                        );

                    }
                );

            }


            /* =================================================
               BOTÓN ELIMINAR
               ================================================= */

            const botonEliminar =
                fila.querySelector(
                    '.carrito-item-eliminar'
                );


            if (botonEliminar) {

                botonEliminar.addEventListener(
                    'click',
                    () => {

                        eliminarDelCarrito(
                            indice
                        );

                    }
                );

            }


            contenedor.appendChild(
                fila
            );

        }
    );


    /* =====================================================
       TOTAL
       ===================================================== */

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
    cambio
) {

    const carrito =
        obtenerCarrito();


    const item =
        carrito[indice];


    if (!item) return;


    /*
       SUBIR CANTIDAD
    */

    if (
        cambio > 0
    ) {

        if (
            typeof item.stock ===
                'number' &&

            item.cantidad >=
                item.stock
        ) {

            mostrarNotificacion(

                `Solo hay ${item.stock} unidad(es) disponibles de esta variante.`

            );


            return;

        }

    }


    item.cantidad +=
        cambio;


    /*
       Si llega a cero,
       eliminamos el producto.
    */

    if (
        item.cantidad <= 0
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
   ELIMINAR DEL CARRITO
   ========================================================= */

function eliminarDelCarrito(
    indice
) {

    const carrito =
        obtenerCarrito();


    if (
        !carrito[indice]
    ) {

        return;

    }


    carrito.splice(
        indice,
        1
    );


    guardarCarrito(
        carrito
    );


    renderizarCarrito();


    mostrarNotificacion(
        'Producto eliminado del carrito.'
    );

}


/* =========================================================
   FINALIZAR PEDIDO POR WHATSAPP
   ========================================================= */

function finalizarPedidoPorWhatsapp() {

    const carrito =
        obtenerCarrito();


    if (
        carrito.length === 0
    ) {

        mostrarNotificacion(
            'Tu carrito está vacío.'
        );

        return;

    }


    let total = 0;


    let mensaje =
        'Hola, quiero hacer este pedido:\n\n';


    carrito.forEach(
        item => {

            const subtotal =

                Number(
                    item.precio
                ) *

                Number(
                    item.cantidad
                );


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
   13. INICIALIZACIÓN GENERAL
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        /* CONTADOR */

        actualizarContadorCarrito();


        /* CATÁLOGO */

        await generarCatalogo();


        /* DESTACADOS */

        await generarProductosDestacados();


        /* FILTROS */

        inicializarFiltros();


        aplicarFiltroDesdeURL();


        /* BUSCADOR */

        inicializarBuscador();


        /* PRODUCTO */

        await inicializarProducto();


        /* CARRITO */

        renderizarCarrito();


        /* FINALIZAR PEDIDO */

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