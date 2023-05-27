const salaModel = require('../models/salaModel');
const usuarioModel = require('../models/usuarioModel');

exports.get = async (req, res) => {
  return await salaModel.listarSalas();
};

exports.entrar = async (iduser, idsala) => {
  const sala = await salaModel.buscarSala(idsala);

  let user = await usuarioModel.buscarUsuario(iduser);
  user.sala = {_id:sala._id, nome:sala.nome, tipo:sala.tipo};
  if (await usuarioModel.alterarUsuarios(user)) {
    return { msg: "OK", timestamp: Date.now() };
  }
  return false;
};

exports.enviarMensagem = async (nick, msg, idsala) => {
  const sala = await salaModel.buscarSala(idsala);
  if (!sala.msgs) {
    sala.msgs = [];
  }
  const timestamp = Date.now();
  sala.msgs.push({
    timestamp: timestamp,
    msg: msg,
    nick: nick
  });
  let resp = await salaModel.atualizarMensagens(sala);
  return { msg: "OK", timestamp: timestamp };
};

exports.buscarMensagens = async (idsala, timestamp) => {
  let mensagens = await salaModel.buscarMensagens(idsala, timestamp);
  return {
    timestamp: mensagens[mensagens.length - 1].timestamp,
    msgs: mensagens
  };
};

exports.sairSala = async (idsala, iduser) => {
  let user = await usuarioModel.buscarUsuario(iduser);
  let resp = await exports.enviarMensagem(iduser, "Sai da sala!", idsala); 
  delete resp.sala;
  console.log(user);
  if (await usuarioModel.alterarUsuarios(user)) {
    user = await usuarioModel.buscarUsuario(iduser);
    console.log(user);
    return { msg: "OK", timestamp: Date.now() };
  }

  return false;
};

exports.criarSala = async (nome, tipo) => {
  const sala = {
    nome: nome,
    tipo: tipo,
    msgs: []
  };

  const novaSala = await salaModel.criarSala(sala);
  return novaSala;
};

 
 
 
 
 
 
 