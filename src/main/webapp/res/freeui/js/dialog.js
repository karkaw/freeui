/**
 * info
 * warm
 * error
 * 
 * @param id
 * @param type
 */
Dialog = function(id,type){
	
	this.id = id ;

	this.type = type ;

	this.info = function(){
		var div = $('<div class="modal-dialog"/>');
		div.css({width:'300px',height:'300px',position:"absolute"});

	};

	this.setTimeout = function(){

	};
		
};