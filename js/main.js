const filter = document.getElementById('filter');
const search = document.getElementById('search');

const xhr = new XMLHttpRequest();
const url = "https://restcountries.eu/rest/v2/";
let urlAll = url + `all/?fields=name;population;region;flag;capital;alpha3Code`;

xhr.responseType = 'json';

getResponse(urlAll, renderResponse);

const back = () => {
    document.getElementById('search-header').style.display ='flex';
    document.getElementById('conutry-grid').style.display = 'grid';
    document.getElementById('country-detail').style.display = 'none';

}

filter.onchange = () => {
    
    if(filter.value === 'all'){
        urlAll = url + `all/?fields=name;population;region;flag;capital;alpha3Code`;
    }else{
        urlAll = url + `region/${filter.value}?fields=name;population;region;flag;capital;alpha3Code`;
    }

    getResponse(urlAll, renderResponse);
}

search.oninput = () => {
    if(!search.value.includes(' ') && search.value.length > 1){
        
        urlAll = url + `name/${search.value}?fields=name;population;region;flag;capital;alpha3Code`;
        getResponse(urlAll, renderResponse);
    }else if(search.value.length === 0){
        
        urlAll = url + `all/?fields=name;population;region;flag;capital;alpha3Code`;
        getResponse(urlAll, renderResponse);
    }
    
}

function getResponse(uurl, reponseFun){

    xhr.onreadystatechange = () => {
     if(xhr.readyState === XMLHttpRequest.DONE){
         clearRespons();
         reponseFun(xhr.response);
         const cards = document.getElementsByClassName('card');
         fetchElements(cards);

     }else{
         document.getElementById('conutry-grid').innerHTML = "<span class='load-text'>Loading...</span>"
     }
    }
 
    xhr.open('GET', uurl);
    xhr.send();
}

function fetchElements(elements){

    for(let i = 0; i < elements.length; i++){
        elements[i].onclick = () => {
            document.getElementById('search-header').style.display ='none';
            document.getElementById('conutry-grid').style.display = 'none';
            document.getElementById('country-detail').style.display = 'block'
            const singleURL = url + `alpha/${elements[i].id}`;
           
            renderDetailResponse(singleURL);
        }
    }
}

// function getName(){
    
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === XMLHttpRequest.DONE){
//             let countName = xhr.response;
//             console.log(countName);
//         }
//     }

//     xhr.open('GET', `${url}all?fields=name`);
//     xhr.send();

// }



function renderDetailResponse(res){
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            while(document.getElementById('country-cont').firstChild){
                document.getElementById('country-cont').removeChild(document.getElementById('country-cont').firstChild);
            }
            const detailsRespons = xhr.response;
            const borderContries = [];
            for(let i = 0; i < detailsRespons.borders.length;i++){
                if(i === 3){
                    break
                }

                borderContries.push(`<a href="#" id="${detailsRespons.borders[i]}" class="bc">${detailsRespons.borders[i]}</a>`);
 
                

            }
            
            const levelDomains = [];
            for(let i = 0; i < detailsRespons.topLevelDomain.length;i++){
                levelDomains.push(detailsRespons.topLevelDomain[i]);
            }

            const allCurrencies = [];
            for(let i = 0; i < detailsRespons.currencies.length;i++){
                allCurrencies.push(detailsRespons.currencies[i].name);
            }

            const allLanguages = [];
            for(let i = 0; i < detailsRespons.languages.length;i++){
                allLanguages.push(detailsRespons.languages[i].name);
            }

            let borderDiv = '';
            
            if(!!borderContries.length){
                borderDiv = `<div class="border-cont"><span>Border Countries: </span>${borderContries.join('')}</div>`
            }

            
            document.getElementById('country-cont').innerHTML += `
            <article class="country">
                        <figure>
                            <img src="${detailsRespons.flag}" alt="">
                        </figure>
                        <div class="country-content-wrapper">
                            <h2>${detailsRespons.name}</h2>
                            <div class="country-content">
                                <dl>
                                    <span><dt>Native Name</dt><dd>${detailsRespons.nativeName}</dd></span>
                                    <span><dt>Population</dt><dd>${detailsRespons.population}</dd></span>
                                    <span><dt>Region</dt><dd>${detailsRespons.region}</dd></span>
                                    <span><dt>Sub Region</dt><dd>${detailsRespons.subRegion}</dd></span>
                                    <span><dt>Capital</dt><dd>${detailsRespons.capital}</dd></span>
                                </dl>
                                <dl>
                                    <span><dt>Top Level Domain</dt><dd>${levelDomains.join(', ')}</dd></span>
                                    <span><dt>Currencies</dt><dd>${allCurrencies.join(', ')}</dd></span>
                                    <span><dt>Languages</dt><dd>${allLanguages.join(', ')}</dd></span>
                                </dl>
                            </div>
                            
                            ${borderDiv}

                        </div>
                    </article>`;
                
                const bcS = document.getElementsByClassName('bc');
                fetchElements(bcS);
                

        }else{
            document.getElementById('country-cont').innerHTML = "<span class='load-text'>Loading...</span>"
        }
    }

    xhr.open('GET', res);
    xhr.send();
    
    
}


function renderResponse(res){
    if(!res.length){
        document.getElementById('conutry-grid').innerText = "No results found"
    }else{
        for(let i = 0 ; i < xhr.response.length; i++){
            document.getElementById('conutry-grid').innerHTML += `<article class="card" id="${res[i].alpha3Code}">
            <figure>
                <img src="${res[i].flag}" alt="Country-name-flag">
            </figure>
            <h2>${res[i].name}</h2>
            <dl>
                <dt>Population</dt><dd>${res[i].population}</dd>
                <dt>Region</dt><dd>${res[i].region}</dd>
                <dt>Capital</dt><dd>${res[i].capital}</dd>
            </dl>
        </article>`;
        }
    }
    
}

function clearRespons(){
    while(document.getElementById('conutry-grid').firstChild){
        document.getElementById('conutry-grid').removeChild(document.getElementById('conutry-grid').firstChild);
    }
}

function themeToggle(){
    const root = document.querySelector('body');
    if(root.classList.contains('dark')){
        root.style.setProperty('--background', 'hsl(207, 26%, 17%)');
        root.style.setProperty('--elements', 'hsl(209, 23%, 22%)');
        root.style.setProperty('--text', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--shadow', 'rgba(14, 13, 13,.3)');  
        root.className = 'light';
        document.getElementById('theme-icon').className = 'material-icons'
        
    }else{
        root.style.setProperty('--background' , 'hsl(0, 0%, 98%)') ;
        root.style.setProperty('--elements',  'hsl(0, 0%, 100%)');
        root.style.setProperty('--text', 'hsl(200, 15%, 8%)');
        root.style.setProperty('--shadow', 'rgb(221, 218, 218)');            
        root.className = 'dark';
        document.getElementById('theme-icon').className = 'material-icons-outlined'

    }
  
}

themeToggle()


