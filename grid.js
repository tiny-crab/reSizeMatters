$(document).ready(function()
{
  rememberRows();
  checkWidth();
  centerRows();
  window.onresize = checkWidth;
});


//function to check if the row is too full or not full enough
function checkWidth()
{
  //for every fluid row...
  $(".container").children(".fluid").each(function(){
    //$this is now a fluid row within the html doc
    var rowPercentFilled = percentFilled($(this));

    var origChildren = $(this).children().length;

    if(rowPercentFilled > 100)
    {
      //breaking off the first child of the row that is too full
      breakOff( $(this).find(":first-child") );
    }

    //checking to see if a column was broken off, in order to check again
    if( $(this).children().length < origChildren)
    {
      checkWidth();
    }

  });

  smush();
  centerRows();
}

//function that takes columns out of rows that are too full and adds
//a new row above it for the extra columns
function breakOff(targetColumn)
{
  //resetting the margins of the column, in case it was already checked previously
  targetColumn.css({"margin-left":"0", "margin-right":"0"});
  //referencing the row that the column will be detached from
  var parentDiv = targetColumn.parent();
  //creating a new template for the new row to insert the column into
  var newRow = $("<div>").addClass("fluid row");
  //add a new row above the parent row
  parentDiv.before(newRow);

  //pull targeted column out
  targetColumn.detach();
  //push into the newly created row
  targetColumn.appendTo(newRow);
}

//function that pushes columns back into their original layout when
//there is enough room for them
//FIX: Need to get this to work for non-original rows, should be easy
function smush()
{

  var allRows = [];
  //grabs all fluid rows and puts the objects into an array
  $(".container").children(".fluid").each(function(){
    allRows.push($(this));
  });
  //for each row inside the doc
  for( var x = 0; x < allRows.length; x++)
  {
    //curRow is simply the current row that the loop is looking at
    var curRow = allRows[x];
    //prevRow is the row directly above the one that the loop is looking at
    var prevRow = allRows[x - 1];

    if(prevRow === undefined)
    {
      continue;
    }
    //if it has the colsinside attr, it's an original!
    if( (curRow.attr("original") ) )
    {
      var curRowPercentFilled = percentFilled(curRow);
      var prevRowPercentFilled = percentFilled(prevRow);
      var total = curRowPercentFilled + prevRowPercentFilled;

      if(total <= 100)
      {
        var lastChild = prevRow.find(":last-child");
        lastChild.prependTo(curRow);
        prevRow.remove();
      }
    }
    fixMargins(curRow);
  }

}

//function that centers rows that can't take anymore, but still aren't
//100% full
//can i use percentFilled() on this?
function centerRows()
{

  var colWidth = 0;
  var containerWidth = 0;
  var ratio = 0;
  var allColWidth = 0;
  var numCols = 0;
  //inside a container class, each fluid row...
  $(".container").children(".fluid").each(function(){
    //$this is now a row, now checking each column
    //get the number of children it has
    numCols = $(this).children().length;
    $(this).children(".column").each(function(){
      //find the width of the column (this)
      colWidth = $(this).width();
      //find the width of the window
      containerWidth = $(".container").width();
      //what percentage of the screen does it take up
      ratio = Math.ceil((colWidth/containerWidth) * 100);
      //adding to allColWidth in order to determine how full the row is
      allColWidth += ratio;
    });
    //the first child doesn't have a left margin, so the number of spaces
    //in the middle of columns are one less than the total # of cols
    numCols -= 1;
    //adding the margin widths to the total width...
    allColWidth += (2 * numCols);
    //finding the percentage needed to push the columns into the center
    var neededMargin = (100 - allColWidth)/2;
    //if the calculations come back with a negative number due to rounding,
    //this keeps it realistic
    if(neededMargin < 0)
    {
      neededMargin = 0;
    }
    //converting the margin into a css percentage
    marginString = (neededMargin) + "%";
    //changing the rows' first child left margin into the centering one
    $(this).find(":first-child").css({"margin-left":marginString});
    //resetting for next row
    allColWidth = 0;
  });
}

//function to mark original rows in order to keep layout
function rememberRows()
{
  //for every row...
  $(".container").children(".fluid").each(function(){
    //make it known that it is original
    $(this).attr("original", "yes");
  });
}

//function to check what percentage of a row is filled
function percentFilled(targetRow)
{
  var rowPercentFilled = 0;

  targetRow.children(".column").each(function(){
    //$this is now a column div

    //find the width of the column (this)
    colWidth = $(this).width();
    //find the width of the container (site width)
    containerWidth = $(".container").width();
    //what percentage of the screen does it take up
    ratio = Math.floor((colWidth/containerWidth) * 100);
    //adding the percentage of the column to the total percent filled
    rowPercentFilled += ratio;
  });

  var numCols = targetRow.children().length;
  //number of margins will be one less than total number of columns
  numCols -= 1;

  //adding the margin space to the total percent filled
  //would be nice if this value was a const, rather than just input (in case
  //somebody wants a different margin in between columns)
  rowPercentFilled += (2 * numCols);

  return rowPercentFilled;
}

function fixMargins(targetRow)
{
  var numChildren = 1;

  targetRow.children(".column").each(function(){
    $(this).css("margin-left", "");
  });
}
