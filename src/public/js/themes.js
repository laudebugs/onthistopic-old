document.addEventListener('DOMContentLoaded', main);

function main(){
    document.querySelector('.new-topic').addEventListener('click', function(evt){
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
            place.append(ask)
            document.getElementById('someContent').addEventListener('click', function(evt){
                place.removeChild(ask);
                entry = document.createElement('form');
                editTitle = document.getElementById('subj')
                subj.textContent = "Add Content to Theme"

                entry.innerHTML = `
                    <form class="signin" action="/signin" method="POST">
                        <div class="entry" id=0>
                            <div class="addBtn"></div>
                            <div class="addContent">
                                <p class="form" >Comma-Separated Embed Url:</p>
                                <input id="" type="text" name="theme">
                            </div>
                            <div class="addBtn">
                                    <img src="/images/plus.png" class="addBtn">
                            </div>
                        </div>
                    </form>
                `;
                place.appendChild(entry)
                fin = document.createElement('div')
                fin.innerHTML = `
                    <button class="add" type="submit" id="fin">Finish</button>
                `;
                place.appendChild(fin);

                //Add Event listeners for Add and subtract

                document.getElementById('fin').addEventListener('click', function(evt){
                    parent.removeChild(form)
                    parent.appendChild(content);
                    //Reload Added content
                })
            })
            document.getElementById('noMore').addEventListener('click', function(evt){
                parent.removeChild(form)
                parent.appendChild(content);
                //Reload Added content
            })


        })
    });
}