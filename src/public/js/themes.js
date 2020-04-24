document.addEventListener('DOMContentLoaded', main);

function main(){

    //Load themes
    document.getElementsByClassName('topic-list')[0].addEventListener("click", event => {
        event.preventDefault();
        getThisTheme(event.target.textContent);
      });
    // document.querySelector('.theme').addEventListener('click', function(evt){
    //     evt.preventDefault();
    //     loadTopics()
    // })
    
    //Aadd new theme
    document.querySelector('.new-topic').addEventListener('click', function(evt){
        evt.preventDefault();
        addNewTheme()
    })
}

function loadTopics(){
    themes = document.currentScript.themes
}
function getThisTheme(theme){
    // let el = document.getElementsByClassName('page-content')[0];
    // let parent = el.parentNode;
    
    // xml = new XMLHttpRequest();
    // xml.open('GET', '/theme-content')
    // xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    // xml.send(`theme=${theme}`)

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/theme-content?theme=${theme}`, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.addEventListener('load', function() {
        window.location = `/theme/?theme=${theme}`; 
        console.log("here");
        });
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {

    //         // Response
    //         window.location = `/theme/?theme=${theme}`; 

    //     }
    // };
    xhttp.send();
}
function addNewTheme(){
    console.log("clicked");
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
                <input id="themeAdded" type="text" name="theme" required >
                <button class="add" type="submit">Add</button>
            </div>
        </form>
    </div>`;
    parent.appendChild(form);
    document.querySelector('.add').addEventListener('click', function(evt){
        evt.preventDefault();
        newTheme = document.getElementById('themeAdded').value
        
        console.log(newTheme)
        if(newTheme.length==0){
            //Have User type theme Again
        }
        //Validate input
        rmv = document.querySelector('.signin')
        place = document.querySelector('.add-topic')
        place.removeChild(rmv)

        ask = document.createElement('div')
        ask.className = "adding";
        ask.innerHTML = `
            <h2 class="res">Your theme: ${newTheme}, has been added to the site.<br>Want to Add some Content?<br></h2>
            <button class="add2" id="someContent" type="submit">Yes Please</button>
            <button class="add2" id="noMore" type="submit">No, I'll let others do it</button>
        `
        place.appendChild(ask)

        const xhr = new XMLHttpRequest();

        // place.append(ask)
        xhr.open('POST', '/themes/add');
        //The content type of our request header
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        
        // xhr.addEventListener('load', function() {
        //     ask.innerHTML = `
        //         <h2 class="res">Your theme: ${newTheme}, has been added to the site.<br>Want to Add some Content?<br></h2>
        //         <button class="add2" id="someContent" type="submit">Yes Please</button>
        //         <button class="add2" id="noMore" type="submit">No, I'll let others do it</button>
        //     `;
        //     });
        xhr.send(`name=${newTheme}`);

        //If the user wishes to add content to the topic
        document.getElementById('someContent').addEventListener('click', function(evt){
            evt.preventDefault();

            place.removeChild(ask);
            entry = document.createElement('form');
            editTitle = document.getElementById('subj')
            subj.textContent = `Add Content to ${newTheme}`

            entry.innerHTML = `
                <form class="signin" action="/themes/add" method="POST">
                    <div class="entry" id=0>
                        <div class="addBtn"></div>
                        <div class="addContent">
                            <p class="form" >Podcast Embed Url:</p>
                            <textarea id="addedContent" type="text" name="url" cols="20" rows="4" theme=${newTheme}></textarea>
                        </div>
                        <div class="addBtn">
                                <img src="/images/plus.png" class="addBtn">
                        </div>
                    </div>
                    <button class="add" type="submit" id="fin">Finish</button>

                </form>
            `;
            place.appendChild(entry)
            fin = document.createElement('div')
            fin.innerHTML = `
                <button class="add" type="submit" id="fin">Finish</button>
            `;
            //place.appendChild(fin);

            //Add Event listeners for Add and subtract

            document.getElementById('fin').addEventListener('click', function(evt){
                evt.preventDefault();

                //Send the link to the back
                const xml = new XMLHttpRequest();
                links = document.getElementById('addedContent').value

                // place.append(ask)
                xml.open('POST', '/themes/addThemeContent');
                //The content type of our request header
                xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                
                xml.addEventListener('load', function() {
                    console.log("here");
                    });
                xml.send(`name=${newTheme}&content=${links}`);

                parent.removeChild(form)
                parent.appendChild(content);
                //Reload Added content
            })
        })
        document.getElementById('noMore').addEventListener('click', function(evt){

            parent.removeChild(form)
            parent.appendChild(content);
            //Reload Added content
            //TODO
        })
    })
}