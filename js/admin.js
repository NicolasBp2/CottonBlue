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


await cargarCategoriasEnFormulario(
    data.categoria || ''
);



  await cargarCategoriasEnFormulario(
    data.categoria || ''
);

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
   VENTAS
   ========================================================= */

let ventaItems = [];
let productosVenta = [];
let variantesVenta = [];


/* =========================================================
   ELEMENTOS VENTAS
   ========================================================= */

const botonAbrirVentas =
    document.getElementById(
        'admin-abrir-ventas'
    );

const botonCerrarVentas =
    document.getElementById(
        'admin-cerrar-ventas'
    );

const seccionVentas =
    document.getElementById(
        'admin-ventas-seccion'
    );

const selectProductoVenta =
    document.getElementById(
        'admin-venta-producto'
    );

const selectVarianteVenta =
    document.getElementById(
        'admin-venta-variante'
    );

const inputCantidadVenta =
    document.getElementById(
        'admin-venta-cantidad-item'
    );

const stockVenta =
    document.getElementById(
        'admin-venta-stock'
    );

const botonAgregarItemVenta =
    document.getElementById(
        'admin-agregar-item-venta'
    );

const botonGuardarVenta =
    document.getElementById(
        'admin-guardar-venta'
    );

const botonCancelarVenta =
    document.getElementById(
        'admin-cancelar-venta'
    );

const selectorMesVentas =
    document.getElementById(
        'admin-ventas-mes'
    );
/* =========================================================
   PESTAÑAS VENTAS / DEVOLUCIONES
   ========================================================= */

const tabVentas =
    document.getElementById(
        'admin-tab-ventas'
    );

const tabDevoluciones =
    document.getElementById(
        'admin-tab-devoluciones'
    );

const panelVentas =
    document.getElementById(
        'admin-panel-ventas'
    );

const panelDevoluciones =
    document.getElementById(
        'admin-panel-devoluciones'
    );


function mostrarPestanaVentas() {

    if (panelVentas) {
        panelVentas.hidden = false;
    }

    if (panelDevoluciones) {
        panelDevoluciones.hidden = true;
    }

    if (tabVentas) {
        tabVentas.classList.add(
            'activo'
        );
    }

    if (tabDevoluciones) {
        tabDevoluciones.classList.remove(
            'activo'
        );
    }

}


async function mostrarPestanaDevoluciones() {

    if (panelVentas) {
        panelVentas.hidden = true;
    }

    if (panelDevoluciones) {
        panelDevoluciones.hidden = false;
    }

    if (tabVentas) {
        tabVentas.classList.remove(
            'activo'
        );
    }

    if (tabDevoluciones) {
        tabDevoluciones.classList.add(
            'activo'
        );
    }
await cargarHistorialVentas();
}


if (tabVentas) {

    tabVentas.addEventListener(
        'click',
        mostrarPestanaVentas
    );

}


if (tabDevoluciones) {

    tabDevoluciones.addEventListener(
        'click',
        mostrarPestanaDevoluciones
    );

}

/* =========================================================
   ABRIR / CERRAR VENTAS
   ========================================================= */

if (
    botonAbrirVentas &&
    seccionVentas
) {

    botonAbrirVentas.addEventListener(
        'click',
        async () => {

            seccionVentas.style.display =
                'block';

            await cargarProductosVenta();
            await cargarHistorialVentas();

            seccionVentas.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }
    );

}


if (
    botonCerrarVentas &&
    seccionVentas
) {

    botonCerrarVentas.addEventListener(
        'click',
        () => {

            seccionVentas.style.display =
                'none';

        }
    );

}


/* =========================================================
   CARGAR PRODUCTOS PARA VENTA
   ========================================================= */

async function cargarProductosVenta() {

    if (!selectProductoVenta) return;

    selectProductoVenta.innerHTML =
        '<option value="">Cargando productos...</option>';


    const {
        data,
        error
    } =
        await supabaseClient

            .from('productos')

            .select(
                'id, nombre, precio, activo'
            )

            .eq(
                'activo',
                true
            )

            .order(
                'nombre',
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            'Error cargando productos para venta:',
            error
        );

        selectProductoVenta.innerHTML =
            '<option value="">No se pudieron cargar</option>';

        return;

    }


    productosVenta =
        data || [];


    selectProductoVenta.innerHTML =
        '<option value="">Seleccionar producto</option>';


    productosVenta.forEach(
        producto => {

            const opcion =
                document.createElement(
                    'option'
                );

            opcion.value =
                producto.id;

            opcion.textContent =
                `${producto.nombre} - ${formatearPrecioAdmin(producto.precio)}`;

            selectProductoVenta.appendChild(
                opcion
            );

        }
    );

}


/* =========================================================
   PRODUCTO SELECCIONADO
   ========================================================= */

if (selectProductoVenta) {

    selectProductoVenta.addEventListener(
        'change',
        async () => {

            const productoId =
                Number(
                    selectProductoVenta.value
                );



            if (!productoId) {

                selectVarianteVenta.innerHTML =
                    '<option value="">Seleccionar variante</option>';

                selectVarianteVenta.disabled =
                    true;

                stockVenta.textContent =
                    '—';

                return;

            }


            await cargarVariantesVenta(
                productoId
            );

        }
    );

}


/* =========================================================
   CARGAR VARIANTES DEL PRODUCTO
   ========================================================= */

async function cargarVariantesVenta(
    productoId
) {

    selectVarianteVenta.disabled =
        true;

    selectVarianteVenta.innerHTML =
        '<option value="">Cargando variantes...</option>';

    stockVenta.textContent =
        '—';


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                'variantes_producto'
            )

            .select(
                'id, producto_id, talla, color_nombre, stock, activo'
            )

            .eq(
                'producto_id',
                productoId
            )

            .eq(
                'activo',
                true
            )

            .order(
                'color_nombre',
                {
                    ascending: true
                }
            )

            .order(
                'talla',
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            'Error cargando variantes:',
            error
        );

        selectVarianteVenta.innerHTML =
            '<option value="">No se pudieron cargar</option>';

        return;

    }


    variantesVenta =
        data || [];


    selectVarianteVenta.innerHTML =
        '<option value="">Seleccionar variante</option>';


    variantesVenta.forEach(
        variante => {

            const opcion =
                document.createElement(
                    'option'
                );

            opcion.value =
                variante.id;

            opcion.textContent =
                `${variante.color_nombre} / ${variante.talla} - Stock: ${variante.stock}`;

            selectVarianteVenta.appendChild(
                opcion
            );

        }
    );


    selectVarianteVenta.disabled =
        variantesVenta.length === 0;

}


/* =========================================================
   MOSTRAR STOCK
   ========================================================= */

