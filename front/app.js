//Chamada da função "createUser" para a associação ao evento de envio do formulário
document
  .getElementById("formulario-registro")
  .addEventListener("submit", createUser);

  document.addEventListener("DOMContentLoaded", getAllUsers);

function createUser(event) {
  //previne o comportamento padrão do formulário, ou seja, impede que ele saja enviado e recarregue a página
  event.preventDefault();
  //Captura os valores dos compos de formulario
  const name = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;

  //Requisção HTTP para o endpoint de cadastro de usuário
  fetch("http://10.89.240.105:5000/api/v1/user", {
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
      alert(data.message);
      console.log(data.message);

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
}

function getAllUsers() {
  fetch("http://10.89.240.105:5000/api/v1/user", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
    .then((data) => {
      const userList = document.getElementById("user-list");
      userList.innerHTML = ""; //Limpa a lista existente

      data.users.forEach((user)=>{
        const listItem = document.createElement ("li");
        listItem.textContent = `Nome: ${user.name},
        CPF: ${user.cpf}, Email: ${user.email}`
        userList.appendChild(listItem);
      })
    })
    .catch((error)=>{
      alert("Erro ao obter usuários" + error.message);
      console.error("Erro:", error.message);
    })
}

