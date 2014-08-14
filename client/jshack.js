Meteor.subscribe('commands');
Meteor.subscribe('mazes');
Meteor.subscribe('heroes');

Template.sidebar.helpers({
    commands: function() {
        return Commands.find();
    }
});

Template.textBox.events({
	'submit form': function (e){
		e.preventDefault();
		var box = $("#command-box");
        Meteor.call('newCommand', box.val(), 1, function(err, res){
            console.log(res);
        });
		box.val("");
	}
});

