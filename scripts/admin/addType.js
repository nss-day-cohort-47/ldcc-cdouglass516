export const addType = () => {
    return `
    <form action="submit" class="addType">
	<h2>Add New Type</h2>
    <label for="typeName">Name:</label>
    <input type="text" id="typeName" name="typeName"><br><br>
	<button class="btn btn-outline-primary" id="btn_addNewType" type="button">Add New Type</button>
</form>`;
}