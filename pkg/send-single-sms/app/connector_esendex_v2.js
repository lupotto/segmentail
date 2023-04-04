//EX0314456
//3f8ecc8ae01a4fdab192
function connector_esendex(auth_esendex){

  var self = this;

  this.auth = auth_esendex;

  this.proxyurl = "https://cors-anywhere.herokuapp.com/";
  this.url_check = "https://api.esendex.com/v1.0/session/constructor";
  this.auth["encoded_string"] = btoa(this.auth["credentials"]);

  this.check_account = function(callback){
    var request = {
  		url : self.url_check,
  		headers:{
  	 		"Authorization":"Basic "+self.auth["encoded_string"],
  			"Content-Type":"application/xml"
  		  }
      }
      ZOHO.CRM.HTTP.post(request)
        .then(function(data){
          callback(data)
        })
    }
    this.url_info_sms = "https://api.esendex.com/v1.0/messages/information"

    this.get_sms_length = function(msgcontent, callback){
      var data ="<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<messages xmlns=\"http://api.esendex.com/ns/\">\n <characterset>Auto</characterset>\n <message elementat=\"0\">\n  <body>"+msgcontent+"</body>\n </message>\n \n</messages>";
      var request = {
                      url : self.url_info_sms,
                      headers:{
                        "Authorization":"Basic "+self.auth["encoded_string"],
                        "Content-Type":"application/xml"
                      },
                      body: data
        }
        console.log(request);
        ZOHO.CRM.HTTP.post(request)
          .then(function(response){
            callback(response);
          })
      }
    this.url_credits = "https://api.esendex.com/v1.0/accounts"

    this.get_account_credits = function(callback){
      var request = {
                      url : self.url_credits,
                      headers:{
                        "Authorization":"Basic "+self.auth["encoded_string"],
                        "Content-Type":"application/xml"
                      }
        }
        ZOHO.CRM.HTTP.get(request)
          .then(function(response){
            callback(response);
          })
    }

    this.url_sms = "https://api.esendex.com/v1.0/messagedispatcher";

    this.send_sms = function(list_sms, callback){
      var request = {
        url : self.url_sms,
        headers:{
          "Authorization":"Basic "+self.auth["encoded_string"],
          "Content-Type":"application/json"
        },
        body: JSON.stringify({"accountreference": self.auth["esendex"],"messages": list_sms})
        }

        ZOHO.CRM.HTTP.post(request)
          .then(function(response){
            callback(response);
          })
      }

  this.url_conversation = "https://api.esendex.com/v1.0/conversation/"

  this.get_conversations = function(num_phone, callback){

    var request = {
                    url : self.url_conversation+"34"+num_phone+"/messages",
                    headers:{
                      "Authorization":"Basic "+self.auth["encoded_string"],
                      "Content-Type":"application/xml"
                    }
      }
      ZOHO.CRM.HTTP.get(request)
        .then(function(response){
          callback(response);
        })
  }

    this.url_batch = "https://api.esendex.com/v1.1/messagebatches/"

    this.get_batch = function(batch_id,  callback){
      try{
        var settings = {
          "url": self.proxyurl + self.url_batch + batch_id,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Basic "+self.auth["encoded_string"]
          },
         "error": function(err){
           callback(err.status)
        }
       };
       $.ajax(settings).done(function(response){
         callback(response)
       });

      }catch(e){
        console.log(e);
      }
    }
}
