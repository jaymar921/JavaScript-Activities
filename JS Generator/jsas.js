const names = [
    'http://image1.png',
    'http://image2.png',
    'http://image3.png',
    'http://image4.png',
    'http://image5.png'
]


// generator function, a function that can be exited and later be re-entered
const GENERATOR = function*(arr){
    yield* arr;
}


// instantiating the generator function
const namesGenerator = GENERATOR(names);


// calling the generator function
for(let i = 0; i < 2; i ++)
    console.log(namesGenerator.next().value);

// operation
console.log("Some task")

// calling the generator function again
for(let i = 0; i < 2; i ++)
    console.log(namesGenerator.next().value);
