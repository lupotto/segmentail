var recId, recModule ;
var messages;
var num_part;
var total;
var auth_esendex  = {
  "esendex": null,
  "username": null,
  "password": null,
  "credentials": null,
  "encoded_string": null
}
const MAX_BATCH = 50000;

$(document).ready(function(){
  ZOHO.embeddedApp.on("PageLoad",function(data){
    recId = data.EntityId;
    recModule = data.Entity;

    ZOHO.CRM.CONFIG.getOrgInfo().then(function(data){
        console.log(data);
        if (data.org[0].alias !== null){
          auth_esendex["esendex"] = data.org[0].alias;
        }else{
          alert("Faltan las credenciales de Esendex")
          ZOHO.CRM.UI.Popup.close()
        }
      });
      ZOHO.CRM.API.getAllUsers({Type:"AllUsers"}).then(function(data){
            for (var i = 0; i < data.users.length; i++){
              console.log(typeof(data.users[i].alias));
              if(typeof(data.users[i].alias) == "string"){
                if(data.users[i].alias.includes("@")){
                //auth_esendex["username"] = data.users[i].email;
                //auth_esendex["password"] = data.users[i].alias;
                console.log("INNNNNN");
                console.log(data.users[i].alias);
                auth_esendex["credentials"] = data.users[i].alias;
              }
              }
            }

            console.log("Auth que coge");
            console.log(auth_esendex["credentials"]);
            if (auth_esendex == null && auth_esendex == null){
               alert("Faltan las credenciales de Esendex")
               ZOHO.CRM.UI.Popup.close()
            }
        });
  ZOHO.CRM.API.getRecord({Entity: recModule, RecordID: recId}).then(function(data){
    messages = data.data;
    total = messages.length;
    num_part = 0 ;
      for(var i=0; i < messages.length; i++){
          if (messages[i]["No_participaci_n_de_SMS"] != false){
            alert("No tenemos autorización para enviar SMS a este cliente")
            ZOHO.CRM.UI.Popup.close()
          }
          if (messages[i]["Mobile"] == null){
            alert("Número de telefono no insertado")
            ZOHO.CRM.UI.Popup.close()
          }
        }
    });
  });

  ZOHO.embeddedApp.init().then(function(){
  console.log("Widget Initialized");
    });

  var $remaining = $('#remaining'),
    $messages = $remaining.next();

     $('#msgcontent').keyup(function(){
      var chars = this.value.length,
      messages = Math.ceil(chars / 160),
      remaining = messages * 160 - (chars % (messages * 160) || messages * 160);
      $remaining.text(remaining + ' carácteres restantes');
      $messages.text(messages + ' mensaje(s)');
    });
})

function cancel_sms(){
  ZOHO.CRM.UI.Popup.close()
}

var sms_module = {}
function sendsms_v2(){
  $( ".load" ).show();
  esendex = new connector_esendex(auth_esendex);
  esendex.check_account(function(response){
    $( ".load" ).show();
    let parser = new DOMParser();
    var xmlDoc = parser.parseFromString(response,"text/xml");
    if(typeof xmlDoc.getElementsByTagName("session")[0] == "undefined"){
      alert("Usuario o contrasña incorrectos");
    }else{
      var msgcontent = $("#msgcontent").val();
      console.log(msgcontent);
      if (msgcontent == ""){
        alert("Mensaje vacío");
        $( ".load" ).hide();
      }else{
          sms_module["Mensaje"] = msgcontent;
          sms_module["Mobile"] = messages[0]["Mobile"];
          esendex.get_sms_length(msgcontent, onGetSMSLength);
      }
    }
  });
}
//TODO: Check the response with XML
function onGetSMSLength(response_length){
  let parser = new DOMParser();
  var parser_xml = parser.parseFromString(response_length,"text/xml");
  num_sms = parseInt(parser_xml.getElementsByTagName("response")[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeValue);
  if (num_sms > 1){
    alert("Más de 160 caracteres. Se enviarán 2 mensajes si envias este texto.");
    $( ".load" ).hide();
  }else{
    sms_module["Sender"] = [{"to": sms_module["Mobile"], "body": sms_module["Mensaje"]}]
    esendex.get_account_credits(function(response){
      let parser = new DOMParser();
      var xmlDoc = parser.parseFromString(response,"text/xml");
      credits = parseInt(xmlDoc.getElementsByTagName("accounts")[0].childNodes[0].childNodes[5].childNodes[0].nodeValue);
      var r = confirm("¿Desea enviar este SMS?");
      if (!r) {
        sms_module = {};
      }else{
        esendex.send_sms(sms_module["Sender"], function(response){
          $( ".load" ).hide();
          if(response == 400){
            sms_module = {}
            alert("Esendex Account not correct");
          }else if (response == 402) {
            sms_module = {}
            alert("Faltan creditos en la cuenta");
          }else{
            alert("Su SMS ha sido enviado con éxito");
          }
        });
      }
    });
  }
}
