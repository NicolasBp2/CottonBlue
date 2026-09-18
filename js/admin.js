/* =========================================================
   COTTON BLUE SHOP — ADMIN
   ========================================================= */


/* =========================================================
   LOGIN
   ========================================================= */

const formLogin =
    document.getElementById(
        'form-admin-login'
    );


if (formLogin) {

    verificarSesionEnLogin();


    formLogin.addEventListener(
        'submit',
        async evento => {

            evento.preventDefault();


            const email =
                document.getElementById(
                    'admin-email'
                ).value.trim();


            const password =
                document.getElementById(
                    'admin-password'
                ).value;


            const mensaje =
                document.getElementById(
                    'admin-login-mensaje'
                );


            mensaje.textContent =
                'Ingresando...';


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email,
                        password

                    });


            if (error) {

                console.error(
                    'Error de login:',
                    error
                );


                mensaje.textContent =
                    `Error: ${error.message}`;


                return;

            }


            if (
                data &&
                data.session
            ) {

                window.location.href =
                    'admin.html';

            }

        }
    );

}


/* =========================================================
   VERIFICAR SESIÓN EN LOGIN
   ========================================================= */

async function verificarSesionEnLogin() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            'Error revisando sesión:',
            error
        );


        return;

    }


    if (
        data &&
        data.session
    ) {

        window.location.href =
            'admin.html';

    }

}


/* =========================================================
   PROTEGER PANEL
   ========================================================= */

async function protegerPanelAdmin() {

    const panel =
        document.querySelector(
            '.admin-panel'
        );


    if (!panel) {

        return false;

    }


    panel.style.display =
        'none';


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        error ||
        !data.session
    ) {

        window.location.href =
            'admin-login.html';


        return false;

    }


    panel.style.display =
        '';


    return true;

}


/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

const botonCerrarSesion =
    document.getElementById(
        'admin-cerrar-sesion'
    );


if (botonCerrarSesion) {

    botonCerrarSesion.addEventListener(
        'click',
        async () => {

            botonCerrarSesion.disabled =
                true;


            botonCerrarSesion.textContent =
                'Cerrando...';


            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                console.error(
                    'Error cerrando sesión:',
                    error
                );


                botonCerrarSesion.disabled =
                    false;


                botonCerrarSesion.textContent =
                    'Cerrar sesión';


                return;

            }


            window.location.href =
                'admin-login.html';

        }
    );

}


/* =========================================================
   ELEMENTOS PRINCIPALES DEL FORMULARIO
   ========================================================= */

const formularioContenedor =
    document.getElementById(
        'admin-formulario-producto'
    );


const formulario =
    document.getElementById(
        'admin-form-producto'
    );


const botonNuevo =
    document.getElementById(
        'admin-nuevo-producto'
    );


const botonCerrarFormulario =
    document.getElementById(
        'admin-cerrar-formulario'
    );


const botonCancelar =
    document.getElementById(
        'admin-cancelar-producto'
    );


/* =========================================================
   NUEVO PRODUCTO
   ========================================================= */

if (botonNuevo) {

    botonNuevo.addEventListener(
        'click',
        abrirFormularioNuevoProducto
    );

}


/* =========================================================
   CERRAR FORMULARIO
   ========================================================= */

if (botonCerrarFormulario) {

    botonCerrarFormulario.addEventListener(
        'click',
        cerrarFormularioProducto
    );

}


if (botonCancelar) {

    botonCancelar.addEventListener(
        'click',
        cerrarFormularioProducto
    );

}


/* =========================================================
   SLUG AUTOMÁTICO
   ========================================================= */

const inputNombre =
    document.getElementById(
        'admin-producto-nombre'
    );


const inputSlug =
    document.getElementById(
        'admin-producto-slug'
    );


if (
    inputNombre &&
    inputSlug
) {

    inputNombre.addEventListener(
        'input',
        () => {

            const id =
                document.getElementById(
                    'admin-producto-id'
                ).value;


            if (!id) {

                inputSlug.value =
                    crearSlug(
                        inputNombre.value
                    );

            }

        }
    );

}


