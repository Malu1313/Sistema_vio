let users = [];
let cpf_user = 0;
const connect = require("../db/connect");
module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name, data_nascimento } = req.body;

    if (!cpf || !email || !password || !name || !data_nascimento) {
      //Verifica se todos os campos estão preenchidos
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      //Verifica se tem só números e se tem 11 dígitos
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      //Verifica se o email tem o @
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      // Construção da query INSERT
      const query = `INSERT INTO usuario (cpf, password, email, name, data_nascimento) VALUES('${cpf}', '${password}', '${email}', '${name}', '${data_nascimento}')`;
      // Executando a query criada
      try {
        connect.query(query, function (err) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "O Email já está vinculado a outro usuário" });
            } else {
              return res
                .status(500)
                .json({ error: "Erro interno do servidor" });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário criado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do Servidor" });
        }

        return res
          .status(200)
          .json({ message: "Lista de usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async updateUser(req, res) {
    // Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, name, email, password, cpf, data_nascimento } = req.body;

    // Validar se todos os campos foram preenchidos
    if (!name || !email || !password || !cpf || !data_nascimento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET name=?,email=?,password=?, cpf=? WHERE id_usuario = ?`;
    const values = [name, email, password, cpf, data_nascimento, id];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Cpf já cadastrado por outro usuario" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "usuario não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "usuario foi atualizado com sucesso" });
      });
    } catch {
      error;
    }
    {
      console.error("Erro ao executar consulta");
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteUser(req, res) {
    const usercpf = req.params.cpf;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [usercpf];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario não encontrado" });
        }

        return res.status(200).json({ message: "Usuario exluido com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async loginUser (req, res){
      const {email, password} = req.body

      if(!email || !password){
        return res.status(400).json({error:"Email e senha são obrigatórios"})
      }

      const query = `SELECT * FROM usuario WHERE email = ?`

      try{
        connect.query(query,[email],(err, results)=>{
          if (err){
          console.log(error);
            return res.status(500).json({error:"Erro interno do servidor"})
          }
          if(results.length===0){
            return res.status(404).json({error:"Usuário não encontrado"})
          }
          const user = results[0];

          if(user.password != password){
            return res.status(403).json({error:"Senha incorreta"})
          }

          return res.status(200).json({message:"Login bem sucedido", user})
        })
      }catch (error) {
        console.log(error);
        return res.status(500).json({error:"Erro interno do servidor"})
      }
  }
};
