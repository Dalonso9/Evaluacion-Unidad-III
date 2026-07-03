MOJO DOJO CASA HOUSE
Autor: Diego Herrera
Objetivo
Pagina Web desarrollada para el ingreso de nuevos Ken de la película Barbie, donde solo se permiten Kens
Requerimientos cumplidos
1. Verificación de Identidad, solo Kens autorizados pueden entrar
<form name="f1" action="/patriarcado" method="POST">
    <a href="/"><img src="images/ken.avif" width="400px" height="400px"></a>
    <h1>MOJO DOJO CASA HOUSE</h1>
    <br>
    <table border="1">
    <tr>
        <td>
            <table>
                <tr>
                    <td>Correo:</td><td><input type="text" name="correo" id="correo"></td>
                </tr>
                <tr>
                    <td>Clave:</td><td><input type="password" name="clave" id="clave"></td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <input type="submit" name="btn" value="Soy Ken">
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    </table>
</form>

Formulario de ingreso de credeciales
server.post("/patriarcado",(req,res)=>{
    
    const correo = req.body.correo;
    const clave = req.body.clave;

    if ((correo=="ken@mattel.com")&&(clave=="12345"))
    {
        const contenido = `
            <h1> VAYA, SI QUE ERES KEN, AMIGO </h1>
            <a href="/kens"><img src="images/soyken.gif"></a>
            <a href="/kens"><h2>Continua por aquí, ganador</h2></a>
            <p>O presiona mi cara</p>
            <br>
        `;
        res.send(cabecera+contenido+final);
    }
    else{
        const contenido =`
        <h1>SAL DE MI PAGINA, BARBIE</h1>
        <a href="/"><img src="images/ahbarbie.gif"></a>
        <br>
        `;
        res.send(cabecera+contenido+final);
    }
});

Validación de credenciales y mensaje de error

Despliegue de Información de Base de Datos:
const conexion = mysql.createConnection({
    host:'10.1.15.29',
    user:'alumno',
    password:'alumno',
    database:'Diego_Herrera'
});

Conexión a Base de Datos
server.get("/kens",(req,res)=>{

    const informacion = conexion.query("select * from kens",(error,data)=>{
        let fila = ``;
        if(error)
        {
            fila = `
            <tr>
            <td colspan="5">NO HAY KENS DISPONIBLES</td>
            </tr>
            `;
        }
        else{
            for(const i of data){
                fila +=`
                    <tr>
                        <td>${i.id}</td><td>${i.nombre}</td><td>${i.tipo_ken}</td><td>${i.dojos}</td><td><input type="button" name="btn_editar" value="Editar" onClick="location='/editar_ken?id=${i.id}';"> &nbsp; <input type="button" name="btn_eliminar" value="Eliminar" onClick="location='/eliminar_ken?id=${i.id}';"></td>
                    </tr>
                `;
            }
        }

        const contenido = `
            <table border="1" width="600">
                <tr>
                    <td>
                        <table width="100%">
                            <tr>
                                <td>ID</td><td>NOMBRE</td><td>TIPO DE KEN</td><td>DOJOS</td><td>ACCION</td>
                            </tr>
                            ${fila}
                        </table>
                    </td>
                </tr>
            </table>
            <br>
            <input type="button" name="btn_nuevo" value="NUEVO KEN" onClick="location='/nuevo_ken';">
        `;
        res.send(cabecera+contenido+final);
    });
});

Tabla de información de Base de Datos
Ingresar Nombre Ken, Tipo de Ken,Cantidad de Dojos
server.get("/nuevo_ken",(req,res)=>{

            const contenido = `
                <form name="insertark" action="/insertar_ken" method="POST">
                    <table border="1" width="275px">
                        <tr>
                            <td>
                                <table>
                                    <tr>
                                        <td>NOMBRE:</td><td><input type="text" name="nombre" value=""></td>
                                    </tr>
                                    <tr>
                                        <td>TIPO KEN:</td><td><input type="text" name="tipo_ken" value=""></td>
                                    </tr>
                                    <tr>
                                        <td>DOJOS:</td><td><input type="number" name="dojos" value=""></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="center"><input type="submit" name="btn_insertar" value="Crear Ken"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </form>
                <img src="images/coolken.gif">
            `;
            res.send(cabecera+contenido+final);
});

