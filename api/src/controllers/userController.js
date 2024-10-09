const connect = require("../db/connect");
module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    if (!cpf || !email || !password || !name) {
      //Se essas constantes estiver vazio tera uma res: Status 400
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      //Varificar se na const cpf tem 11 digitos
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      //Varificar se na const email inclui @
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      // Construção da query INSERT
      const query = `INSERT INTO usuario (cpf, password, email, name) VALUES('${cpf}','${password}','${email}','${name}')`;
      // Executando a query criada
      try {
        connect.query(query, function (err) {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                error: "O email já esta vinculado a outro usuário",
              });
            } else {
              return res.status(400).json({
                error: "Erro interno do servidor",
              });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário criado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }

  static async getAllUsers(req, res) {
    //Pegar todos os usuarios e mandar uma resposta de 200
    return res
      .status(200)
      .json({ message: "Obtendo todos os usuários" });
  }

  static async updateUser(req, res) {
    // Implementação em tempo real com Professor
    const { cpf, email, password, name } = req.body;
    //Desestrutura e recupera os dados enviados via corpo da requisição
    if (!cpf || !email || !password || !name) {
      //Validar se todos os campos da requisição foram preenchidos
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    //Procurar o indíce do user no Array 'users' pelo cpf
    const userIndex = users.findIndex((user) => user.cpf === cpf);
    //Se o usuario não for encontrado userIndex equivale a -1
    if (userIndex === -1) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    //Atualiza os dados do usuario  no array 'users'
    users[userIndex] = { cpf, email, password, name };
    return res
      .status(200)
      .json({ error: "Usuário atualizado", user: users[userIndex] });
  }

  static async deleteUser(req, res) {
    // Obtem o parametro 'id' da requisição, que é o cpf do user a ser deletato
    const userId = req.params.cpf;
    const userIndex = users.findIndex((user) => user.cpf === userId);
    //Se o usuario não for encontrado userIndex equivale a -1
    if (userIndex === -1) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }
    //Removendo o usuário do array 'users'
    users.splice(userIndex, 1);
    return res.status(200).json({ error: "Usuário Apagado" });
  }
};
