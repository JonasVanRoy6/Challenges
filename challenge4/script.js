document.addEventListener("DOMContentLoaded", function() {
    var ball = document.getElementById("ball");
    var maze = document.getElementById("maze");
    var goal = document.querySelector(".goal");
    var walls = document.querySelectorAll(".wall");
    
    var mazeWidth = maze.offsetWidth;
    var mazeHeight = maze.offsetHeight;
    var ballSize = ball.offsetWidth;
    
    function handleOrientation(event) {
        var x = event.gamma;  
        var y = event.beta;   
        
        
        var newX = (mazeWidth - ballSize) * (x + 90) / 180;
        var newY = (mazeHeight - ballSize) * (y + 90) / 180;
        
        
        if (newX >= 0 && newX <= (mazeWidth - ballSize)) {
            ball.style.left = newX + "px";
        }
        if (newY >= 0 && newY <= (mazeHeight - ballSize)) {
            ball.style.top = newY + "px";
        }
        
        
        walls.forEach(function(wall) {
            if (isColliding(ball, wall)) {
                
                ball.style.left = "190px"; 
                ball.style.top = "190px"; 
            }
        });
        
        
        if (isColliding(ball, goal)) {
            alert("Proficiat het is je gelukt!");
        }
    }
    
    window.addEventListener("deviceorientation", handleOrientation, true);
    
    
    function isColliding(elem1, elem2) {
        var rect1 = elem1.getBoundingClientRect();
        var rect2 = elem2.getBoundingClientRect();
        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }
});
