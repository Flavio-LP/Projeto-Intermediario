const express = require('express')
const axios = require('axios').default
const parser = require('node-html-parser').parse
const app = express()
const PORT = process.env.PORT || 8080

app.get('/',function(req,res){
    res.send("Está página possui três rotas implementadas, são elas /steam(exemplo:https://projetointermediarioppw2.herokuapp.com/steam/?temr='escreva o nome de um jogo que queira procurar na steam'),/api ou /api?/pokemon='escrava o nome de um pokemon' e /ageofempires2, qualquer outra página será redirecionada para a steam")
})

app.get('/steam', function(req, res){ //- ROTA QUE FAZ WEB SCARPING
    var query = req.query.term  //- RECEBE UM TERMO PRA PESQUISAR NA STEAM
    if(query==undefined){
        vetor='Error 404, query sem valor!' // RETORNA ERRO 404 CASO NÃO TENHO QUERY STRING 
        res.send(vetor)
        return
    }
    var vetor=[]
    var jogos = []
    var datas_jogos=[]

    var url = "https://store.steampowered.com/search/?term="+query //- FAZ A REQUISIÇÃO NA STEAM
    var requisicao = axios.get(url)
    requisicao.then(function(resposta){
        var root = parser(resposta.data)
        var pesquisa=root.querySelectorAll('.col.search_name.ellipsis') //- FAZ A CAPTURA POR CLASSES NO HTML RETORNADO
        var nome=parser(pesquisa)
        var jogo_lista=nome.querySelectorAll('.title') //- PEGA O TITULO DO JOGO PESQUISADO
        jogo_lista.forEach(function(jogos_lista){
            var obs={
                "Nome:": jogos_lista.innerHTML,
                "Data_Lancamento":[]
                
            }
            vetor.push(obs)
        })
        var datas=root.querySelectorAll('.col.search_released.responsive_secondrow') //- PEGA AS DATAS DE LANÇAMENTO DOS JOGOS PESQUISADOS
        var data=parser(datas)
        datas.forEach(function(data){
            var obs={
                "Data":data.innerText
            }
            datas_jogos.push(obs)
        })
        for(i=0;i<vetor.length;i++){
            vetor[i].Data_Lancamento=datas_jogos[i];
        }
        console.log(vetor)
        if(vetor==""){
            vetor=['Nenhum jogo foi encontrado com esse termo!']
        }
        res.send(vetor)
       

    })
      
})


app.get('/api', function(req, res){   //- ROTA QUE FAZ REQUISIÇÃO EM DUAS APIs
    // query string
    var query = req.query.pokemon
    var vetor = []
    var pokemon1 = []
    console.log(query)
    if(query==undefined){  //-CASO NO TENHA QUERY STRING, FAZ UMA REQUISIÇÃO EM DUAS API E RETORNA O NOME DE UMA API E O HP DO POKEMON DE OUTRA API, ONDE TRAZ OS 3 PRIMEIROS POKÉMONS DA PRIMEIRA API
        var url = "https://pokeapi.co/api/v2/pokemon/?limit=3"
        var requisicao = axios.get(url)
        requisicao.then(function(resposta){

            for(i=0;i<3;i++){
                pokemon1[i]=resposta.data.results[i].name
            }
        })
        var url1 ="https://api.pokemontcg.io/v2/cards" //- SEGUNDA API PRA PEGAR O HP DO POKÉMON
        var req=axios.get(url1)
        req.then(function(resposta1){
            for(i=0;i<3;i++){
                for(j=0;j<250;j++){
                    if(pokemon1[i].toUpperCase()==resposta1.data.data[j].name.toUpperCase()){
                        var obs={
                            "Name": pokemon1[i],
                            "HP": resposta1.data.data[j].hp
                        }
                        console.log(obs)
                        vetor.push(obs)
                        break;
                    }
                }
            }
            res.send(vetor)
        })
    }else{
        var url = "https://pokeapi.co/api/v2/pokemon/"+query  //- FAZ A REQUISIÇÃO DO NOME DO POKÉMON QUE FOI PASSADO PELA QUERY STRING
        var requisicao = axios.get(url)
        requisicao.then(function(resposta){
            
            pokemon1.push(resposta.data.species.name)
        })
        
        var url1 ="https://api.pokemontcg.io/v2/cards" // FAZ A REQUISIÇÃO E TRAZ O HP DO POKÉMON QUE FOI PASSADO POR QUERY STRING
        var req=axios.get(url1)
        req.then(function(resposta1){
                for(j=0;j<250;j++){
                    if(pokemon1[0].toUpperCase()==resposta1.data.data[j].name.toUpperCase()){
                        var obs={
                            "Name": pokemon1[0],
                            "HP": resposta1.data.data[j].hp
                        }
                        console.log(obs)
                        vetor.push(obs)
                        break;
                    }
                }
        if(vetor[0]==[]){ //- RETORNA UM ERRO 404 CASO A QUERY STRING NÃO FOI ENCONTRADA
            vetor[0]="Error 404, query não encontrada!"
            res.send(vetor)
        }else{
        res.send(vetor)
        }
        
        })
        
    }
    
})

app.get('/ageofempeires2',function(req, res){  //- ROTA DO AGE OF EMPIRES 2
    var vetor=[]
    var url="https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition/" //- FAZ REQUISIÇÃO NO SITE DA STEAM
    var requisicao = axios.get(url)
    requisicao.then(function(resposta){
        var root=parser(resposta.data)
        var jogo=root.querySelectorAll('.apphub_AppName') //- PEGA O NOME E A EDIÇÃO DO JOGO
        var nome_jogo=parser(jogo)
        var obs={
            "Nome": nome_jogo.innerText
        }
        vetor.push(obs) //- INSERE NO VETOR O NOME DO JOGO
    })
    
    var url="https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations" //- FAZ REQUISIÇÃO EM UMA API PRA PEGAR AS CIVILIZAÇÕES DO AGE OF EMPIRES 2
    var req = axios.get(url)
    req.then(function(resposta){
        var civilizations=resposta.data.civilizations;
        for(i=0;i<civilizations.length;i++){
            var obs={
                "Civilizações":civilizations[i].name
            }
            vetor.push(obs)
        }
        res.send(vetor)
    })
    

})

app.get('*', function(req, res){ //- QUALQUER ROTA QUE DIFERENTE DAS IMPLEMENTADAS SERÃO REDIRECIONADAS PARA O MEU PERFIL DA STEAM
    res.redirect('https://steamcommunity.com/profiles/76561198310703375/')
})

app.listen(PORT, function(){
    console.log("Servidor iniciado")
})
