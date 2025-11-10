import Color from "color";
import minimist from "minimist";
import { getAverageColor } from "fast-average-color-node";
import { Vibrant } from "node-vibrant/node";

const args = minimist(process.argv.slice(2));

export async function fetchImage() {
	const imgPath = args["i"];
	const vi = Vibrant.from(imgPath);

	const palette = await vi.getPalette();

	console.log("node vibrent");
	console.log(new Color(palette.Vibrant?.hex).hex());
	console.log(new Color(palette.DarkVibrant?.hex).hex());
	console.log("fast-average-color-node");
	console.log(new Color((await getAverageColor(imgPath)).hex).hex());
	console.log(
		new Color(
			(
				await getAverageColor(imgPath, {
					algorithm: "dominant",
				})
			).hex,
		).hex(),
	);
}
