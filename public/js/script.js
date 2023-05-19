//produtos: https://raw.githubusercontent.com/JessicaMoreiraS/Formulario---Consumo-JSON/main/produtos.json

//Selecionar apenas uma forma de pagamento
var pagEscolhido = "";
function selecionaPag(mantem){
    if(mantem == "cardCredt"){
        document.getElementById("cardDebt").checked = false;
        document.getElementById("transferencia").checked = false;
        document.getElementById("pix").checked = false;
        pagEscolhido = "cardCredt";
    }else{
        document.getElementById("cardCredt").checked = false;
        if(mantem == "cardDebt"){
            document.getElementById("transferencia").checked = false;
            document.getElementById("pix").checked = false;
            pagEscolhido = "cardDebt";
        }else{
            document.getElementById("cardDebt").checked = false;
            if(mantem == "transferencia"){
                document.getElementById("pix").checked = false;
                pagEscolhido = "transferencia";
            }else{
                document.getElementById("transferencia").checked = false;
                pagEscolhido = "pix";
            }
        }
    }
}


//GET COMPRADOR
var senhaCorretaCoprador= "";
function buscarComprador(){
    if(document.getElementById("idComprador").value.length == 6){
        var idComprador = document.getElementById("idComprador").value

        fetch(`Comprador/${idComprador}`)
        .then(response => 
            response.json()
        ).then(comprador => {
            if(comprador.nome == undefined){
                Swal.fire("comprador não encontrador")
                return;
            }else{
                document.getElementById("nomeComprador").value = comprador.nome;
                senhaCorretaCoprador = comprador.senha
            }
        })
    }
}


//GET PRODUTOS XIAOMI
function escolherXiaomi(){
    if(document.getElementById("xiaomi").checked == true){
        document.getElementById("samsung").checked = false;
        document.getElementById("apple").checked = false;
        buscarProd(2);
    }
}

//GET PRODUTOS APPLE
function escolherApple(){
    if(document.getElementById("apple").checked == true){
        document.getElementById("samsung").checked = false;
        document.getElementById("xiaomi").checked = false;
        buscarProd(1);
    }   
}

//GET PRODUTOS SAMSUNG
function escolherSamsung(){
    if(document.getElementById("samsung").checked == true){
        document.getElementById("xiaomi").checked = false;
        document.getElementById("apple").checked = false;
        buscarProd(0);
    }
}

//GET ENCONTRAR OS PRODUTOS DA MARCA
var marcaPosition = "";
function buscarProd(marcaPosicao){
    fetch('https://raw.githubusercontent.com/JessicaMoreiraS/Formulario---Consumo-JSON/main/produtos.json')
    .then(response =>{
        return response.json()
    }).then(produtos =>{
        marcas = [produtos.Samsung, produtos.Apple, produtos.Xiaomi]
        marcaPosition = marcaPosicao
      
        document.getElementById("nomeProd").innerHTML = ""        
        for(x=0; x<marcas[marcaPosicao].length; x++){
            document.getElementById("nomeProd").innerHTML += '<option value='+x+'>'+marcas[marcaPosicao][x].nome+'</option>'
        }
        preencherPreco(0)
    })
}

//GET PRECO E DESCRICAO DO PRODUTO
var idProdEscolhido = "";
function preencherPreco(posicaoProd){
    fetch('https://raw.githubusercontent.com/JessicaMoreiraS/Formulario---Consumo-JSON/main/produtos.json')
    .then(response =>{
        return response.json()
    }).then(produtos =>{
        marcas = [produtos.Samsung, produtos.Apple, produtos.Xiaomi]
        idProdEscolhido = marcas[marcaPosition][posicaoProd].id

        document.getElementById("precoUnid").value = marcas[marcaPosition][posicaoProd].preco;
        document.getElementById("areaDescricao").innerHTML = "<p>"+marcas[marcaPosition][posicaoProd].descricao+"</p>"
        preencherPrecoTotal(document.getElementById("quantidade"));
    })
}

//PREENCHER PRECO TOTAL
function preencherPrecoTotal(quantidade){
    if(quantidade.value != "" && document.getElementById("precoUnid").value != ""){
        var nQuantidade = parseFloat(quantidade.value);
        var valorUnitario = parseFloat(document.getElementById("precoUnid").value);
        var valorTotal =nQuantidade*valorUnitario
        document.getElementById("precoTotal").value = valorTotal;
    }
    if(quantidade.value == ""){
        document.getElementById("precoTotal").value = "";
    }
}


