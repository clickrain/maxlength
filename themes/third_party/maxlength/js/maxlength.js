(function() {
	// Initialize an <input> element with all of the maxlength magic.
	function prepareInput(input) {
		if (input.attr('data-maxlength')) {
			// If it's already been initialized, then carry on.
			return;
		}

		// Initialize the form, if necessary.
		var form = input.closest('form');
		if (form.length) {
			prepareForm(form);
		}

		// Create the HTML structure that we need to make this work.
		// <div class="maxlengthblock">
		//   <input>
		//   <span class="counteroverflow">
		//     <span class="counter">100</span>
		//   </span>
		// </div>
		var $maxlengthblock = $('<div>', {
			'class': 'maxlengthblock'
		});
		var $counteroverflow = $('<span>', {
			'class': 'counteroverflow'
		});
		var $counter = $('<span>', {
			'class': 'counter',
			'text': parseInt(input.attr('maxlength'), 10) - input.val().length
		});
		$counteroverflow.append($counter);
		$wrapped = input.wrap($maxlengthblock).parent();
		input.attr('data-maxlength', input.attr('maxlength'));
		input.removeAttr('maxlength');
		setTimeout(function() {
			// For whatever reason, Firefox removes the maxlength attribute,
			// but doesn't remove the actually maxlength code. So, set a small
			// timeout and try again.
			input.removeAttr('maxlength');
		}, 30);
		$wrapped.append($counteroverflow);

		// Update the count that shows in the counter, and the class of the
		// .maxlengthblock.
		function updateCount(input) {
			var maxlength = input.attr('data-maxlength');
			var $maxlengthblock = input.parent();
			var $counter = $maxlengthblock.find('.counter');
			var length = input.val().length;
			var remaining = maxlength - length;
			$counter.text(remaining);

			if (20 <= remaining) {
				$maxlengthblock.removeClass('level1 level2 overrun');
			}
			if (10 <= remaining && remaining < 20) {
				$maxlengthblock.addClass('level1');
				$maxlengthblock.removeClass('level2 overrun');
			}
			if (0 <= remaining && remaining < 10) {
				$maxlengthblock.addClass('level2');
				$maxlengthblock.removeClass('level1 overrun');
			}
			if (remaining < 0) {
				$maxlengthblock.addClass('overrun');
				$maxlengthblock.removeClass('level1 level2');
			}
		}

		input.on('focus', function(e) {
			// We can't reasonably capture pastes. So, we need to have a timer
			// going at a pretty decent interval, in case some text gets
			// pasted in.
			var intervalid = setInterval(function() {
				updateCount(input);
			}, 250);
			input.data('intervalid', intervalid);
			input.parent().addClass('focused');
		});

		input.on('blur', function(e) {
			// We don't want the timer going all the time. Shut it down when
			// its no longer valuable.
			clearInterval(input.data('intervalid'));
			input.parent().removeClass('focused');
		});

		input.on('keyup', function(e) {
			// Yeah, update the count anytime a key is pressed.
			updateCount(input);
		});

		// When we try to do a `input.wrap(...)` within a focus, then the
		// input doesn't actually get the focus. So, make sure to give the
		// input the focus.
		setTimeout(function() {
			input.focus();
		}, 30);
	}

	// Initialize a <form> element with all of the maxlength magic. Basically,
	// since there's no maxlength attribute anymore, we need to enforce the
	// maximum length through code.
	function prepareForm(form) {
		// If we've already initialized this form, then do nothing.
		if (form.attr('data-maxlength-enabled')) {
			return;
		}

		// We don't want to initialize the form twice, so note that we don't
		// need to do this again.
		form.attr('data-maxlength-enabled', true);

		form.on('submit', function(e) {
			// Find all of our items.
			var items = form.find('[data-maxlength]');

			// Go through all of the items, and if any of them is invalid,
			// focus it, stop looking, and report that we can't submit the
			// form.
			var allowSubmit = true;
			items.each(function() {
				var item = $(this);
				var maxlength = parseInt(item.attr('data-maxlength'), 10);
				if (item.val().length > maxlength) {
					allowSubmit = false;
					var parentTab = item.closest('.main_tab');
					tab_focus(parentTab.attr('id'));
					item.focus();
					return false;
				}
			});

			// If we can't submit the form, don't submit the form.
			if (!allowSubmit) {
				e.preventDefault();
			}
		});
	}

	// Whenever a text field with a maxlength gets focused, initialize it. We
	// don't want to just initialize all of them on load, because then we
	// would miss new grid rows, or any other text fields that get added
	// later.
	$(document).on('focus', '[maxlength]', function(e) {
		prepareInput($(this));
	});
})();
