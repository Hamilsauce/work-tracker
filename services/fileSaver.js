import {
	csvToJson,
	arrayToCsv
} from './reformatData.js'

export const exportAsCsv = history => {
	const text = arrayToCsv(history);
	const filename = `work-history.csv`;
	const file = new Blob([text], { type: "application/json" })
	saveAs(file, filename)
}
export const exportAsJson = history => {
	const text = JSON.stringify(history,null, 2);
	const filename = `work-history.json`;
	const file = new Blob([text], { type: "application/json" })
	saveAs(file, filename)
}

{
	exportAsJson
}