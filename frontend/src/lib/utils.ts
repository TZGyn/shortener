import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { cubicOut } from 'svelte/easing'
import type { TransitionConfig } from 'svelte/transition'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

type FlyAndScaleParams = {
	y?: number
	x?: number
	start?: number
	duration?: number
}

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = {
		y: -8,
		x: 0,
		start: 0.95,
		duration: 150,
	},
): TransitionConfig => {
	const style = getComputedStyle(node)
	const transform = style.transform === 'none' ? '' : style.transform

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number],
	) => {
		const [minA, maxA] = scaleA
		const [minB, maxB] = scaleB

		const percentage = (valueA - minA) / (maxA - minA)
		const valueB = percentage * (maxB - minB) + minB

		return valueB
	}

	const styleToString = (
		style: Record<string, number | string | undefined>,
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str
			return str + `${key}:${style[key]};`
		}, '')
	}

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0])
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0])
			const scale = scaleConversion(
				t,
				[0, 1],
				[params.start ?? 0.95, 1],
			)

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t,
			})
		},
		easing: cubicOut,
	}
}

// type declaration are in ../app.d.ts
// this works because its imported in the root layout by other components
String.prototype.removeUnderscores = function () {
	return this.replace(/_/g, ' ')
}

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1)
}

Number.prototype.toDecimalPoint = function (decimal: number) {
	const decimalInInt = Math.round(decimal)

	const value = 10 ** decimalInInt

	return Math.round(this.valueOf() * value) / value
}

export const isAlphanumeric = (str: string) => {
	return str.match('^[A-Za-z0-9]+$')
}

// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
export function byteToHumanReadable(
	bytes: number,
	si = true,
	dp = 1,
) {
	const thresh = si ? 1000 : 1024

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B'
	}

	const units = si
		? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
	let u = -1
	const r = 10 ** dp

	do {
		bytes /= thresh
		++u
	} while (
		Math.round(Math.abs(bytes) * r) / r >= thresh &&
		u < units.length - 1
	)

	return bytes.toFixed(dp) + ' ' + units[u]
}