if (selectVarianteVenta) {

    selectVarianteVenta.addEventListener(
        'change',
        () => {

            const varianteId =
                Number(
                    selectVarianteVenta.value
                );


            const variante =
                variantesVenta.find(
                    item =>
                        Number(item.id) ===
                        varianteId
                );


            stockVenta.textContent =
                variante
                    ? variante.stock
                    : '—';

        }
    );

}


/* =========================================================
   AGREGAR PRODUCTO A LA VENTA
   ========================================================= */

if (botonAgregarItemVenta) {

    botonAgregarItemVenta.addEventListener(
        'click',
        () => {

            const productoId =
                Number(
                    selectProductoVenta.value
                );

            const varianteId =
                Number(
                    selectVarianteVenta.value
                );

            const cantidad =
                Number(
                    inputCantidadVenta.value
                );


            const producto =
                productosVenta.find(
                    item =>
                        Number(item.id) ===
                        productoId
                );


            const variante =
                variantesVenta.find(
                    item =>
                        Number(item.id) ===
                        varianteId
                );


            const mensaje =
                document.getElementById(
                    'admin-venta-mensaje'
                );


            if (
                !producto ||
                !variante
            ) {

                mensaje.textContent =
                    'Selecciona un producto y una variante.';

                return;

            }


            if (
                !cantidad ||
                cantidad <= 0
            ) {

                mensaje.textContent =
                    'La cantidad debe ser mayor que cero.';

                return;

            }


            if (
                cantidad >
                Number(variante.stock)
            ) {

                mensaje.textContent =
                    `Solo hay ${variante.stock} unidad(es) disponibles.`;

                return;

            }


            const itemExistente =
                ventaItems.find(
                    item =>
                        Number(item.variante_id) ===
                        varianteId
                );


            if (itemExistente) {

                const nuevaCantidad =
                    Number(
                        itemExistente.cantidad
                    ) +
                    cantidad;


                if (
                    nuevaCantidad >
                    Number(variante.stock)
                ) {

                    mensaje.textContent =
                        `No puedes superar el stock disponible de ${variante.stock}.`;

                    return;

                }


                itemExistente.cantidad =
                    nuevaCantidad;

            }

            else {

                ventaItems.push({

                    producto_id:
                        producto.id,

                    producto_nombre:
                        producto.nombre,

                    variante_id:
                        variante.id,

                    talla:
                        variante.talla,

                    color:
                        variante.color_nombre,

                    stock:
                        variante.stock,

                    precio:
                        producto.precio,

                    cantidad:
                        cantidad

                });

            }


            mensaje.textContent =
                '';

            inputCantidadVenta.value =
                1;


            renderizarItemsVenta();

        }
    );

}


/* =========================================================
   MOSTRAR ITEMS DE LA VENTA
   ========================================================= */

function renderizarItemsVenta() {

    const contenedor =
        document.getElementById(
            'admin-venta-items'
        );

    const totalElemento =
        document.getElementById(
            'admin-venta-total'
        );


    if (
        !contenedor ||
        !totalElemento
    ) {

        return;

    }


    contenedor.innerHTML =
        '';


    if (
        ventaItems.length === 0
    ) {

        contenedor.innerHTML =
            `
                <p class="admin-venta-items-vacio">
                    Todavía no has agregado productos a esta venta.
                </p>
            `;

        totalElemento.textContent =
            '$0';

        return;

    }


    let total =
        0;


    ventaItems.forEach(
        item => {

            const subtotal =
                Number(item.precio) *
                Number(item.cantidad);


            total +=
                subtotal;


            const fila =
                document.createElement(
                    'div'
                );


            fila.className =
                'admin-venta-item';


            fila.innerHTML = `

                <div class="admin-venta-item-info">

                    <strong>
                        ${item.producto_nombre}
                    </strong>

                    <span>
                        ${item.color} / ${item.talla}
                    </span>

                </div>


                <div class="admin-venta-item-cantidad">

                    ${item.cantidad}
                    ×
                    ${formatearPrecioAdmin(item.precio)}

                </div>


                <strong>
                    ${formatearPrecioAdmin(subtotal)}
                </strong>


                <button
                    type="button"
                    class="admin-venta-item-eliminar"
                    data-id="${item.variante_id}"
                >
                    ×
                </button>

            `;


            contenedor.appendChild(
                fila
            );

        }
    );


    totalElemento.textContent =
        formatearPrecioAdmin(
            total
        );


    document
        .querySelectorAll(
            '.admin-venta-item-eliminar'
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    'click',
                    () => {

                        const varianteId =
                            Number(
                                boton.dataset.id
                            );


                        ventaItems =
                            ventaItems.filter(
                                item =>
                                    Number(item.variante_id) !==
                                    varianteId
                            );


                        renderizarItemsVenta();

                    }
                );

            }
        );

}


/* =========================================================
   LIMPIAR VENTA
   ========================================================= */

function limpiarVentaAdmin() {

    ventaItems =
        [];

const fechaVenta =
    document.getElementById(
        'admin-venta-fecha'
    );
    const canal =
        document.getElementById(
            'admin-venta-canal'
        );

    const metodo =
        document.getElementById(
            'admin-venta-metodo'
        );

    const cliente =
        document.getElementById(
            'admin-venta-cliente'
        );

    const nota =
        document.getElementById(
            'admin-venta-nota'
        );

    const mensaje =
        document.getElementById(
            'admin-venta-mensaje'
        );
if (fechaVenta) {
    fechaVenta.value = '';
}

if (canal) canal.value = '';
if (metodo) metodo.value = '';
if (cliente) cliente.value = '';
if (nota) nota.value = '';

    if (selectProductoVenta) {
        selectProductoVenta.value = '';
    }

    if (selectVarianteVenta) {

        selectVarianteVenta.innerHTML =
            '<option value="">Seleccionar variante</option>';

        selectVarianteVenta.disabled =
            true;

    }

    if (stockVenta) {
        stockVenta.textContent = '—';
    }

    if (inputCantidadVenta) {
        inputCantidadVenta.value = 1;
    }

    if (mensaje) {
        mensaje.textContent = '';
    }


    renderizarItemsVenta();

}


if (botonCancelarVenta) {

    botonCancelarVenta.addEventListener(
        'click',
        limpiarVentaAdmin
    );

}

/* =========================================================
   REGISTRAR VENTA EN SUPABASE
   ========================================================= */