Formulario de Ingreso de Kens
server.post("/insertar_ken",(req,res)=>{

    const nombre = req.body.nombre;
    const tipo_ken = req.body.tipo_ken;
    const dojos = req.body.dojos;

    conexion.query("insert into kens(nombre,tipo_ken,dojos) values(?,?,?)",[nombre,tipo_ken,dojos],(error,data)=>{

        if(error||data.length==0){
            const contenido = `
            <h1>ERROR AL CREAR KEN</h1>
            <br>
            <img src="images/lentesken.gif"><br><br>
            <input type="button" name="btn" value="Regresar a la lista de Kens" onClick="location='/kens';">
            `;
            res.send(cabecera+contenido+final);
        }
        else{
            const contenido = `
                <script>
                    alert("Ken creado correctamente");\n
                    location="/kens";
                </script>
            `;
            res.send(cabecera+contenido+final);
        }
    });
});

Ingreso de Ken a base de datos, con validación
Editar Nombre Ken, Tipo de Ken, Cantidad de Dojos
server.get("/editar_ken",(req,res)=>{

    const id_recibido = req.query.id;

    conexion.query("select * from kens where id=?",[id_recibido],(error,data)=>{

        if(error||data.length==0){
            const contenido = `
            <h1>NO EXISTE TAL KEN</h1>
            <br>
            <img src="images/lentesken.gif"><br><br>
            <input type="button" name="btn" value="Regresar a la lista de Kens" onClick="location='/kens';">
            `;
            res.send(cabecera+contenido+final);
        }
        else{
            const nombre_recibido = data[0].nombre;
            const tipo_ken_recibido = data[0].tipo_ken;
            const dojos_recibido = data[0].dojos;
            const contenido = `
                <form name="editark" action="/actualizar_ken" method="POST">
                    <input type="hidden" name="id" value="${id_recibido}">
                    <table border="1" width="275px">
                        <tr>
                            <td>
                                <table>
                                    <tr>
                                        <td>NOMBRE:</td><td><input type="text" name="nombre" value="${nombre_recibido}"></td>
                                    </tr>
                                    <tr>
                                        <td>TIPO KEN:</td><td><input type="text" name="tipo_ken" value="${tipo_ken_recibido}"></td>
                                    </tr>
                                    <tr>
                                        <td>DOJOS:</td><td><input type="number" name="dojos" value="${dojos_recibido}"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="center"><input type="submit" name="btn_actualizar" value="Actualizar Ken"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </form>
                <img src="images/lentesken.gif">
            `;
            res.send(cabecera+contenido+final);
        }
    });
});

Formulario de Edición con información de Base de Datos
server.post("/actualizar_ken",(req,res)=>{

    const id_recibido = req.body.id;
    const nombre_recibido = req.body.nombre;
    const tipo_ken_recibido = req.body.tipo_ken;
    const dojos_recibido = req.body.dojos;

    conexion.query("update kens set nombre=?,tipo_ken=?,dojos=? where id=?",[nombre_recibido,tipo_ken_recibido,dojos_recibido,id_recibido],(error,data)=>{
        if(error||data.length==0){
            const contenido = `
            <h1>ERROR AL ACTUALIZAR KEN</h1>
            <br>
            <img src="images/lentesken.gif"><br><br>
            <input type="button" name="btn" value="Regresar a la lista de Kens" onClick="location='/kens';">
            `;
            res.send(cabecera+contenido+final);
        }
        else{
            const contenido = `
            <script>
                alert("Información Actualizada");\n
                location="/kens";
            </script>
            `;
            res.send(cabecera+contenido+final);
        }
    });
});

