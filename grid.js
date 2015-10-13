$(document).ready(function()
{
  //marks all rows that are direct children of the container div
  rememberRows($(".container"));
  //indirectly checks all rows that are direct children of the container div
  centerRows($(".container"));
  //every time the window changes size, the rows are checked
  window.onresize = findRows;
});

//function that calls checkWidth for the container div because of .onresize stupidity
function findRows()
{
  checkWidth($(".container"));
}

//push a selector into this function (carrying fluid rows)
//this function makes sure that the rows inside are holding all they can
function checkWidth(layer)
{
  //array to hold all arrays in this layer
  var rowArray = [];

  //pushing all of the row objects into the array
  layer.children(".fluid").each(function(){
    rowArray.push($(this));
  });

  //in order to start at the bottom of the page
  rowArray.reverse();

  //iterating through each row at a time
  for (var x = 0; x < rowArray.length; x++)
  {
    //the row the loop is looking at (starting from bottommost row on the page)
    var curRow = rowArray[x];
    //the row directly above the curRow
    var rowAbove = rowArray[x + 1];
    //a var with a percentage of how full the row is
    var rowPercentFilled = percentFilled(curRow);

    //recursion to search through this row and find if it has rows inside
    //check each of this row's columns...
    curRow.children(".column").each(function(){
      //and if they contain a fluid row
      if( $(this).find(".fluid").length !== 0 )
      {
        //recursion!! I love recursion
        checkWidth($(this));
      }
    });

    //while the row is too big (checking to remove children into new row)
    while ( rowPercentFilled > 100 )
    {
      //if there is no row above or it's an original row
      if (rowAbove === undefined || rowAbove.attr("original"))
      {
        //create a new row above the current row
        rowAbove = newRow(curRow);
      }

      //get the first child of the too-big row
      var firstChild = curRow.find(".column").first();

      //always put the first child into the row above the too-big row
      breakOff(firstChild, rowAbove);

      //refreshing the check value
      rowPercentFilled = percentFilled(curRow);
    }

    //while the row is too small (checking to pull children from rows above)
    while ( rowPercentFilled < 100)
    {
      //if the row above it is undefined or it is an original row
      if (rowAbove === undefined || rowAbove.attr("original"))
      {
        //break out of loop
        break;
      }
      else
      {
        //getting the last child of the row above
        var lastChild = rowAbove.find(".column").last();
        //ratio% of the lastchild to its row
        var lastChildRatio = ( lastChild.width() / rowAbove.width() ) * 100;

        //if the child was added, would it be less than 100% full?
        if ((rowPercentFilled + lastChildRatio) <= 100)
        {
          //since the last child can fit, prepend it
          lastChild.prependTo(curRow);

          //delete the rowAbove if it has no children anymore
          if(rowAbove.children().length === 0)
          {
            rowAbove.remove();
          }

          //refreshing the check value
          rowPercentFilled = percentFilled(curRow);
        }
        else
        {
          //otherwise break out of the loop
          break;
        }

      }

    }

    //using this to reset the layer and go again
    rowArray = [];

    //pushing all of the row objects into the array
    layer.children(".fluid").each(function(){
      rowArray.push($(this));
    });

    //in order to start at the bottom of the page
    rowArray.reverse();
  }
  fixMargins($(".container"));
  centerRows($(".container"));
}

//function to create a new row on top of the row object passed to it
function newRow(targetRow)
{
  var classOfRow = targetRow.attr("class");

  //creating a new template for the new row to insert the column into
  var newRow = $("<div>").addClass(classOfRow);
  //add a new row above the parent row
  targetRow.before(newRow);
  //passing the newly constructed object back so breakOff() can use it as a parameter
  return newRow;
}

//function to take children from overfull rows and put them into the row above
function breakOff(targetColumn, targetRow)
{
  //resetting the margins of the column, in case it was already checked previously
  targetColumn.css({"margin-left":"0", "margin-right":"0"});

  //pull targeted column out
  targetColumn.detach();
  //push into the newly created row
  targetColumn.appendTo(targetRow);
}

//function that centers rows that can't take anymore, but still aren't
//100% full
//can i use percentFilled() on this?
function centerRows(layer)
{

  var colWidth = 0;
  var layerWidth = 0;
  var ratio = 0;
  var allColWidth = 0;
  var numCols = 0;
  //inside a container class, each fluid row...
  layer.children(".fluid").each(function(){
    //$this is now a row, now checking each column

    //checking each of this row's children to see if it holds more rows
    $(this).children(".column").each(function(){

      //if THIS column has fluid rows inside of it,
      if( $(this).find(".fluid").length != 0 )
      {
        //recurse!
        centerRows($(this));
      }

    });

    //get the number of children it has
    numCols = $(this).children().length;

    $(this).children(".column").each(function(){
      //find the width of the column (this)
      colWidth = $(this).width();
      //find the width of the window
      layerWidth = layer.width();
      //what percentage of the screen does it take up
      ratio = Math.ceil((colWidth/layerWidth) * 100);
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
    $(this).find(":first").css({"margin-left":marginString});
    //resetting for next row
    allColWidth = 0;
  });

}

//function to mark original rows in order to keep layout
function rememberRows(layer)
{
  //for every row...
  layer.children(".fluid").each(function(){

    //checking this row to see if it has rows inside
    $(this).children(".column").each(function(){

      //if it does,
      if( $(this).find(".fluid").length != 0 )
      {
        //recurse!
        rememberRows($(this));
      }

    });

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
    var colWidth = $(this).outerWidth();
    //find the width of the container (site width)
    var windowWidth = ($(".container")).width();
    //what percentage of the screen does it take up
    ratio = ((colWidth/windowWidth) * 100);
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

//function to fix spacing with new children in correctly condensed rows
function fixMargins(layer)
{
  //for all rows in this layer
  layer.children(".fluid").each(function(){
      //and for all columns in this row
      $(this).children(".column").each(function(){
        //check if there are rows inside of this column
        if( $(this).find(".fluid").length != 0 )
        {
          //recurse!
          fixMargins($(this));
        }

        //just fix the margins inside this row
        $(this).css("margin-left", "");

      });
  });
}