if (botonGuardarVenta) {

    botonGuardarVenta.addEventListener(
        'click',
        async () => {

            const fechaVenta =
                document.getElementById(
                    'admin-venta-fecha'
                ).value;

            const canal =
                document.getElementById(
                    'admin-venta-canal'
                ).value;

            const metodo =
                document.getElementById(
                    'admin-venta-metodo'
                ).value;

            const cliente =
                document.getElementById(
                    'admin-venta-cliente'
                ).value.trim();

            const nota =
                document.getElementById(
                    'admin-venta-nota'
                ).value.trim();

            const mensaje =
                document.getElementById(
                    'admin-venta-mensaje'
                );


            if (
                !fechaVenta ||
                !canal ||
                !metodo
            ) {

                mensaje.textContent =
                    'Selecciona la fecha, el canal de venta y el método de pago.';

                return;

            }


            if (
                ventaItems.length === 0
            ) {

                mensaje.textContent =
                    'Agrega al menos un producto a la venta.';

                return;

            }


            botonGuardarVenta.disabled =
                true;

            botonGuardarVenta.textContent =
                'Registrando...';

            mensaje.textContent =
                '';


            const itemsRPC =
                ventaItems.map(
                    item => ({

                        variante_id:
                            item.variante_id,

                        cantidad:
                            item.cantidad

                    })
                );


            const {
                data,
                error
            } =
                await supabaseClient
                    .rpc(
                        'registrar_venta',
                        {

                            p_fecha_venta:
                                fechaVenta,

                            p_canal_venta:
                                canal,

                            p_metodo_pago:
                                metodo,

                            p_cliente:
                                cliente || null,

                            p_nota:
                                nota || null,

                            p_items:
                                itemsRPC

                        }
                    );


            botonGuardarVenta.disabled =
                false;

            botonGuardarVenta.textContent =
                'Registrar venta';


            if (error) {

                console.error(
                    'Error registrando venta:',
                    error
                );

                mensaje.textContent =
                    `No se pudo registrar la venta: ${error.message}`;

                return;

            }


            limpiarVentaAdmin();

            mensaje.textContent =
                `Venta #${data} registrada correctamente.`;


            await cargarProductosVenta();
            await cargarHistorialVentas();
            await cargarProductosAdmin();

        }
    );

}
/* =========================================================
   MES ACTUAL
   ========================================================= */

function establecerMesActualVentas() {

    if (!selectorMesVentas) return;

    // Si ya hay un mes seleccionado,
    // no lo cambiamos.
    if (selectorMesVentas.value) {
        return;
    }

    const fecha =
        new Date();

    const anio =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(
            2,
            '0'
        );

    selectorMesVentas.value =
        `${anio}-${mes}`;

}


if (selectorMesVentas) {

    establecerMesActualVentas();


    selectorMesVentas.addEventListener(
        'change',
        cargarHistorialVentas
    );

}


/* =========================================================
   HISTORIAL DE VENTAS
   ========================================================= */
async function cargarHistorialVentas() {

    if (!selectorMesVentas) return;


    const lista =
        document.getElementById(
            'admin-ventas-lista'
        );


    if (!lista) return;


    const valorMes =
        selectorMesVentas.value;


    if (!valorMes) return;


    const [
        anio,
        mes
    ] =
        valorMes
            .split('-')
            .map(Number);


    const inicio =
        new Date(
            anio,
            mes - 1,
            1
        );


    const fin =
        new Date(
            anio,
            mes,
            1
        );


    lista.innerHTML =
        '<p>Cargando ventas...</p>';


    /* =============================================
       CARGAR VENTAS
       ============================================= */

    const {
        data: ventas,
        error: errorVentas
    } =
        await supabaseClient

            .from(
                'ventas'
            )

            .select(`
                id,
                fecha_venta,
                canal_venta,
                metodo_pago,
                cliente,
                nota,
                total,
                anulada,
                fecha_anulacion,
                motivo_anulacion,
                venta_detalles (
                    id,
                    producto_nombre,
                    talla,
                    color,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
            `)

            .gte(
                'fecha_venta',
                inicio.toISOString()
            )

            .lt(
                'fecha_venta',
                fin.toISOString()
            )

            .order(
                'fecha_venta',
                {
                    ascending: false
                }
            );


    if (errorVentas) {

        console.error(
            'Error cargando ventas:',
            errorVentas
        );

        lista.innerHTML =
            '<p>No se pudieron cargar las ventas.</p>';

        return;

    }


    /* =============================================
       CARGAR DEVOLUCIONES
       ============================================= */

    const {
        data: devoluciones,
        error: errorDevoluciones
    } =
        await supabaseClient

            .from(
                'devoluciones'
            )

            .select(`
                id,
                venta_id,
                motivo,
                total_devuelto,
                created_at,
                devolucion_detalles (
                    id,
                    venta_detalle_id,
                    cantidad,
                    subtotal
                )
            `)

            .gte(
                'created_at',
                inicio.toISOString()
            )

            .lt(
                'created_at',
                fin.toISOString()
            )

            .order(
                'created_at',
                {
                    ascending: false
                }
            );


    if (errorDevoluciones) {

        console.error(
            'Error cargando devoluciones:',
            errorDevoluciones
        );

    }


    renderizarHistorialVentas(
        ventas || [],
        devoluciones || []
    );


    renderizarHistorialDevoluciones(
        devoluciones || []
    );

}


/* =========================================================
   MOSTRAR HISTORIAL Y RESUMEN
   ========================================================= */
