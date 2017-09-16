console.log("laoded chatai!");

const MAX_BOARD_SIZE = 10;

// This array will store all the open cards
var openCardArray = [];

// This array will look for matches
var matchedCardArray = [];

var turnsTaken = 0;
var matchedCards = 0;
var cardTurnSec = 6;

$(document).ready(function(){

	// Fill the dropdown to get board size
	for(var i=2; i<=MAX_BOARD_SIZE; i=i+2){
		var optionEle = '<option>' + i + '</option>';
		$('#game-inputs-container-size-select').append(optionEle);
	}


	// 'GO' click listener
	$('#game-inputs-container-go-btn').on('click', function(){

		// Reset the game-board
		$('#game-board').empty();
		openCardArray = [];
		matchedCardArray = [];
		turnsTaken = 0;
		matchedCards = 0;
		$('#turns-taken-count').text(turnsTaken);

		// Find board size
		var boardSize = $('#game-inputs-container-size-select').val();

		// Initialize matchedCardArray
		for(var i=1; i<=(boardSize*boardSize)/2; i++){
			matchedCardArray.push(0);
		}

		// Generate random card value sets
		var ar = generateRandomArray(boardSize);

		// Start the game
		initGameBoard(boardSize, ar);
	});

});

function generateRandomArray(val){
	console.log("generateRandomArray called");

	ar = [];
	for(var i=1; i<=val*val; i++){
		ar.push(i % ((val*val)/2) + 1);
	}

	return shuffle(ar);
}



function initGameBoard(val, randomArray){
	console.log("initGameBoard called");

	$('#game-board').css('width', 75*val + 'px');
	$('#game-board').css('height', 75*val + 'px');


	var count = 0;
	for(var i=0; i<val; i++){
		for(var j=0; j<val; j++){

			var ele = '<div id="flip-container-' + count + '" class="flip-container" data-count="' + randomArray[count] + '" onclick="onCardPress(this)"> \
					<div class="flipper"> \
						<div class="front"> \
						</div> \
						<div class="back"> \
							<span>'+ randomArray[count] +'</span> \
						</div> \
					</div>  \
				</div>';

			$('#game-board').append(ele);	

			count++;
		}
	}
}

function onCardPress(ele){	
console.log("onCardPress called");

	// Don't allow the user to reverse-flip the card
	if($(ele).hasClass('flip'))
		return;

	// Don't allow users to open more than 2 cards at once
	if(openCardArray.length > 1)
		return;

	// Push this card into open array, so that we can close it later on
	openCardArray.push(ele);
	$('#turns-taken-count').text(++turnsTaken);

	// Flip the card to show the number
	$(ele).toggleClass('flip');

	var cardValue = $(ele).data('count');
	var cardIndex = cardValue - 1;
	matchedCardArray[cardIndex]++;
	
	
	// If a second card is opened check for instant match
	if(openCardArray.length == 2){

		// Yes it's a match
		if(matchedCardArray[cardIndex] == 2){
			openCardArray.length = 0;
			matchedCards++;

			// Game winner ?
			if(matchedCards == matchedCardArray.length){
				swal('Good job!', 'You finished the game in ' + turnsTaken + ' chances', 'success');
			}
		}
		else{
			matchedCardArray.setAll(0);
		}

		// Take a second, and then flip back both the cards to resume game
		setTimeout(function(){

			var openCardArrayLen = openCardArray.length;

			while(openCardArray.length > 0){
				var ele = openCardArray.pop();
				$(ele).toggleClass('flip');
			}
		}, 1000);
		
	}
	else{
		setTimeout(function(){

			var pos = jQuery.inArray(ele, openCardArray);
			if( pos != -1){
				openCardArray.slice(pos, 1);
				$(ele).toggleClass('flip');
				if(matchedCardArray[cardIndex] != 0)
					matchedCardArray[cardIndex]--;
			}
		}, cardTurnSec*1000);
	}
}


