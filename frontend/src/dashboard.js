let dashboard = document.querySelector("#dashboard");
let addFood = document.querySelector("#addFood");
let listing = document.querySelector("#listing");
let delivery = document.querySelector("#delivery");
let profile = document.querySelector("#profile");
let edit = document.querySelector("#edit");



let navBtn = document.querySelector("#navBtn")
let profileBtn = document.querySelector("#profileBtn")
let editBtn = document.querySelector("#editBtn");

function addHide(){
    dashboard.classList.add("hidden");
    addFood.classList.add("hidden");
    listing.classList.add("hidden");
    delivery.classList.add("hidden");
    profile.classList.add("hidden");
    edit.classList.add("hidden")
}

navBtn.addEventListener("click",function(e){
    if(e.target.id=="navBtn"){
        return;
    }
    let elId= e.target.id;
    console.log(elId);
    let newElId = elId.replace("Btn","");
    console.log(newElId);
    addHide();
    let elm = document.querySelector(`#${newElId}`);
    elm.classList.remove("hidden")
})

profileBtn.addEventListener("click",function(e){
    addHide();
    profile.classList.remove("hidden")
    
})

editBtn.addEventListener("click",function(e){
    addHide();
    edit.classList.remove("hidden")
    
})



// Add food Form functions
const allData =[];
let divUl = document.querySelector("#divUl")
let donationForm = document.querySelector("#donationForm");
donationForm.addEventListener("submit",function(e){
    e.preventDefault();
    const formData = new FormData(donationForm);
    let data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    allData.push(data);
    let newLi = document.createElement("li")
    newLi.innerText = data.foodType;
    divUl.appendChild(newLi);
    donationForm.reset();
    console.log(allData);
})
let foodSubmitBtnFinal = document.querySelector("#foodSubmitBtnFinal");
foodSubmitBtnFinal.addEventListener("click",(e)=>{
    e.preventDefault();
    axios.post("http://localhost:5000/donor/listfood", allData)
    .then(res => {
        console.log("Data sent successfully:", res.data);
        })
    .catch(err => {
        console.error("Error sending data:", err);
    });
    
})