function renderizarHistorialVentas(
    ventas,
    devoluciones = []
) {

    const lista =
        document.getElementById(
            'admin-ventas-lista'
        );

    const ingresos =
        document.getElementById(
            'admin-ventas-ingresos'
        );

    const cantidadVentas =
        document.getElementById(
            'admin-ventas-cantidad'
        );

    const unidades =
        document.getElementById(
            'admin-ventas-unidades'
        );

    const textoMes =
        document.getElementById(
            'admin-ventas-mes-texto'
        );

    const productoTop =
        document.getElementById(
            'admin-ventas-producto-top'
        );

    const varianteTop =
        document.getElementById(
            'admin-ventas-variante-top'
        );


    /* =====================================================
       DEVOLUCIONES POR DETALLE
       ===================================================== */

    const cantidadesDevueltasPorDetalle = {};


    devoluciones.forEach(
        devolucion => {

            (
                devolucion.devolucion_detalles ||
                []
            ).forEach(
                detalle => {

                    const detalleId =
                        Number(
                            detalle.venta_detalle_id
                        );


                    if (
                        !cantidadesDevueltasPorDetalle[
                            detalleId
                        ]
                    ) {

                        cantidadesDevueltasPorDetalle[
                            detalleId
                        ] = 0;

                    }


                    cantidadesDevueltasPorDetalle[
                        detalleId
                    ] +=
                        Number(
                            detalle.cantidad || 0
                        );

                }
            );

        }
    );


    /* =====================================================
       ESTADÍSTICAS NETAS
       ===================================================== */

    let totalIngresos = 0;
    let totalUnidades = 0;
    let cantidadVentasActivas = 0;

    const resumenCanales = {};
    const resumenMetodos = {};
    const resumenProductos = {};
    const resumenVariantes = {};


    ventas.forEach(
        venta => {

            /*
                Las anuladas pueden permanecer
                en el historial, pero no cuentan.
            */

            if (venta.anulada) {
                return;
            }


            const detalles =
                venta.venta_detalles || [];


            let totalVentaNeto = 0;
            let unidadesVentaNetas = 0;


            detalles.forEach(
                detalle => {

                    const cantidadVendida =
                        Number(
                            detalle.cantidad || 0
                        );


                    const cantidadDevuelta =
                        Number(
                            cantidadesDevueltasPorDetalle[
                                Number(detalle.id)
                            ] || 0
                        );


                    const cantidadNeta =
                        Math.max(
                            0,
                            cantidadVendida -
                            cantidadDevuelta
                        );


                    /*
                        Si este producto fue devuelto
                        completamente, ya no cuenta.
                    */

                    if (
                        cantidadNeta <= 0
                    ) {

                        return;

                    }


                    const precioUnitario =
                        Number(
                            detalle.precio_unitario || 0
                        );


                    const subtotalNeto =
                        cantidadNeta *
                        precioUnitario;


                    totalVentaNeto +=
                        subtotalNeto;


                    unidadesVentaNetas +=
                        cantidadNeta;


                    const nombreProducto =
                        detalle.producto_nombre ||
                        'Sin nombre';


                    if (
                        !resumenProductos[
                            nombreProducto
                        ]
                    ) {

                        resumenProductos[
                            nombreProducto
                        ] = 0;

                    }


                    resumenProductos[
                        nombreProducto
                    ] +=
                        cantidadNeta;


                    const nombreVariante =
                        `${detalle.producto_nombre} - ${detalle.color} / ${detalle.talla}`;


                    if (
                        !resumenVariantes[
                            nombreVariante
                        ]
                    ) {

                        resumenVariantes[
                            nombreVariante
                        ] = 0;

                    }


                    resumenVariantes[
                        nombreVariante
                    ] +=
                        cantidadNeta;

                }
            );


            /*
                Si toda la venta fue devuelta,
                deja de contar como venta activa.
            */

            if (
                unidadesVentaNetas <= 0
            ) {

                return;

            }


            cantidadVentasActivas += 1;

            totalIngresos +=
                totalVentaNeto;

            totalUnidades +=
                unidadesVentaNetas;


            /* ==============================
               CANALES
               ============================== */

            const canal =
                venta.canal_venta ||
                'Otro';


            if (
                !resumenCanales[
                    canal
                ]
            ) {

                resumenCanales[
                    canal
                ] = {

                    ventas: 0,
                    ingresos: 0

                };

            }


            resumenCanales[
                canal
            ].ventas += 1;


            resumenCanales[
                canal
            ].ingresos +=
                totalVentaNeto;


            /* ==============================
               MÉTODOS DE PAGO
               ============================== */

            const metodo =
                venta.metodo_pago ||
                'Otro';


            if (
                !resumenMetodos[
                    metodo
                ]
            ) {

                resumenMetodos[
                    metodo
                ] = {

                    ventas: 0,
                    ingresos: 0

                };

            }


            resumenMetodos[
                metodo
            ].ventas += 1;


            resumenMetodos[
                metodo
            ].ingresos +=
                totalVentaNeto;

        }
    );


    /* =====================================================
       MOSTRAR ESTADÍSTICAS
       ===================================================== */

    if (ingresos) {

        ingresos.textContent =
            formatearPrecioAdmin(
                totalIngresos
            );

    }


    if (cantidadVentas) {

        cantidadVentas.textContent =
            cantidadVentasActivas;

    }


    if (unidades) {

        unidades.textContent =
            totalUnidades;

    }


    const productoMasVendido =
        obtenerElementoMasVendido(
            resumenProductos
        );


    const varianteMasVendida =
        obtenerElementoMasVendido(
            resumenVariantes
        );


    if (productoTop) {

        productoTop.textContent =
            productoMasVendido
                ? `${productoMasVendido.nombre} (${productoMasVendido.cantidad})`
                : '—';

    }


    if (varianteTop) {

        varianteTop.textContent =
            varianteMasVendida
                ? `${varianteMasVendida.nombre} (${varianteMasVendida.cantidad})`
                : '—';

    }


    renderizarDesgloseVentas(
        'admin-ventas-canales',
        resumenCanales
    );


    renderizarDesgloseVentas(
        'admin-ventas-metodos',
        resumenMetodos
    );


    /* =====================================================
       TEXTO DEL MES
       ===================================================== */

    if (
        selectorMesVentas &&
        selectorMesVentas.value &&
        textoMes
    ) {

        const [
            anio,
            mes
        ] =
            selectorMesVentas.value
                .split('-')
                .map(Number);


        const fecha =
            new Date(
                anio,
                mes - 1,
                1
            );


        textoMes.textContent =
            fecha.toLocaleDateString(
                'es-CO',
                {

                    month: 'long',
                    year: 'numeric'

                }
            );

    }


    /* =====================================================
       HISTORIAL
       ===================================================== */

    if (!lista) {
        return;
    }


    lista.innerHTML =
        '';


    let ventasVisibles =
        0;


    ventas.forEach(
        venta => {

            const detalles =
                venta.venta_detalles || [];


            const detallesNetos = [];


            let totalVentaNeto = 0;


            detalles.forEach(
                detalle => {

                    const cantidadVendida =
                        Number(
                            detalle.cantidad || 0
                        );


                    const cantidadDevuelta =
                        Number(
                            cantidadesDevueltasPorDetalle[
                                Number(detalle.id)
                            ] || 0
                        );


                    const cantidadNeta =
                        Math.max(
                            0,
                            cantidadVendida -
                            cantidadDevuelta
                        );


                    if (
                        cantidadNeta <= 0
                    ) {

                        return;

                    }


                    const precioUnitario =
                        Number(
                            detalle.precio_unitario || 0
                        );


                    const subtotalNeto =
                        cantidadNeta *
                        precioUnitario;


                    totalVentaNeto +=
                        subtotalNeto;


                    detallesNetos.push({

                        ...detalle,

                        cantidadNeta,
                        subtotalNeto

                    });

                }
            );


            /*
                Venta totalmente devuelta:
                NO aparece en historial de ventas.

                Las anuladas sí pueden seguir apareciendo.
            */

            if (
                !venta.anulada &&
                detallesNetos.length === 0
            ) {

                return;

            }


            ventasVisibles += 1;


            const tarjeta =
                document.createElement(
                    'article'
                );


            tarjeta.className =
                'admin-venta-historial-card';


            if (venta.anulada) {

                tarjeta.classList.add(
                    'admin-venta-historial-card-anulada'
                );

            }


            const fecha =
                new Date(
                    venta.fecha_venta
                );


            const detallesParaMostrar =
                venta.anulada
                    ? detalles
                    : detallesNetos;


            const detallesHTML =
                detallesParaMostrar
                    .map(
                        detalle => {

                            const cantidadMostrar =
                                venta.anulada
                                    ? Number(
                                        detalle.cantidad || 0
                                    )
                                    : detalle.cantidadNeta;


                            const subtotalMostrar =
                                venta.anulada
                                    ? Number(
                                        detalle.subtotal || 0
                                    )
                                    : detalle.subtotalNeto;


                            return `

                                <li>

                                    <span>
                                        ${detalle.producto_nombre}
                                        —
                                        ${detalle.color} /
                                        ${detalle.talla}
                                    </span>

                                    <span>
                                        ${cantidadMostrar}
                                        ×
                                        ${formatearPrecioAdmin(
                                            detalle.precio_unitario
                                        )}
                                    </span>

                                    <strong>
                                        ${formatearPrecioAdmin(
                                            subtotalMostrar
                                        )}
                                    </strong>

                                </li>

                            `;

                        }
                    )
                    .join('');


            const totalMostrar =
                venta.anulada
                    ? Number(
                        venta.total || 0
                    )
                    : totalVentaNeto;


            tarjeta.innerHTML = `

                <div class="admin-venta-historial-header">

                    <div>

                        <strong>
                            Venta #${venta.id}
                        </strong>

                        <span>
                            ${fecha.toLocaleString('es-CO')}
                        </span>

                    </div>


                    <strong>
                        ${formatearPrecioAdmin(
                            totalMostrar
                        )}
                    </strong>

                </div>


                <div class="admin-venta-historial-meta">

                    <span>
                        ${venta.canal_venta}
                    </span>

                    <span>
                        ${venta.metodo_pago}
                    </span>


                    ${
                        venta.cliente
                            ? `<span>${venta.cliente}</span>`
                            : ''
                    }

                </div>


                <ul class="admin-venta-historial-detalles">

                    ${detallesHTML}

                </ul>


                ${
                    venta.nota

                        ? `
                            <p class="admin-venta-historial-nota">
                                ${venta.nota}
                            </p>
                        `

                        : ''
                }


                ${
                    venta.anulada

                        ? `
                            <div class="admin-venta-anulada">

                                <strong>
                                    Venta anulada
                                </strong>

                                ${
                                    venta.motivo_anulacion

                                        ? `
                                            <span>
                                                Motivo: ${venta.motivo_anulacion}
                                            </span>
                                        `

                                        : ''
                                }

                                ${
                                    venta.fecha_anulacion

                                        ? `
                                            <span>
                                                ${new Date(
                                                    venta.fecha_anulacion
                                                ).toLocaleString('es-CO')}
                                            </span>
                                        `

                                        : ''
                                }

                            </div>
                        `

                        : `
                            <button
                                type="button"
                                class="admin-abrir-devolucion"
                                data-id="${venta.id}"
                            >
                                Gestionar devolución
                            </button>
                        `
                }

            `;


            lista.appendChild(
                tarjeta
            );

        }
    );


    if (
        ventasVisibles === 0
    ) {

        lista.innerHTML =
            '<p>No hay ventas activas registradas en este mes.</p>';

    }

}
/* =========================================================
   MOSTRAR DESGLOSE DE VENTAS
   ========================================================= */

