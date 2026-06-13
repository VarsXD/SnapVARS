document.getElementById("adminForm").addEventListener("submit", function(e){

e.preventDefault();

const username=document.getElementById("username").value;

const password=document.getElementById("password").value;

if(username==="admin" && password==="admin123"){

localStorage.setItem("admin","true");

window.location="dashboard.html";

}

else{

alert("Wrong Credentials");

}

});