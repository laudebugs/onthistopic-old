document.addEventListener('DOMContentLoaded', main);

function main(){

    logged = document.currentScript.getAttribute('lin')
    opt= document.getElementById('signedin');
    opt2 = document.getElementById('register');

    if(logged===true){
        console.log("here")
        opt.innerHTML = `
        <a id="signedin" href="/myaccount" class="side"><p class="account">my account</p></a>
        `;
        opt2.innerHTML = `
            <a href="/logout" class="side"><p class="account">logout</p></a>
        `;
    }
    else{
        opt.innerHTML=`
        <a  href="/login" class="side"><p class="account">login</p></a>

        `;
        opt2.innerHTML =`
            <a href="/register" class="side"><p class="account">register</p></a>
        `;
    }

    
}
