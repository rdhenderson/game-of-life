import React from 'react';

const LENGTH = 5;
const SIZE = 300;
const TIMER = 100;

const fillBox = ({ctx, x, y}) => ctx.fillRect(x, y, LENGTH, LENGTH);
// const boxes = initBoard(SIZE);

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      update: 0,
      boxes: initBoard(SIZE)
    }
    this.updateCanvas = this.updateCanvas.bind(this);
    this.evalCell = this.evalCell.bind(this);
    this.evalGeneration = this.evalGeneration.bind(this);
  }

  componentDidMount() {
    setInterval(()=> {
      this.evalGeneration()
      console.log("timeout running")
    }, TIMER);
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  evalGeneration(){
    const { boxes } = this.state;
    const nextState = {};
    Object.keys(boxes).forEach(key => nextState[key] = this.evalCell(boxes[key]));
    this.setState({boxes: nextState, update: this.state.update + 1})
  }

  evalCell(cell){
    const { boxes } = this.state;
    const item = { ...cell }
    const pop = cell.neighbors.filter(key => boxes[key].alive).length;

    let next
    if (item.alive) {
      next = (pop < 2 || pop > 3) ? false : true;
    } else {
      next = (pop === 3) ? true : false;
    }

    item.alive = next;
    return item;
}

  updateCanvas() {
    const {boxes} = this.state
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0, SIZE*LENGTH, SIZE*LENGTH);
    Object.keys(boxes).filter(key => boxes[key].alive).forEach( key =>
      fillBox({
        ctx,
        x: boxes[key].x * LENGTH,
        y: boxes[key].y * LENGTH,
      })
    )
  }

  render() {
    return (
      <div>
        <h1> Generation #{this.state.update} </h1>
        <canvas ref="canvas" width={SIZE*LENGTH} height={SIZE*LENGTH} style={{marginTop: "50px", marginBottom:"auto", marginLeft: "auto", marginRight: "auto"}}/>
      </div>
    );
  }
}

function initBoard(size){
  const board = {};
  for(let x = 0; x < size; x++){
    for(let y = 0; y < size; y++){
      const rand = Math.random();
      board[`${x}:${y}`] = {
        alive : (rand > 0.5) ? true : false,
        x,
        y,
      }
    }
  }
  return getNeighbors(board);
}

function getNeighbors(board){
  Object.keys(board).forEach( key => {
    const box = board[key];
    const xMin = (box.x - 1 > 0) ? box.x - 1 : 0;
    const xMax = (box.x + 1 < SIZE) ? box.x + 1: SIZE - 1;
    const yMin = (box.y - 1 > 0) ? box.y - 1 : 0;
    const yMax = (box.y + 1 < SIZE) ? box.y + 1: SIZE - 1;
    box.neighbors = [];
    for(let i = xMin; i <= xMax; i++){
      for(let j = yMin; j <= yMax; j++){
        if (!( i === box.x && j === box.y)){
          box.neighbors.push(`${i}:${j}`)
        }
      }
    }
  });
  return board;
}

export default Board
