const db = require("./db");
let listarSalas=async ()=>{
    let salas = await db.findAll("salas");
    return salas;
}

let buscarSala = async (idsala)=>{
    return db.findOne("sala",idsala);
}

let buscarUsuario= async(idUser)=>{
    let user = await db.findOne("usuarios", idUser);
    return user;
}

let atualizarMensagens=async (sala)=>{
    return await db.updateOne("salas", sala,{_id:sala._id});
  }
 
  let buscarMensagens = async (idsala, timestamp)=>{
    let sala = await buscarSala(idsala);
    if(sala.msgs){
      let msgs=[];
      sala.msgs.forEach((msg)=>{
        if(msg.timestamp >= timestamp){
          msgs.push(msg);
        }
      });
      return msgs;
    }
    return [];
}
let criarSala = async (sala) => {
    return await db.insertOne("salas", sala);
  }
 
module.exports ={listarSalas, buscarUsuario,buscarSala, atualizarMensagens, buscarMensagens, criarSala}

