import { defineConfig, presetIcons, presetUno } from 'unocss'
import extractorPug from '@unocss/extractor-pug'
export default defineConfig({
	presets: [
		presetUno(),
		presetIcons(),
	],
	extractors: [
		extractorPug()
	]
})