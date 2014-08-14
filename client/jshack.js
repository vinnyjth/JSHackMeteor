Meteor.subscribe('commands');
Meteor.subscribe('mazes');
Meteor.subscribe('heroes');

Template.sidebar.helpers({
    commands: function() {
        return Commands.find();
    }
});
Template.command.rendered = function(){
    $(this.lastNode).show(500);
    $(".sidebar-content").scrollTop($(".sidebar-content")[0].scrollHeight);
}

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
Template.canvas.events({
    'keydown': function(e) {
        if (e.which == 37) {
            Meteor.call('newCommand', "left", 1 )
        }else if (e.which == 38){
            Meteor.call('newCommand', "up", 1 )
        }else if (e.which == 39){
            Meteor.call('newCommand', "right", 1 )
        }else if (e.which == 40){
            Meteor.call('newCommand', "down", 1 )
        }

    }
});
