const apiURL = "http://localhost:8088";

//// user functions
let loggedInUser = {}
let snackDetail = {}

export const getLoggedInUser = () => {
	return { ...loggedInUser };
}

export const logoutUser = () => {
	loggedInUser = {}
}

export const setLoggedInUser = (userObj) => {
	loggedInUser = userObj;
}

export const loginUser = (userObj) => {
	return fetch(`${apiURL}/users?name=${userObj.name}&email=${userObj.email}`)
		.then(response => response.json())
		.then(parsedUser => {
			//is there a user?
			if (parsedUser.length > 0) {
				setLoggedInUser(parsedUser[0]);
				return getLoggedInUser();
			} else {
				//no user
				return false;
			}
		})
}

export const registerUser = (userObj) => {
	return fetch(`${apiURL}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(userObj)
	})
		.then(response => response.json())
		.then(parsedUser => {
			setLoggedInUser(parsedUser);
			return getLoggedInUser();
		})
}
export const addLDType = (type) =>{
	type = capitalize(type.toLowerCase());
	
	let payload = {name: type};
	return fetch(`${apiURL}/types`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	})
		.then(response => response.json())
		.then(parsedType => {
			if(parsedType === payload){
				return "success"
			}else{
				return parsedType;
			}
		});
}

export const getToppings = () =>{
	return fetch(`${apiURL}/toppings`)
		.then(response => response.json())
		.then(toppings => {
			return toppings.map(a => a.name);
		})
}

///// snack functions

let snackCollection = [];

export const useSnackCollection = () => {
  //Best practice: we don't want to alter the original state, so
  //make a copy of it and then return it
  //the spread operator makes quick work
  const snackCollectionCopy = [...snackCollection]
  return snackCollectionCopy;
}

export const getSnacks = (toppingId) => {
	if (toppingId) {
		return fetch(`${apiURL}/snackToppings/?toppingId=${toppingId}&_expand=snack`)
		.then(response => response.json())
		.then(parsedResponse => {
			let snackByTopping = []
			parsedResponse.forEach(item =>{
				snackByTopping.push(item.snack)
			})
			return snackByTopping;
		})
	} else {
		return fetch(`${apiURL}/snacks`)
			.then(response => response.json())
			.then(parsedResponse => {
				snackCollection = parsedResponse
				return parsedResponse;
			})
	}
}

export const getSingleSnack = (snackId) => {
	return fetch(`${apiURL}/snacks/${snackId}?_expand=type&_expand=shape&_expand=season&_expand=inFlavor`)
		.then(function (response) {
			return response.json();
		}).then(function (data) {
			snackDetail = data;
			return fetch(`${apiURL}/snackToppings/?snackId=${snackDetail.id}&_expand=topping`); // make a 2nd request and return a promise
		}).then(function (response) {
			return response.json();
		})
		.then(function (data) {
			let toppings = "";
			data.forEach((item, index) => {
				if (item.snackId == snackDetail.id) {
					toppings += ` ${item.topping.name}`
					if ((index + 1) !== data.length) toppings += ',';
				}
			})
			snackDetail.toppings = toppings;
			return snackDetail; // make a 2nd request and return a promise
		})
		.catch(function (error) {
			console.log('Request failed', error)
		})
}
const capitalize = (s) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
  }