console.log('yum, yum, yum');

import { LoginForm } from "./auth/LoginForm.js";
import { RegisterForm } from "./auth/RegisterForm.js";
import { NavBar } from "./nav/NavBar.js";
import { SnackList } from "./snacks/SnackList.js";
import { SnackDetails } from "./snacks/SnackDetails.js";
import { Footer } from "./nav/Footer.js";
import {
	logoutUser, setLoggedInUser, loginUser, registerUser, getLoggedInUser,
	getSnacks, getSingleSnack, getToppings
} from "./data/apiManager.js";



const applicationElement = document.querySelector("#ldsnacks");

//login/register listeners
applicationElement.addEventListener("click", event => {
	event.preventDefault();
	if (event.target.id === "login__submit") {
		//collect all the details into an object
		const userObject = {
			name: document.querySelector("input[name='name']").value,
			email: document.querySelector("input[name='email']").value
		}
		loginUser(userObject)
			.then(dbUserObj => {
				if (dbUserObj) {
					sessionStorage.setItem("user", JSON.stringify(dbUserObj));
					startLDSnacks(dbUserObj.admin);
				} else {
					//got a false value - no user
					const entryElement = document.querySelector(".entryForm");
					entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
				}
			})
	} else if (event.target.id === "register__submit") {
		//collect all the details into an object
		const userObject = {
			name: document.querySelector("input[name='registerName']").value,
			email: document.querySelector("input[name='registerEmail']").value,
			admin: false
		}
		registerUser(userObject)
			.then(dbUserObj => {
				sessionStorage.setItem("user", JSON.stringify(dbUserObj));
				startLDSnacks(dbUserObj.admin);
			})
	}
})

applicationElement.addEventListener("click", event => {
	if (event.target.id === "logout") {
		logoutUser();
		sessionStorage.clear();
		checkForUser();
	}
})
// end login register listeners

// snack listeners
applicationElement.addEventListener("click", event => {
	event.preventDefault();

	if (event.target.id.startsWith("detailscake")) {
		const snackId = event.target.id.split("__")[1];
		getSingleSnack(snackId)
			.then(response => {
				showDetails(response);
			})
	}
})

document.getElementById("nav_div").addEventListener("change", event => {
	event.preventDefault();
	if (event.target.id === "select_topping") {
		var e = document.getElementById("select_topping");
		var toppingId = e.options[e.selectedIndex].value;
		showSnackList(toppingId);
	}
})

applicationElement.addEventListener("click", event => {
	event.preventDefault();
	if (event.target.id === "allSnacks") {
		showSnackList();
	}
})

const showDetails = (snackObj) => {
	const listElement = document.querySelector("#mainContent");
	listElement.innerHTML = SnackDetails(snackObj);
}
//end snack listeners

const checkForUser = () => {
	if (sessionStorage.getItem("user")) {
		let userObj = JSON.parse(sessionStorage.getItem("user"));
		loginUser(userObj)
		.then(dbUserObj => {
			if (dbUserObj) {
				sessionStorage.setItem("user", JSON.stringify(dbUserObj));
				startLDSnacks(dbUserObj.admin);
			} else {
				//got a false value - no user
				const entryElement = document.querySelector(".entryForm");
				entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
			}
		})
	} else {
		applicationElement.innerHTML = "";
		//show login/register
		showNavBar()
		showLoginRegister();
	}
}

const showLoginRegister = () => {
	//template strings can be used here too
	applicationElement.innerHTML += `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
}

const showNavBar = (isAdmin) => {
	getToppings() //get array of toppings
	.then(toppings =>{
		document.querySelector("#nav_div").innerHTML = NavBar(isAdmin,toppings);
		var select = document.getElementById("select_topping");
		var opt = new Option('Select a topping', 0);
		select.options[select.options.length] = opt;
		for(let index in toppings) {
		let newIndex = Number(index) + 1	
		select.options[select.options.length] = new Option(toppings[index], newIndex);

	}
	})
}

const showSnackList = (toppingId) => {
	if (toppingId) {
		getSnacks(toppingId).then(allSnacks => {
			const listElement = document.querySelector("#mainContent")
			listElement.innerHTML = SnackList(allSnacks);
		})
	} else {
		getSnacks().then(allSnacks => {
			const listElement = document.querySelector("#mainContent")
			listElement.innerHTML = SnackList(allSnacks);
		})
	}

}

const showFooter = () => {
	applicationElement.innerHTML += Footer();
}

const startLDSnacks = (isAdmin) => {
	applicationElement.innerHTML = "";
	showNavBar(isAdmin);
	applicationElement.innerHTML += `<div id="mainContent"></div>`;
	showSnackList();
	showFooter();

}

checkForUser();