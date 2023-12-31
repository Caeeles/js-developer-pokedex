const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        // Adiciona um ouvinte de evento de clique a cada item da lista
        const items = document.querySelectorAll('.pokemon');
        items.forEach((item, index) => {
            const pokemonName = pokemons[index].name.toLowerCase(); // Obtém o nome do Pokémon
            item.addEventListener('click', () => {
                // Navegar para a página do Pokémon com base no nome
                const pokemonDetailsURL = `/pokemon-pages/${pokemonName}.html`;

                // Verifica se a página específica existe
                fetch(pokemonDetailsURL)
                    .then(response => {
                        if (response.status === 200) {
                            // Se a página existe, navega para ela
                            window.location.href = pokemonDetailsURL;
                        } else {
                            // Se a página não existe, navega para a página genérica
                            window.location.href = '/pokemon-pages/em-construção.html';
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao verificar a existência da página:', error);
                    });
            });
        });
    });
}




loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})