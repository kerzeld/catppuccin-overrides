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
		hsv: [
			{
				base: {
					h: 340,
					s: 45,
					v: 95,
				},
				overrides: {
					...baseHSVOverrides,
					pink: {},
				},
			},
		],
	},
};

const yellowTheme: ITheme = {
	name: "yellow",
	accent: "yellow",
	overrides: {
		hsv: [
			{
				base: {
					h: 50,
					s: 45,
					v: 90,
				},
				overrides: {
					...baseHSVOverrides,
					yellow: {},
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

const lemonTheme: ITheme = {
	name: "lemon",
	accent: "green",
	overrides: {
		hsv: [
			{
				base: {
					h: 70,
					s: 50,
					v: 95,
				},
				overrides: {
					...baseHSVOverrides,
					green: {},
				},
			},
		],
	},
};

const redTheme: ITheme = {
	name: "red",
	accent: "red",
	overrides: {
		hsv: [
			{
				base: {
					h: 0,
					s: 45,
					v: 95,
				},
				overrides: {
					...baseHSVOverrides,
					red: {},
				},
			},
		],
	},
};

const greenTheme: ITheme = {
	name: "green",
	accent: "green",
	overrides: {
		hsv: [
			{
				base: {
					h: 120,
					s: 45,
					v: 95,
				},
				overrides: {
					...baseHSVOverrides,
					green: {},
				},
			},
		],
	},
};

export const themes = {
	pink: pinkTheme,
	yellow: yellowTheme,
	orange: orangeTheme,
	lemon: lemonTheme,
	red: redTheme,
	green: greenTheme,
};
