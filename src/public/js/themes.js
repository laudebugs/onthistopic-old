
document.addEventListener('DOMContentLoaded', main);

function main(){

    // document.getElementsByClassName('topic-list')[0].addEventListener("click", event => {
    //     event.preventDefault();
    //     console.log('here')
    //     getThisTheme(event.target.textContent);
    //   });
    //Aadd new theme
    document.querySelector('.new-topic').addEventListener('click', function(evt){
        evt.preventDefault();
        addNewTheme()
    })
    
}

function loadTopics(){
    themes = document.currentScript.themes
}
async function getThisTheme(theme){

    //Change the title of the page
    page = document.querySelector('h1')
    page.textContent = theme;

    const response = await fetch(`/theme-content/?theme=${theme}`)

    const pods = await response.json();
    content = document.querySelector('.page-content');
    parent = content.parentNode
    parent.removeChild(content)

    resources = document.createElement('div');
    resources.className = "resources";
    for(let i=0; i<pods.podcasts.length; i++){
        ifr = document.createElement('iframe')
        ifr.className = "ifr"
        ifr.src =pods.podcasts[i];
        resources.appendChild(ifr);
    }

    podContent = document.createElement('div')
    podContent.className = "podContent"
    podContent.appendChild(resources)
    add = document.createElement('div')
    
    add.innerHTML =`
    <form style="width:70%;" class="signin" action="/themes/add" method="POST">
        <div class="entry" id=0>
            <div class="addBtn"></div>
            <div class="addContent">
                <p class="form" >Podcast Embed Url:</p>
                <textarea id="addedPod" type="text" name="url" cols="100" rows="2" theme=${theme}></textarea>
            </div>
            <div class="addBtn">
                    <img src="/images/plus.png" class="addBtn">
            </div>
        </div>
        <button class="add" type="submit" id="fin">Add Podcasts</button>
    </form>
    `;  
    podContent.append(add);
    parent.appendChild(podContent);
    
    document.getElementById('fin').addEventListener('click', function(add){
        add.preventDefault()
        newPods = []
        newPods.push(document.getElementById('addedPod').value)

        addThemePods(theme, newPods)
        
    });
    
}
function addThemePods( podName, pods){
    addPodcasts('/themes/addThemeContent', {themeName:podName, newPodcasts:pods});
    console.log(pods)
    async function addPodcasts(url ='', data={}){
        const response = await fetch(url,{
            method:'POST',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json()
    }
}
function addNewTheme(){
    content = document.querySelector('.topic-content');
    parent = document.querySelector('.page-content')
    parent.removeChild(content)
    form = document.createElement('div')
    form.className = "new-theme"
    form.innerHTML = `
    <div class="add-topic">
        <h2 class="page-title" id="subj">Add Theme</h2>
        <form class="signin" action="/themes" method="POST">
            <div class="frm">
                <input id="themeAdded" type="text" name="theme" required>
                <button class="add" type="submit">Add</button>
            </div>
        </form>
    </div>`;
    parent.appendChild(form);
    
    
}