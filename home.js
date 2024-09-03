function myMenuFunction(){
    const menubtn = document.getElementById("mynavmenu");

    if(menubtn.className === "nav-menu"){
        menubtn.className += "responsive";
    }
    else{
        menubtn.className = "nav-menu";
    }
}