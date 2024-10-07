let users = []; //array definido

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    if (!cpf || !email || !password || !name) {
      //se estiver vazio
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      //se o cpf é um número e tem tamanho 11
      return res
        .status(400)
        .json({
          error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
        });
    } else if (!email.includes("@")) {
      //se dentro dessa string tem @
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um usuário com o mesmo CPF
    const existingUser = users.find((user) => user.cpf === cpf);
    if (existingUser) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    // Cria e adiciona novo usuário
    const newUser = { cpf, email, password, name };
    users.push(newUser);

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user: newUser }); //no final coloca isso
  }

  static async getAllUsers(req, res) {
    //pega todos os usuarios
    return res
      .status(200)
      .json({ message: "Obtendo todos os usuários", users });
  }

  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { cpf, email, password, name } = req.body;

    //Validar se todos os campos foram preenchidos
    if (!cpf || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    //Procurar o índice do usuário no Array 'users' pelo cpf
    const userIndex = users.findIndex((user) => user.cpf === userId);

    //Se o usuário não for encontrado unserIndex equivale a -1
    if (userIndex === -1) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    //Atualiza os dados do usuário no Array 'users'
    users[userIndex] = { cpf, email, password, name };

    return res
      .status(200)
      .json({ message: "Usuário atualizado", user: users[userIndex] }); //Atribuindo valor do [userIndex] para user
  }

  static async deleteUser(req, res) {
    //Obtém o parâmetro 'id' da requisição, que é ao CPF do user a ser deletado
    const userId = req.params.cpf;

    //Procurar o índice do usuário no Array 'users' pelo cpf
    const userIndex = users.findIndex((user) => user.cpf === userId);

    //Se o usuário não for encontrado unserIndex equivale a -1
    if (userIndex === -1) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    //Removendo o usuário do Array 'users'
    users.splice(userIndex, 1);

    return res.status(200).json({ message: "Usuário apagado" });
  }
};
