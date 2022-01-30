let container = document.getElementById("container");
const generation = document.getElementById("generation");
const type = document.getElementsByName("type")[0];
const popText = document.getElementsByClassName("pop-text")[0];
let popUpTextOpened = false;

let anime_container = document.getElementById("animelist")

let gens = [20159,527,1564,1565,14123,19291,34034,40351];

let gen1 = 20159;
let gen2 = 527;
let gen3 = 1564;
let gen4 = 1565;
let gen5 = 14123;
let gen6 = 19291;
let gen7 = 34034;
let gen8 = 40351;

let typeColors = {
    fire: '#ff9100',
    water: '#a3f4ff',
    grass: '#a3ffcb',
    electric: '#fff875',
    ground: '#f4e7da',
    rock: '#8a8a8a',
    fairy: '#f7ccff',
    poison: '#722f9c',
    bug: '#3ec745',
    dragon: '#1d4ea8',
    psychic: '#e3397a',
    flying: '#e1f5fc',
    fighting: 'red',
    normal: '#f5f5f5'
}

type.addEventListener("change", () => {
    if (generation.value != "")
    {
        console.log("type changed");
        container.innerHTML = "";
        fetchGen(genPokemon[parseInt(generation.value - 1)], genPokemon[parseInt(generation.value)]);
    }
});


let genPokemon = [0, 151, 251, 386, 493, 649, 721, 809, 898];
generation.addEventListener("change", () => {
    container.innerHTML = "";
    anime_container.innerHTML = "";
    fetch('https://api.jikan.moe/v4/anime/' + gens[generation.value - 1])
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            let poketitle = data.data.title;
            // console.log(data.data.title)
            let pokeimage = data.data.images.jpg.image_url;
            // console.log(data.data.images.jpg.image_url)
            let pokesynopsis = data.data.synopsis;
            anime_container.innerHTML += 
            `<div class="animecard">
                <h2>${poketitle}</h2>
                <img src="${pokeimage}">
                <p>${pokesynopsis}</p>
            </div>`

})
    fetchGen(genPokemon[parseInt(generation.value - 1)], genPokemon[parseInt(generation.value)]);
});

function generatePokecard(name, sprite, type)
{
    container.innerHTML += `<div class="pokecard" style="background-color:${typeColors[type]}" onclick="playSound(this);"><p>${name}</p><img src="${sprite}" height="100" width="100"></div>`;
}
function fetchGen(start, limit)
{
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit - start}&offset=${start}`).then((res) => res.json()).then(d => {
        console.log(d);
        d.results.forEach(pokemon => {
            let name = pokemon.name;
            fetch(pokemon.url).then((response) => response.json()).then(data => {
                let sprite = data.sprites.front_default;
                if (type.value != "")
                {
                    containsType = false;
                    data.types.forEach(pokeType => {
                        if (pokeType.type.name == type.value)
                        {
                            containsType = true;
                        }
                    });
                    if (containsType == false)
                    {
                        return;
                    }
                }
                let pokeType = data.types[0].type.name;
                generatePokecard(name, sprite, pokeType);
            });
        });
    });
}

function playSound(pokeData)
{
    let pokemonName = pokeData.children[0].textContent;
    let pokemonSprite = pokeData.children[1].src;
    let pokemonColor = pokeData.style.backgroundColor;
    console.log(pokemonSprite);
    let pokeSound = new Audio(`https://play.pokemonshowdown.com/audio/cries/${pokemonName}.mp3`);
    pokeSound.play();
    if (popUpTextOpened == false)
    {
        popText.style.visibility = "visible";
        popText.style.height = "300px";
        popUpTextOpened = true;
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`).then((res) => res.json()).then(d => {
            let pokemonDesc = d.flavor_text_entries[0].flavor_text;
            popText.style.backgroundColor = pokemonColor;
            popText.children[1].innerHTML += `<div class="left"><img src="${pokemonSprite}" width="150" height="150"><h4>${pokemonName}</h4></div><div class="right"><p>${pokemonDesc}</p></div>`;
        });
    }
    
}

function closePopText()
{
    if(popUpTextOpened == true)
    {
        popText.style.visibility = "hidden";
        popText.style.height = "0px";
        popUpTextOpened = false;
        popText.children[1].innerHTML = "";
    }
}