//GET CEP
function buscarCep(inputCep){
    if(inputCep.value.length == 8){
        const preencherFormulario = (endereco) => {
            document.getElementById("rua").value = endereco.logradouro;
            document.getElementById("bairro").value = endereco.bairro;
            document.getElementById("cidade").value = endereco.localidade;
            document.getElementById("estado").value = endereco.uf;
        }

        const pesquisarCep = async () => {
            const cep = inputCep.value;
            const url = `https://viacep.com.br/ws/${cep}/json/`;
            
            const dados = await fetch(url); //o fetch busca a url
            const endereco = await dados.json();
            preencherFormulario(endereco);
            console.log(endereco);
        }
        document.getElementById("cep").addEventListener("focusout", pesquisarCep);

        document.getElementById("numero").focus();
    }
}



function verificaCamposPedido(){
    if(document.getElementById("nomeComprador").value == ""){
        Swal.fire("insira seu id");
        return false;
    }
    if(document.getElementById("senhaComprador").value != senhaCorretaCoprador){
        Swal.fire("senha invalida");
        return false;
    }
    if(document.getElementById("quantidade").value == ""){
        Swal.fire("Escolha a quantidades de produtos que deseja comprar");
        return false;
    }
    if(document.getElementById("precoUnid").value == ""){
        Swal.fire("Escolha a marca do produto");
        return false;
    }
    if(document.getElementById("cardCredt").checked == false && document.getElementById("cardDebt").checked == false && document.getElementById("transferencia").checked == false && document.getElementById("pix").checked == false){
        Swal.fire("escolha uma forma de pagamento");
        return false;
    }
    if(document.getElementById("dataEntrega").value == ""){
        Swal.fire("Escolha uma data para a entrega do pedido");
        return false;
    }
    if(document.getElementById("rua").value == ""){
        Swal.fire("Escolha um CEP valido para a entrega do pedido");
        return false;
    }
    if(document.getElementById("numero").value == ""){
        Swal.fire("Escolha um número de endereço valido para a entrega do pedido");
        return false;
    }
    return true;
}

//POST PEDIDO
function enviarPedido(){
    event.preventDefault();
    
    if(verificaCamposPedido()){
        fetch('pedidos',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idComprador: document.getElementById("idComprador").value,
                idProduto: idProdEscolhido,
                quantidade: document.getElementById("quantidade").value,
                valorUnitario: document.getElementById("precoUnid").value,
                valorTotal: document.getElementById("precoTotal").value,
                endereco:
                {
                    cep: document.getElementById("cep").value,
                    numero: document.getElementById("numero").value,
                },
                formaPag: pagEscolhido,
                dataEntrega: document.getElementById("dataEntrega").value,
                infoAdd: document.getElementById("infoAdd").value,
                status: "pendente"
            })
        })
        .then(response => response.json())
        alert("Pedido realizado com sucesso")
        location.reload()
    }
}

function verificaCamposCadastro(){
    if(document.getElementById("nome").value == ""){
        Swal.fire("insira seu nome");
        return false;
    }
    if(document.getElementById("senha").value == ""){
        Swal.fire("insira uma senha valida");
        return false;
    }
    if(document.getElementById("email").value == ""){
        Swal.fire("insira um email valido");
        return false;
    }
    if(document.getElementById("telefone").value == ""){
        Swal.fire("insira um número de telefone");
        return false;
    }
    return true;
}

//POST COMPRADOR
//GET ID DO NOVO COMPRADOR
function cadastrarComprador(){
    event.preventDefault();

    var ultimoId = "";
    
    if(verificaCamposCadastro()){
        fetch('Comprador',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: document.getElementById("nome").value, 
                senha: document.getElementById("senha").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("telefone").value,
                cpf: document.getElementById("cpf").value
            })
        })
        .then(response => response.json());
        
        fetch(`Comprador`)
        .then(response => 
            response.json()
        ).then(compradores => {
            ultimoId = compradores[compradores.length-1].id
            console.log(ultimoId)
            sessionStorage.setItem('novoId', ultimoId)
            cadastro = true
        })
    }
    location.reload()
}

