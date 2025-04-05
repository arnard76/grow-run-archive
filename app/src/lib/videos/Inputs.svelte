<script lang="ts">
	export let record: Video;
</script>

<input type="text" bind:value={record.name} placeholder="Name your video" />
<textarea bind:value={record.description} placeholder="Enter a video description" />
<input type="text" bind:value={record.youtube_video_URL} placeholder="Paste a link to your video" />
