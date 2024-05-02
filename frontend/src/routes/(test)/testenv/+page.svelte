<script>
	import { PUBLIC_SHORTENER_URL } from '$env/static/public'
	import { env } from '$env/dynamic/public'
</script>

<div>{PUBLIC_SHORTENER_URL}</div>
<div>Dynamic env: {env.PUBLIC_SHORTENER_URL}</div>