function swalCadastroComprador(){
    if(sessionStorage.getItem('novoId') != "undefined" && sessionStorage.getItem('novoId') != null){
        Swal.fire({
            icon: 'success',
            title: "Atenção, seu ID é: " + sessionStorage.getItem('novoId'),
            text: "Use seu ID para acessar sua conta e fazer seus pedidos",
            timer: 5000,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        sessionStorage.setItem('novoId', "undefined")
    }
}


//GET PRODUTOS
function exibirProdutos(){
    var boxProd = "";
    fetch('https://raw.githubusercontent.com/JessicaMoreiraS/Formulario---Consumo-JSON/main/produtos.json')
    .then(response =>{
        return response.json()
    }).then(produtos =>{
        var marcas = [produtos.Samsung, produtos.Apple, produtos.Xiaomi]
        
        for(x=0; x<marcas.length; x++){
            for(y=0; y<marcas[x].length; y++){      
                boxProd = `<div class="boxProd">
                <h3>ID: ${marcas[x][y].id}</h3>
                <h4>${marcas[x][y].nome}</h4>
                <p>${marcas[x][y].descricao}</p>
                <h4>R$${(marcas[x][y].preco).toFixed(2)}</h4>
                </div>`;
                
                $('#areaProd').append(boxProd)  /* ($("#...") ) == ( document.getElementById("") ) && ( .apende ) == ( .innerHTML += )*/
            }
        }
    })
}

//GET PEDIDOS
function exibirPedidos(){
    fetch(`pedidos`)
    .then(response => 
        response.json()
    ).then(pedidos => {
        for(x=0; x<pedidos.length; x++){
            var linha = `<tr>
                <td>${pedidos[x].id}</td>
                <td>${pedidos[x].idComprador}</td>
                <td>${pedidos[x].idProduto}</td>
                <td>${pedidos[x].quantidade}</td>
                <td>${pedidos[x].valorUnitario}</td>
                <td>${pedidos[x].valorTotal}</td>
                <td>CEP: ${pedidos[x].endereco.cep} | N°: ${pedidos[x].endereco.numero}</td>
                <td>${pedidos[x].formaPag}</td>
                <td>${pedidos[x].dataEntrega}</td>
                <td>${pedidos[x].infoAdd}</td>
                <td>${pedidos[x].status}</td>
                <td><button onclick="mudarStatusPedido(${pedidos[x].id})">Mudar</button></td>
                <td><button onclick="apagarPedido(${pedidos[x].id})">Deletar</button></td>
                </tr>`
            document.getElementById("tbody").innerHTML += linha 
        }
    })
}

//PUT PEDIDO
function mudarStatusPedido(idPedido){
    var diferenteStatus;
    fetch(`pedidos/${idPedido}`,{
        method: "GET",
    }) 
    .then(response => response.json())
    .then(pedido => {
        if(pedido.status == "pendente"){
            diferenteStatus = "entregue"
            location.reload()
        }
        if(pedido.status == "entregue"){
            diferenteStatus = "pendente"
            location.reload()
        }

        var oIdComprador= pedido.idComprador;
        var oIdProduto= pedido.idProduto;
        var aQuantidade= pedido.quantidade;
        var oValorUnitario= pedido.valorUnitario;
        var oValorTotal= pedido.valorTotal;
        var oCep= pedido.endereco.cep;
        var oNumero= pedido.endereco.numero;
        var aFormaPag= pedido.formaPag;
        var aDataEntrega= pedido.dataEntrega;
        var aInfoAdd= pedido.infoAdd;
    

    fetch(`pedidos/${idPedido}`,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idComprador: oIdComprador,
            idProduto: oIdProduto,
            quantidade: aQuantidade,
            valorUnitario: oValorUnitario,
            valorTotal: oValorTotal,
            endereco:
            {
                cep: oCep,
                numero: oNumero,
            },
            formaPag: aFormaPag,
            dataEntrega: aDataEntrega,
            infoAdd: aInfoAdd,
            status:diferenteStatus
        })
    }) 
   .then(response => response.json())
    })
}

//DELETE PEDIDO
function apagarPedido(idPedido){
    fetch(`pedidos/${idPedido}`,{
        method: "DELETE",
   }) 
   .then(response => response.json())
   location.reload()
}

