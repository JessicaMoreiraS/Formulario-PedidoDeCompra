//Importar a biblioteca json-server
const jsonServer =  require('json-server');

//Criar uma instancia do servidor JsonServer
const server = jsonServer.create();

//Criar um roteador com o arquivo db.json
//O roteador define as rotas 
const router = jsonServer.router('db.json');

//Funcao que é executada em cada requisicao feit com o servidor
//Importa os padrões JSONSERVER 
const requisicao = jsonServer.defaults();

//Funcao que é  executada em cada requisicao
server.use(requisicao);

//Define a porta
const porta = 3000;

//Usa o roteador criado
server.use(router);

//Importa o modulo express (não esqueça de instalar)
const express = require('express');
const app =  express();

//Configura o servidor para usar na pasta Public
app.use(express.static('public'))

//Define a rota principal
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/login.html');
})

//Inicia o servidor na porta definida
server.listen(porta, () => {
    console.log(`JsonServer esta rodando em http://localhost:${porta}`);
})


// //tentando enviar email
// const nodemailer = require('nodemailer')
// require('dotenv').config()

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     //port: 25,
//     service: 'gmail',
//     secure: true,
//     auth: {
//         user: "jessicamoreirars09@gmail.com",
//         pass: "09"
//     },
//     //tls: { rejectUnauthorized: false }
// });
// var email = `jessicamoreirars09@gmail.com`
// //email a ser enviado
// const mailOptions = {
//     from: process.env.email,
//     to: 'jessica.moreira.roso@gmail.com',
//     subject: 'E-mail recuperação de senha!',
//     text: `Atenção 
//         Sua Senha é 123
//         Não compartilhe sua senha com outras pessoas`
// };

// //chamar a funcao para enviar o email
// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//         console.log('Email enviado: ' + info.response);
//     }
// });







// //importar o módulo express
// const express = require('express');

// //Criar a instancia do express
// const app = express();

// //Definindo a porta do servidor
// const port = 3000;

// //funcao de uma requisicao feita pelo servidor
// app.use(express.static('public'));

// //Definir a rota principal e nviando o arquivo index.html para o localholst3000
// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/index.html')
// })

// //Exibir uma mensagem no console para verificar se o servidor esta funcionando
// console.log(`A porta que esta conectada é http://localhost:${port}`);

// //Iniciando o servidor na porta definida
// app.listen(port);