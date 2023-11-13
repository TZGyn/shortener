<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { formSchema, type FormSchema } from '../schema'
	import type { SuperValidated } from 'sveltekit-superforms'

	export let form: SuperValidated<FormSchema>
</script>

<Form.Root method="POST" {form} schema={formSchema} let:config>
	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label>Email</Form.Label>
			<Form.Input placeholder="name@example.com" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="password">
		<Form.Item>
			<Form.Label>Password</Form.Label>
			<Form.Input type="password" placeholder="••••••••" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="password_confirm">
		<Form.Item>
			<Form.Label>Password Confirm</Form.Label>
			<Form.Input type="password" placeholder="••••••••" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button class="w-full">Sign Up</Form.Button>
</Form.Root>
