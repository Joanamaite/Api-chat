const jwt = require("jsonwebtoken");

const checkToken = async (token, id, key) => { //função que verifica o token 
 return jwt.verify(token,key,(err,decoded)=>{
  if(err){
    return false;
  }else if(decoded.id==id){
    return true;
  }else{
    return false;
  }
 })
};

const setToken = async (id,key)=>{//cria um token para o usuario
  console.log(id);
  if(id){
    return jwt.sign({id},key, {expiresIn:28800})
  }
  console.log(token);
  return false;
  
};

module.exports = {
  checkToken,
  setToken
}