//GET PEDIDOS ENTREGUES / PENDENTES
function exibirPedidosPendentesOuEntregues(situacao){
    fetch(`pedidos`)
    .then(response => 
        response.json()
    ).then(pedidos => {
        for(x=0; x<pedidos.length; x++){
            if(situacao == "pendente"){
                if(pedidos[x].status == "pendente"){
                    console.log("Aqui")
                    var linha = `<tr>
                    <td>${pedidos[x].id}</td>
                    <td>${pedidos[x].idComprador}</td>
                    <td>${pedidos[x].idProduto}</td>
                    <td>${pedidos[x].quantidade}</td>
                    <td>${pedidos[x].valorUnitario}</td>
                    <td>${pedidos[x].valorTotal}</td>
                    <td>CEP: ${pedidos[x].endereco.cep} | N°: ${pedidos[x].endereco.numero}</td>
                    <td>${pedidos[x].formaPag}</td>
                    <td>${pedidos[x].dataEntrega}</td>
                    <td>${pedidos[x].infoAdd}</td>
                    </tr>`
                    document.getElementById("tbody").innerHTML += linha
                }
            }else{
                if(pedidos[x].status == "entregue"){
                    var linha = `<tr>
                    <td>${pedidos[x].id}</td>
                    <td>${pedidos[x].idComprador}</td>
                    <td>${pedidos[x].idProduto}</td>
                    <td>${pedidos[x].quantidade}</td>
                    <td>${pedidos[x].valorUnitario}</td>
                    <td>${pedidos[x].valorTotal}</td>
                    <td>CEP: ${pedidos[x].endereco.cep} | N°: ${pedidos[x].endereco.numero}</td>
                    <td>${pedidos[x].formaPag}</td>
                    <td>${pedidos[x].dataEntrega}</td>
                    <td>${pedidos[x].infoAdd}</td>
                    </tr>`
                    document.getElementById("tbody").innerHTML += linha
                }
            }
        }
    })
    
}

//GET COMPRADORES
function exibirTabelaCompradores(){
    fetch(`Comprador`)
    .then(response => 
        response.json()
    ).then(compradores => {
        for(x=0; x<compradores.length; x++){
        var linha = `<tr>
        <td>${compradores[x].id}</td>
        <td>${compradores[x].cpf}</td>
        <td>${compradores[x].nome}</td>
        <td>${compradores[x].email}<a href="mailto:email@provedor.com.br"><img class="imgWhats" src="/imagens/email.png" class="icoEmail"></a></td>
        <td>${compradores[x].telefone}<a href="https://api.whatsapp.com/send?1=pt_BR&phone=55${compradores[x].telefone}" target="_blank"><img class="imgWhats" src="/imagens/whatsapp.png" class="icoWhats"></a></td>
        </tr>`
        document.getElementById("tbody").innerHTML += linha
        }
    })
}


//GET COMPRADOR (LOGIN)
var compradorAcesso;
function acessarConta(){
    event.preventDefault();
    var idComprador = document.getElementById("id").value

    fetch(`Comprador/${idComprador}`)
    .then(response => 
        response.json()
    ).then(comprador => {
        if(comprador.nome == undefined){
            Swal.fire("comprador não encontrador")
            return;
        }else{
            if(comprador.senha == document.getElementById("senha").value){

                sessionStorage.setItem('chave', comprador.id );
                window.location='/perfil.html';
            }else{
                Swal.fire("senha incorreta")
            }
        }
    })
}

