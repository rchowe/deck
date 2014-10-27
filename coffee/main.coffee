
cards = null
window.shoe = []
shoe = window.shoe
requirements = {}

update_options = ->
	''' Update settings for the configuration panel. '''

	# Update the requirements list.
	for card, index in cards
		continue if 'requirements' not of card
		for req in card.requirements
			if req not of requirements
				requirements[req] = []
			requirements[req].push(index)

	# Sort the arguments
	keys = (req for req of requirements)
	keys.sort()

	for key in keys
		out = '<ul class = "cards-affected">'
		ids = requirements[key]
		for id in ids
			out += '<li>' + cards[id].title + '</li>'
		out += '</ul>'

		$('#card-options').append("<label class = 'checkbox inline'><input type = 'checkbox' checked = 'true' id = '#{key}'/>#{key}<div class = 'help-block'>#{out}</div></label>")

window.draw_card = ->
	''' Draw a card, triggered when the user presses the draw card button. '''

	# Load cards, if necessary
	if not cards?
		xhr = new XMLHttpRequest
		xhr.onreadystatechange = ->
			if xhr.readyState == 4
				cards = jsyaml.load(xhr.responseText).cards
				if cards?
					update_options()
					draw_card()
				else
					alert('Error loading cards.')
					return
		xhr.open 'GET', 'cards.yaml', true
		xhr.send()
		return

	# Generate the deck, if necessary
	if shoe.length == 0
		try
			dt = ((new Date()) - (new Date(localStorage.getItem('shoe_date')))) / 1000.0
			if dt < 60 * 60 * 24
				console.log('Loading shoe from local storage (HTML5).')
				shoe = (parseInt(x) for x in localStorage.getItem('shoe').split(' '))
			else
				shoe = (index for _, index in cards)
		catch
			shoe = (index for _, index in cards)

	# Shuffle the deck
	shoe = shuffle shoe

	# TODO: Fix Requirements Behavior/With Replacement
	index = 0
	if is_with_replacement()
		index = shoe[0]
	else
		while true
			index = shoe.pop()
			if 'requirements' of cards[index]
				for req in cards[index].requirements
					e = document.getElementById(req)
					if e? and not e.checked
						continue
			break

	# Save the shoe to local storage, if available
	try
		localStorage.setItem('shoe', shoe.join(' '))
		localStorage.setItem('shoe_date', new Date().toString())
	catch
		console.warn('Local Storage Error')

	# Update the card
	card = cards[index]
	$('#card-title').html(card.title)
	text = card.text
	text.replace('\n', '<br/>')
	$('#card-text').html(text)
	if 'flavor_text' of card
		$('#card-flavor-text').html(card.flavor_text)
	else
		console.log('No Flavor Text')
		$('#card-flavor-text').html('')

is_with_replacement = ->
	''' Gets the configuration setting specifying whether to draw cards with replacement or not. '''
	$('input[name="draw-style"]:checked').val() == 'replacement'

shuffle = (array) ->
	''' Shuffles an array in-place. '''
	index = array.length

	while index != 0
		rIndex = Math.floor(Math.random() * index)
		index -= 1

		temp = array[index]
		array[index] = array[rIndex]
		array[rIndex] = temp

	return array
