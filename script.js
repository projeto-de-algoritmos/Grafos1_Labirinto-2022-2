let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");


let current

class Maze {
    constructor(size, rows, columns) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }

    getGrid() {
        return this.grid;
    }

    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row = []
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row)
        }
        current = this.grid[0][0];
    }


    mazeInitial() {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = 'black';
        current.visited = true

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns)
            }
        }
    }

    draw() {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = 'black';
        current.visited = true

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns)
            }
        }

        let next = current.checkNeighbours()

        if (next) {
            next.visited = true
            this.stack.push(current);
            current.highlight(this.columns);

            current.removeWall(current, next)

            current = next
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns)
        }

        if (this.stack.length == 0) {
            return;
        }

        window.requestAnimationFrame(() => {
            this.draw()
        })
    }
}


class Cell {
    constructor(rowNum, colNum, parentGrid, parentSize) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true,
        };
    }

    drawTopWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / columns, y);
        ctx.stroke();
    }

    drawRightWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x + size / columns, y);
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    drawBottomWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / rows);
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    drawLeftWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size / rows);
        ctx.stroke();
    }

    WallTop(aux) {
        this.walls.topWall = aux;
    }
    WallBot(aux) {
        this.walls.bottomWall = aux;
    }
    WallRight(aux) {
        this.walls.rightWall = aux;
    }
    WallLeft(aux) {
        this.walls.leftWall = aux;
    }
    get Walls() {
        return this.walls;
    }
    get Visited() {
        return this.visited;
    }


    checkNeighbours() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = []

        let top = row !== 0 ? grid[row - 1][col] : undefined
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined
        let left = col !== 0 ? grid[row][col - 1] : undefined


        if (top && !top.visited) neighbours.push(top)
        if (right && !right.visited) neighbours.push(right)
        if (bottom && !bottom.visited) neighbours.push(bottom)
        if (left && !left.visited) neighbours.push(left)

        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random]
        } else {
            return undefined;
        }
    }


    removeWall(cell1, cell2) {
        let x = (cell1.colNum - cell2.colNum);

        if (x == 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x == -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        let y = cell1.rowNum - cell2.rowNum;

        if (y == 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y == -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    highlight(columns) {
        let x = (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;

        ctx.fillStyle = "Blue";

        ctx.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3)
    }

    show(size, rows, columns) {
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';

        ctx.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);

        if (this.visited) {
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2)
        }
    }
}

class Graph {

    constructor(vertex) {
        this.vertex = vertex;
        this.listAdj = new Map();
    }

    getKeys() {
        return this.listAdj.keys();
    }
    getValues(i) {
        return this.listAdj.get(i);
    }
    addVertex(v) {
        this.listAdj.set(v, []);
    }
    addEdge(v, w) {
        this.listAdj.get(v).push(w);
    }
    print() {
        var vertex = this.listAdj.keys();
        for (var i of vertex) {
            var listAdj = this.listAdj.get(i);
            var sum = '';
            for (var j = 0; j < listAdj.length; ++j) {
                sum += listAdj[j];
                if (j != listAdj.length - 1) sum += ' && ';
            }
        }
    }
    get Keys() {
        return this.listAdj.keys();
    }

    path(v, visitados) {
        visitados[v] = true;

        var get_values = this.listAdj.get(v);

        for (var w in get_values) {
            var value = get_values[w];
            if (!visitados[value]) this.path(value, visitados);
        }
    }
    //findPath

    findPath(origem, destino) {
        if (origem == destino) {
            return [origem, origem];
        }

        var fila = [origem],
            visitados = {},
            ant = {},
            aux = 0,
            steps = [];

        while (aux < fila.length) {
            var u = fila[aux];
            aux++;

            if (!this.listAdj.get(u)) {
                continue;
            }

            var get_values = this.listAdj.get(u);
            for (var i = 0; i < get_values.length; ++i) {
                var v = get_values[i];
                if (visitados[v]) {
                    continue;
                }
                visitados[v] = true;
                if (v === destino) {
                    steps = [v];
                    while (u !== origem) {
                        steps.push(u);
                        u = ant[u];
                    }
                    steps.push(u);
                    steps.reverse();
                    return steps;
                }
                ant[v] = u;
                fila.push(v);
            }
        }
        return steps;
    }
}