function renderizarDesgloseVentas(
    contenedorId,
    datos
) {

    const contenedor =
        document.getElementById(
            contenedorId
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML =
        '';


    const entradas =
        Object.entries(
            datos
        );


    if (
        entradas.length === 0
    ) {

        contenedor.innerHTML =
            '<p>Sin datos todavía.</p>';

        return;

    }


    entradas.forEach(
        ([
            nombre,
            resumen
        ]) => {

            const fila =
                document.createElement(
                    'div'
                );


            fila.className =
                'admin-ventas-desglose-fila';


            fila.innerHTML = `

                <div>

                    <strong>
                        ${nombre}
                    </strong>

                    <span>
                        ${resumen.ventas}
                        venta${resumen.ventas === 1 ? '' : 's'}
                    </span>

                </div>


                <strong>
                    ${formatearPrecioAdmin(
                        resumen.ingresos
                    )}
                </strong>

            `;


            contenedor.appendChild(
                fila
            );

        }
    );

}
function obtenerElementoMasVendido(
    datos
) {

    const entradas =
        Object.entries(
            datos
        );


    if (
        entradas.length === 0
    ) {

        return null;

    }


    let mayor =
        entradas[0];


    entradas.forEach(
        entrada => {

            if (
                Number(entrada[1]) >
                Number(mayor[1])
            ) {

                mayor =
                    entrada;

            }

        }
    );


    return {

        nombre:
            mayor[0],

        cantidad:
            mayor[1]

    };

}
/* =========================================================
   ANULAR VENTA
   ========================================================= */

document.addEventListener(
    'click',
    async evento => {

        const boton =
            evento.target.closest(
                '.admin-anular-venta'
            );

        if (!boton) return;


        const ventaId =
            Number(
                boton.dataset.id
            );


        const confirmar =
            window.confirm(
                `¿Seguro que quieres anular la venta #${ventaId}?`
            );


        if (!confirmar) {
            return;
        }


        const motivo =
            window.prompt(
                'Escribe el motivo de la anulación:'
            );


        if (motivo === null) {
            return;
        }


        boton.disabled =
            true;

        boton.textContent =
            'Anulando...';


        const {
            error
        } =
            await supabaseClient
                .rpc(
                    'anular_venta',
                    {
                        p_venta_id:
                            ventaId,

                        p_motivo:
                            motivo.trim() || null
                    }
                );


        if (error) {

            console.error(
                'Error anulando venta:',
                error
            );

            window.alert(
                `No se pudo anular la venta: ${error.message}`
            );

            boton.disabled =
                false;

            boton.textContent =
                'Anular venta';

            return;

        }


        await cargarHistorialVentas();

        await cargarProductosVenta();

        await cargarProductosAdmin();


        window.alert(
            `Venta #${ventaId} anulada correctamente. El stock fue repuesto.`
        );

    }
);
/* =========================================================
   DEVOLUCIONES
   ========================================================= */

let ventaDevolucionActual = null;


document.addEventListener(
    'click',
    evento => {

        const boton =
            evento.target.closest(
                '.admin-abrir-devolucion'
            );

        if (!boton) return;


        const ventaId =
            Number(
                boton.dataset.id
            );


        abrirModalDevolucion(
            ventaId
        );

    }
);


async function abrirModalDevolucion(
    ventaId
) {

    const modal =
        document.getElementById(
            'admin-devolucion-modal'
        );

    const contenedor =
        document.getElementById(
            'admin-devolucion-productos'
        );

    const titulo =
        document.getElementById(
            'admin-devolucion-venta'
        );

    const mensaje =
        document.getElementById(
            'admin-devolucion-mensaje'
        );


    if (
        !modal ||
        !contenedor
    ) {
        return;
    }


    mensaje.textContent =
        '';

    contenedor.innerHTML =
        '<p>Cargando productos...</p>';


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                'venta_detalles'
            )

            .select(`
                id,
                producto_nombre,
                talla,
                color,
                cantidad,
                precio_unitario
            `)

            .eq(
                'venta_id',
                ventaId
            );


    if (error) {

        console.error(
            'Error cargando venta:',
            error
        );

        mensaje.textContent =
            'No se pudo cargar la venta.';

        return;

    }


    ventaDevolucionActual = {
        id: ventaId,
        detalles: data || []
    };


    titulo.textContent =
        `Venta #${ventaId}`;


    contenedor.innerHTML =
        '';


    ventaDevolucionActual.detalles
        .forEach(
            detalle => {

                const fila =
                    document.createElement(
                        'div'
                    );


                fila.className =
                    'admin-devolucion-item';


                fila.innerHTML = `

                    <div>

                        <strong>
                            ${detalle.producto_nombre}
                        </strong>

                        <span>
                            ${detalle.color} / ${detalle.talla}
                        </span>

                        <span>
                            Vendidas: ${detalle.cantidad}
                        </span>

                    </div>


                    <div>

                        <label>
                            Devolver
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="${detalle.cantidad}"
                            value="0"
                            class="admin-devolucion-cantidad"
                            data-id="${detalle.id}"
                        >

                    </div>

                `;


                contenedor.appendChild(
                    fila
                );

            }
        );


    modal.hidden =
        false;

}


