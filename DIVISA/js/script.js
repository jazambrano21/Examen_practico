$(document).ready(function() {
    // Objeto para almacenar la información de las monedas y sus tasas de conversión
    var currencyData = {}; 
    var baseCurrencyCode = "EUR"; // La moneda base es el Euro de Alemania
    var currentCurrencyDiv = null; // Variable para almacenar el div que está siendo editado

    // Cargar el archivo XML y procesarlo
    $.ajax({
        type: "GET", // Método de solicitud
        url: "data/data.xml", // Ruta del archivo XML
        dataType: "xml", // Especificamos que la respuesta es de tipo XML
        success: function(xml) {
            // Procesamos el XML cuando se carga correctamente
            $(xml).find("pais").each(function() {
                var countryName = $(this).find("nombre").text(); // Nombre del país
                var currencyName = $(this).find("moneda").text(); // Nombre de la moneda
                var exchangeRate = parseFloat($(this).find("valor").text()); // Tasa de cambio de la moneda
                var currencyCode = $(this).find("acronimo").text(); // Código de la moneda
                var flagUrl = $(this).find("bandera").text(); // URL de la bandera del país

                // Guardamos la información de la moneda en el objeto currencyData
                currencyData[currencyCode] = {
                    country: countryName,
                    currency: currencyName,
                    rate: exchangeRate,
                    flag: flagUrl
                };

                // Llenamos el select del modal con las monedas disponibles
                $("#currency-select").append(new Option(countryName + " - " + currencyName, currencyCode, false, false));
            });

            // Imprimimos en consola los datos cargados para verificar
            console.log("Datos cargados del XML:", currencyData);
        },
        error: function() {
            // Si hay un error al cargar el XML, mostramos un mensaje de error
            console.error("Error al cargar el archivo XML.");
        }
    });

    // Función para validar si el valor ingresado es un número válido
    function isValidNumber(value) {
        return !isNaN(value) && value !== ""; // Verifica que el valor no sea NaN y no esté vacío
    }

    // Función para realizar la conversión de moneda
    function performConversion() {
        // Tomamos el valor ingresado en el input base (USD en este caso) y lo convertimos a número
        var baseValue = $("#usd-value").val().replace(",", "."); // Reemplazamos comas por puntos
        baseValue = parseFloat(baseValue); // Convertimos el valor a un número flotante

        if (!isValidNumber(baseValue)) {
            // Si el valor no es válido, mostramos un mensaje de alerta
            alert("Por favor, ingrese un valor numérico válido.");
            return;
        }

        // Realizamos la conversión para todas las monedas que aparecen en la lista
        $("#currency-list .row").each(function() {
            var currencyCode = $(this).data("currencyCode"); // Obtenemos el código de la moneda del div
            if (currencyCode) {
                var rate = currencyData[currencyCode].rate; // Obtenemos la tasa de conversión
                var convertedValue = baseValue * rate; // Realizamos la conversión

                // Actualizamos el valor convertido en el input correspondiente
                $(this).find("input").val(convertedValue.toFixed(2)); // Mostramos el valor convertido con 2 decimales
            }
        });
    }

    // Lógica para el botón de cálculo (cuando se presiona el botón, realiza la conversión)
    $("#calculate-btn").click(function() {
        performConversion(); // Llama a la función para realizar la conversión
    });

    // Abrir el modal para agregar una moneda
    $("#add-currency-btn").click(function(e) {
        e.preventDefault(); // Evita la acción por defecto (recargar la página, si fuera un link)
        currentCurrencyDiv = null; // No estamos editando ningún div
        $('#currencyModal').modal('show'); // Muestra el modal de selección de moneda
    });

    // Abrir el modal de selección de moneda al hacer clic en el botón de tres puntos
    $(document).on('click', '.fa-ellipsis-v', function() {
        currentCurrencyDiv = $(this).closest('.row'); // Guardamos el div que estamos editando
        $('#currencyModal').modal('show'); // Muestra el modal de selección de moneda
    });

    // Función para guardar la moneda seleccionada y actualizar el div correspondiente
    $("#save-currency-btn").click(function() {
        var selectedOption = $("#currency-select option:selected"); // Obtenemos la moneda seleccionada
        var selectedCurrencyCode = selectedOption.val(); // Obtenemos el código de la moneda
        var selectedCurrencyText = selectedOption.text(); // Obtenemos el texto de la moneda
        var selectedFlag = currencyData[selectedCurrencyCode].flag; // Obtenemos la URL de la bandera
        var currencyName = selectedCurrencyText.split(" - ")[1]; // Nombre de la moneda (Ej: "Euro")
        var countryName = selectedCurrencyText.split(" - ")[0]; // Nombre del país (Ej: "Alemania")

        // Si estamos editando un div, actualizamos la moneda
        if (currentCurrencyDiv) {
            currentCurrencyDiv.find("img").attr("src", selectedFlag); // Actualizamos la bandera
            currentCurrencyDiv.find("span").text(`${currencyName} (${countryName})`); // Actualizamos el nombre de la moneda
            currentCurrencyDiv.data("currencyCode", selectedCurrencyCode); // Guardamos el código de la moneda en el div
            currentCurrencyDiv.find("input").val("0"); // Reiniciamos el valor del input a 0
        } else {
            // Si no estamos editando, creamos un nuevo div para la moneda seleccionada
            var newCurrencyDiv = `
                <div class="row mb-4 align-items-center border rounded p-2" id="currency-${selectedCurrencyCode}" data-currencyCode="${selectedCurrencyCode}">
                    <div class="col-auto">
                        <img src="${selectedFlag}" alt="${selectedCurrencyCode}" class="img-fluid rounded-circle" style="width: 40px; height: 40px;">
                        <span class="ms-2">${currencyName} (${countryName})</span>
                    </div>
                    <div class="col">
                        <input type="text" class="form-control border-0 input-transparent" value="0" disabled>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-outline-secondary no-border">
                            <i class="fas fa-ellipsis-v icon-large vertical-dots"></i> <!-- Icono de tres puntos -->
                        </button>
                    </div>
                </div>
            `;
            $("#currency-list").append(newCurrencyDiv); // Agregamos el nuevo div a la lista de monedas
        }

        // Cerramos el modal sin realizar la conversión aún
        $('#currencyModal').modal('hide');
    });

    // Aseguramos que la conversión se ejecute cada vez que se cambia el valor base
    $(document).on('input', '#usd-value', function() {
        performConversion(); // Llamamos a la función de conversión cada vez que se cambia el valor
    });
});
