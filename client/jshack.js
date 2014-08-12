Meteor.subscribe('commands');



Template.sidebar.helpers({
    commands: function() {
        return Commands.find();
    }
});

Template.textBox.events({
	'submit form': function (e){
		e.preventDefault();
		var box = $("#command-box");
		var command = {
			text: box.val()
		};
		box.val("");
		Commands.insert(command);
	}
});