//GET DADOS COMPRADOR (PERFIL)
//GET PEDIDOS DO COMPRADOR (TABELA DO PERFIL)
//GET PRODUTO DO PEDIDO (TABELA PERFIL)
function perfilComprador(){
    var idArquivado = sessionStorage.getItem('chave');
    fetch(`Comprador/${idArquivado}`)
    .then(response => 
        response.json()
    ).then(comprador => {
        document.getElementById("idComprador").value = comprador.id
        document.getElementById("nomeComprador").value = comprador.nome
        document.getElementById("telefoneComprador").value = comprador.telefone
        document.getElementById("emailComprador").value = comprador.email
        document.getElementById("senhaComprador").value = comprador.senha
        document.getElementById("cpfComprador").value = comprador.cpf
    })

    fetch(`pedidos`)
    .then(response => 
        response.json()
    ).then(pedidos => {

        var idProdPedido = [];
        var idPedido = [];
        var quantidade = [];
        var valorUnit = [];
        var valorTot = [];
        var dataEnt = [];
        var cep = [];
        var numero = [];
        var status = [];
        var btnDelete = [];

        var prodNome = [];
        var prodDescricao = [];

        for(x=0; x<pedidos.length; x++){
            if(pedidos[x].idComprador == idArquivado){
                idProdPedido.push(pedidos[x].idProduto);
                idPedido.push(pedidos[x].id);
                quantidade.push(pedidos[x].quantidade);
                valorUnit.push(pedidos[x].valorUnitario);
                valorTot.push(pedidos[x].valorTotal);
                dataEnt.push(pedidos[x].dataEntrega);
                cep.push(pedidos[x].endereco.cep);
                numero.push(pedidos[x].endereco.numero);
                status.push(pedidos[x].status);
                var idBtn =pedidos[x].id;

                if(status[status.length-1] == "pendente"){
                    btnDelete.push(`<button onclick="apagarPedido(${idBtn})">Cancelar Pedido</button>`)
                }else{
                    btnDelete.push(`<p>-<p>`)
                }

                fetch(`https://raw.githubusercontent.com/JessicaMoreiraS/Formulario---Consumo-JSON/main/produtos.json`)
                .then(response => 
                    response.json()
                ).then(produtos => {
                    marcas = [produtos.Samsung, produtos.Apple, produtos.Xiaomi]

                    document.getElementById("corpoTab").innerHTML ="";
                    for(b=0; b<idPedido.length; b++){

                        for(y=0; y<marcas.length; y++){
                            for(a=0; a<marcas[y].length; a++){
                                if(marcas[y][a].id == idProdPedido[b]){
    
                                    prodNome.push(marcas[y][a].nome);
                                    prodDescricao.push(marcas[y][a].descricao);
                                }
                            }
                        }
                        var linha = `<tr>
                        <td>${idPedido[b]}</td>
                        <td>${idProdPedido[b]}</td>
                        <td>${prodNome[b]}</td>
                        <td>${prodDescricao[b]}</td>
                        <td>${quantidade[b]}</td>
                        <td>${valorUnit[b]}</td>
                        <td>${valorTot[b]}</td>
                        <td>${dataEnt[b]}</td>
                        <td>CEP:${cep[b]} | Nº:${numero[b]}</td>
                        <td>${status[b]}</td>
                        <td>${btnDelete[b]}</td>
                        </tr>`;
                    
                        document.getElementById("corpoTab").innerHTML += linha
                    }
                })
            }
        }
    })
}

function atualizarComprador(){
    event.preventDefault();
    sessionStorage.setItem('mensagem', true);
    
    fetch(`Comprador/${document.getElementById("idComprador").value}`,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: document.getElementById("nomeComprador").value,
            telefone: document.getElementById("telefoneComprador").value,
            email: document.getElementById("emailComprador").value,
            senha: document.getElementById("senhaComprador").value,
            cpf: document.getElementById("cpfComprador").value,
        })
    }) 
    .then(response => response.json())
    location.reload()
}

function swalDadosAtualizados(){
    if(sessionStorage.getItem('mensagem') == "true"){
        Swal.fire({
            icon: 'success',
            title: 'Dados atualizados com sucesso',
            showConfirmButton: false,
            timer: 1500
        })
        sessionStorage.setItem('mensagem', false)
    }
}



function senhaGestor(){
    Swal.fire({
        title: 'Essa area é restrita ao Gestor, para acessa-la digite a senha',
        input: 'password',
        inputAttributes: {
          placeholder:123456
        },
        confirmButtonText: 'Acessar',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        preConfirm: (senha) => {
            if(senha == 123456){
                window.location='/areaGestor.html';
            }else{
                Swal.fire({
                    title: `Senha incorreta. Acesso negado`,
                })
            }
        }
    })
}

function BuscarIdPorCpf(){
    event.preventDefault();
    const cpf = $('#cpf').val()
    const senha = $('#senha').val()

    fetch(`Comprador`)
    .then(response => 
        response.json()
    ).then(compradores => {
        const pessoaEncontrada = compradores.find(pessoa => pessoa.cpf == cpf );
        if(pessoaEncontrada){
            if(pessoaEncontrada.senha == senha){
                Swal.fire(`Ateção, seu ID é: ${pessoaEncontrada.id}`)
            }else{
                Swal.fire("Senha incorreta")
            }
        }else{
            Swal.fire("CPF não encontrado")
        }
    })
}


//GET USUARIO - VERIFICA CPF E ENVIA EMAIL COM SENHA (ESQUECER ID)
function enviarEmailComSenha(){
    event.preventDefault();
    const cpf = $('#cpf').val()

    fetch(`Comprador`)
    .then(response => 
        response.json()
    ).then(compradores => {
        
        const pessoaEncontrada = compradores.find(pessoa => pessoa.cpf == cpf );
        if(pessoaEncontrada){

            document.getElementById('formEmail').action = `https://formsubmit.co/${pessoaEncontrada.email}`;
            $('#conteudoEmail').val(`Sua senha é ${pessoaEncontrada.senha}`)
            document.getElementById('formEmail').submit()  
        }else{
            Swal.fire("CPF não encontrado")
        }
    })
}
