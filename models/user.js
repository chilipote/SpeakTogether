module.exports = function(mongoose) {
	
	var UserSchema = mongoose.Schema({
	 	  name: String
	});
	
	return mongoose.model('User', UserSchema);
}