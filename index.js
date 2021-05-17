const express = require('express')
const axios = require('axios').default
const parser = require('node-html-parser').parse
const app = express()
const PORT = process.env.PORT || 8080

app.get('/steam', function(req, res){
    var query = req.query.term
    if(query==undefined){
        vetor='Error 404, query sem valor!'
        res.send(vetor)
        return
    }
    var vetor=[]
    var jogos = []
    var datas_jogos=[]

    var url = "https://store.steampowered.com/search/?term="+query
    var requisicao = axios.get(url)
    requisicao.then(function(resposta){
        var root = parser(resposta.data)
        var pesquisa=root.querySelectorAll('.col.search_name.ellipsis')
        var nome=parser(pesquisa)
        var jogo_lista=nome.querySelectorAll('.title')
        jogo_lista.forEach(function(jogos_lista){
            var obs={
                "Nome:": jogos_lista.innerHTML,
                "Data_Lancamento":[]
                
            }
            //console.log(obs)
            vetor.push(obs)
        })
        var datas=root.querySelectorAll('.col.search_released.responsive_secondrow')
        var data=parser(datas)
        //console.log(data.innerText)
        datas.forEach(function(data){
            var obs={
                "Data":data.innerText
            }
            datas_jogos.push(obs)
        })
        for(i=0;i<vetor.length;i++){
            vetor[i].Data_Lancamento=datas_jogos[i];
        }
        res.send(vetor)
       

    })
      
})


app.get('/api', function(req, res){
    // query string
    var query = req.query.pokemon
    var vetor = []
    var pokemon1 = []
    console.log(query)
    if(query==undefined){
        var url = "https://pokeapi.co/api/v2/pokemon/?limit=3"
        var requisicao = axios.get(url)
        requisicao.then(function(resposta){

            for(i=0;i<3;i++){
                pokemon1[i]=resposta.data.results[i].name
            }
        })
        var url1 ="https://api.pokemontcg.io/v2/cards"
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
        var url = "https://pokeapi.co/api/v2/pokemon/"+query
        var requisicao = axios.get(url)
        requisicao.then(function(resposta){
            
            pokemon1.push(resposta.data.species.name)
        })
        
        var url1 ="https://api.pokemontcg.io/v2/cards"
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
        if(vetor[0]=[]){
            vetor[0]="Error 404, query não encontrada!"
            res.send(vetor)
        }else{
        res.send(vetor)
        }
        
        })
        
    }
    
})

app.get('/ageofempeires2',function(req, res){
    var vetor=[]
    var url="https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition/"
    var requisicao = axios.get(url)
    requisicao.then(function(resposta){
        var root=parser(resposta.data)
        var jogo=root.querySelectorAll('.apphub_AppName')
        var nome_jogo=parser(jogo)
        vetor[0]="Nome: "+ nome_jogo.innerText
        //console.log(nome_jogo.innerText)
    })
    var url="https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations"
    var req = axios.get(url)
    req.then(function(resposta){
        var civilizations=resposta.data.civilizations;
        for(i=0;i<civilizations.length;i++){
            vetor.push("Civilização:"+civilizations[i].name)
        }
        res.send(vetor)
        /*civilizations.forEach(function(){
            console.log(resposta.data.civilizations)
            //vetor.push(resposta.data.civilizations.name)
        })
        //console.log(resposta.data.civilizations[0])*/
    })
    

})

/*app.get('*', function(req, res){
    res.redirect('http://professor.venson.net.br')
})*/

app.listen(PORT, function(){
    console.log("Servidor iniciado")
})