/* =========================================================
   CREAR SLUG
   ========================================================= */

function crearSlug(texto) {

    return texto

        .normalize(
            'NFD'
        )

        .replace(
            /[\u0300-\u036f]/g,
            ''
        )

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9]+/g,
            '-'
        )

        .replace(
            /^-+|-+$/g,
            ''
        );

}


/* =========================================================
   SUBIR IMAGEN A SUPABASE STORAGE
   ========================================================= */

async function subirImagenProducto(
    archivo
) {

    if (!archivo) {

        return null;

    }


    const partesNombre =
        archivo.name
            .split('.');


    const extension =
        partesNombre.length > 1
            ? partesNombre
                .pop()
                .toLowerCase()
            : 'jpg';


    const nombreArchivo =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${extension}`;


    const ruta =
        `productos/${nombreArchivo}`;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(
                'productos'
            )
            .upload(
                ruta,
                archivo,
                {
                    cacheControl:
                        '3600',

                    upsert:
                        false
                }
            );


    if (error) {

        console.error(
            'Error subiendo imagen:',
            error
        );


        throw error;

    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from(
                'productos'
            )
            .getPublicUrl(
                ruta
            );


    return data.publicUrl;

}
/* =========================================================
   OBTENER RUTA DE UNA IMAGEN DEL BUCKET PRODUCTOS
   ========================================================= */

function obtenerRutaImagenStorage(
    url
) {

    if (!url) {

        return null;

    }


    const marcador =
        '/storage/v1/object/public/productos/';


    if (
        !url.includes(
            marcador
        )
    ) {

        return null;

    }


    return decodeURIComponent(
        url.split(
            marcador
        )[1]
    );

}


/* =========================================================
   ELIMINAR IMAGEN DEL STORAGE
   ========================================================= */

async function eliminarImagenStorage(
    url
) {

    const ruta =
        obtenerRutaImagenStorage(
            url
        );


    /*
       Si no es una imagen de nuestro bucket,
       no hacemos nada.
    */

    if (!ruta) {

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(
                'productos'
            )
            .remove([
                ruta
            ]);


    if (error) {

        console.error(
            'No se pudo eliminar la imagen anterior:',
            error
        );

    }

}

/* =========================================================
   VISTA PREVIA DE IMAGEN
   ========================================================= */

const inputArchivoImagen =
    document.getElementById(
        'admin-producto-archivo'
    );


if (inputArchivoImagen) {

    inputArchivoImagen.addEventListener(
        'change',
        () => {

            const archivo =
                inputArchivoImagen.files[0];


            const preview =
                document.getElementById(
                    'admin-imagen-preview'
                );


            if (!preview) return;


            if (!archivo) {

                preview.textContent =
                    'Sin imagen seleccionada';


                return;

            }


            const urlTemporal =
                URL.createObjectURL(
                    archivo
                );


            preview.innerHTML = `

                <img
                    src="${urlTemporal}"
                    alt="Vista previa"
                >

            `;

        }
    );

}


/* =========================================================
   ABRIR FORMULARIO NUEVO PRODUCTO
   ========================================================= */

function abrirFormularioNuevoProducto() {

    if (!formulario) return;


    formulario.reset();


    document.getElementById(
        'admin-producto-id'
    ).value =
        '';


    document.getElementById(
        'admin-producto-imagen'
    ).value =
        '';


    document.getElementById(
        'admin-producto-activo'
    ).checked =
        true;


    document.getElementById(
        'admin-formulario-titulo'
    ).textContent =
        'Nuevo producto';


    document.getElementById(
        'admin-producto-mensaje'
    ).textContent =
        '';


    const preview =
        document.getElementById(
            'admin-imagen-preview'
        );


    if (preview) {

        preview.textContent =
            'Sin imagen seleccionada';

    }


    const archivo =
        document.getElementById(
            'admin-producto-archivo'
        );


    if (archivo) {

        archivo.value =
            '';

    }


    const seccionVariantes =
        document.getElementById(
            'admin-variantes-seccion'
        );


    if (seccionVariantes) {

        seccionVariantes.hidden =
            true;

    }


    formularioContenedor.hidden =
        false;


    formularioContenedor.scrollIntoView({

        behavior:
            'smooth',

        block:
            'start'

    });

}


/* =========================================================
   CERRAR FORMULARIO PRODUCTO
   ========================================================= */

function cerrarFormularioProducto() {

    if (!formularioContenedor) return;


    formularioContenedor.hidden =
        true;


    const seccionVariantes =
        document.getElementById(
            'admin-variantes-seccion'
        );


    if (seccionVariantes) {

        seccionVariantes.hidden =
            true;

    }


    if (formulario) {

        formulario.reset();

    }


    limpiarFormularioVariante();

}


/* =========================================================
   CARGAR PRODUCTOS
   ========================================================= */

async function cargarProductosAdmin() {

    const contenedor =
        document.getElementById(
            'admin-productos-contenedor'
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        '<p>Cargando productos...</p>';


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                'productos'
            )

            .select(
                '*'
            )

            .order(
                'created_at',
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            'Error cargando productos:',
            error
        );


        contenedor.innerHTML =
            '<p>No se pudieron cargar los productos.</p>';


        return;

    }


    renderizarProductosAdmin(
        data || []
    );

}


/* =========================================================
   RENDERIZAR PRODUCTOS
   ========================================================= */

function renderizarProductosAdmin(
    productos
) {

    const contenedor =
        document.getElementById(
            'admin-productos-contenedor'
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        '';


    if (
        productos.length === 0
    ) {

        contenedor.innerHTML =
            '<p>Todavía no hay productos.</p>';


        return;

    }


    productos.forEach(
        producto => {

            const tarjeta =
                document.createElement(
                    'article'
                );


            tarjeta.className =
                'admin-producto-card';


            tarjeta.innerHTML = `

                <div
                    class="admin-producto-imagen"
                    style="
                        background-image:
                        url('${producto.imagen || ''}')
                    "
                >
                </div>


                <div class="admin-producto-info">

                    <h3>
                        ${producto.nombre}
                    </h3>


                    <p>
                        ${formatearPrecioAdmin(
                            producto.precio
                        )}
                    </p>


                    <div class="admin-producto-meta">

                        <span>
                            ${producto.genero || 'Sin género'}
                        </span>

                        <span>
                            ${producto.categoria || 'Sin categoría'}
                        </span>

                    </div>


                    <div class="admin-producto-estados">

                        ${
                            producto.oferta
                                ? '<span>Oferta</span>'
                                : ''
                        }

                        ${
                            producto.destacado
                                ? '<span>Destacado</span>'
                                : ''
                        }

                        <span>
                            ${
                                producto.activo
                                    ? 'Activo'
                                    : 'Inactivo'
                            }
                        </span>

                    </div>


                    <button
                        type="button"
                        class="admin-editar-producto"
                        data-id="${producto.id}"
                    >
                        Editar
                    </button>

                </div>

            `;


            contenedor.appendChild(
                tarjeta
            );

        }
    );


    document
        .querySelectorAll(
            '.admin-editar-producto'
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    'click',
                    () => {

                        abrirFormularioEditarProducto(
                            boton.dataset.id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   ABRIR EDITAR PRODUCTO
   ========================================================= */

async function abrirFormularioEditarProducto(
    id
) {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                'productos'
            )

            .select(
                '*'
            )

            .eq(
                'id',
                id
            )

            .single();


    if (error) {

        console.error(
            'Error cargando producto:',
            error
        );


        return;

    }


    document.getElementById(
        'admin-producto-id'
    ).value =
        data.id;


    document.getElementById(
        'admin-producto-nombre'
    ).value =
        data.nombre || '';


    document.getElementById(
        'admin-producto-slug'
    ).value =
        data.slug || '';


    document.getElementById(
        'admin-producto-precio'
    ).value =
        data.precio || 0;


    document.getElementById(
        'admin-producto-genero'
    ).value =
        data.genero || '';


    document.getElementById(
        'admin-producto-categoria'
    ).value =
        data.categoria || '';


    document.getElementById(
        'admin-producto-imagen'
    ).value =
        data.imagen || '';


    document.getElementById(
        'admin-producto-descripcion'
    ).value =
        data.descripcion || '';


    document.getElementById(
        'admin-producto-oferta'
    ).checked =
        Boolean(
            data.oferta
        );


    document.getElementById(
        'admin-producto-destacado'
    ).checked =
        Boolean(
            data.destacado
        );


    document.getElementById(
        'admin-producto-activo'
    ).checked =
        Boolean(
            data.activo
        );


    document.getElementById(
        'admin-formulario-titulo'
    ).textContent =
        'Editar producto';


    document.getElementById(
        'admin-producto-mensaje'
    ).textContent =
        '';


    const preview =
        document.getElementById(
            'admin-imagen-preview'
        );


    if (preview) {

        if (data.imagen) {

            preview.innerHTML = `

                <img
                    src="${data.imagen}"
                    alt="${data.nombre}"
                >

            `;

        }

        else {

            preview.textContent =
                'Sin imagen seleccionada';

        }

    }


    const archivo =
        document.getElementById(
            'admin-producto-archivo'
        );


    if (archivo) {

        archivo.value =
            '';

    }


    formularioContenedor.hidden =
        false;


    const seccionVariantes =
        document.getElementById(
            'admin-variantes-seccion'
        );


    if (seccionVariantes) {

        seccionVariantes.hidden =
            false;

    }


    limpiarFormularioVariante();


    await cargarVariantesAdmin(
        data.id
    );


    formularioContenedor.scrollIntoView({

        behavior:
            'smooth',

        block:
            'start'

    });

}


/* =========================================================
   GUARDAR PRODUCTO
   ========================================================= */

if (formulario) {

    formulario.addEventListener(
        'submit',
        async evento => {

            evento.preventDefault();


            const botonGuardar =
                document.getElementById(
                    'admin-guardar-producto'
                );


            const mensaje =
                document.getElementById(
                    'admin-producto-mensaje'
                );


            const id =
                document.getElementById(
                    'admin-producto-id'
                ).value;


            const nombre =
                document.getElementById(
                    'admin-producto-nombre'
                ).value.trim();


            const slug =
                crearSlug(

                    document.getElementById(
                        'admin-producto-slug'
                    ).value

                );


            const precio =
                Number(

                    document.getElementById(
                        'admin-producto-precio'
                    ).value

                );


            const genero =
                document.getElementById(
                    'admin-producto-genero'
                ).value;


            const categoria =
                document.getElementById(
                    'admin-producto-categoria'
                ).value;


            const descripcion =
                document.getElementById(
                    'admin-producto-descripcion'
                ).value.trim();


            const oferta =
                document.getElementById(
                    'admin-producto-oferta'
                ).checked;


            const destacado =
                document.getElementById(
                    'admin-producto-destacado'
                ).checked;


            const activo =
                document.getElementById(
                    'admin-producto-activo'
                ).checked;


            if (
                !nombre ||
                !slug ||
                !genero ||
                !categoria
            ) {

                mensaje.textContent =
                    'Completa los campos obligatorios.';


                return;

            }


            botonGuardar.disabled =
                true;


            botonGuardar.textContent =
                'Guardando...';


            mensaje.textContent =
                '';


            /* =================================================
               IMAGEN
               ================================================= */

            const inputArchivo =
                document.getElementById(
                    'admin-producto-archivo'
                );


            const archivoImagen =
                inputArchivo
                    ? inputArchivo.files[0]
                    : null;


          const imagenAnterior =
    document.getElementById(
        'admin-producto-imagen'
    ).value;


let imagenFinal =
    imagenAnterior;


            if (archivoImagen) {

                try {

                    imagenFinal =
                        await subirImagenProducto(
                            archivoImagen
                        );

                }

                catch (error) {

                    mensaje.textContent =
                        'No se pudo subir la imagen.';


                    botonGuardar.disabled =
                        false;


                    botonGuardar.textContent =
                        'Guardar producto';


                    return;

                }

            }


            const producto = {

                nombre,
                slug,
                descripcion,
                precio,
                genero,
                categoria,

                imagen:
                    imagenFinal,

                oferta,
                destacado,
                activo

            };


            let resultado;


            /* =================================================
               EDITAR PRODUCTO
               ================================================= */

            if (id) {

                resultado =
                    await supabaseClient

                        .from(
                            'productos'
                        )

                        .update(
                            producto
                        )

                        .eq(
                            'id',
                            id
                        )

                        .select()

                        .single();

            }


            /* =================================================
               CREAR PRODUCTO
               ================================================= */

            else {

                resultado =
                    await supabaseClient

                        .from(
                            'productos'
                        )

                        .insert([
                            producto
                        ])

                        .select()

                        .single();

            }


            botonGuardar.disabled =
                false;


            botonGuardar.textContent =
                'Guardar producto';


          if (
    resultado.error
) {

    console.error(
        'Error guardando producto:',
        resultado.error
    );


    if (
        resultado.error.code === '23505'
    ) {

        mensaje.textContent =
            'Ya existe un producto con ese slug. Cambia el nombre o el slug.';

    }

    else {

        mensaje.textContent =
            `Error: ${resultado.error.message}`;

    }


    /*
       Si se alcanzó a subir una imagen nueva
       pero el producto NO pudo guardarse,
       eliminamos esa imagen para no dejar
       archivos huérfanos en Storage.
    */

    if (
        archivoImagen &&
        imagenFinal &&
        imagenFinal !== imagenAnterior
    ) {

        await eliminarImagenStorage(
            imagenFinal
        );

    }


    return;

}

            const productoGuardado =
                resultado.data;
/* =====================================================
   ELIMINAR IMAGEN ANTERIOR SI FUE REEMPLAZADA
   ===================================================== */

if (
    archivoImagen &&
    imagenAnterior &&
    imagenFinal !== imagenAnterior
) {

    await eliminarImagenStorage(
        imagenAnterior
    );

}

            document.getElementById(
                'admin-producto-id'
            ).value =
                productoGuardado.id;


            document.getElementById(
                'admin-producto-imagen'
            ).value =
                productoGuardado.imagen || '';


            mensaje.textContent =
                id

                    ? 'Producto actualizado correctamente.'

                    : 'Producto creado correctamente. Ya puedes agregar tallas, colores y stock.';


            await cargarProductosAdmin();


            document.getElementById(
                'admin-formulario-titulo'
            ).textContent =
                'Editar producto';


            const seccionVariantes =
                document.getElementById(
                    'admin-variantes-seccion'
                );


            if (seccionVariantes) {

                seccionVariantes.hidden =
                    false;

            }


            await cargarVariantesAdmin(
                productoGuardado.id
            );

        }
    );

}


/* =========================================================
   VARIANTES
   ========================================================= */

const formVariante =
    document.getElementById(
        'admin-form-variante'
    );


/* =========================================================
   CARGAR VARIANTES
   ========================================================= */

async function cargarVariantesAdmin(
    productoId
) {

    const lista =
        document.getElementById(
            'admin-variantes-lista'
        );


    if (!lista) return;


    lista.innerHTML =
        '<p>Cargando variantes...</p>';


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                'variantes_producto'
            )

            .select(
                '*'
            )

            .eq(
                'producto_id',
                productoId
            )

            .order(
                'color_nombre',
                {
                    ascending:
                        true
                }
            )

            .order(
                'talla',
                {
                    ascending:
                        true
                }
            );


    if (error) {

        console.error(
            'Error cargando variantes:',
            error
        );


        lista.innerHTML =
            '<p>No se pudieron cargar las variantes.</p>';


        return;

    }


    renderizarVariantesAdmin(
        data || []
    );

}


/* =========================================================
   RENDERIZAR VARIANTES
   ========================================================= */

function renderizarVariantesAdmin(
    variantes
) {

    const lista =
        document.getElementById(
            'admin-variantes-lista'
        );


    if (!lista) return;


    lista.innerHTML =
        '';


    if (
        variantes.length === 0
    ) {

        lista.innerHTML =
            '<p>No hay variantes todavía.</p>';


        return;

    }


    variantes.forEach(
        variante => {

            const fila =
                document.createElement(
                    'div'
                );


            fila.className =
                'admin-variante-fila';


            fila.innerHTML = `

                <div class="admin-variante-color">

                    <span
                        class="admin-color-muestra"
                        style="
                            background:
                            ${variante.color_codigo || '#cccccc'}
                        "
                    >
                    </span>

                    ${variante.color_nombre}

                </div>


                <div>
                    Talla:
                    <strong>
                        ${variante.talla}
                    </strong>
                </div>


                <div>
                    Stock:
                    <strong>
                        ${variante.stock}
                    </strong>
                </div>


                <div class="admin-variante-acciones">

                    <button
                        type="button"
                        class="admin-variante-editar"
                        data-id="${variante.id}"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="admin-variante-eliminar"
                        data-id="${variante.id}"
                    >
                        Eliminar
                    </button>

                </div>

            `;


            const botonEditar =
                fila.querySelector(
                    '.admin-variante-editar'
                );


            if (botonEditar) {

                botonEditar.addEventListener(
                    'click',
                    () => {

                        editarVarianteAdmin(
                            variante
                        );

                    }
                );

            }


            const botonEliminar =
                fila.querySelector(
                    '.admin-variante-eliminar'
                );


            if (botonEliminar) {

                botonEliminar.addEventListener(
                    'click',
                    () => {

                        eliminarVarianteAdmin(
                            variante.id
                        );

                    }
                );

            }


            lista.appendChild(
                fila
            );

        }
    );

}


/* =========================================================
   GUARDAR VARIANTE
   ========================================================= */

if (formVariante) {

    formVariante.addEventListener(
        'submit',
        async evento => {

            evento.preventDefault();


            const productoId =
                document.getElementById(
                    'admin-producto-id'
                ).value;


            if (!productoId) {

                return;

            }


            const varianteId =
                document.getElementById(
                    'admin-variante-id'
                ).value;


            const mensaje =
                document.getElementById(
                    'admin-variante-mensaje'
                );


            const colorIngresado =
    document.getElementById(
        'admin-variante-color'
    ).value.trim();


const colorNombre =
    colorIngresado

        .toLowerCase()

        .replace(
            /\b\w/g,
            letra =>
                letra.toUpperCase()
        );


const talla =
    document.getElementById(
        'admin-variante-talla'
    )
        .value
        .trim()
        .toUpperCase();


            const stock =
                Number(
                    document.getElementById(
                        'admin-variante-stock'
                    ).value
                );


            if (
                !colorNombre ||
                !talla ||
                stock < 0
            ) {

                mensaje.textContent =
                    'Completa correctamente color, talla y stock.';


                return;

            }


            const variante = {

                producto_id:
                    Number(
                        productoId
                    ),

                color_nombre:
                    colorNombre,

                color_codigo:
                    document.getElementById(
                        'admin-variante-codigo'
                    ).value,

                talla:
                    talla,

                stock:
                    stock,

                activo:
                    true

            };


            let resultado;


            /* EDITAR */

            if (varianteId) {

                resultado =
                    await supabaseClient

                        .from(
                            'variantes_producto'
                        )

                        .update(
                            variante
                        )

                        .eq(
                            'id',
                            varianteId
                        );

            }


            /* CREAR */

            else {

                resultado =
                    await supabaseClient

                        .from(
                            'variantes_producto'
                        )

                        .insert([
                            variante
                        ]);

            }

if (
    resultado.error
) {

    console.error(
        'Error guardando variante:',
        resultado.error
    );


    if (
        resultado.error.code === '23505'
    ) {

        mensaje.textContent =
            'Ya existe una variante con ese color y esa talla.';

    }

    else {

        mensaje.textContent =
            `Error: ${resultado.error.message}`;

    }


    return;

}


            mensaje.textContent =
                varianteId

                    ? 'Variante actualizada.'

                    : 'Variante agregada.';


            limpiarFormularioVariante();


            await cargarVariantesAdmin(
                productoId
            );

        }
    );

}


/* =========================================================
   EDITAR VARIANTE
   ========================================================= */

function editarVarianteAdmin(
    variante
) {

    document.getElementById(
        'admin-variante-id'
    ).value =
        variante.id;


    document.getElementById(
        'admin-variante-color'
    ).value =
        variante.color_nombre || '';


    document.getElementById(
        'admin-variante-codigo'
    ).value =
        variante.color_codigo ||
        '#111111';


    document.getElementById(
        'admin-variante-talla'
    ).value =
        variante.talla || '';


    document.getElementById(
        'admin-variante-stock'
    ).value =
        variante.stock ?? 0;


    document.getElementById(
        'admin-guardar-variante'
    ).textContent =
        'Guardar cambios';


    document.getElementById(
        'admin-cancelar-variante'
    ).hidden =
        false;

}


/* =========================================================
   CANCELAR EDICIÓN VARIANTE
   ========================================================= */

const botonCancelarVariante =
    document.getElementById(
        'admin-cancelar-variante'
    );


if (botonCancelarVariante) {

    botonCancelarVariante.addEventListener(
        'click',
        limpiarFormularioVariante
    );

}


/* =========================================================
   LIMPIAR FORMULARIO VARIANTE
   ========================================================= */

function limpiarFormularioVariante() {

    if (!formVariante) return;


    formVariante.reset();


    const id =
        document.getElementById(
            'admin-variante-id'
        );


    if (id) {

        id.value =
            '';

    }


    const codigo =
        document.getElementById(
            'admin-variante-codigo'
        );


    if (codigo) {

        codigo.value =
            '#111111';

    }


    const stock =
        document.getElementById(
            'admin-variante-stock'
        );


    if (stock) {

        stock.value =
            0;

    }


    const botonGuardar =
        document.getElementById(
            'admin-guardar-variante'
        );


    if (botonGuardar) {

        botonGuardar.textContent =
            '+ Agregar variante';

    }


    if (botonCancelarVariante) {

        botonCancelarVariante.hidden =
            true;

    }

}


/* =========================================================
   ELIMINAR VARIANTE
   ========================================================= */

async function eliminarVarianteAdmin(
    varianteId
) {

    const productoId =
        document.getElementById(
            'admin-producto-id'
        ).value;


    if (!productoId) return;


    const confirmar =
        window.confirm(
            '¿Seguro que quieres eliminar esta variante?'
        );


    if (!confirmar) return;


    const {
        error
    } =
        await supabaseClient

            .from(
                'variantes_producto'
            )

            .delete()

            .eq(
                'id',
                varianteId
            );


    const mensaje =
        document.getElementById(
            'admin-variante-mensaje'
        );


    if (error) {

        console.error(
            'Error eliminando variante:',
            error
        );


        if (mensaje) {

            mensaje.textContent =
                `Error: ${error.message}`;

        }


        return;

    }


    if (mensaje) {

        mensaje.textContent =
            'Variante eliminada.';

    }


    await cargarVariantesAdmin(
        productoId
    );

}


/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

function formatearPrecioAdmin(
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
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        const protegido =
            await protegerPanelAdmin();


        if (
            protegido
        ) {

            await cargarProductosAdmin();

        }

    }
);