
var cards = null;
var numbersDrawn = [];
var requirements = {};

function updateOptions() {
	for ( var i = 0; i < cards.length; i++ ) {
		if ( 'requirements' in cards[i] )
		{
			reqs = cards[i]['requirements'];
			for ( var j = 0; j < reqs.length; j++ ) {
				if ( ! (reqs[j] in requirements) ) {
					requirements[reqs[j]] = [];
				}
				requirements[reqs[j]].push( i );
			}
		}
	}

	// Sort the arguments
	keys = [];
	for ( var req in requirements ) {
		keys.push(req);
	}
	keys.sort();

	for ( var i = 0; i < keys.length; i++ ) {
		out = '<ul class = "cards-affected">';
		var ids = requirements[keys[i]];
		for ( var j = 0; j < ids.length; j++ )
		{
			out += '<li>' + cards[ids[j]]['title'] + '</li>';
		}
		out += '</ul>';
		$('#card-options').append('<label class = "checkbox inline"><input type = "checkbox" checked = "true" id = "' + keys[i] + '"/>' + keys[i] + ' <div class = "help-block">' + out + '</div></label>');
	}
}

function drawCard()
{
	// Load cards if necessary
	if ( cards == null )
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if ( xhr.readyState == 4 ) {
				cards = jsyaml.load( xhr.responseText )['cards'];
				if ( cards != null )
				{
					updateOptions();
					drawCard();
				}
				else
					alert('Error loading cards.');
			}
		};
		xhr.open('GET', 'cards.yaml', true );
		xhr.send();
		return;
	}

	if ( numbersDrawn.length == 0 ) {
		for ( var i = 0; i < cards.length; i++ ) {
			numbersDrawn.push(i);
		}
	}

	numbersDrawn = shuffle( numbersDrawn );
	var number = 0;
	if ( isWithReplacement() ) {
		number = numbersDrawn[0];
	}
	else {
		while ( true ) {
			number = numbersDrawn.pop();
			if ( 'requirements' in cards[number] ) {
				for ( var i in cards[number]['requirements'] ) {
					var req = cards[number]['requirements'][i];
					if ( document.getElementById(req) != null && ! document.getElementById(req).checked )
					{
						continue;
					}
				}
			}
			break;
		}
	}

	document.getElementById('card-title').innerHTML = cards[number]['title'];
	text = cards[number]['text'];
	text.replace('\n', '<br/>')
	document.getElementById('card-text').innerHTML = text;
	if ( 'flavor_text' in cards[number] ) {
		document.getElementById('card-flavor-text').innerHTML = cards[number]['flavor_text'];
	}
	else {
		document.getElementById('card-flavor-text').innerHTML = '';
	}
}

function isWithReplacement() {
	return $('input[name="draw-style"]:checked').val() == 'replacement';
}

function shuffle( array ) {
	var index = array.length;
	var temp, rIndex;

	while ( 0 != index ) {
		rIndex = Math.floor( Math.random() * index );
		index -= 1;

		temp = array[index];
		array[index]  = array[rIndex];
		array[rIndex] = temp;
	}

	return array;
}
