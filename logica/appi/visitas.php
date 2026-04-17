<?php
header("Content-Type: application/json");

$archivo = __DIR__ . "/../../datos/visitas.json";

if(!file_exists($archivo)){
    file_put_contents($archivo, "[]");
}

function leer($archivo){
    $json = file_get_contents($archivo);
    $datos = json_decode($json, true);
    return is_array($datos) ? $datos : [];
}

function guardar($archivo, $datos){
    file_put_contents(
        $archivo,
        json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );
}

$metodo = $_SERVER["REQUEST_METHOD"];
$visitas = leer($archivo);

switch($metodo){

    case "GET":
        echo json_encode($visitas);
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);

        $nuevo = [
            "id" => count($visitas) > 0 ? max(array_column($visitas, "id")) + 1 : 1,
            "paciente" => $data["paciente"],
            "fecha" => $data["fecha"],
            "motivo" => $data["motivo"],
            "diagnostico" => $data["diagnostico"]
        ];

        $visitas[] = $nuevo;
        guardar($archivo, $visitas);

        echo json_encode(["mensaje"=>"Creado"]);
        break;

    case "PUT":
        $data = json_decode(file_get_contents("php://input"), true);

        foreach($visitas as &$v){
            if($v["id"] == $data["id"]){
                $v["paciente"] = $data["paciente"];
                $v["fecha"] = $data["fecha"];
                $v["motivo"] = $data["motivo"];
                $v["diagnostico"] = $data["diagnostico"];
            }
        }

        guardar($archivo, $visitas);

        echo json_encode(["mensaje"=>"Actualizado"]);
        break;

    case "DELETE":
        $data = json_decode(file_get_contents("php://input"), true);

        $visitas = array_values(array_filter($visitas, function($v) use ($data){
            return $v["id"] != $data["id"];
        }));

        guardar($archivo, $visitas);

        echo json_encode(["mensaje"=>"Eliminado"]);
        break;
}
?>