function cerrarModalDevolucion() {

    const modal =
        document.getElementById(
            'admin-devolucion-modal'
        );

    const motivo =
        document.getElementById(
            'admin-devolucion-motivo'
        );

    const mensaje =
        document.getElementById(
            'admin-devolucion-mensaje'
        );


    if (modal) {
        modal.hidden = true;
    }


    if (motivo) {
        motivo.value = '';
    }


    if (mensaje) {
        mensaje.textContent = '';
    }


    ventaDevolucionActual =
        null;

}
/* =========================================================
   MOSTRAR HISTORIAL DE DEVOLUCIONES
   ========================================================= */

function renderizarHistorialDevoluciones(
    devoluciones
) {

    const lista =
        document.getElementById(
            'admin-devoluciones-lista'
        );

    const totalElemento =
        document.getElementById(
            'admin-devoluciones-total'
        );

    const cantidadElemento =
        document.getElementById(
            'admin-devoluciones-cantidad'
        );

    const unidadesElemento =
        document.getElementById(
            'admin-devoluciones-unidades'
        );


    let totalDevuelto = 0;
    let unidadesDevueltas = 0;


    devoluciones.forEach(
        devolucion => {

            totalDevuelto +=
                Number(
                    devolucion.total_devuelto || 0
                );


            (
                devolucion.devolucion_detalles ||
                []
            ).forEach(
                detalle => {

                    unidadesDevueltas +=
                        Number(
                            detalle.cantidad || 0
                        );

                }
            );

        }
    );


    if (totalElemento) {

        totalElemento.textContent =
            formatearPrecioAdmin(
                totalDevuelto
            );

    }


    if (cantidadElemento) {

        cantidadElemento.textContent =
            devoluciones.length;

    }


    if (unidadesElemento) {

        unidadesElemento.textContent =
            unidadesDevueltas;

    }


    if (!lista) {
        return;
    }


    lista.innerHTML =
        '';


    if (
        devoluciones.length === 0
    ) {

        lista.innerHTML =
            '<p>No hay devoluciones registradas en este mes.</p>';

        return;

    }


    devoluciones.forEach(
        devolucion => {

            const tarjeta =
                document.createElement(
                    'article'
                );


            tarjeta.className =
                'admin-venta-historial-card';


            const fecha =
                new Date(
                    devolucion.created_at
                );


            tarjeta.innerHTML = `

                <div class="admin-venta-historial-header">

                    <div>

                        <strong>
                            Devolución #${devolucion.id}
                        </strong>

                        <span>
                            Venta #${devolucion.venta_id}
                        </span>

                        <span>
                            ${fecha.toLocaleString('es-CO')}
                        </span>

                    </div>


                    <strong>
                        -${formatearPrecioAdmin(
                            devolucion.total_devuelto
                        )}
                    </strong>

                </div>


                ${
                    devolucion.motivo
                        ? `
                            <p class="admin-venta-historial-nota">
                                Motivo: ${devolucion.motivo}
                            </p>
                        `
                        : ''
                }

            `;


            lista.appendChild(
                tarjeta
            );

        }
    );
}
/* =========================================================
   CERRAR MODAL DE DEVOLUCIÓN
   ========================================================= */

document.addEventListener(
    'click',
    evento => {

        const cerrar =
            evento.target.closest(
                '#admin-cerrar-devolucion'
            );

        const cancelar =
            evento.target.closest(
                '#admin-cancelar-devolucion'
            );


        if (
            cerrar ||
            cancelar
        ) {

            cerrarModalDevolucion();

        }

    }
);


/* =========================================================
   CONFIRMAR DEVOLUCIÓN
   ========================================================= */

