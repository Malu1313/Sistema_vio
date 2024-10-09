//Acessao objeto "document" que  respresenta a página html

//const { json } = require("body-parser");
//const { application, response } = require("express");

//Seleciona o elemento com o id indicado do formulário
document
  .getElementById("formulario-registro")
  //adiciona o ouvinte de evento(submit)para capturar o envio do formulário
  .addEventListener("submit", function (event) {
    //previne o comportamento padrão do formulário, ou seja, impede que ele saja enviado e recarregue a página
    event.preventDefault();
    //Captura os valores dos compos de formulario
    const name = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("senha").value;

    //Requisção HTTP para o endpoint de cadastro de usuário
    fetch("http://localhost:5000/api/v1/user", {
      //Realiza uma chamada HTTP para o servidor (a rota definida)
      method: "POST",
      headers: {
        //A requisição será em formato json
        "Content-Type": "application/json",
      },
      //Transforma os dados do formulário em uma string json para serem emviados no corpo da requisição
      body: JSON.stringify({ name, cpf, password, email }),
    })
      .then((response) => {
        //Tratamento da resposta do servidor / API
        if (response.ok) {
          //Verifica se a resposta foi bem sucedida(status 2xx)
          return response.json();
        }
        //Convertendo o erro em formato json
        return response.json().then((err) => {
          //Mensagem retonada do servidor,acessada pela chave "error"
          throw new Error(err.error);
        });
      }) //fechamento da then(response)
      .then((data) => {
        //Executa a resposta de sucesso -retorna ao usário final
        //Exibe um alerta para o usuário final(front) com o nome do usuário que acabou de ser cadastrado
        //alert("Usuário cadastrado com sucesso! " + data.user.name);
        alert(data.message);
        //exibe o log no terminal
        console.log("Usuario criado: ", data.user);
        //Reseta os campos do formulário após osucesso do trabalho
        document.getElementById("formulario-registro").reset();
      })
      .catch((error) => {
        //Captura qualquer erro que ocorra durente o processo da requisição /resposta
        alert("Erro no cadastro:" + error.message);
        console.error("Erro:", error.message);
      });
  });
