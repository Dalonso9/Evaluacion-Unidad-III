const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public')); // sirve HTML, imágenes, CSS, todo

const conexion = mysql.createConnection({
    host:'10.1.15.29',
    user:'alumno',
    password:'alumno',
    database:'Diego_Herrera'
});

const cabecera = fs.readFileSync('public/header.html','utf8');
const final = fs.readFileSync('public/footer.html','utf8');

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
                                        <td>NOMBRE:</td><td><input type="text" name="nombre" value="${nombre_recibido}" readonly></td>
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

server.listen(3000, () => {
    console.log('Servidor iniciado en puerto 3000 (OK) ');
});