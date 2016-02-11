
var CommentBox = React.createClass({displayName: 'CommentBox',
  render: function() {
    return (
      React.createElement('div', {className: "commentBox"},
        "CommentBoxx."
      )
      
    );
  }
});
React.render(
  React.createElement(CommentBox, null),
  document.getElementById('blah')
);