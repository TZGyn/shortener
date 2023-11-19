<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { formSchema, type FormSchema } from '../schema'
	import type { SuperValidated } from 'sveltekit-superforms'

	export let form: SuperValidated<FormSchema>
	export let isLoading: boolean = false
</script>

<Form.Root method="POST" {form} schema={formSchema} let:config>
	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label>Email</Form.Label>
			<Form.Input
				disabled={isLoading}
				placeholder="name@example.com" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="password">
		<Form.Item>
			<Form.Label>Password</Form.Label>
			<Form.Input
				disabled={isLoading}
				type="password"
				placeholder="••••••••" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button disabled={isLoading} class="w-full"
		>Sign In</Form.Button>
</Form.Root>
