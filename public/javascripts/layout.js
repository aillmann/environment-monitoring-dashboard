$(document).ready( function() {
	console.log('jQuery has loaded');

	$.ajax({
		url: '/api/envs',
		success: function(data, textStatus, jqXHR) {
			console.log(data.envs.list);
			data.envs.list.forEach(function(env) {
				$("#navbar-env-dropdown").append(
					'<a class="dropdown-item" href="/environmentDashboard/' + env + '">' + env + '</a>')});
		}
	});
});