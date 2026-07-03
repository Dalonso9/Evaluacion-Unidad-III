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
    database:'patriarcado'
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

server.listen(3000, () => {
    console.log('Servidor iniciado en puerto 3000 (OK) ');
});