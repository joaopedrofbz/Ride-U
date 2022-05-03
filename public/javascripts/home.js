function toggle() {
    var blur = document.getElementById('blur');
    blur.classList.toggle('active')
    var popup1 = document.getElementById('popup1');
    popup1.classList.toggle('active')
}

function alerts() {
    alert("Estás Inscrito no Evento, podes verificar o teu bilhete no menu Bilhetes");
    window.location.href = 'home.html';
}

function pesquisar() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("mySearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myMenu");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
