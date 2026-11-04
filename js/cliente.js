/* =========================================================
   COTTON BLUE — CLIENTES
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const tabLogin =
    document.getElementById(
        'cliente-tab-login'
    );


const tabRegistro =
    document.getElementById(
        'cliente-tab-registro'
    );


const formLoginCliente =
    document.getElementById(
        'cliente-form-login'
    );


const formRegistroCliente =
    document.getElementById(
        'cliente-form-registro'
    );


/* =========================================================
   PESTAÑAS
   ========================================================= */

if (
    tabLogin &&
    tabRegistro
) {

    tabLogin.addEventListener(
        'click',
        () => {

            tabLogin.classList.add(
                'activo'
            );

            tabRegistro.classList.remove(
                'activo'
            );


            formLoginCliente.hidden =
                false;

            formRegistroCliente.hidden =
                true;

        }
    );


    tabRegistro.addEventListener(
        'click',
        () => {

            tabRegistro.classList.add(
                'activo'
            );

            tabLogin.classList.remove(
                'activo'
            );


            formLoginCliente.hidden =
                true;

            formRegistroCliente.hidden =
                false;

        }
    );

}


/* =========================================================
   REGISTRAR CLIENTE
   ========================================================= */

if (formRegistroCliente) {

    formRegistroCliente.addEventListener(
        'submit',
        async evento => {

            evento.preventDefault();


            const nombre =
                document.getElementById(
                    'cliente-registro-nombre'
                ).value.trim();


            const email =
                document.getElementById(
                    'cliente-registro-email'
                ).value.trim();


            const telefono =
                document.getElementById(
                    'cliente-registro-telefono'
                ).value.trim();


            const password =
                document.getElementById(
                    'cliente-registro-password'
                ).value;


            const aceptaPromociones =
                document.getElementById(
                    'cliente-registro-promociones'
                ).checked;


            const mensaje =
                document.getElementById(
                    'cliente-registro-mensaje'
                );


            const boton =
                formRegistroCliente
                    .querySelector(
                        'button[type="submit"]'
                    );


            mensaje.textContent =
                'Creando cuenta...';


            boton.disabled =
                true;


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signUp({

                        email:
                            email,

                        password:
                            password,

                       options: {

    emailRedirectTo:
        `${window.location.origin}/cliente-login.html?confirmado=1`,

    data: {

        nombre:
            nombre,

        telefono:
            telefono || '',

        acepta_promociones:
            aceptaPromociones

    }

}

                    });


            if (error) {

                boton.disabled =
                    false;


                mensaje.textContent =
                    `No se pudo crear la cuenta: ${error.message}`;


                return;

            }


            /*
                Si Supabase inicia sesión
                inmediatamente, creamos el perfil.
            */

            if (
                data &&
                data.user &&
                data.session
            ) {

                const {
                    error: errorPerfil
                } =
                    await supabaseClient

                        .from(
                            'perfiles_clientes'
                        )

                        .insert({

                            id:
                                data.user.id,

                            nombre:
                                nombre,

                            telefono:
                                telefono || null,

                            acepta_promociones:
                                aceptaPromociones

                        });


                if (errorPerfil) {

                    console.error(
                        'Error creando perfil:',
                        errorPerfil
                    );


                    boton.disabled =
                        false;


                    mensaje.textContent =
                        'La cuenta se creó, pero hubo un problema creando el perfil.';


                    return;

                }


                window.location.href =
                    'index.html';


                return;

            }


            /*
                Si Supabase exige verificar correo.
            */

            boton.disabled =
                false;


            mensaje.textContent =
                'Cuenta creada. Revisa tu correo para confirmar tu registro.';

        }
    );

}


/* =========================================================
   INICIAR SESIÓN
   ========================================================= */

if (formLoginCliente) {

    formLoginCliente.addEventListener(
        'submit',
        async evento => {

            evento.preventDefault();


            const email =
                document.getElementById(
                    'cliente-login-email'
                ).value.trim();


            const password =
                document.getElementById(
                    'cliente-login-password'
                ).value;


            const mensaje =
                document.getElementById(
                    'cliente-login-mensaje'
                );


            const boton =
                formLoginCliente
                    .querySelector(
                        'button[type="submit"]'
                    );


            boton.disabled =
                true;


            mensaje.textContent =
                'Ingresando...';


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email:
                            email,

                        password:
                            password

                    });


            boton.disabled =
                false;


            if (error) {

                mensaje.textContent =
                    'Correo o contraseña incorrectos.';


                return;

            }


            if (
                data &&
                data.session
            ) {

                window.location.href =
                    'index.html';

            }

        }
    );

}