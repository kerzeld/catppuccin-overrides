import type { ITheme } from "./interfaces.ts";

const baseHSVOverrides = {
	text: {
		s: 10,
		v: 95,
	},
	subtext1: {
		s: 10,
		v: 90,
	},
	subtext0: {
		s: 10,
		v: 85,
	},
	overlay2: {
		s: 10,
		v: 70,
	},
	overlay1: {
		s: 10,
		v: 65,
	},
	overlay0: {
		s: 10,
		v: 60,
	},
	surface2: {
		s: 10,
		v: 50,
	},
	surface1: {
		s: 10,
		v: 45,
	},
	surface0: {
		s: 10,
		v: 40,
	},
	base: {
		s: 10,
		v: 22,
	},
	mantle: {
		s: 10,
		v: 19,
	},
	crust: {
		s: 10,
		v: 16,
	},
};

const pinkTheme: ITheme = {
	name: "pink",
	accent: "pink",
	overrides: {
		hex: {
			pink: "#f285aa",
			text: "#f2dae2",
			subtext1: "#e6cfd6",
			subtext0: "#d9c3ca",
			overlay2: "#b3a1a7",
			overlay1: "#a6959b",
			overlay0: "#998a8f",
			surface2: "#807377",
			surface1: "#73676b",
			surface0: "#665c5f",
			base: "#383234",
			mantle: "#302c2d",
			crust: "#292526",
		},
		hsv: [
			{
				base: {
					h: 340,
					s: 35,
					v: 95,
				},
				overrides: {
					...baseHSVOverrides,
				},
			},
		],
	},
};

const yellowTheme: ITheme = {
	name: "yellow",
	accent: "yellow",
	overrides: {
		hex: {
			yellow: "#e6d99c",
			text: "#f2eeda",
			subtext1: "#e6e2cf",
			subtext0: "#d9d5c3",
			overlay2: "#b3b0a1",
			overlay1: "#a6a395",
			overlay0: "#99968a",
			surface2: "#807d73",
			surface1: "#737167",
			surface0: "#66645c",
			base: "#383732",
			mantle: "#30302c",
			crust: "#292825",
		},
		hsv: [
			{
				base: {
					h: 50,
					s: 32,
					v: 90,
				},
				overrides: {
					...baseHSVOverrides,
				},
			},
		],
	},
};

const orangeTheme: ITheme = {
	name: "orange",
	accent: "peach",
	overrides: {
		hsv: [
			{
				base: {
					h: 13,
					s: 45,
					v: 95,
				},
				overrides: {
					...baseHSVOverrides,
					peach: {},
				},
			},
		],
	},
};

export const themes = {
	pink: pinkTheme,
	yellow: yellowTheme,
	orange: orangeTheme,
};
