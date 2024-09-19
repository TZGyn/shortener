<script lang="ts">
	import * as Select from '$lib/components/ui/select'
	import * as Pagination from '$lib/components/ui/pagination'

	export let perPage: number
	export let page: number
	export let total: number
	export let path: string

	const updateSearchParam = (
		params: { name: string; value: any }[],
	) => {
		const urlParams = new URLSearchParams(window.location.search)
		params.map(({ name, value }) => {
			if (value) {
				urlParams.set(name, value)
			} else {
				urlParams.delete(name)
			}
		})
		const searchParams = urlParams.toString()
		if (searchParams) {
			return `${path}?` + searchParams
		} else {
			return path
		}
	}
</script>

<div class="flex items-center justify-between border-t p-4">
	<Select.Root
		selected={{ label: perPage.toString(), value: perPage }}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Page Size" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Page Size</Select.Label>
				{#each [12, 24, 48, 96] as pageSize}
					<a
						href={updateSearchParam([
							{
								name: 'perPage',
								value: pageSize,
							},
							{
								name: 'page',
								value: 1,
							},
						])}>
						<Select.Item value={pageSize} label={pageSize.toString()}>
							{pageSize}
						</Select.Item>
					</a>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="favoriteFruit" />
	</Select.Root>
	{#if total > 0}
		<Pagination.Root
			class="items-end"
			count={total}
			{page}
			{perPage}
			let:pages
			let:currentPage>
			<Pagination.Content>
				{#if page <= 1}
					<Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item>
				{:else}
					<a
						href={updateSearchParam([
							{
								name: 'page',
								value: page - 1,
							},
						])}>
						<Pagination.Item>
							<Pagination.PrevButton />
						</Pagination.Item>
					</a>
				{/if}
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<a
							href={updateSearchParam([
								{
									name: 'page',
									value: page.value,
								},
							])}>
							<Pagination.Item>
								<Pagination.Link
									{page}
									isActive={currentPage == page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						</a>
					{/if}
				{/each}
				{#if page >= total / perPage}
					<Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item>
				{:else}
					<a
						href={updateSearchParam([
							{
								name: 'page',
								value: page + 1,
							},
						])}>
						<Pagination.Item>
							<Pagination.NextButton />
						</Pagination.Item>
					</a>
				{/if}
			</Pagination.Content>
		</Pagination.Root>
	{/if}
</div>
