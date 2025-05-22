// 1) Crear la base de datos y la colección
const db = connect("mongodb://localhost:27017/cafeteria");


db.cafes.drop();

db.cafes.insertMany([
  {
    tipo: "espresso",
    ingredientes: ["chocolate", "canela"],
    peso: 200,
    intensidad: "alta",
    precio: [
      { tipo: "efectivo", precio: 500 },
      { tipo: "tarjeta", precio: 550 }
    ],
    contiene_leche: false,
    tostador: { localidad: "San Telmo", nombre: "Tostadores del Sur", cuit: "20-12345678-1" }
  },
  {
    tipo: "cold brew",
    ingredientes: ["vainilla", "caramelo"],
    peso: 250,
    intensidad: "media",
    precio: [
      { tipo: "efectivo", precio: 600 },
      { tipo: "tarjeta", precio: 650 }
    ],
    contiene_leche: true,
    tostador: { localidad: "San Justo", nombre: "Café Justo", cuit: "20-23456789-2" }
  },
  {
    tipo: "filtrado",
    ingredientes: ["chocolate"],
    peso: 220,
    intensidad: "media",
    precio: [
      { tipo: "efectivo", precio: 480 },
      { tipo: "tarjeta", precio: 520 }
    ],
    contiene_leche: false,
    tostador: { localidad: "Rosario", nombre: "El Tostador", cuit: "20-34567890-3" }
  },
  {
    tipo: "descafeinado",
    ingredientes: ["caramelo"],
    peso: 210,
    intensidad: "baja",
    precio: [
      { tipo: "efectivo", precio: 450 },
      { tipo: "tarjeta", precio: 470 }
    ],
    contiene_leche: true,
    tostador: { localidad: "Santa Fe", nombre: "Granos del Litoral", cuit: "20-45678901-4" }
  },
  {
    tipo: "espresso",
    ingredientes: ["vainilla"],
    peso: 260,
    intensidad: "media",
    precio: [
      { tipo: "efectivo", precio: 510 },
      { tipo: "tarjeta", precio: 540 }
    ],
    contiene_leche: false,
    tostador: { localidad: "Buenos Aires", nombre: "Café Argento", cuit: "20-56789012-5" }
  },
  {
    tipo: "cold brew",
    ingredientes: ["chocolate", "vainilla"],
    peso: 255,
    intensidad: "alta",
    precio: [
      { tipo: "efectivo", precio: 620 },
      { tipo: "tarjeta", precio: 670 }
    ],
    contiene_leche: false,
    tostador: { localidad: "Santos Lugares", nombre: "Especialidades Café", cuit: "20-67890123-6" }
  },
  {
    tipo: "filtrado",
    ingredientes: ["canela", "caramelo"],
    peso: 230,
    intensidad: "media",
    precio: [
      { tipo: "efectivo", precio: 490 },
      { tipo: "tarjeta", precio: 530 }
    ],
    contiene_leche: true,
    tostador: { localidad: "Córdoba", nombre: "Tostado Norte", cuit: "20-78901234-7" }
  },
  {
    tipo: "espresso",
    ingredientes: ["chocolate", "vainilla"],
    peso: 270,
    intensidad: "alta",
    precio: [
      { tipo: "efectivo", precio: 650 },
      { tipo: "tarjeta", precio: 700 }
    ],
    contiene_leche: false,
    tostador: { localidad: "Mendoza", nombre: "Andes Coffee", cuit: "20-89012345-8" }
  },
  {
    tipo: "cold brew",
    ingredientes: ["vainilla"],
    peso: 245,
    intensidad: "baja",
    precio: [
      { tipo: "efectivo", precio: 580 },
      { tipo: "tarjeta", precio: 610 }
    ],
    contiene_leche: true,
    tostador: { localidad: "San Rafael", nombre: "Montaña Café", cuit: "20-90123456-9" }
  },
  {
    tipo: "descafeinado",
    ingredientes: ["canela"],
    peso: 195,
    intensidad: "baja",
    precio: [
      { tipo: "efectivo", precio: 430 },
      { tipo: "tarjeta", precio: 460 }
    ],
    contiene_leche: false,
    tostador: { localidad: "La Plata", nombre: "Café Sur", cuit: "20-01234567-0" }
  }
]);

// 2) Cafés con chocolate
print("2) Cafés con chocolate:");
print(db.cafes.countDocuments({ ingredientes: "chocolate" }));

// 3) Cold brew con vainilla
print("3) Cold brew con vainilla:");
print(db.cafes.countDocuments({ tipo: "cold brew", ingredientes: "vainilla" }));

// 4) Tipo y peso con intensidad media
print("4) Cafés con intensidad media:");
printjson(db.cafes.find({ intensidad: "media" }, { tipo: 1, peso: 1, _id: 0 }).toArray());

// 5) Tipo, peso e intensidad entre 200 y 260
print("5) Cafés entre 200 y 260 gramos:");
printjson(db.cafes.find(
  { peso: { $gte: 200, $lte: 260 } },
  { tipo: 1, peso: 1, intensidad: 1, _id: 0 }
).toArray());

// 6) Localidades con "san"
print("6) Cafés tostados en localidades que contienen 'san':");
printjson(db.cafes.find(
  { "tostador.localidad": { $regex: "san", $options: "i" } }
).sort({ peso: -1 }).toArray());

// 7) Sumar peso por tipo
print("7) Sumar peso por tipo:");
printjson(db.cafes.aggregate([
  { $group: { _id: "$tipo", total_peso: { $sum: "$peso" } } }
]).toArray());

// 8) Agregar "whisky" a intensidad alta
print("8) Agregar whisky a cafés de intensidad alta:");
db.cafes.updateMany(
  { intensidad: "alta" },
  { $addToSet: { ingredientes: "whisky" } }
);

// 9) Sumarle 10 al peso entre 200 y 260
print("9) Aumentar peso en cafés entre 200 y 260 gramos:");
db.cafes.updateMany(
  { peso: { $gte: 200, $lte: 260 } },
  { $inc: { peso: 10 } }
);

// 10) Eliminar cafés con peso <= 210
print("10) Eliminar cafés con peso menor o igual a 210:");
db.cafes.deleteMany({ peso: { $lte: 210 } });
