//Counties
export const counties = [
    {id: "15", name: "A Coruña" },
    {id: "01", name: "Álava" },
    {id: "02", name: "Albacete" },
    {id: "03", name: "Alicante" },
    {id: "04", name: "Almería" },
    {id: "33", name: "Asturias" },
    {id: "05", name: "Ávila" },
    {id: "06", name: "Badajoz" },
    {id: "08", name: "Barcelona" },
    {id: "48", name: "Bizkaia" },
    {id: "09", name: "Burgos" },
    {id: "10", name: "Cáceres" },
    {id: "11", name: "Cádiz" },
    {id: "39", name: "Cantabria" },
    {id: "12", name: "Castellón" },
    {id: "51", name: "Ceuta" },
    {id: "13", name: "Ciudad Real" },
    {id: "14", name: "Córdoba" },
    {id: "16", name: "Cuenca" },
    {id: "17", name: "Girona" },
    {id: "18", name: "Granada" },
    {id: "19", name: "Guadalajara" },
    {id: "20", name: "Guipuzkoa" },
    {id: "21", name: "Huelva" },
    {id: "22", name: "Huesca" },
    {id: "07", name: "Illes Balears" },
    {id: "23", name: "Jaén" },
    {id: "26", name: "La Rioja" },
    {id: "35", name: "Las Palmas" },
    {id: "24", name: "León" },
    {id: "25", name: "Lleida" },
    {id: "27", name: "Lugo" },
    {id: "28", name: "Madrid" },
    {id: "29", name: "Málaga" },
    {id: "52", name: "Melilla" },
    {id: "30", name: "Murcia" },
    {id: "31", name: "Navarra" },
    {id: "32", name: "Ourense" },
    {id: "34", name: "Palencia" },
    {id: "36", name: "Pontevedra" },
    {id: "37", name: "Salamanca" },
    {id: "38", name: "Santa Cruz de Tenerife" },
    {id: "40", name: "Segovia" },
    {id: "41", name: "Sevilla" },
    {id: "42", name: "Soria" },
    {id: "43", name: "Tarragona" },
    {id: "44", name: "Teruel" },
    {id: "45", name: "Toledo" },
    {id: "46", name: "Valencia" },
    {id: "47", name: "Valladolid" },
    {id: "49", name: "Zamora" },
    {id: "50", name: "Zaragoza" }
];

//Offices
export const offices = [
    {id: "BCN", name: "Barcelona" },
    {id: "MAD", name: "Madrid" },
    {id: "SEV", name: "Sevilla" }
];

//Categories
export const occupationCategories = [
    {id: "cat01", name: "Artes escénicas" },
    {id: "cat02", name: "Audiovisual" },
    {id: "cat03", name: "Otras" }
];

//Occupations (max 32 characters in order to be stored correctly in the blockchain as bytes32).
//Solidity does not allow arrays of strings as a parameter in a function in the current version.
//PENDING: Occupation classifications checking: "satélite de la cultura -unas estadísticas del ministerio- y en la fundación contemporanea".
export const occupations= [
    {id: "occ01001", name: "Actor/Actriz", category: "Artes escénicas" },
    {id: "occ01002", name: "Artes plásticas", category: "Artes escénicas" },
    {id: "occ01003", name: "Bailarín/a", category: "Artes escénicas" },
    {id: "occ01004", name: "Coreógrafo/a", category: "Artes escénicas" },
    {id: "occ01005", name: "Músico/a", category: "Artes escénicas" },
    {id: "occ01006", name: "Productor/a", category: "Artes escénicas" },
    {id: "occ01007", name: "Otras", category: "Artes escénicas" },
    {id: "occ02001", name: "Animación 2D/3D", category: "Audiovisual" },
    {id: "occ02002", name: "Diseño gráfico", category: "Audiovisual" },
    {id: "occ02003", name: "Fotógrafo/a", category: "Audiovisual" },
    {id: "occ02004", name: "Maquinista", category: "Audiovisual" },
    {id: "occ02005", name: "Realización de vídeo", category: "Audiovisual" },
    {id: "occ02006", name: "Técnico/a de sonido", category: "Audiovisual" },
    {id: "occ02007", name: "Otras", category: "Audiovisual" },
    {id: "occ03001", name: "Otras", category: "Otras" }
];




