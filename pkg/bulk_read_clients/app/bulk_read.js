const MAX_BATCH = 50000;
const MAX_QUEUE_TIMEOUT = 1000;
// const fields = [
//   "Id_ClienteFid",
//   "Ciudad_TPV_de_alta",
//   "Owner",
//   "Club",
//   "Consumo_temp_actual",
//   "AOV_Average_Order_Value",
//   "Consumo_acumulado",
//   "CP",
//   "Date_of_Birth",
//   "Direcci_n",
//   "DNI_NIF",
//   "D_a_del_mes_del_cumplea_os",
//   "Edad1",
//   "Email",
//   "Email_Opt_Out",
//   "Estado_del_Cliente",
//   "Estado_Fidelizaci_n",
//   "Fecha_ltima_compra",
//   "Fecha_hora_alta",
//   "First_Name",
//   "Id_TPV_de_alta",
//   "Id_Vendedor_de_alta",
//   "Last_Name",
//   "Mes_del_cumplea_os",
//   "Mobile",
//   "No_participaci_n_de_SMS",
//   "N_m_Tarjeta_Fie",
//   "N_mero",
//   "Pa_s_TPV_de_alta",
//   "Pa_s1",
//   "Pedidos_acumulados",
//   "Phone",
//   "Piso",
//   "Poblaci_n1",
//   "PPT_temp_actual",
//   "PPT_temp_anterior",
//   "Provincia_TPV_de_alta",
//   "Provincia1",
//   "Puntos_caducados",
//   "Puntos_generados",
//   "Puntos_cancelados",
//   "RGPD",
//   "Puntos_Acumulados",
//   "Sexo",
//   "Ticket_medio_temp_actual",
//   "Ticket_medio_temp_anterior",
//   "Ticket_medio_acumulado",
//   "Tipo_de_cliente",
//   "Tipo_de_TPV_de_alta",
//   "TPV_de_alta1",
//   "Ubicaci_n_TPV_de_alta",
//   "UPT_temp_actual1",
//   "UPT_temp_anterior1",
//   "UPT_acumulado1",
//   "Vendedor_de_alta1",
// ];

function test() {
  console.log("hola");
}

// $(document).ready(function () {
//   ZOHO.embeddedApp.init().then(function () {
//     console.log("Widget Initialized");
//   });
// });
/*
function cancel_export() {
  ZOHO.CRM.UI.Popup.close();
}

function getFields() {
  var request = {
    url: "https://crm.segmentail.io/crm/v3/settings/custom_views/224560000000030971?module=Contacts",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  ZOHO.CRM.HTTP.get(request).then(onGetFields);
}

var token = null;
var num_page = 1;
var fields = null;

function export_csv_ajax_zoho() {
  token = $("#passw").val();
  if (token == "") {
    alert("Inserta un token para autentificarte");
  } else {
    var token = $("#passw").val();
    console.log(token);

    var request = {
      url: "https://crm.segmentail.io/crm/v3/settings/custom_views/224560000000030971?module=Contacts",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };

    ZOHO.CRM.HTTP.get(request).then(onGetFields);

    //   data = { query: { module: "Contacts", fields: fields, page: num_page } };

    //   var request = {
    //     url: "https://crm.segmentail.io/crm/bulk/v2/read",
    //     headers: {
    //       Authorization: token,
    //       "Content-Type": "application/json",
    //     },
    //     body: data,
    //   };
    //   ZOHO.CRM.HTTP.post(request).then(onBulkSend);
    // }
  }
}

function onGetFields(response) {
  const parsedFields = response.custom_views[0].fields;

  const mappedFields = parsedFields.map((f) => console.log(f.api_name));
  console.log(mappedFields);
  data = {
    query: { module: "Contacts", fields: mappedFields, page: num_page },
  };

  var request = {
    url: "https://crm.segmentail.io/crm/bulk/v2/read",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: data,
  };
  ZOHO.CRM.HTTP.post(request).then(onBulkSend);
}

id_bulk = null;

function onBulkSend(response) {
  token = $("#passw").val();

  if (typeof response == "string") {
    resp_json = JSON.parse(response);
    if (resp_json.status == "error") {
      alert("Token de autentificación inválido");
    } else {
      $(".load").show();
      id_bulk = resp_json.data[0].details.id;
    }
  }

  var request = {
    url: "https://crm.segmentail.io/crm/bulk/v2/read/" + id_bulk,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };
  ZOHO.CRM.HTTP.get(request).then(onGetStatus);
}

flag_pages = false;

function onGetStatus(response) {
  resp_json = JSON.parse(response);
  console.log(resp_json.data[0].state);
  console.log(response);
  if (resp_json.data[0].state == "QUEUED") {
    setTimeout(function () {
      onBulkSend(false);
    }, MAX_QUEUE_TIMEOUT);
  } else if (resp_json.data[0].state == "IN PROGRESS") {
    setTimeout(function () {
      $(".load").show();
      onBulkSend(false);
    }, MAX_QUEUE_TIMEOUT);
  } else if (resp_json.data[0].state == "COMPLETED") {
    onCompleted(response);
    console.log(resp_json.data[0].result.more_records);
    flag_pages = resp_json.data[0].result.more_records;
  }
}

function onCompleted(response) {
  token = $("#passw").val();
  resp_json = JSON.parse(response);

  var request = {
    url: "https://crm.segmentail.io/crm/bulk/v2/read/" + id_bulk + "/result",
    //url : "https://crm.segmentail.com/crm/bulk/v2/read/224560000014407037/result",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    RESPONSE_TYPE: "stream",
  };
  ZOHO.CRM.HTTP.get(request).then(function (body) {
    JSZip.loadAsync(body)
      .then(function (zip) {
        return zip.file(id_bulk + ".csv").async("string");
      })
      .then(onCSVConverted);
  });
}

function onCSVConverted(text) {
  var zip = new JSZip();
  zip.file(id_bulk + ".csv", text);

  zip.generateAsync({ type: "blob" }).then(
    function (content) {
      saveAs(content, id_bulk + ".zip");
      $(".load").hide();
      alert("Descarga " + num_page + " CSV completada");
      if (flag_pages) {
        num_page++;
        export_csv_ajax_zoho();
      }
    },
    function (err) {
      console.log(err);
    }
  );
}
*/
