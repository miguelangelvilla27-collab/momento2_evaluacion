const url = "logica/visitas.php";

const form = document.getElementById("formVisita");
const tabla = document.getElementById("tablaVisitas");

document.addEventListener("DOMContentLoaded", cargarVisitas);

form.addEventListener("submit", async function(e){
    e.preventDefault();

    const datos = {
        id: document.getElementById("id").value,
        paciente: document.getElementById("paciente").value,
        fecha: document.getElementById("fecha").value,
        motivo: document.getElementById("motivo").value,
        diagnostico: document.getElementById("diagnostico").value
    };

    let metodo = "POST";

    if(datos.id !== ""){
        metodo = "PUT";
        datos.id = parseInt(datos.id);
    }

    await fetch(url,{
        method: metodo,
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(datos)
    });

    form.reset();
    document.getElementById("id").value = "";
    cargarVisitas();
});

async function cargarVisitas(){
    const respuesta = await fetch(url);
    const visitas = await respuesta.json();

    tabla.innerHTML = "";

    visitas.forEach(v => {
        tabla.innerHTML += `
            <tr>
                <td>${v.id}</td>
                <td>${v.paciente}</td>
                <td>${v.fecha}</td>
                <td>${v.motivo}</td>
                <td>${v.diagnostico}</td>
                <td class="acciones">
                    <button onclick="editar(${v.id}, '${v.paciente}', '${v.fecha}', '${v.motivo}', '${v.diagnostico}')">Editar</button>
                    <button onclick="eliminar(${v.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function editar(id, paciente, fecha, motivo, diagnostico){
    document.getElementById("id").value = id;
    document.getElementById("paciente").value = paciente;
    document.getElementById("fecha").value = fecha;
    document.getElementById("motivo").value = motivo;
    document.getElementById("diagnostico").value = diagnostico;
}

async function eliminar(id){
    await fetch(url,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({id:id})
    });

    cargarVisitas();
}