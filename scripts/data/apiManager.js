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


///// snack functions

let snackCollection = [];

export const useSnackCollection = () => {
  //Best practice: we don't want to alter the original state, so
  //make a copy of it and then return it
  //the spread operator makes quick work
  const snackCollectionCopy = [...snackCollection]
  return snackCollectionCopy;
}

export const getSnacks = () => {
	return fetch(`${apiURL}/snacks`)
		.then(response => response.json())
		.then(parsedResponse => {
			snackCollection = parsedResponse
			return parsedResponse;
		})
}

export const getSingleSnack = (snackId) => {
	return fetch(`${apiURL}/snacks/${snackId}`)
	.then(function(response) {
		return response.json();}).then(function(data) {
		snackDetail = data;
		return fetch(`${apiURL}/types/${data.typeId}`); // make a 2nd request and return a promise
	  }).then(function(response) {
		return response.json();
	  }).then(function(data) {
		snackDetail.type = data;
		return fetch(`${apiURL}/seasons/${snackDetail.seasonId}`); // make a 2nd request and return a promise
	  })
	  .then(function(response) {
		return response.json();
	  }).then(function(data) {
		snackDetail.season = data;
		return fetch(`${apiURL}/shapes/${snackDetail.shapeId}`); // make a 2nd request and return a promise
	  }).then(function(response) {
		return response.json();
	  }).then(function(data) {
		snackDetail.shape = data;
		return fetch(`${apiURL}/inFlavors/${snackDetail.inFlavorId}`); // make a 2nd request and return a promise
	}).then(function(response) {
		return response.json();
	  }).then(function(data) {
		snackDetail.inFlavor = data;
		return fetch(`${apiURL}/snackToppings?snackId=${snackDetail.id}`); // make a 2nd request and return a promise
	}).then(function(response) {
		return response.json();
	  })
	  .then(function(data) {
		  let qs = "";
        data.forEach((item,index) =>{
			if(item.snackId == snackDetail.id){
				qs += `id=${item.toppingId}`;
				if(index + 1 !== data.length){
					qs += `&`;
				}
			}
		})
		return fetch(`${apiURL}/toppings?${qs}`); // make a 2nd request and return a promise
	}).then(function(response) {
		return response.json();
	  }).then(function(data) {
		snackDetail.toppings = "";
		data.forEach(item =>{
			snackDetail.toppings += `-${item.name}- `
		})  

		return snackDetail; // make a 2nd request and return a promise
	  })
	  .catch(function(error) {
		console.log('Request failed', error)
	  })

}