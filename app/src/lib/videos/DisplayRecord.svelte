<script lang="ts">
	export let record: Video;
	let recordVideoEmbedCode: string | undefined;
	if (record.youtube_video_URL.includes('www.youtube.com/watch?v=')) {
		recordVideoEmbedCode = record.youtube_video_URL.split('www.youtube.com/watch?v=')[1];
	}
</script>

<div class="w-full">
	<h1>{record.name}</h1>
	<iframe
		width="876"
		height="493"
		src="https://www.youtube.com/embed/{recordVideoEmbedCode}"
		title="a video from youtube"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>

	<p>{record.description || 'No description'}</p>
</div>
