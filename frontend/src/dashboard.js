let dashboard = document.querySelector("#dashboard");
let addFood = document.querySelector("#addFood");
let listing = document.querySelector("#listing");
let delivery = document.querySelector("#delivery");

let navBtn = document.querySelector("#navBtn")

function addHide(){
    dashboard.classList.add("hidden");
    addFood.classList.add("hidden");
    listing.classList.add("hidden");
    delivery.classList.add("hidden");
}

navBtn.addEventListener("click",function(e){
    let elId= e.target.id;
    // console.log(elId);
    let newElId = elId.replace("Btn","");
    // console.log(newElId);
    addHide();
    let elm = document.querySelector(`#${newElId}`);
    elm.classList.remove("hidden")
})
