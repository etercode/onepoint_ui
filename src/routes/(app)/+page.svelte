<script>
	/** Placeholder feed — replace with API data when crawler ships. */
	const placeholders = [
		{
			source: 'Reuters',
			initial: 'R',
			color: '#ff6b35',
			title: 'Markets steady as investors weigh central bank signals',
			time: '12m',
			excerpt: 'Global equities held firm as traders parsed the latest policy hints from major central banks.'
		},
		{
			source: 'BBC News',
			initial: 'B',
			color: '#bb1919',
			title: 'Regional summit opens with focus on trade and climate',
			time: '34m',
			excerpt: 'Leaders gathered for a two-day forum covering supply chains, emissions targets, and cross-border trade.'
		},
		{
			source: 'TechCrunch',
			initial: 'T',
			color: '#0a9e01',
			title: 'Startups push open models amid shifting regulation',
			time: '1h',
			excerpt: 'Founders are betting on transparent training data as lawmakers debate new AI compliance rules.'
		}
	];
</script>

<svelte:head>
	<title>Home — onepoint</title>
</svelte:head>

<div class="feed-layout">
	<aside class="feed-sidebar" aria-label="Filters">
		<div class="sidebar-card">
			<h2>Sources</h2>
			<p>Connect crawlers to filter your feed by publisher.</p>
			<button type="button" class="chip-btn chip-btn-active" disabled>All</button>
		</div>
	</aside>

	<div class="feed-main">
		<div class="feed-compose">
			<div class="compose-icon">📰</div>
			<div>
				<p class="compose-title">Your news feed</p>
				<p class="compose-sub">Stories from every source you follow — coming soon.</p>
			</div>
		</div>

		<ul class="post-list">
			{#each placeholders as item}
				<li class="post-card">
					<div class="post-avatar" style="--avatar-color: {item.color}">{item.initial}</div>
					<article class="post-body">
						<header class="post-header">
							<span class="post-source">{item.source}</span>
							<span class="post-dot">·</span>
							<time class="post-time">{item.time}</time>
						</header>
						<h2 class="post-title">{item.title}</h2>
						<p class="post-excerpt">{item.excerpt}</p>
						<div class="post-actions">
							<button type="button" class="post-action" disabled>Save</button>
							<button type="button" class="post-action" disabled>Share</button>
						</div>
					</article>
				</li>
			{/each}
		</ul>
	</div>
</div>
