class obstacle{
    constructor(x1, y1, x2, y2)
    {
        this.a = {x:x1, y:y1};
        this.b = {x:x2, y:y2};
    }
    
    show()
    {
        stroke(1);
        strokeWeight(1);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}

class controller{
    constructor(x, y, a)
    {
        this.x = x;
        this.y = y;
        this.angle = a;
        this.rays = [];
        for (let i = (this.angle - FOV); i <= (this.angle + FOV)-1; i+=FOV*2*DETAILS)
        {
            this.rays.push(new ray(this.x, this.y, i)) 
        }
    }

    handleInputs()
    {
        if(keyIsDown(87) > 0)
        {
            this.y -= 1;
        }
        if(keyIsDown(83) > 0)
        {
            this.y += 1;
        }
        if(keyIsDown(65) > 0)
        {
            this.x -=1;
        }
        if(keyIsDown(68) > 0)
        {
            this.x +=1;
        }
        if (mouseX >= this.x)
        {
            this.angle = atan((mouseY - this.y)/(mouseX - this.x));
        }
        else{
            this.angle = 180 + atan(((mouseY - this.y)/(mouseX - this.x)));
        }
        let index = 0;
        stroke(255, 0, 0)

        for (let i = (this.angle - FOV); i < (this.angle + FOV) -1; i+=FOV*2*DETAILS)
        {
            this.rays[index].a = {x:this.x, y:this.y}
            this.rays[index].angle = i;

            var intersections = []
            for (var o of obstacles)
            {
                var pnt = this.rays[index].getIntersectionPoint(o);
                if (pnt)
                {
                    intersections.push(pnt)
                }
            }
            var last = Infinity;
            var thing;
            for (var p of intersections)
            {
                let distance = dist(this.x ,this.y ,p.x, p.y);
                if (distance < last)
                {
                    last = distance;
                    thing = p;
                }
            }
            if (thing)
            {
                strokeWeight(2);
                line(this.x, this.y, thing.x, thing.y)
                strokeWeight(5);
                point(thing.x, thing.y)
                
            }
            scene[index] = last //* cos(this.rays[index].angle);
            index++;
        }

    }
    show()
    {
        noStroke();
        fill(0, 165, 255);
        ellipse(this.x, this.y, 8, 8);
        for(var r of this.rays)
        {

            r.show();
        }
    }
}

class ray{
    constructor(x1, y1, a)
    {
        this.a = {x:x1, y:y1};
        this.angle = a;
        this.b = {x: this.a.x + cos(this.angle), y:this.a.y + sin(this.angle)}
        //this.b = {x:x2, y:y2};
        //this.angle = asin((this.a.y - this.b.y)/(this.a.x - this.b.x))
    }
    show()
    {
        this.b = {x: this.a.x + cos(this.angle)*5, y:this.a.y + sin(this.angle)*5}
        stroke(0, 100, 255);
        noFill();
        line(this.a.x, this.a.y, this.b.x, this.b.y)
    }
    isIntersectingWith(obstacle)
    {
        const denominator = (obstacle.a.x - obstacle.b.x) * (this.a.y - this.b.y) - (obstacle.a.y - obstacle.b.y) * (this.a.x - this.b.x);
        if (denominator == 0)
        {
            return;
        }
        const t = ((obstacle.a.x - this.a.x) * (this.a.y - this.b.y) - (obstacle.a.y - this.a.y) * (this.a.x - this.b.x))/denominator;
        const u = -(((obstacle.a.x - obstacle.b.x) * (obstacle.a.y - this.a.y) - (obstacle.a.y - obstacle.b.y) * (obstacle.a.x - this.a.x))/denominator);

        if (t > 0 && t < 1 && u > 0)
        {
            return {u:u, t:t};
        }
        else
        {
            return;
        }
    }

    getIntersectionPoint(obstacle)
    {
        var things = this.isIntersectingWith(obstacle);
        if (things)
        {
            let point = {x:obstacle.a.x + things.t*(obstacle.b.x - obstacle.a.x), y:obstacle.a.y + things.t*(obstacle.b.y - obstacle.a.y)}
            return point
        }
        else
        {
            return;
        }
    }
    
}

function room(x, y, sides)
{
    obstacles.push(new obstacle(x-15, y-15, x-7, y-15));
    obstacles.push(new obstacle(x-15, y-15, x-15, y-7));

    obstacles.push(new obstacle(x+15, y-15, x+7, y-15));
    obstacles.push(new obstacle(x+15, y-15, x+15, y-7));

    obstacles.push(new obstacle(x-7, y+15, x-15, y+15));
    obstacles.push(new obstacle(x-15, y+15, x-15, y+7));
    
    obstacles.push(new obstacle(x+7, y+15, x+15, y+15));
    obstacles.push(new obstacle(x+15, y+15, x+15, y+7));
}

const FOV = 22.5;
const DETAILS = 0.01;
let scene = [];
let player;
let obstacles = [];

function setup ()
{
    angleMode(DEGREES);
    rectMode(CENTER);
    createCanvas(800, 400);
    player = new controller(200, 200, 0);
    room(200, 200, [true, true, true, true]);
    obstacles.push(new obstacle(0, 0, 0, 400));
    obstacles.push(new obstacle(0, 0, 400, 0));
    obstacles.push(new obstacle(400, 0, 400, 400));
    obstacles.push(new obstacle(0, 400, 400, 400));
    
}


function draw()
{
    background(220)
    fill(1);
    noStroke();
    rect(600, 200, 400, 400)
    stroke(0, 255, 0)
    strokeWeight(5)
    line(400, 0, 400, 400)
    player.handleInputs();
    for (let o of obstacles)
    {
        o.show();
    }
    player.show();

    let pixel = 400/scene.length;
    for (var i = 0; i < scene.length; i++)
    {
        noStroke();
        fill(map(scene[i]^2, 0, 400, 255, 0));
        let h = map(scene[i], 0, 400^2, 400, 0);
        rect(400 + i * pixel + pixel/2, 400 /2 , pixel + 1, h);
    }
}
