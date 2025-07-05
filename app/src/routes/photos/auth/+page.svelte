<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	$: if (browser) {
		if (!localStorage.getItem('photos_access_token')) goto('/photos');

		window.location =
			'https://accounts.google.com/o/oauth2/v2/auth?' +
			new URLSearchParams({
				client_id: '32095394806-j1j5e8q8einaojcll3rcbhn3imtsahnh.apps.googleusercontent.com',
				redirect_uri: 'https://localhost:5173/photos/authcomplete',
				response_type: 'token',
				state: 'state_parameter_passthrough_value',
				scope:
					'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata'
			});
	}
</script>