document.addEventListener(
    'click',
    async evento => {

        const boton =
            evento.target.closest(
                '#admin-confirmar-devolucion'
            );


        if (!boton) {
            return;
        }


        if (!ventaDevolucionActual) {

            console.error(
                'No hay una venta seleccionada para devolver.'
            );

            return;

        }


        const mensaje =
            document.getElementById(
                'admin-devolucion-mensaje'
            );


        const motivoInput =
            document.getElementById(
                'admin-devolucion-motivo'
            );


        const motivo =
            motivoInput
                ? motivoInput.value.trim()
                : '';


        const inputs =
            document.querySelectorAll(
                '#admin-devolucion-productos .admin-devolucion-cantidad'
            );


        const items =
            [];


        inputs.forEach(
            input => {

                const cantidad =
                    Number(
                        input.value
                    );


                if (
                    cantidad > 0
                ) {

                    items.push({

                        venta_detalle_id:
                            Number(
                                input.dataset.id
                            ),

                        cantidad:
                            cantidad

                    });

                }

            }
        );


        if (
            items.length === 0
        ) {

            if (mensaje) {

                mensaje.textContent =
                    'Selecciona al menos una unidad para devolver.';

            }

            return;

        }


        boton.disabled =
            true;

        boton.textContent =
            'Procesando...';


        if (mensaje) {

            mensaje.textContent =
                '';

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .rpc(
                    'registrar_devolucion',
                    {

                        p_venta_id:
                            Number(
                                ventaDevolucionActual.id
                            ),

                        p_motivo:
                            motivo || null,

                        p_items:
                            items

                    }
                );


        boton.disabled =
            false;

        boton.textContent =
            'Confirmar devolución';


        if (error) {

            console.error(
                'Error registrando devolución:',
                error
            );


            if (mensaje) {

                mensaje.textContent =
                    `Error: ${error.message}`;

            }

            return;

        }


        cerrarModalDevolucion();


        await cargarHistorialVentas();

        await cargarProductosVenta();

        await cargarProductosAdmin();


        if (
            typeof mostrarPestanaDevoluciones ===
            'function'
        ) {

            await mostrarPestanaDevoluciones();

        }


        const mensajeGeneral =
            document.getElementById(
                'admin-venta-mensaje'
            );


        if (mensajeGeneral) {

            mensajeGeneral.textContent =
                `Devolución #${data} registrada correctamente.`;

        }

    }
);
/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        const protegido =
            await protegerPanelAdmin();

        if (protegido) {

            await cargarProductosAdmin();

            await cargarCategoriasAdmin();

            await cargarCategoriasEnFormulario();

        }

    }
);


/* =========================================================
   ABRIR / CERRAR CATEGORÍAS
   ========================================================= */

const botonAbrirCategorias =
    document.getElementById(
        'admin-abrir-categorias'
    );

const botonCerrarCategorias =
    document.getElementById(
        'admin-cerrar-categorias'
    );

const seccionCategorias =
    document.getElementById(
        'admin-categorias-seccion'
    );


if (
    botonAbrirCategorias &&
    seccionCategorias
) {

    botonAbrirCategorias.addEventListener(
        'click',
        () => {

            seccionCategorias.style.display =
                'block';

        }
    );

}


if (
    botonCerrarCategorias &&
    seccionCategorias
) {

    botonCerrarCategorias.addEventListener(
        'click',
        () => {

            seccionCategorias.style.display =
                'none';

        }
    );

}


/* =========================================================
   CATEGORÍAS
   ========================================================= */

let categoriaEditandoId = null;


/* =========================================================
   CARGAR CATEGORÍAS
   ========================================================= */

async function cargarCategoriasAdmin() {

    const lista =
        document.getElementById(
            'admin-categorias-lista'
        );

    if (!lista) return;


    lista.innerHTML =
        '<p>Cargando categorías...</p>';


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                'categorias'
            )

            .select(
                '*'
            )

            .order(
                'orden',
                {
                    ascending: true
                }
            )

            .order(
                'nombre',
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            'Error cargando categorías:',
            error
        );

        lista.innerHTML =
            '<p>No se pudieron cargar las categorías.</p>';

        return;

    }


    renderizarCategoriasAdmin(
        data || []
    );

}


/* =========================================================
   MOSTRAR CATEGORÍAS
   ========================================================= */

function renderizarCategoriasAdmin(
    categorias
) {

    const lista =
        document.getElementById(
            'admin-categorias-lista'
        );

    if (!lista) return;


    lista.innerHTML = '';


    if (categorias.length === 0) {

        lista.innerHTML =
            '<p>Todavía no hay categorías.</p>';

        return;

    }


    categorias.forEach(
        categoria => {

            const fila =
                document.createElement(
                    'div'
                );

            fila.className =
                'admin-categoria-fila';


            fila.innerHTML = `

                <div class="admin-categoria-info">

                    <strong>
                        ${categoria.nombre}
                    </strong>

                    <span>
                        ${categoria.slug}
                    </span>

                </div>


                <div class="admin-categoria-datos">

                    <span>
                        Orden: ${categoria.orden}
                    </span>


                    <span
                        class="${
                            categoria.activo
                                ? 'categoria-estado-activa'
                                : 'categoria-estado-inactiva'
                        }"
                    >
                        ${
                            categoria.activo
                                ? 'Activa'
                                : 'Inactiva'
                        }
                    </span>


                    <button
                        type="button"
                        class="admin-categoria-editar"
                        data-id="${categoria.id}"
                        data-nombre="${categoria.nombre}"
                        data-orden="${categoria.orden}"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="admin-categoria-toggle"
                        data-id="${categoria.id}"
                        data-activo="${categoria.activo}"
                    >
                        ${
                            categoria.activo
                                ? 'Desactivar'
                                : 'Activar'
                        }
                    </button>

                </div>

            `;


            lista.appendChild(
                fila
            );

        }
    );


    const botonesToggle =
        lista.querySelectorAll(
            '.admin-categoria-toggle'
        );


    botonesToggle.forEach(
        boton => {

            boton.addEventListener(
                'click',
                async () => {

                    const id =
                        boton.dataset.id;

                    const activoActual =
                        boton.dataset.activo ===
                        'true';

                    boton.disabled = true;

                    await cambiarEstadoCategoria(
                        id,
                        !activoActual
                    );

                }
            );

        }
    );


    const botonesEditar =
        lista.querySelectorAll(
            '.admin-categoria-editar'
        );


    botonesEditar.forEach(
        boton => {

            boton.addEventListener(
                'click',
                () => {

                    abrirEdicionCategoria(
                        boton.dataset.id,
                        boton.dataset.nombre,
                        boton.dataset.orden
                    );

                }
            );

        }
    );

}


/* =========================================================
   ABRIR EDICIÓN DE CATEGORÍA
   ========================================================= */

function abrirEdicionCategoria(
    id,
    nombre,
    orden
) {

    const inputNombreCategoria =
        document.getElementById(
            'admin-categoria-nombre'
        );

    const inputOrdenCategoria =
        document.getElementById(
            'admin-categoria-orden'
        );

    const mensaje =
        document.getElementById(
            'admin-categoria-mensaje'
        );


    if (
        !inputNombreCategoria ||
        !inputOrdenCategoria ||
        !botonGuardarCategoria
    ) {

        return;

    }


    categoriaEditandoId =
        Number(id);


    inputNombreCategoria.value =
        nombre || '';


    inputOrdenCategoria.value =
        Number(
            orden || 0
        );


    botonGuardarCategoria.textContent =
        'Guardar cambios';


    if (mensaje) {

        mensaje.textContent =
            'Editando categoría.';

    }


    if (seccionCategorias) {

        seccionCategorias.style.display =
            'block';

    }


    inputNombreCategoria.focus();

}