Actualización de Ken en Base de Datos
Eliminar Ken especifico
server.get("/eliminar_ken",(req,res)=>{

    const id_recibido = req.query.id;

    conexion.query("select * from kens where id=?",[id_recibido],(error,data)=>{

        if(error||data.length==0){
            const contenido = `
            <h1>NO EXISTE TAL KEN</h1>
            <br>
            <img src="images/lentesken.gif"><br><br>
            <input type="button" name="btn" value="Regresar a la lista de Kens" onClick="location='/kens';">
            `;
            res.send(cabecera+contenido+final);
        }
        else{
            const nombre_recibido = data[0].nombre;
            const contenido = `
                <h1>¿Esta seguro que desea eliminar al Ken ${nombre_recibido}?</h1>
                <br>
                <input type="button" name="btn1" value="SI" onClick="location='/confirmar_eliminacion?id=${id_recibido}';">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="button" name="btn2" value="NO" onClick="location='/kens';">
                <br>
                <img src="images/barbie.gif">
            `;
            res.send(cabecera+contenido+final);
        }
    });
});

Validación previa a Eliminación de Ken
server.get("/confirmar_eliminacion",(req,res)=>{

    const id_recibido = req.query.id;

    conexion.query("delete from kens where id=?",[id_recibido],(error,data)=>{

        if(error||data.length==0){
            const contenido = `
            <h1>ERROR AL ELIMINAR KEN</h1>
            <br>
            <img src="images/lentesken.gif"><br><br>
            <input type="button" name="btn" value="Regresar a la lista de Kens" onClick="location='/kens';">
            `;
            res.send(cabecera+contenido+final);
        }
        else{
            const contenido = `
                <script>
                    alert("Ken Eliminado");\n
                    location="/kens";
                </script>
            `;
            res.send(cabecera+contenido+final);
        }
    });
});

Ejecución de eliminación de Ken en base de Datos
 
Instrucciones de Ejecución
Levantamiento:
A través de node del archivo app.js vía consola para iniciar página web en Localhost:3000, se desplegara el mensaje “Servidor iniciado en puerto 3000 (OK)”
 
Base de Datos:
El servidor debe estar activo (host: 10.1.15.29), en caso de una base de datos local se debe modificar lo datos de ingreso en app.js
 
Ingresar a la Pagina Web:
Ingresar vía navegador a Localhost:3000
 
Poner credenciales (Correo: ken@mattel.com Clave: 12345)
 

En caso de ingreso incorrecto se desplegará un mensaje de error de Usuario no Autorizado
 
Todo es dará inicio a /kens donde se encuentra los datos y los botones de ingresar, editar y eliminar
 
Edición de Ken:
Al seleccionar cualquier fila el botón editar este redirigirá a la pagina /editar_ken donde se autocompletarán los datos de dicho Ken.
 
 
El proceso de culmina seleccionado “Actualizar Ken” con un mensaje por navegador “Información Actualizada”
 
El seleccionar “Aceptar” redirigirá a /kens
Eliminación de Ken:
Al seleccionar cualquier fila el botón eliminar este redirigirá a la pagina /eliminar_ken donde se generarán dos opciones para poder seguir, siendo “Si” para eliminar y “No” para volver a /kens
 
Al seleccionar “si” el proceso de culmina con un mensaje por navegador “Ken Eliminado”
 
El seleccionar “Aceptar” redirigirá a /kens

 
Añadir Ken:
Al seleccionar el botón “Nuevo Ken” este redirigirá a la pagina /nuevo_ken donde se deben llenar los campos para la correcta adición de un Ken
 
Al seleccionar “Crear Ken” el proceso de culmina con un mensaje por navegador “Ken Eliminado”
 
El seleccionar “Aceptar” redirigirá a /kens

 
Evidencias
Login
 
Error de Ingreso 
 
Usuario Autorizado
 
Información de Kens (Tabla) con botones de Nuevo Ken (Añadir), Editar y Eliminar
 
 
Edición
 
Mensaje de Edición Exitosa
 
 
Eliminar Ken
 
Mensaje de Correcta Eliminación
 
 
Añadir Ken
 
Mensaje de Correcta creación
 
