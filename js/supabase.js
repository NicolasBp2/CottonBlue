/* =========================================================
   CONEXIÓN CON SUPABASE
   ========================================================= */

const SUPABASE_URL =
    'https://kdzutqridlmftlnstggn.supabase.co';


const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_dKZKvf1e_JOYk29MvuiuBg_-PnDqaUx';


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   PRUEBA: LEER PRODUCTOS
   ========================================================= */

async function probarConexionSupabase() {

    const { data, error } =
        await supabaseClient
            .from('productos')
            .select('*');


    if (error) {

        console.error(
            'Error al leer productos desde Supabase:',
            error
        );

        return;

    }


    console.log(
        'Productos recibidos desde Supabase:',
        data
    );

}


/* Ejecutamos la prueba */

probarConexionSupabase();