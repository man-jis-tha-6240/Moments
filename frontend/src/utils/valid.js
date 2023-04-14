export const valid = ({ yourName, userName, email, password, cf_password }) => {
	const error = {}
	if (yourName.length > 25 || yourName.length < 5) {
		error.yourName = 'Name must be between 5 to 25 characters long'
	}
	if (userName.replace(/ /g, '').length > 25 || userName.replace(/ /g, '').length < 2) {
		error.userName = 'Name must be between 2 to 25 characters long'
	}
	if(!validateEmail(email)){
		error.email='Please enter a valid email address'
	}
	if(!validatePassword(password)){
		error.password='Password must be 8 characters long with an uppercase letter, a lowercase letter, a number and a special character'
	}
	if (password!==cf_password){
		error.cf_password='Passwords do not match'
	}
	return {
        errorMsg: error,
        errorLength: Object.keys(error).length
    }
}
function validateEmail(email) {
    const re = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return re.test(email);
}
function validatePassword(password) {
	const reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return reg.test(password);
}
