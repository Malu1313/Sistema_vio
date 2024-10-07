let organizadores = [];
let id_organizadores = 0;
module.exports = class organizadorController {
  static async createOrganizador(req, res) {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha || !telefone) {
      //Verifica se todos os campos estão preenchidos
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      //Verifica se tem só números e se tem 11 dígitos
      return res
        .status(400)
        .json({
          error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos",
        });
    } else if (!email.includes("@")) {
      //Verifica se o email tem o @
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um usuário com o mesmo Email
    const existingOrganizador = organizadores.find((organizador) => organizador.email === email);
    if (existingOrganizador) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Cria e adiciona novo usuário
    const newOrganizador = { id: id_organizadores++, nome, email, senha, telefone };
    organizadores.push(newOrganizador);

    return res
      .status(201)
      .json({ message: "Organizador criado com sucesso", organizadores: newOrganizador }); //201 significa cadastrado
  }

  static async getAllOrganizadores(req, res) {
    //Lista todos os usuarios
    return res
      .status(200)
      .json({ message: "Obtendo todos os Organizadores", organizadores }); //200 significa sucesso
  }

  static async updateOrganizador(req, res) {
    // Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, nome, email, senha, telefone } = req.body;

    // Validar se todos os campos foram preenchidos
    if (!nome || !email || !senha || !telefone) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    // Procurar o indice do organizador no Array 'organizadores' pelo id
    const organizadorIndex = organizadores.findIndex((organizador) => organizador.id === id);

    // Se o organizador não for encontrado organizadorIndex equivale a -1
    if (organizadorIndex === -1) {
      return res.status(400).json({ error: "Organizador não encontrado" });
    }

    // Atualiza os dados do organizador do Array 'organizadores'
    organizadores[organizadorIndex] = { id, nome, email, senha, telefone };

    return res
      .status(200)
      .json({ message: "Organizador atualizado", organizador: organizadores[organizadorIndex] });
  }

  static async deleteOrganizador(req, res) {
    // Obtém o parâmetro 'id' da requisição, que é o id do organizador a ser deletado
    const organizadorId = req.params.id;

    // Procurar o indice do organizador no Array 'organizadores' pelo email
    const organizadorIndex = organizadores.findIndex((organizador) => organizador.id == organizadorId);

    // Se o usuário não for encontrado organizadorIndex equivale a -1
    if (organizadorIndex === -1) {
      return res.status(400).json({ error: "Organizador não encontrado" });
    }

    //Removendo o usuário do Array 'organizadores'
    organizadores.splice(organizadorIndex, 1);

    return res.status(200).json({message: "Organizador Apagado"});
  }
};
