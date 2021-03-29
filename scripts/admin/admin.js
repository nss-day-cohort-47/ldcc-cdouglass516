
export const adminMenu = (isAdmin) => {
	//only show Admin menu if user is admin
const AdminMenu =`<button class="btn btn-outline-primary" id="btn_addType" type="button">Add A Type</button>` 
	return  (isAdmin) ?`

<div class="adminMenu">
    <a href="#" alt="Add/Edit Type" class="link-button">Add or Edit Type</a>
    <a href="#" alt="Add/Edit Topping" class="link-button">Add or Edit Topping</a>
    <a href="#" alt="Add/Edit Snack" class="link-button">Add or Edit  Snack</a>
</div>
	`:``
}