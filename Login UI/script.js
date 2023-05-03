/*setInterval(()=> {
	location.href='';
},1000)
*/

// grab the canvas element
const canvas = document.querySelector('#background-canvas');
const context = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1080;

context.fillStyle = 'black';
context.fillRect(0,0,1920,1080);


class Circle{
	constructor({position, radius = 2, velocity, distance=10}){
		this.position = position;
		this.radius = radius;
		this.velocity = velocity;
		this.distance = distance;
		this.max_connection = 3;
		this.connections = 0;
	}

	draw(){
		context.beginPath();
		
		context.arc(
			this.position.x,
			this.position.y,
			this.radius,
			0,
			Math.PI * 2,
			false
		)
		context.fillStyle = 'white';
		context.fill();
		context.closePath();
	}

	update(){
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// if malapas sa screen
		if(this.position.x > canvas.width){
			this.position.x = 0;
		}
		if(this.position.x < 0){
			this.position.x = canvas.width;
		}
		if(this.position.y > canvas.height){
			this.position.y = 0;
		}
		if(this.position.y < 0){
			this.position.y = canvas.height;
		}
	}
}

const arrayOfCircles = new Array();

const circleGenerator = () => {
	for(let i = 0; i < 100; i++){
		const c1 = new Circle({
			position:{
				x: Math.floor(Math.random() * 1920),
				y: Math.floor(Math.random() * 1080)
			},
			radius: 3,
			velocity: {
				x: Math.floor(Math.random() * 2)>0?Math.random()*1:0-(Math.random() * 1),
				y: Math.floor(Math.random() * 2)>0?Math.random()*1:0-(Math.random() * 1)
			}
		});
		c1.distance = Math.floor(Math.random()*300);
		arrayOfCircles.push(c1);
	}
}

const keys = {
	position:{
		x: 0,
		y: 0
	}
}


circleGenerator();

const drawALine = (pointA, pointB) => {
	context.beginPath()
	context.moveTo(pointA.position.x, pointA.position.y);
	context.lineTo(pointB.position.x, pointB.position.y);
	context.strokeStyle = 'white';
	context.lineWidth = 1;
	context.stroke();
}

const getDistanceOfTwoPoints = (point1, point2) => {
	let a = Math.abs(point1.position.x - point2.position.x);
	let b = Math.abs(point1.position.y - point2.position.y);

	a *= a;
	b *= b;

	let c = a + b;
	return Math.sqrt(c);
}



// animation loop
const animation = () => {
	requestAnimationFrame(animation);
	context.clearRect(0,0,1920,1080);
	

	// draw a line if a circle is near another circle
	arrayOfCircles.forEach(c1 => {
		arrayOfCircles.forEach(c2 => {
			let distance = getDistanceOfTwoPoints(c1, c2);

			//console.log(distance);
			if(distance < c1.distance){
				if(c1.connections < c1.max_connection){
					drawALine(c1, c2);
					c1.connections++;
				}
				
			}
		});
	});

	// draw the circles
	arrayOfCircles.forEach(c => {
		let circleDistance = getDistanceOfTwoPoints(keys, c);
		
		if(circleDistance < 100 ){
			//console.log(circleDistance)
			if(c.position.x < keys.position.x){
				c.position.x-=1;
			}
			if(c.position.x > keys.position.x){
				c.position.x+=1;
			}

			if(c.position.y < keys.position.y){
				c.position.y-=1;
			}
			if(c.position.y > keys.position.y){
				c.position.y+=1;
			}
		}

		c.update();
		c.draw();
		c.connections = 0;
	})

}


addEventListener('mousemove', ({clientX, clientY})=> {
	keys.position.x = clientX;
	keys.position.y = clientY;
	console.log(keys.position.x, keys.position.y)
})

animation();