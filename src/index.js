var express = require('express');
var app = express();

var snmp = require('net-snmp');

var h = "";

app.use(express.static('public'));


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/process_get', function (req, res) {

    // Prepara a saida para JSON
    resposta = {
        ip:req.query.ipConsulta,
        botao:req.query.ipBotao,
        pTCP:req.query.protoTCP,
        pUDP:req.query.protoUDP,
        community:req.query.communityConsulta
    };
    // snmpwalk -v 1 -c read_only_community_string localhost
    var snmpSessao = snmp.createSession(resposta.ip, resposta.community);

    var teste2;

    function doneCbUDP (error) {
        if (error){
            console.error (error.toString ());
        }
        else{
            teste = teste + "</table> <p><input type=\"button\" value=\"Nova Busca\" onclick=\"history.back()\"></input></p></body> </html>";
            return res.send(teste);
        }
    }

    function doneCbTCPcon (error) {
        if (error){
            console.error (error.toString ());
        }
        else{
            teste = teste + "</table> <p><input type=\"button\" value=\"Nova Busca\" onclick=\"history.back()\"></input></p></body> </html>";
            return res.send(teste);
        }
    }

    function doneCbUDP2 (error) {
        if (error){
            console.error (error.toString ());
        }
        else{
           var t2 = "";
           var oidTCPConn = "1.3.6.1.2.1.6.13.1.1";
           teste2 = teste + "</table> <br> </br> <table> <tr><th>Endereços/Portas Locais</th><th>Endereços/Portas Remotas</th></tr>"

           snmpSessao.subtree(oidTCPConn, function (varbinds) {

                for (var i = 0; i < varbinds.length; i++) {
                    if(varbinds[i].value === 5){ // 5 e' established
                        t2 = (varbinds[i].oid);
                        t2 = t2.substring(oidTCPConn.length + 1); // + 1 devido ao ponto
                        t2 = "<tr><td>" + t2;
                    
                                
                        var n2 = 1;
                        t2 = t2.replace(/\./g, v => n2++ == 5 ? "</td><td>" : v); // remove o quinto ponto
                        n2=1;
                        t2 = t2.replace(/\./g, v => n2++ == 4 ? ":" : v); // troca o quarto ponto
                        n2=1;
                        t2 = t2.replace(/\./g, v => n2++ == 7 ? ":" : v); // troca o setimo ponto
                        t2 = t2 + "</td>";

                        teste2 = teste2 + t2;
                    }
                }
            }, doneCbTCPcon2);
        }
    }

    function doneCbTCPcon2 (error) {
        if (error){
            console.error (error.toString ());
        }
        else{
            teste2 = teste2 + "</table> <p><input type=\"button\" value=\"Nova Busca\" onclick=\"history.back()\"></input></p></body> </html>";
            return res.send(teste2);
        }
    }
 
    if(resposta.botao){

        if(resposta.pTCP && resposta.pUDP){
           
           var teste = "<html> <head> <style> table, th, td { border: 1px solid black; border-collapse: collapse;} </style> </head><body> <table> <tr><th>Portas UDP</th></tr>"
           var t = "";
           const oidsUDP = "1.3.6.1.2.1.7.5.1.2";
           snmpSessao.subtree(oidsUDP, function (varbinds) {
                   for (var i = 0; i < varbinds.length; i++) {
                       t = varbinds[i].value;
                       teste = teste.concat("<tr><td>" + t + "</td></tr>");
                   }            
           }, doneCbUDP2);
        }
        else{
            if(resposta.pUDP){
                var teste = "<html> <head> <style> table, th, td { border: 1px solid black; border-collapse: collapse;} </style> </head><body> <table> <tr><th>Portas UDP</th></tr>"
                var t = "";
                const oidsUDP = "1.3.6.1.2.1.7.5.1.2";
                snmpSessao.subtree(oidsUDP, function (varbinds) {
                        for (var i = 0; i < varbinds.length; i++) {
                            t = varbinds[i].value;
                       }
                       teste = teste.concat("<tr><td>" + t + "</td></tr>");
                }, doneCbUDP);
            }
            else{
                var teste = "<html> <head> <style> table, th, td { border: 1px solid black; border-collapse: collapse;} </style> </head><body> <table> <tr><th>Endereços/Portas Locais</th><th>Endereços/Portas Remotas</th></tr>"

                var t = "";
                var oidTCPConn = "1.3.6.1.2.1.6.13.1.1";
                snmpSessao.subtree(oidTCPConn, function (varbinds) {
                        for (var i = 0; i < varbinds.length; i++) {
                            if(varbinds[i].value === 5){ // 5 e' established
                                t = (varbinds[i].oid);
                                t = t.substring(oidTCPConn.length + 1); // + 1 devido ao ponto
                                t = "<tr><td>" + t;
                                console.log(t);
                                
                                var n = 1;
                                t = t.replace(/\./g, v => n++ == 5 ? "</td><td>" : v); // remove o quinto ponto
                                n=1;
                                t = t.replace(/\./g, v => n++ == 4 ? ":" : v); // troca o quarto ponto
                                n=1;
                                t = t.replace(/\./g, v => n++ == 7 ? ":" : v); // troca o setimo ponto
                                t = t + "</td>";

                                teste = teste + t;
                            }
                       }
                }, doneCbTCPcon);
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
