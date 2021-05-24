Projeto Intermediario da disciplina de PPW II

Aplicação rodando no site : https://projetointermediarioppw2.herokuapp.com

Foram implementados três rotas além da rota raiz neste Projeto

A rota raiz da informações de como prosseguir diante das outras rotas.

A primeira rota implementada foi a '/steam' na qual funciona intercalado com o sistema de busca de jogos na steam, ao passar uma query string onde rota faz uma requisição no site da steam e traz os jogos como o nome e juntamente traz o ano de lançamento dos jogos que foram buscados pela própria busca da steam, esse retorno dos dados é feito por web scraping na qual retorna dados em html para que possa ser feita a captura dos dados, formando um objeto com o nome e a data de lançamento, com limite máximo de até 50 jogos que o algoritmo de busca da steam retorna.

site da requisição : https://store.steampowered.com/search/?term


A segunda rota é '/api'na qual a rota retorna de duas APIs o nome do primeiro pokémon da pokedex e suas evoluções juntamente com o HP de do pokemon e das evoluções, porém pode ser usado uma query string pra pesquisar um pokémon específico, na qual retorna só o pokémon e seu HP, formando um objeto com o nome e o HP.

API do nome do pokémon : https://pokeapi.co/api/v2/pokemon/?limit=3

API do HP do pokémon : https://api.pokemontcg.io/v2/cards

A terceira rota é '/ageofempeires2' na qual é feito uma requisição no site da steam para retornar o nome do jogo e a edição dele através de uma web scraping, após isso é feito uma requisição em uma API de age of empires 2 para pegar as civilizações e isso tudo é colocado em um vetor em forma de objeto e é retornado a página html. obs: está rota possui a maneira de filtrar através de query string.

site : steam:https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition/

site api : https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations

Além disso qualquer outra rota que não foi implementada, o usuário será redirecionado pro meu perfil na steam!

Neste projeto foram usandas as bibliotecas : Node, Express, Axios e node-html-parser
