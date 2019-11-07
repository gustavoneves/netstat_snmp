var express = require('express');
var app = express();

var snmp = require('net-snmp');

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

    function doneCbUDP (error) {
        if (error){
            console.error (error.toString ());
        }
        else{
            //console.log("TESTE: " + teste);
            return res.send("Portas udp abertas: " + teste);
        }
    }

    function doneCbTCPcon (error) {
        if (error){
            console.error (error.toString ());
        }
        else{
            //console.log("TESTE: " + teste);
            return res.send("Portas tcp ConnState: " + teste);
        }
    }
 
    if(resposta.botao){
        if(resposta.pTCP && resposta.pUDP){
            return res.send("ip: " + resposta.ip + " " + "TCP" + " e " + "UDP");
        }
        else{
            if(resposta.pUDP){
                var teste = "<br>";
                var t = "";
                const oidsUDP = "1.3.6.1.2.1.7.5.1.2";
                snmpSessao.subtree(oidsUDP, function (varbinds) {
                        for (var i = 0; i < varbinds.length; i++) {
                            //console.log (varbinds[i].oid + "|" + varbinds[i].value);
                            t = varbinds[i].value;
                       }
                       teste = teste.concat(t + "<br>");
                }, doneCbUDP);
            }
            else{
                var teste = "<br>";
                var t = "";
                var oidTCPConn = "1.3.6.1.2.1.6.13.1.1";
                snmpSessao.subtree(oidTCPConn, function (varbinds) {
                        for (var i = 0; i < varbinds.length; i++) {
                            //console.log (varbinds[i].oid + "|" + varbinds[i].value);
                            //t = varbinds[i].value;
                            if(varbinds[i].value === 5){ // 5 e' established
                                t = (varbinds[i].oid);
                                t = t.substring(oidTCPConn.length + 1); // + 1 devido ao ponto
                                var n = 1;
                                t = t.replace(/\./g, v => n++ == 5 ? " " : v); // remove o quinto ponto
                                n=1;
                                t = t.replace(/\./g, v => n++ == 4 ? ":" : v); // troca o quarto ponto
                                n=1;
                                t = t.replace(/\./g, v => n++ == 7 ? ":" : v); // troca o setimo ponto
                            }
                       }
                       teste = teste.concat(t + "<br>");
                }, doneCbTCPcon);

                //return res.send("ip: " + resposta.ip + " " + "TCP");
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
