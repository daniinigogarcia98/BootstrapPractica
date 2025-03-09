$(document).ready(function () {
  // Mostrar el color seleccionado en formato hexadecimal
  $("#temaColor").on("input", function () {
    var color = $(this).val();
    $("#colorValor").text(color).css("font-family", "monospace");
  });
  $("#temaColor").on("input", function () {
    var colorSeleccionado = $(this).val();
    $("#colorValor").text(colorSeleccionado).css("color", colorSeleccionado);
  });
  // Cargar los códigos de descuento desde el archivo JSON usando AJAX
  $.ajax({
    url: "./json/codigos.json", // Ruta del archivo JSON
    dataType: "json",
    success: function (codigosDescuento) {
      // Validar código de referido
      $("#btnAplicarCodigo").on("click", function () {
        var codigo = $("#codigoReferido").val();
        var codigoValido = codigosDescuento.find(function (item) {
          return item.codigo === codigo;
        });

        if (!codigoValido) {
          var toastError = $(
            '<div class="toast align-items-center text-bg-danger border-0 my-2" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body p-3">Código de descuento no válido.</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>'
          );
          $("#toastContainer").append(toastError);
          toastError.toast("show");
          $("#descuentoMensaje").empty();
        } else {
          var descuentoMensaje = `Tu descuento es: ${codigoValido.descuento}`;

          // Mostrar mensaje en el div
          $("#descuentoMensaje")
            .text(descuentoMensaje)
            .addClass("alert alert-success rounded text-start"); // Alinea el texto a la izquierda

          // Mostrar toast verde con el mismo mensaje
          var toastSuccess = $(
            `<div class="toast align-items-center text-bg-success border-0 my-2" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                  <div class="toast-body p-3">${descuentoMensaje}</div>
                  <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
              </div>`
          );
          $("#toastContainer").append(toastSuccess);
          toastSuccess.toast("show");

          // Deshabilitar el botón y actualizar su texto
          $("#btnAplicarCodigo").prop("disabled", true).text("Aplicado");
        }
      });
    },
    error: function () {
      alert("Error al cargar los códigos de descuento.");
    },
  });

  // Mostrar tooltips cuando se pasa el ratón
  $("[title]").tooltip();

  // Validar campos del formulario al hacer submit
  $("#registroForm").on("submit", function (e) {
    e.preventDefault();
    var camposVacios = false;
    var toastMessages = [];

    // Verificar si hay campos vacíos
    $("input, select").each(function () {
      if ($(this).val() === "" && $(this).is(":visible")) {
        camposVacios = true;
        $(this).css("background-color", "#f8d7da");
      } else {
        $(this).css("background-color", "");
      }
    });

    // Verificar si se han seleccionado intereses
    if (
      !$("#interesTecnologia").prop("checked") &&
      !$("#interesNegocios").prop("checked") &&
      !$("#interesDiseno").prop("checked")
    ) {
      toastMessages.push("Por favor, seleccione al menos un interés.");
    }

    // Verificar si se ha elegido un plan
    if (!$('input[name="plan"]:checked').val()) {
      toastMessages.push("Por favor, seleccione un plan de suscripción.");
    }

    // Mostrar toast de campos vacíos si es necesario
    if (camposVacios) {
      toastMessages.push("Por favor, complete todos los campos obligatorios.");
    }

    // Mostrar toasts si hay errores
    if (toastMessages.length > 0) {
      toastMessages.forEach(function (msg) {
        var toastError = $(
          '<div class="toast align-items-center text-bg-danger border-0 my-2" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body p-3">' +
            msg +
            '</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>'
        );
        $("#toastContainer").append(toastError);
        toastError.toast("show");
      });
      return;
    }

    // Enviar los datos con AJAX
    $.ajax({
      url: "./json/registro.json", // Ruta del archivo JSON (simulación de respuesta)
      method: "GET",
      data: $("#registroForm").serialize(),
      success: function (response) {
        if (response.error === 0) {
          // Mostrar mensaje de éxito en el modal
          var modalMessage = `
    <div class="alert " role="alert">
      <p>El registro se ha realizado correctamente.</p>
    </div>
  `;
          $("#modalResultadoMensaje").html(modalMessage);
          $("#modalResultado").modal("show");
        } else {
          // Mostrar mensaje de error en el modal
          var modalMessageError = `
    <div class="alert alert-danger" role="alert">
      <p>${response.error_msg}</p>
    </div>
  `;
          $("#modalResultadoMensaje").html(modalMessageError);
          $("#modalResultado").modal("show");
        }
      },
      error: function () {
        var modalMessageError = `
  <div class="alert alert-danger" role="alert">
    <h4 class="alert-heading">Error al procesar el registro</h4>
    <p>Hubo un problema al intentar registrar tus datos.</p>
  </div>
`;
        $("#modalResultadoMensaje").html(modalMessageError);
        $("#modalResultado").modal("show");
      },
    });
  });
});
