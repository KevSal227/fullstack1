var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// grabs all the trash buttons, the class has to match the one in profile.ejs
var trash = document.getElementsByClassName("trash");
//need to create a new variable for thumbDown 
// we have thumbDown in our profile.ejs
var thumbDown = document.getElementsByClassName("fa-thumbs-down");



// TRASH ARRAY FOR PUNCHES ------------------------------
// this goes through every trash button next to our punches and gives it a click
// when you click it, it grabs the id of that punch and sends it to the server
// the server deletes that punch from the database
// then it takes the punch off the page so you see it disappear right away
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        // grabs the date and time from the punch you clicked
        // const date = this.parentNode.parentNode.childNodes[1].innerText
        // const time = this.parentNode.parentNode.childNodes[3].innerText
        // we grab the id of the punch we clicked, its saved in data-id on the button
        const id = this.dataset.id
        // this is the li the button is in so we know what to take off the page
        const punch = this.parentNode
        fetch('punches', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          // we send the id over to the server so it knows which punch to delete
          body: JSON.stringify({
            'id': id
          })
        }).then(function (response) {
          // if it works itll take the punch off the page right away
          if (response.ok) {
            punch.remove()
          } else {
            // if something is broken itll show up in the console, well thats the plan
            console.log('delete failed', response.status)
          }
        })
      });
});

