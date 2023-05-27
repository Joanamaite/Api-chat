var express = require("express");
var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const token = require("./util/token.js");
const salaController = require("./controllers/salaController");
const usuarioController = require("./controllers/usuarioController");
const router = express.Router();

app.use('/', router.get('/',(req,res)=>{
    res.status(200).send("<h1>API-CHAT<h1>")
}));

app.use("/sobre",router.get("/sobre", (req, res, next)=>{
    res.status(200).send({
        "nome":"API - CHAT",
        "versão":"0.1.0",
        "autor":"Joana"
    })
}));
app.use("/sala/criar", router.post("/sala/criar", async (req, res) => {
    if (!token.checkToken(req.headers.token, req.body.iduser, req.body.nick)) {
      return res.status(400).send({ msg: "Usuário não autorizado" });
    }
  
    // Extrair os dados da requisição
    const { nome, tipo } = req.body;
  
    // Chamar o controller para criar a sala
    const sala = await salaController.criarSala(nome, tipo);
  
    if (sala) {
      return res.status(200).send({ msg: "Sala criada com sucesso", sala });
    } else {
      return res.status(400).send({ msg: "Erro ao criar sala" });
    }
  }));
//Listar Salas
app.use("/salas", router.get("/salas", async (req, res, next) => {
  if (await token.checkToken(req.body.token, req.body.iduser, req.body.nick)) {
    let resp = await salaController.get();
    res.status(200).send(resp);
    
  } else {
    res.status(400).send({ msg: "Usuário não autorizado" });
  }
}));

app.use("/entrar", router.post("/entrar", async(req, res, next)=>{
    const usuarioController = require("./controllers/usuarioController");
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
}));

app.use("/sala/entrar", router.put("/sala/entrar", async (req, res)=>{
    let resp = await salaController.entrar(req.body.iduser, req.body.idsala);
    res.status(200).send(resp);
}));

//enviar mensagem
app.use("/sala/mensagem/", router.post("/sala/mensagem", async (req, res) => {
    if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
    let resp= await salaController.enviarMensagem(req.headers.nick, req.body.msg,req.body.idsala);
    res.status(200).send(resp);
  }))
  //listar mensagem
  app.use("/sala/mensagens/", router.get("/sala/mensagens", async (req, res) => {
    if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
    let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
    res.status(200).send(resp);
  }))
  app.use("/sala/sair/", router.put("/sala/sair", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.body.iduser,req.body.nick)) return false;
	let resp= await salaController.sairSala(req.query.idsala, req.body.iduser);
	res.status(200).send(resp);
}))
  

module.exports=app;