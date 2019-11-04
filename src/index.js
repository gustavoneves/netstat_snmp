var express = require('express');
var app = express();

var snmp = require('net-snmp');

app.use(express.static('public'));


//app.get('/index.htm', function (req, res) {
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/process_get', function (req, res) {

    const oidsUDP = "1.3.6.1.2.1.7.5.1.2";
    const oidsTCP = ["1.3.6.1.2.1.6.13.1.3", "1.3.6.1.2.1.6.13.1.5"]; //portas locais e remotas
    // Prepara a saida para JSON
    resposta = {
        ip:req.query.ipConsulta,
        botao:req.query.ipBotao,
        pTCP:req.query.protoTCP,
        pUDP:req.query.protoUDP,
        community:req.query.communityConsulta
    };

    
    if(resposta.botao){
        if(resposta.pTCP && resposta.pUDP){
            return res.send("ip: " + resposta.ip + " " + "TCP" + " e " + "UDP");
        }
        else{
            if(resposta.pUDP){
                return res.send("ip: " + resposta.ip + " " + "UDP");
            }
            else{
                return res.send("ip: " + resposta.ip + " " + "TCP");
            }
        }     
    }


})

var servidor = app.listen(8081, function () {
//var servidor = app.listen(8081, "192.168.5.42", function () {
   var endHost = servidor.address().address
   var portaHost = servidor.address().port
   
   console.log("Servidor ouvindo em http://%s:%s", endHost, portaHost)

})





    
   // Prepara a saida para JSON
   /*
   resposta = {
        dia:req.query.iData,
        idProto:req.query.idProto,
        idASN:req.query.idASN,
        idPaises:req.query.idPaises
   };
   */
   //console.log(resposta);
	//
   //console.log(req.query);
   /*
   if(resposta.idProto){
      var caminho = resposta.dia + "/protocolos";
   } else if (resposta.idASN){
      var caminho = resposta.dia + "/ASNs";
   }
   else{
      var caminho = resposta.dia + "/paises";
   }
   */
   //console.log(caminho);
   //res.redirect(caminho);























//const express = require('express');

//const app = express();
/*
//intecepto a rota que passou a raiz
app.get('/', (req, res) => { //req representa a requisicao; res representa a resposta
    return res.send('Hello World');
});
*/
/*
app.get('/', (req, res) => { //req representa a requisicao; res representa a resposta
    return res.send(`Hello ${req.query.name}`);
});
*/
//app.listen(3333);