function mazeGen() {
    let btnGerar = document.querySelector('#gerar');
    let btnBuscar = document.querySelector('#buscar');
    btnGerar.addEventListener('click', () => {
        newMaze.draw();
        btnBuscar.removeAttribute("disabled");
        btnGerar.setAttribute("disabled", "disabled"); 
    });

}

function findAwayOut() {
    let btnFind = document.querySelector('#buscar');
    let btnGerar = document.querySelector('#gerar');

    btnFind.addEventListener('click', () => {
        buscar(); 
        btnFind.setAttribute("disabled", "disabled");        
    });
}

function newFlow() {
    let btnNovo = document.querySelector('#new');
  
    btnNovo.addEventListener('click', () => {
      location.reload();
    });
  }





function buscar() {

    var ponto1, ponto2;

    let min = 5;
    let max = 99;

    let random = Math.floor(Math.random() * (max - min + 1)) + min;

    ponto1 = parseInt(0);
    ponto2 = parseInt(random);

    var matrixLogic = newMaze.getGrid();

    var graphLogic = new Graph(100);

    for (var i = 0; i < 100; ++i) {
        graphLogic.addVertex(i);
    }

    for (var i = 0; i < 10; ++i) {
        for (var j = 0; j < 10; ++j) {

            var Wall = matrixLogic[i][j].Walls;
            let origem, destino;

            if (Wall.topWall == false && matrixLogic[i - 1][j].Visited) {
                origem = i * 10 + j;
                destino = (i - 1) * 10 + j;
                graphLogic.addEdge(origem, destino);
                matrixLogic[i][j].WallTop(true);
            }
            if (Wall.bottomWall == false && matrixLogic[i + 1][j].Visited) {
                origem = i * 10 + j;
                destino = (i + 1) * 10 + j;
                graphLogic.addEdge(origem, destino);
                matrixLogic[i][j].WallBot(true);
            }
            if (Wall.rightWall == false && matrixLogic[i][j + 1].Visited) {
                origem = i * 10 + j;
                destino = i * 10 + (j + 1);
                graphLogic.addEdge(origem, destino);
                matrixLogic[i][j].WallRight(true);
            }
            if (Wall.leftWall == false && matrixLogic[i][j - 1].Visited) {
                origem = i * 10 + j;
                destino = i * 10 + (j - 1);
                graphLogic.addEdge(origem, destino);
                matrixLogic[i][j].WallLeft(true);
            }
        }
    }

    paintPath(graphLogic.findPath(ponto1, ponto2));
    paintDestiny(graphLogic.findPath(ponto1, ponto2));

}


function paintDestiny(steps) {
    let p, q;
    var counter = -1;
    var i = setInterval(function () {
        counter++;
        if (counter === steps.length) {
            clearInterval(i);
            paintDestino(p, q);
        }
        if (steps[counter] < 10) {
            p = (steps[counter] * 500) / 10 + 1;
            q = 0;
        } else {
            p = (parseInt(steps[counter] % 10) * 500) / 10 + 1;
            q = (parseInt(steps[counter] / 10) * 500) / 10 + 1;
        }
    });

    function paintDestino(p, q) {
        ctx.fillStyle = '#efe804';
        ctx.fillRect(p, q, 500 / 10 - 3, 500 / 10 - 3);
    }
}

function paintPath(steps) {
    let p, q;
    var counter = 0;

    var i = setInterval(function () {
        counter++;
        if (counter === steps.length) {
            clearInterval(i);
            paintCheack(p, q);
        }
        if (steps[counter] < 10) {
            p = (steps[counter] * 500) / 10 + 1;
            q = 0;
        } else {
            p = (parseInt(steps[counter] % 10) * 500) / 10 + 1;
            q = (parseInt(steps[counter] / 10) * 500) / 10 + 1;
        }

        paint(p, q);
    }, 200);
    function paint(p, q) {
        ctx.fillStyle = 'red';
        ctx.fillRect(p, q, 500 / 10 - 3, 500 / 10 - 3);
    }

    function paintCheack(p, q) {
        ctx.fillStyle = '#7CF000';
        ctx.fillRect(p, q, 500 / 10 - 3, 500 / 10 - 3);
    }
}


let newMaze = new Maze(500, 10, 10);
newMaze.setup();
newMaze.mazeInitial();
mazeGen()
findAwayOut()
newFlow()
