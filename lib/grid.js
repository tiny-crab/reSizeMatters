$(document).ready(function()
{
  rememberRows();
  checkWidthNew();
  centerRows();
  window.onresize = checkWidthNew;
});

function checkWidthNew()
{
  var allRows = [];

  //pushing all of the row objects into the array
  $(".container").children(".fluid").each(function(){
    $(this).push(allRows);
  });

  //in order to start at the bottom of the page
  allRows.reverse();

  for (var x = 0; x < allRows.length; x++)
  {
    var curRow = allRows[x];
    var rowAbove = allRows[x + 1];
    var rowPercentFilled = percentFilled(curRow);

    //while the row is too big
    while ( rowPercentFilled > 100 )
    {

      //if there is no row above or it's an original row
      if (rowAbove === undefined || rowAbove.attr("original"))
      {
        //create a new row above the current row
        newRow(curRow);
      }

      //get the first child of the too-big row
      var firstChild = curRow.find(":first-child");

      //always put the first child into the row above the too-big row
      breakOff(firstChild);
    }

    while ( rowPercentFilled <= 100 )
    {
      if (rowAbove === undefined || rowAbove.attr("original"))
      {
        break;
      }
      else
      {
        //getting the last child of the row above
        var lastChild = rowAbove.find(":last-child");
        //ratio of the lastchild to its row
        var lastChildRatio = Math.ceil(lastChild.width / rowAbove.width) * 100;

        //if the child was added, would it be less than 100% full?
        if ((rowPercentFilled + lastChildRatio) <= 100)
        {
          lastChid.prependTo(curRow);
        }
        else
        {
          break;
        }

      }
    }
  }
}


//function to check if the row is too full or not full enough
function checkWidth()
{
  var allRows = [];
  //pushing all of the row objects into the array
  $(".container").children(".fluid").each(function(){
    $(this).push(allRows);
  });
  //starting from the bottommost row
  for( var x = 0; x < allRows.length; x++)
  {
    //curRow is the iterated row
    var curRow = allRows[x];
    //prevRow is the row directly above it
    var prevRow = allRows[x-1];
    //finding the percentage filled of the curRow
    var rowPercentFilled = percentFilled(curRow);

    //if too full...
    if (rowPercentFilled > 100)
    {
      //and if the prevRow is an original row, or nonexistent
      if ( (prevRow.attr("original")) || prevRow === undefined)
      {
        //create a new row and add the first child of curRow to it
        breakOffNewRow(curRow.find(":first-child"));
      }
      //otherwise
      else
      {
        //getting the firstChild of curRow
        var firstChild = curRow.find(":first-child");
        //pushing the firstChild into the row above
        firstChild.appendTo(prevRow);
        //checking the prevRow now
        x -= 2;
      }
    }
  }

  centerRows();
}

//function that takes columns out of rows that are too full and adds
//a new row above it for the extra columns
function breakOffNewRow(targetColumn)
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
