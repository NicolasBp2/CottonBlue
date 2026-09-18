/* =========================================================
   COTTON BLUE SHOP — SUPABASE
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const SUPABASE_URL =
    'https://kdzutqridlmftlnstggn.supabase.co';


const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_dKZKvf1e_JOYk29MvuiuBg_-PnDqaUx';


/* =========================================================
   CREAR CLIENTE
   ========================================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   FORMATEAR PRODUCTO
   ========================================================= */

function formatearProductoSupabase(producto) {

    return {

        id:
            producto.slug,

        idSupabase:
            producto.id,

        nombre:
            producto.nombre,

        descripcion:
            producto.descripcion,

        precio:
            producto.precio,

        imagen:
            producto.imagen,

        genero:
            producto.genero,

        categoriaBase:
            producto.categoria,

        categoria:
            `${producto.genero}-${producto.categoria}`,

        oferta:
            producto.oferta,

        destacado:
            producto.destacado,

        activo:
            producto.activo

    };

}


/* =========================================================
   OBTENER TODOS LOS PRODUCTOS ACTIVOS
   ========================================================= */

async function obtenerProductosSupabase() {

    const { data, error } =
        await supabaseClient
            .from('productos')
            .select('*')
            .eq('activo', true)
            .order(
                'created_at',
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            'Error al obtener productos:',
            error
        );

        return null;

    }


    return data.map(
        formatearProductoSupabase
    );

}


/* =========================================================
   OBTENER PRODUCTOS DESTACADOS
   ========================================================= */

async function obtenerProductosDestacadosSupabase() {

    const { data, error } =
        await supabaseClient
            .from('productos')
            .select('*')
            .eq('activo', true)
            .eq('destacado', true)
            .order(
                'created_at',
                {
                    ascending: true
                }
            )
            .limit(3);


    if (error) {

        console.error(
            'Error al obtener productos destacados:',
            error
        );

        return null;

    }


    return data.map(
        formatearProductoSupabase
    );

}


/* =========================================================
   OBTENER UN PRODUCTO POR SLUG
   ========================================================= */

async function obtenerProductoPorSlugSupabase(slug) {

    const { data, error } =
        await supabaseClient
            .from('productos')
            .select('*')
            .eq('slug', slug)
            .eq('activo', true)
            .maybeSingle();


    if (error) {

        console.error(
            'Error al obtener producto:',
            error
        );

        return null;

    }


    if (!data) {

        return null;

    }


    return formatearProductoSupabase(
        data
    );

}


/* =========================================================
   OBTENER VARIANTES DE UN PRODUCTO
   ========================================================= */

async function obtenerVariantesProductoSupabase(
    productoId
) {

    const { data, error } =
        await supabaseClient
            .from('variantes_producto')
            .select('*')
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
            'Error al obtener variantes:',
            error
        );

        return null;

    }


    return data;

}


/* =========================================================
   HACER FUNCIONES DISPONIBLES PARA main.js
   ========================================================= */

window.obtenerProductosSupabase =
    obtenerProductosSupabase;


window.obtenerProductosDestacadosSupabase =
    obtenerProductosDestacadosSupabase;


window.obtenerProductoPorSlugSupabase =
    obtenerProductoPorSlugSupabase;


window.obtenerVariantesProductoSupabase =
    obtenerVariantesProductoSupabase;