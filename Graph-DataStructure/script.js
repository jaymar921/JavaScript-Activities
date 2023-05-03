/*
setInterval(()=>{
	location.href = '';
}, 3000);
*/


const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const output = document.querySelector('#output-text');

canvas.width = 700;
canvas.height = 500;
let text_type = 'GRAPH TRAVERSAL';

const drawText = () => {
	context.fillStyle = 'black';
	context.font = '50px Georgia';
	context.fillText(text_type, 20, 450);
	console.log(text_type)
}

const drawBg = () => {
	context.fillStyle = 'black';
	context.fillRect(0,0,1920,1080);
}

class Square{
	constructor({position, width, height, color}){
		this.position = position;
		this.width = width;
		this.height = height;
		this.color = color;
		this.connectionColor = 'red';
	}

	drawConnections(){
		this.neighbors.forEach(n => {
			context.beginPath();
			context.moveTo(this.position.x+this.center(),this.position.y+this.center(),this.width, this.height);
			context.lineTo(n.position.x+n.center(),n.position.y+n.center(),n.width, n.height);
			context.strokeStyle = this.connectionColor;
			context.lineWidth = 5;
			context.stroke();
		});
	}

	draw(){
		context.fillStyle = this.color;
		context.fillRect(
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		context.fillStyle = 'yellow';
		context.font = '12px Georgia';
		context.fillText(this.name, this.position.x+this.center()/2, this.position.y+this.center(), this.width);
	}

	center(){
		return this.width/2;
	}
}

class Vertex extends Square{
	constructor({position, name,width=32, height=32, color='green'}){
		super({position, width, height, color})
		this.position = position;
		this.name = name;
		this.neighbors = new Array();
		this.parent = null;
	}
}

let VERTICES = new Array();

const AddVertex = (_name, _x, _y) => {
	VERTICES.push(
		new Vertex(
			{
				position:{
					x:_x,
					y:_y
				},
				name:_name
			}
		)
	)
}

const getDistance = (p1, p2) => {
	let a = Math.abs(p1.position.x - p2.position.x);
	let b = Math.abs(p1.position.y - p2.position.y);

	let c = (a*a) + (b*b);
	return Math.sqrt(c);
}

const AddNeighbor = (v_1, v_2) => {
	const vertex_1 = VERTICES.filter(v => v.name === v_1)[0];
	const vertex_2 = VERTICES.filter(v => v.name === v_2)[0];

	vertex_1.neighbors.push(vertex_2);
	vertex_2.neighbors.push(vertex_1);
}

const blockGenerator = async () => {
	let i = 0;
	for(let x = 0; x < 32*12; x+=35){
		for(let y = 0; y < 32 * 12; y += 35){
			AddVertex(i++, x, y);
		}
	}
}

const connectAllNodes = () => {
	VERTICES.forEach(n1 => {
		VERTICES.forEach(n2 => {
			if(getDistance(n1, n2) <= 35){
				if(
					n1.name == 55 ||
					n1.name == 56 ||
					n1.name == 57 ||
					n1.name == 58 ||
					n1.name == 59 ||
					n1.name == 61 ||
					n1.name == 62 ||
					n1.name == 63 ||
					n1.name == 64 ||
					n1.name == 65 ||
					n2.name == 55 ||
					n2.name == 56 ||
					n2.name == 57 ||
					n2.name == 58 ||
					n2.name == 59 ||
					n2.name == 61 ||
					n2.name == 62 ||
					n2.name == 63 ||
					n2.name == 64 ||
					n2.name == 65 
				) {

				}
				else{
					AddNeighbor(n1.name,n2.name);
				}
				if(n1.name == 55 ||
					n1.name == 56 ||
					n1.name == 57 ||
					n1.name == 58 ||
					n1.name == 59 ||
					n1.name == 61 ||
					n1.name == 62 ||
					n1.name == 63 ||
					n1.name == 64 ||
					n1.name == 65 ){
					n1.color = 'red';
				}
			}
		})
	})
}


const loadVertex = async () => {
	VERTICES = new Array();
	await blockGenerator();
	connectAllNodes();
	/*
	AddVertex('A', 128, 86);
	AddVertex('B', 99, 217);
	AddVertex('C', 47, 345);
	AddVertex('D', 286, 266);
	AddVertex('E', 352, 176);
	AddVertex('F', 395, 364);
	AddVertex('G', 464, 64);
	AddVertex('H', 601, 141);
	AddVertex('I', 544, 276);
	AddVertex('J', 181, 463);
	AddVertex('K', 518, 421);

	AddNeighbor('A','B');
	AddNeighbor('B','C');
	AddNeighbor('B','D');
	AddNeighbor('C','F');
	AddNeighbor('D','E');
	AddNeighbor('A','E');
	AddNeighbor('F','E');
	AddNeighbor('G','E');
	AddNeighbor('G','H');
	AddNeighbor('H','I');
	AddNeighbor('F','J');
	AddNeighbor('F','K');
	*/
}

loadVertex();

/*
 
	 get the node
	 if this node is near the goal
	 visit the node
	 expand the node (neighbors)
*/
const DFS = async (vertex_name, goalVertex) => {
	loadVertex();
	text_type = 'Depth-First-Search';
	let output_string = `OUTPUT<br>Starting Postion: ${vertex_name}`;
	const starting = VERTICES.filter(v => v.name === vertex_name)[0];
	const goal = VERTICES.filter(v => v.name === goalVertex)[0];
	
	goal.color = 'orange';
	const queue = new Array();
	const visited = new Array();

	queue.push(starting);
	starting.color = 'red';
	starting.draw()
	while(queue.length!=0){
		await sleep(50);
		// pop
		const v = queue.pop();
		if(visited.includes(v.name)){
			continue;
		}
		starting.color = 'red';
		starting.draw()
		if(v.name === goalVertex){
			reconstruct_path(v);
			break;
		}
		visited.push(v.name);
		v.color = 'black';
		v.connectionColor = 'blue'
		for(let n of v.neighbors){
			if(visited.includes(n.name)){
				continue;
			}
			n.parent = v;
			output_string += `<br>Visited ${n.name}`;
			output.innerHTML = output_string;
			if(!queue.includes(n))
				queue.push(n);
		}
	}
	output_string += `<br>Graph Traversed`;
	output.innerHTML = output_string;
}
const BFS = async (vertex_name, goalVertex) => {
	loadVertex();
	text_type = 'Breadth-First-Search';
	let output_string = `OUTPUT<br>Starting Postion: ${vertex_name}`;
	const starting = VERTICES.filter(v => v.name === vertex_name)[0];
	const goal = VERTICES.filter(v => v.name === goalVertex)[0];
	
	goal.color = 'orange';
	const queue = new Array();
	const visited = new Array();

	queue.push(starting);
	starting.color = 'red';
	starting.draw()
	while(queue.length!=0){
		await sleep(50);
		// pop
		const v = queue.shift();
		if(visited.includes(v.name)){
			continue;
		}
		starting.color = 'red';
		starting.draw()
		if(v.name === goalVertex){
			reconstruct_path(v);
			break;
		}
		visited.push(v.name);
		v.color = 'black';
		v.connectionColor = 'blue'
		for(let n of v.neighbors){
			if(visited.includes(n.name)){
				continue;
			}
			n.parent = v;
			output_string += `<br>Visited ${n.name}`;
			output.innerHTML = output_string;
			if(!queue.includes(n))
				queue.push(n);
		}
	}
	output_string += `<br>Graph Traversed`;
	output.innerHTML = output_string;
}

const animate = () => {
	requestAnimationFrame(animate);
	context.clearRect(0,0,canvas.width, canvas.height);
	drawText();
	VERTICES.forEach(v => {
		v.drawConnections();
	})
	VERTICES.forEach(v => {
		v.draw();
	})
	
};

const reconstruct_path = (v) => {
	let i = 0;
	for(let node = v; node != null; node = node.parent){
		if(i++ >= 200){
			break;
		}

		node.color = 'yellow';
		node.connectionColor = 'aqua';
	}
}

animate();


