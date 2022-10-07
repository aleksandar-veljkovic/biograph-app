import { sha3_256 } from 'js-sha3';
import {v4} from 'uuid';
import { escape } from 'sqlstring';
import fs from 'fs';

const regex = new RegExp(/[\0\x08\x09\x1a\n\r"'\\\%]/g)
const escaper = (char) => {
	const m = ['\\0', '\\x08', '\\x09', '\\x1a', '\\n', '\\r', "'", '"', "\\", '\\\\', "%"];
	const r = ['\\\\0', '\\\\b', '\\\\t', '\\\\z', '\\\\n', '\\\\r', "''", '""', '\\\\', '\\\\\\\\', '\\%'];
	return r[m.indexOf(char)];
};

class Utilities {
	static generateId() {
		return v4().replace(/\-/g,'');
	}

	static sha3(data) {
		return (sha3_256(JSON.stringify(data)));
	}

	static writeJsonArray(filePath, arr) {
		let content = '';
		for (const obj of arr) {
			content += `${JSON.stringify(obj)}\n`;
		}

		if (fs.existsSync(filePath)) {
			fs.appendFileSync(filePath, content)
		} else {
			fs.writeFileSync(filePath, content);
		}
	}

	static mysql_real_escape_string (str) {
    if (typeof str != 'string')
        return str;

		return Utilities.escapeSpecialChars(str);
	}

	static escapeSpecialChars = function(str) {
		return str.replace(/\\n/g, "\\n")
							 .replace(/\\'/g, "\\'")
							 .replace(/'/g, "\'\'")
							//  .replace(/"/g, "\\\"")
							 .replace(/\\"/g, '\\"')
							 .replace(/\\&/g, "\\&")
							 .replace(/\\r/g, "\\r")
							 .replace(/\\t/g, "\\t")
							 .replace(/\\b/g, "\\b")
							 .replace(/\\f/g, "\\f")
							 .replace(/\\_/g, "\\_")
							 .replace(/\\_/g, "\\_")
							 .replace(/\\Z/g, "\\Z")
							 .replace(/\\%/g, "\\%");
	};

	static escapeJson(obj) {
		return Utilities.escapeSpecialChars(JSON.stringify(obj));
	}

	static capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	static beautifyCamelCase(text) {
		return text.split('_').map(word => Utilities.capitalize(word)).join(' ');
	}
}

export default Utilities;