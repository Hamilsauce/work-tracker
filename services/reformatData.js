// log last updated: 12.26.19 - refactored some for each loops into a map and reduce

//* mapDelimiter: attempts to map parameter string input for delimiter to a character;
const mapDelimiter = delimiter => {
	const del = delimiter.toLowerCase();
	let delim;
	if (del == '\t') {
		delim = '\t';
	} else if (del == ' ') {
		delim = ' ';
	} else if (del == ',') {
		delim = ',';
	} else {
		delim == del;
	}
	return delim;
}

//* convertToObjects: does all the record-by-record row-to-obj work; output: array of records as objects
const convertToObjects = (colNames, dataBody, delim) => {
	let recordsAsObjects = dataBody
		.map((row, i) => {
			const recordObj = row.split(delim)
				.reduce((record, recordFields) => {
					recordFields = recordFields.replace(/(\r\n|\n|\r)/gm, "");
					record[colNames[i]] = recordFields;
					return record;
				}, {});
			return recordObj;
		});
	return recordsAsObjects;
}

//* csvToJson: the module, provides interface/API layer for external use
export const csvToJson = (input, delimiter = 'comma') => {
	const csvToObjs = source => { //organizing function, maps API inputs with various function params
		let err = '';
		const delim = mapDelimiter(delimiter);
		if (delim === -1) {
			err = 'Error: invalid delimiter provided.';
			console.error(err);
			return err;
		} else {
			let dataBody = source.split('\n');
			const colNames = dataBody.shift().trim().split(delim);
			return convertToObjects(colNames, dataBody, delim);
		}
	}
	return JSON.stringify(csvToObjs(input), null, " ", 4);
}

export const arrayToCsv = (input, delimiter = 'comma') => {
	const csv = input
		.map(record => {
			const fields = Object.values(record)
				.map(f => { return `"${f}"` })
			const newRecord = fields.join(',')
			return newRecord
		})

	csv.unshift(Object.keys(input[0]))
	return csv.join("\n")
}

{
	csvToJson,
	arrayToCsv
}