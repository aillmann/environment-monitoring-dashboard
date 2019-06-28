$(document).ready( function() {
	console.log('jQuery has loaded');

	var redProducts = 0;
	var greenProducts = 0;
	var totalProducts = 0;
	var timeoutProducts = 0;

	// auto switch functinality
	$.ajax({
		url: '/api/envs', 
		success: function(data, textStatus, jqXHR) {
			var randEnvIndex = Math.floor((Math.random() * data.envs.count) + 1);
			if ( $('#rand-refresh-checkbox').prop('checked') ) {
				setTimeout(function() {
					window.location.href = '/environmentDashboard/' + data.envs.list[randEnvIndex];
				}, 120000);	
			}
		}
	});

	$('#rand-refresh-checkbox').change(function() {
			$.ajax({
			url: '/api/envs', 
			success: function(data, textStatus, jqXHR) {
				var randEnvIndex = Math.floor((Math.random() * data.envs.count) + 1);
				if ( $('#rand-refresh-checkbox').prop('checked') ) {
					window.location.href = '/environmentDashboard/' + data.envs.list[randEnvIndex];
				}
			}
		});
	});

	$.ajax({
		url: '/api/products?env=' + env,
		success: function(data, textStatus, jqXHR) {
			totalProducts = data.products.count;
			$('#total-products').html(totalProducts);
		}
	});

/*	setTimeout(function() {
		if ($('#overall-status').text() != 'Red') {
			$('#overall-status').html('<span class="badge badge-success">Green</span>');
		}
	}, 5000);*/

	$( ".product-list" ).each(function() {

		var product = $( this ).text()

		$.ajax({
			url: '/api/products/' + product + '?env=' + env + '&test=true', 
			success: function(data, textStatus, jqXHR) {
				// $('#'+product+'-status-cell').append('  --  status: ' + data.statusLabel + ', version: ' + data.version);
				var ver;
				(data.test.version) ? (ver = data.test.version) : (ver = 'unavailable')
				$('#'+product+'-details-cell').append('<a href="/products/' + product +'?env=' + env + '">Results</a>');
				$('#'+product+'-version-cell').html(ver);
				$('#'+product+'-link-cell').html(data.hostname);

				if (data.test.statusCode == 0) {
					$('#red-products').removeAttr('hidden');
					$('#overall-status').html('<span class="badge badge-danger">Red</span>');
					$('#red-products-list').append('<a class="list-group-item" href="#' + product +'-row"' + '>'+product+'</a>');

					redProducts++;
					$('#total-failed').html(redProducts);

					$('#'+product+'-status-cell').html('<span class="badge badge-danger">Red</span>')

				} else if ( data.test.statusCode == 2 ) {
					greenProducts++;
					$('#total-passed').html(greenProducts);

					$('#'+product+'-status-cell').html('<span class="badge badge-success">Green</span>')
				} else if ( data.test.statusCode == 10 ) {
					timeoutProducts++;
					$('#total-timeout').html(timeoutProducts);
					$('#'+product+'-status-cell').html('<span class="badge badge-warning">Timeout</span>')
				} 

				if (greenProducts >= totalProducts) {
					$('#overall-status').html('<span class="badge badge-success">Green</span>');
				} else if ( (greenProducts + redProducts + timeoutProducts) >= totalProducts && redProducts <= 0 ) {
					$('#overall-status').html('<span class="badge badge-warning">Warning</span>');
				}
			}
		});
	});

	$('#reload-button').click(function(){
		location.reload();
	});

	$('#index-button').click(function(){
		window.location.href='/'
	});
/*
	setTimeout(function() {
		location.reload();
	}, 30000);
*/
});