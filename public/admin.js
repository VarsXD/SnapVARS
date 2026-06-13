if(localStorage.getItem("admin")!=="true"){

window.location="login.html";

}

const users=JSON.parse(localStorage.getItem("users"))||[];

const history=JSON.parse(localStorage.getItem("loginHistory"))||[];

document.getElementById("totalUsers").innerText=users.length;

document.getElementById("totalLogins").innerText=history.length;

const table=document.getElementById("userTable");

users.forEach((user,index)=>{

table.innerHTML+=`

<tr>

<td>${user.name}</td>

<td>${user.email}</td>

<td>${user.joined}</td>

<td>

<button onclick="deleteUser(${index})">

Delete

</button>

</td>

</tr>

`;

});

const login=document.getElementById("loginTable");

history.forEach(item=>{

login.innerHTML+=`

<tr>

<td>${item.name}</td>

<td>${item.email}</td>

<td>${item.loginTime}</td>

</tr>

`;

});

function deleteUser(index){

users.splice(index,1);

localStorage.setItem("users",JSON.stringify(users));

location.reload();

}