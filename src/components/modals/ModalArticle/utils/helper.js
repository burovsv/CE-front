import * as mammoth from 'mammoth/mammoth.browser.js';
import moment from 'moment';

export const formats = ['font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'script', 'header', 'blockquote', 'code-block', 'indent', 'list', 'direction', 'align', 'link', 'image', 'video', 'formula'];

export const ext = (name) => name.match(/\.([^.]+)$/)?.[1];

export function parseWordDocxFile(element, setValue) {
    if (!element) return;
    const file = element;

    console.time();
    var reader = new FileReader();
    reader.onloadend = function (event) {
        var arrayBuffer = reader.result;
        // debugger
        mammoth
            .convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function (resultObject) {
                const rendered = resultObject.value;
                setValue(rendered)
            });
        console.timeEnd();
    }
    reader.readAsArrayBuffer(file);
}
export const uploadTextFileInputChange = (e, setAdditionDocDesc) => {
    let file = e.target.files[0];
    const format = ext(file.name);
    if (format !== 'docx') return;
    parseWordDocxFile(file, setAdditionDocDesc);
}

export const getElementByFormat = (file, additionDocDesc, textFileName) => {
    const format = ext(file.name);
    // let el = {}
    if (format === 'docx') {
        const content = (additionDocDesc) ? additionDocDesc : file;
        const fileContent = new File([content], "text.txt", { type: "text/plain" })
        return {
            name: textFileName,
            content: fileContent,
            type: 'docx',
        }
    } else if (format === 'pdf') {
        return {
            name: textFileName,
            content: file,
            type: 'pdf',
        }
    } else {
        return null
    }
}