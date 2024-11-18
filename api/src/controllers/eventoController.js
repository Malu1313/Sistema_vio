const connect = require("../db/connect");

module.exports = class eventoController {
  //criação de um evento
  static async createEvento(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador } = req.body;

    //validação genérica de todos os atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser prenchidos!" });
    }

    const query = `insert into evento (nome, descricao, data_hora, local, fk_id_organizador) values (?,?,?,?,?)`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o evento!" });
        }
        return res.status(201).json({ message: "Evento criado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error); //o programador que irá ver está mensagem
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  } //fim do create

  //Visualizar todos os eventos cadastrados
  static async getAllEventos(req, res) {
    const query = `select * from evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        return res
          .status(200)
          .json({ message: "Eventos listados com sucesso!", events: results });
      });
    } catch (error) {
      console.log("Erro ao executar a query: ", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  } //fim do getAllEventos

  //update de um evento
  static async updateEvento(req, res) {
    const { id_evento, nome, descricao, data_hora, local, fk_id_organizador } =
      req.body;

    //validação genérica de todos os atributos
    if (
      !id_evento ||
      !nome ||
      !descricao ||
      !data_hora ||
      !local ||
      !fk_id_organizador
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser prenchidos!" });
    }

    const query = `update evento set nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? where id_evento=?`;
    const values = [
      nome,
      descricao,
      data_hora,
      local,
      fk_id_organizador,
      id_evento,
    ];
    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ", results);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o evento!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado!" });
        }
        return res
          .status(200)
          .json({ message: "Evento atualizado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error); //o programador que irá ver está mensagem
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  } //fim do update

  //Exclusão de eventos
  static async deleteEvento(req, res) {
    const idEvento = req.params.id;

    const query = `delete from evento where id_evento=?`;

    try {
      connect.query(query, idEvento, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir evento!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado!" });
        }
        return res
          .status(200)
          .json({ message: "Evento excluído com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta!", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async getEventosPorData(req, res) {
    const query = `SELECT * FROM evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }

        const dataEvento = new Date(results[0].data_hora);
        const dia = dataEvento.getDate();
        const mes = dataEvento.getMonth() + 1; //retorna de 0 a 11 (o +1 faz ele colocar o número real)
        const ano = dataEvento.getFullYear(); //retorna o ano com 4 digitos
        console.log(dia + "/" + mes + "/" + ano);

        const dataEvento1 = new Date(results[1].data_hora);
        const dia1 = dataEvento1.getDate();
        const mes1 = dataEvento1.getMonth() + 1; //retorna de 0 a 11 (o +1 faz ele colocar o número real)
        const ano1 = dataEvento1.getFullYear(); //retorna o ano com 4 digitos
        console.log(dia1 + "/" + mes1 + "/" + ano1);

        const dataEvento2 = new Date(results[2].data_hora);
        const dia2 = dataEvento2.getDate();
        const mes2 = dataEvento2.getMonth() + 1; //retorna de 0 a 11 (o +1 faz ele colocar o número real)
        const ano2 = dataEvento2.getFullYear(); //retorna o ano com 4 digitos
        console.log(dia2 + "/" + mes2 + "/" + ano2);

        const now = new Date();
        const eventosPassados = results.filter(
          (evento) => new Date(evento.data_hora) < now
        );
        const eventosFuturos = results.filter(
          (evento) => new Date(evento.data_hora) >= now
        );

        const diferencaMs =
          eventosFuturos[0].data_hora.getTime() - now.getTime();
        const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
          (diferencaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        console.log(
          diferencaMs,
          "Falta:" + dias + "dias",
          "e" + horas + "horas"
        );

        //comparando datas
        const dataFiltro = new Date("2024-12-15").toISOString().split("T");
        const eventosDia = results.filter(
          (evento) =>
            new Date(evento.data_hora).toISOString().split("T")[0] ===
            dataFiltro[0]
        );
        console.log("Eventos:", eventosDia);

        return res
          .status(200)
          .json({ message: "OK", eventosFuturos, eventosPassados });
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  }

  //Mostra os eventos que acontecem em tal dia e nos proximos 7
    static async getEventosdia(req, res) {
    const dataRecebida = req.params.data;

    // Converte a data recebida em um objeto Date
    const dataInicial = new Date(dataRecebida);
    const dataFinal = new Date(dataInicial);
    dataFinal.setDate(dataInicial.getDate() + 7); // Adiciona 7 dias à data inicial

    const dataInicial2 = new Date("2024-01-01").toISOString().split("T")[0];
    const dataFinal2 = new Date("2024-01-07").toISOString().split("T")[0];

    const query = `
      SELECT * FROM evento WHERE data_hora >= ? AND data_hora <= ?`;
    try {
      connect.query(query, [dataInicial2, dataFinal2], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }

        return res
          .status(200)
          .json({ message: "OK", dataInicial2, dataFinal2 });
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  }
};