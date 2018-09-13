const starships = {
    'CR90 Corvette': 2,
    'V-wing': 75,
    'Belbullab': 22,
    'Starfighter': 74,
    'Jedi Interceptor': 65,
    'Star Destroyer': 3,
    'Trade Fedaration Cruiser': 59,
    'Solar Sailer': 58,
    'Republic Attack Cruiser': 63,
    'A-wing': 28,
    'B-wing': 29,
    'Naboo Fighter': 39,
    'Millenium Falcon': 10
}

const shipProps = ['name', 'cost_in_credits', 'max_atmosphering_speed', 'cargo_capacity', 'passengers']

const select1 = document.getElementById("shipA");
const select2 = document.getElementById("shipB");
createOptions(select1);
createOptions(select2);

const compTable = document.getElementById("compTable");
createTable(compTable);

const compareBtn = document.getElementById("compareBtn");
compareBtn.addEventListener('click', () => {

    run(compareShips);
})

function *compareShips() {

    let shipA = select1.options[select1.selectedIndex].value
    let shipB = select2.options[select2.selectedIndex].value

    //fetch ship data
    let shipAResponse = yield fetch("https://swapi.co/api/starships/" + shipA)
    let shipAdata = yield shipAResponse.json();

    let shipBResponse = yield fetch("https://swapi.co/api/starships/" + shipB)
    let shipBdata = yield shipBResponse.json();

    //populate appropriate data in table
    table = document.getElementById('compTable');
    
    shipProps.map(prop => {
        let row = document.getElementById(prop);
        row.cells[1].textContent = shipAdata[prop];
        row.cells[2].textContent = shipBdata[prop];

        if (prop !== 'name') {
            if (shipAdata[prop] > shipBdata[prop])
                row.cells[1].style = 'background-color:red';
            if (shipAdata[prop] < shipBdata[prop])
                row.cells[2].style = 'background-color:red';
        }
        
    })
    
}

function createOptions(el) {
    Object.keys(starships).map(starship => {
        let option = document.createElement('option');
        option.value = starships[starship];
        option.appendChild(document.createTextNode(starship))
        el.appendChild(option);
    })
}

function createTable(tableElement) {
    var tableHeaderRow = document.createElement('TR');
    var th1 = document.createElement('TH');
    var th2 = document.createElement('TH');
    var th3 = document.createElement('TH');
    th2.appendChild(document.createTextNode("Starship 1"));
    th3.appendChild(document.createTextNode("Starship 2"));
    tableHeaderRow.appendChild(th1);
    tableHeaderRow.appendChild(th2);
    tableHeaderRow.appendChild(th3);   
    tableElement.appendChild(tableHeaderRow);

    // Add rows for ship attributes
    let attributes = ["Name", "Cost","Speed", "Cargo Size", "Passengers"]
    attributes.map((attr, index) => {
        var dataRow = document.createElement('TR');
        dataRow.setAttribute('id',shipProps[index]);
        var cell1 = document.createElement('TD');
        var cell2 = document.createElement('TD');
        var cell3 = document.createElement('TD');
        cell1.appendChild(document.createTextNode(attr));
        dataRow.appendChild(cell1);
        dataRow.appendChild(cell2);
        dataRow.appendChild(cell3);
        tableElement.appendChild(dataRow);
    })
}

function run(genFunc){
    const genObject= genFunc(); //creating a generator object

    function iterate(iteration){ //recursive function to iterate through promises
        if(iteration.done) //stop iterating when done and return the final value wrapped in a promise
            return Promise.resolve(iteration.value);
        return Promise.resolve(iteration.value) //returns a promise with its then() and catch() methods filled
        .then(x => iterate(genObject.next(x))) //calls recursive function on the next value to be iterated
        .catch(x => iterate(genObject.throw(x))); //throws an error if a rejection is encountered
    }

    try {
        return iterate(genObject.next()); //starts the recursive loop
    } catch (ex) {
        return Promise.reject(ex); //returns a rejected promise if an exception is caught
    }
}

