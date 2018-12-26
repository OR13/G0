import _ from "lodash";

var Board = function(size) {
  this.current_color = Board.BLACK;
  this.size = size;
  this.board = this.create_board(size);
  this.last_move_passed = false;
  this.in_atari = false;
  this.attempted_suicide = false;
  this.history = [];
  this.captures = [];
  this.capturesArrayBlack = [];
  this.capturesArrayWhite = [];
  this.moveCount = 0;
  this.moveCountArray = [];
  this.last_move_undo = false;
};

Board.EMPTY = 0;
Board.BLACK = 1;
Board.WHITE = 2;

/*
 * Returns a size x size matrix with all entries initialized to Board.EMPTY
 */
Board.prototype.create_board = function(size) {
  var m = [];
  for (var i = 0; i < size; i++) {
    m[i] = [];
    for (var j = 0; j < size; j++) m[i][j] = Board.EMPTY;
  }
  return m; 
};

Board.prototype.reset = function() {
  this.current_color = Board.BLACK;
  this.board = this.create_board(this.size);
  this.last_move_passed = false;
  this.in_atari = false;
  this.attempted_suicide = false;
  this.history = [];
  this.captures = [];
  this.moveCount = 0;
  this.moveCountArray = [];
  this.last_move_undo = false;
};

/*
 * Switches the current player
 */
Board.prototype.switch_player = function() {
  this.current_color =
    this.current_color === Board.BLACK ? Board.WHITE : Board.BLACK;
};

/*
 * At any point in the game, a player can pass and let his opponent play
 */
Board.prototype.pass = function() {
  if (this.last_move_passed) this.end_game();
  this.last_move_passed = true;
  this.switch_player();
};

/*
 * At any point in the game, a player can undo and let his opponent play
 */
Board.prototype.undo = function() {
 if(this.history.length){
  const {board, current_color} = this.history.pop();
  this.board = board;
  this.current_color = current_color;
  console.log("board undo", this);
 }
  else{
    console.log("no history");
  }
};

/*
 * Called when the game ends (both players passed)
 */
Board.prototype.end_game = function() {
  console.log("GAME OVER");
};

Board.prototype.is_valid_state = function(history) {
  console.log("history length " + this.history.length);
  const state = JSON.stringify(this.board);
  console.log("Im checking if current state is valid");
  for (var n = 0; this.moveCountArray[this.moveCountArray.length - 1] > this.moveCountArray[this.moveCountArray.length - 2] && this.moveCount > 0 && n < history.length; n=n+1) {
    if (JSON.stringify(history[n].board) === state) {
      console.log("INVALIDDDD");
      return false;}
  }
  return true;
};

var playHistoryX = [];
var playHistoryY = [];

/*
 * Attempt to place a stone at (i,j). Returns true iff the move was legal
 */
Board.prototype.play = function(i, j) {
  playHistoryX.push(i);
  playHistoryY.push(j);
  this.moveCount++;
  console.log(this.moveCount);
  this.moveCountArray.push(this.moveCount);
  console.log("Played at " + i + ", " + j);
  this.attempted_suicide = this.in_atari = false;
  if (playHistoryX[playHistoryX.length - 1]=== playHistoryX[playHistoryX.length-2] && playHistoryY[playHistoryY.length - 1]=== playHistoryY[playHistoryY.length-2]) {
    console.log("ko rule");
    this.moveCount--;
    return false;
  }
  if (this.board[i][j] !== Board.EMPTY) {
    console.log("INVALID MOVE");
    return false;
  }
  var color = (this.board[i][j] = this.current_color);
  var captured = [];
  var neighbors = this.get_adjacent_intersections(i, j);
  var atari = false;

  var self = this;
  _.each(neighbors, function(n) {
    var state = self.board[n[0]][n[1]];
    if (state !== Board.EMPTY && state !== color) {
      var group = self.get_group(n[0], n[1]);
      console.log(group);
      if (group["liberties"] === 0) captured.push(group);
      else if (group["liberties"] === 1) atari = true;
    }
  });

var turnBlack = 0;
var turnWhite = 0;

  // detect suicide
  if (_.isEmpty(captured) && this.get_group(i, j)["liberties"] === 0) {
    this.board[i][j] = Board.EMPTY;
    this.attempted_suicide = true;
    return false;
  }

  _.each(captured, function(group) {
    _.each(group["stones"], function(stone) {
      self.board[stone[0]][stone[1]] = Board.EMPTY;
      if (color === 1) {
        turnBlack++;
      } else if (color === 2) {
        turnWhite++;}
        }
    );
  });
  this.capturesArrayBlack.push(turnBlack);
  this.capturesArrayWhite.push(turnWhite);

  if (atari) this.in_atari = true;

  this.last_move_passed = false;
  this.switch_player();
  const state = {
    current_color: this.current_color,
    board: _.cloneDeep(self.board)
  }
  this.history.push(state);
  console.log("history", this.history);
  return true;
};

/*
 * Given a board position, returns a list of [i,j] coordinates representing
 * orthagonally adjacent intersections
 */
Board.prototype.get_adjacent_intersections = function(i, j) {
  var neighbors = [];
  if (i > 0) neighbors.push([i - 1, j]);
  if (j < this.size - 1) neighbors.push([i, j + 1]);
  if (i < this.size - 1) neighbors.push([i + 1, j]);
  if (j > 0) neighbors.push([i, j - 1]);
  return neighbors;
};

/*
 * Performs a breadth-first search about an (i,j) position to find recursively
 * orthagonally adjacent stones of the same color (stones with which it shares
 * liberties). Returns null for if there is no stone at the specified position,
 * otherwise returns an object with two keys: "liberties", specifying the
 * number of liberties the group has, and "stones", the list of [i,j]
 * coordinates of the group's members.
 */
Board.prototype.get_group = function(i, j) {
  var color = this.board[i][j];
  if (color === Board.EMPTY) return null;

  var visited = {}; // for O(1) lookups
  var visited_list = []; // for returning
  var queue = [[i, j]];
  var count = 0;

  let func = function(n) {
    var state = self.board[n[0]][n[1]];
    if (state === Board.EMPTY) count++;
    if (state === color) queue.push([n[0], n[1]]);
  };

  while (queue.length > 0) {
    var stone = queue.pop();
    if (visited[stone]) continue;

    var neighbors = this.get_adjacent_intersections(stone[0], stone[1]);
    var self = this;

    _.each(neighbors, func);

    visited[stone] = true;
    visited_list.push(stone);
  }

  return {
    liberties: count,
    stones: visited_list
  };
};

export default Board;
