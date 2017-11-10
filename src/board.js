import React from 'react';

const LENGTH = 10;
const SIZE = 100;
const TIMER = 100;

const fillBox = ({ctx, x, y}) => ctx.fillRect(x*LENGTH, y*LENGTH, LENGTH, LENGTH);
// const boxes = initBoard(SIZE);

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      generation: 0,
      boxes: this.initBoard(SIZE)
    }
    this.updateCanvas = this.updateCanvas.bind(this);
    this.initBoard = this.initBoard.bind(this);
    this.evalGeneration = this.evalGeneration.bind(this);
  }

  componentDidMount() {
    setInterval(()=> {
      this.evalGeneration()
    }, TIMER);
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  initBoard(size){
    const board = [];
    for(let y = 0; y < size; y++){
      const row = [];
      for(let x = 0; x < size; x++){
        row[x]= (Math.random() > 0.5) ? true : false
      }
      board[y] = row;
    }
    // console.log("Board", board)
    return board;
  }

  evalGeneration(){
    const { boxes }  = this.state;
    const newState = boxes.map((row, y) => row.map((box, x) => {
      const xMin = (x - 1 > 0) ? x - 1 : 0;
      const xMax = (x + 1 < SIZE) ? x + 1: SIZE - 1;
      const yMin = (y - 1 > 0) ? y - 1 : 0;
      const yMax = (y + 1 < SIZE) ? y + 1: SIZE - 1;
      let pop = 0;
      for(let j = yMin; j <= yMax; j++){
        for(let i = xMin; i <= xMax; i++){
          if (!( i === x && j === y) && boxes[j][i]){
            pop++;
          }
        }
      }
      let next
      if (box) {
        next = (pop < 2 || pop > 3) ? false : true;
      } else {
        next = (pop === 3) ? true : false;
      }
      // console.log(`Box: ${box} - Pop: ${pop} - Next: ${next}`)
      return next;
    }));
    // console.log("New State", newState)
    this.setState({ boxes: newState, generation: this.state.generation + 1 });
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0, SIZE*LENGTH, SIZE*LENGTH);
    this.state.boxes.forEach((row, y) => row.forEach((box, x) => {
      if (box) fillBox({ctx, x, y})
    }));
  }

  render() {
    return (
      <div>
        <h1> Generation #{this.state.generation} </h1>
        <canvas ref="canvas" width={SIZE*LENGTH} height={SIZE*LENGTH} style={{marginTop: "50px", marginBottom:"auto", marginLeft: "auto", marginRight: "auto"}}/>
      </div>
    );
  }
}

export default Board