/* =========================================================
   CAMBIAR ESTADO DE CATEGORÍA
   ========================================================= */

async function cambiarEstadoCategoria(
    id,
    nuevoEstado
) {

    const {
        error
    } =
        await supabaseClient

            .from(
                'categorias'
            )

            .update({
                activo: nuevoEstado
            })

            .eq(
                'id',
                id
            );


    if (error) {

        console.error(
            'Error cambiando estado de categoría:',
            error
        );

        alert(
            'No se pudo actualizar la categoría.'
        );

        await cargarCategoriasAdmin();

        return;

    }


    await cargarCategoriasAdmin();

    await cargarCategoriasEnFormulario();

}


/* =========================================================
   GUARDAR CATEGORÍA
   Crear o editar
   ========================================================= */

const botonGuardarCategoria =
    document.getElementById(
        'admin-guardar-categoria'
    );


if (botonGuardarCategoria) {

    botonGuardarCategoria.addEventListener(
        'click',
        async () => {

            const inputNombreCategoria =
                document.getElementById(
                    'admin-categoria-nombre'
                );

            const inputOrdenCategoria =
                document.getElementById(
                    'admin-categoria-orden'
                );

            const mensaje =
                document.getElementById(
                    'admin-categoria-mensaje'
                );


            if (
                !inputNombreCategoria ||
                !inputOrdenCategoria ||
                !mensaje
            ) {

                return;

            }


            const nombre =
                inputNombreCategoria.value.trim();


            const orden =
                Number(
                    inputOrdenCategoria.value || 0
                );


            if (!nombre) {

                mensaje.textContent =
                    'Escribe el nombre de la categoría.';

                return;

            }


            if (
                !Number.isFinite(orden) ||
                orden < 0
            ) {

                mensaje.textContent =
                    'El orden debe ser un número igual o mayor que 0.';

                return;

            }


            botonGuardarCategoria.disabled =
                true;


            botonGuardarCategoria.textContent =
                categoriaEditandoId
                    ? 'Guardando...'
                    : 'Creando...';


            mensaje.textContent =
                '';


            /* =====================================
               EDITAR
               ===================================== */

            if (categoriaEditandoId) {

                const {
                    error
                } =
                    await supabaseClient

                        .from(
                            'categorias'
                        )

                        .update({
                            nombre,
                            orden
                        })

                        .eq(
                            'id',
                            categoriaEditandoId
                        );


                botonGuardarCategoria.disabled =
                    false;


                if (error) {

                    console.error(
                        'Error editando categoría:',
                        error
                    );

                    botonGuardarCategoria.textContent =
                        'Guardar cambios';

                    mensaje.textContent =
                        `Error: ${error.message}`;

                    return;

                }


                categoriaEditandoId =
                    null;


                botonGuardarCategoria.textContent =
                    'Crear categoría';


                inputNombreCategoria.value =
                    '';


                inputOrdenCategoria.value =
                    '0';


                mensaje.textContent =
                    'Categoría actualizada correctamente.';


                await cargarCategoriasAdmin();

                await cargarCategoriasEnFormulario();


                return;

            }


            /* =====================================
               CREAR
               ===================================== */

            const slug =
                crearSlug(
                    nombre
                );


            if (!slug) {

                botonGuardarCategoria.disabled =
                    false;

                botonGuardarCategoria.textContent =
                    'Crear categoría';

                mensaje.textContent =
                    'El nombre de la categoría no es válido.';

                return;

            }


            const {
                error
            } =
                await supabaseClient

                    .from(
                        'categorias'
                    )

                    .insert([
                        {
                            nombre,
                            slug,
                            orden,
                            activo: true
                        }
                    ]);


            botonGuardarCategoria.disabled =
                false;


            botonGuardarCategoria.textContent =
                'Crear categoría';


            if (error) {

                console.error(
                    'Error creando categoría:',
                    error
                );


                if (
                    error.code ===
                    '23505'
                ) {

                    mensaje.textContent =
                        'Ya existe una categoría con ese nombre.';

                }

                else {

                    mensaje.textContent =
                        `Error: ${error.message}`;

                }


                return;

            }


            inputNombreCategoria.value =
                '';


            inputOrdenCategoria.value =
                '0';


            mensaje.textContent =
                'Categoría creada correctamente.';


            await cargarCategoriasAdmin();

            await cargarCategoriasEnFormulario();

        }
    );

}


/* =========================================================
   CARGAR CATEGORÍAS EN SELECT DE PRODUCTO
   ========================================================= */

async function cargarCategoriasEnFormulario(
    valorSeleccionado = ''
) {

    const selectCategoria =
        document.getElementById(
            'admin-producto-categoria'
        );


    if (!selectCategoria) return;


    const valorActual =
        valorSeleccionado ||
        selectCategoria.value ||
        '';


    selectCategoria.innerHTML = `
        <option value="">
            Cargando categorías...
        </option>
    `;


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                'categorias'
            )

            .select(
                'id, nombre, slug, activo, orden'
            )

            .order(
                'orden',
                {
                    ascending: true
                }
            )

            .order(
                'nombre',
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            'Error cargando categorías en formulario:',
            error
        );


        selectCategoria.innerHTML = `
            <option value="">
                No se pudieron cargar las categorías
            </option>
        `;


        return;

    }


    const categorias =
        data || [];


    const activas =
        categorias.filter(
            categoria =>
                categoria.activo
        );


    selectCategoria.innerHTML = `
        <option value="">
            Seleccionar
        </option>
    `;


    activas.forEach(
        categoria => {

            const opcion =
                document.createElement(
                    'option'
                );


            opcion.value =
                categoria.slug;


            opcion.textContent =
                categoria.nombre;


            selectCategoria.appendChild(
                opcion
            );

        }
    );


    /*
        Si estamos editando un producto cuya categoría
        ahora está inactiva, la mostramos solo para
        conservar correctamente el valor existente.
    */

    if (
        valorActual &&
        !activas.some(
            categoria =>
                categoria.slug === valorActual
        )
    ) {

        const categoriaInactiva =
            categorias.find(
                categoria =>
                    categoria.slug === valorActual
            );


        if (categoriaInactiva) {

            const opcion =
                document.createElement(
                    'option'
                );


            opcion.value =
                categoriaInactiva.slug;


            opcion.textContent =
                `${categoriaInactiva.nombre} (inactiva)`;


            selectCategoria.appendChild(
                opcion
            );

        }

    }


    if (valorActual) {

        selectCategoria.value =
            valorActual;

    }

}