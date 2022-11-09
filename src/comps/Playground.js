import React from 'react';
import { Proskomma } from 'proskomma';
import {doRender, configIssues} from 'proskomma-render-pdf';


const pk = new Proskomma();
const sTagRegex = /\\s5\s/g;

export default class Playground extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            result: '',
            files: ''
        }
    }

    queryPk = async function (query) {
        const result = await pk.gqlQuery(query);
        const data = JSON.stringify(result, null, 2);
        console.log(data);
        return data;
    }

    setupPoskomma(data) {
        const mutationQuery = `mutation { addDocument(` +
            `selectors: [{key: "lang", value: "eng"}, {key: "abbr", value: "ust"}], ` +
            `contentType: "usfm", ` +
            `content: """${data}""") }`;

        this.queryPk(mutationQuery)
            .then(result => console.log(result + '\n\n'));

    }


    fileInput(event) {
        const myThis = this;
        const fileList = event.target.files;
        const fileReader = new FileReader();
        console.log(fileList);
        let fileNames = this.state.files;

        fileReader.onload = function () {
            const usfm = fileReader.result.replaceAll(sTagRegex, ''); // remove \s5 tags
            myThis.setState({ result: usfm });
            myThis.setupPoskomma(usfm);

            const newFileNames = Array.from(fileList).map(f => f.name);
            newFileNames.forEach(name => fileNames += '\n' + name);

            myThis.setState({
                files: fileNames
            });
        }
        fileReader.readAsText(fileList[0]);
    }

    submit() {
        const text = document.querySelector(".query-input").value;
        this.queryPk(text)
            .then(res =>
                this.setState({ result: res })
            );

    }

    copyToClipboard() {
        const copyText = this.state.result;
        navigator.clipboard.writeText(copyText);
    }

    keyDown(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            const dom = e.target;

            var start = dom.selectionStart;
            var end = dom.selectionEnd;
            const space = "  ";
            dom.value = dom.value.substring(0, start) + space + dom.value.substring(end);
      
          // put caret at right position again
            dom.selectionStart = dom.selectionEnd = start + space.length;

        }

        if (e.key == 'Enter' && e.ctrlKey) {
            this.submit();
        }

    }

    render() {
        return (
            <div>
                <div className='top-pane'>
                    <h3>USFM GraphQL tool</h3>
                </div>
                <hr />
                <div className='main-body'>
                    <span className="upload-header">Upload .usfm file: </span>
                    <input type="file" id="file-picker" onChange={(e) => this.fileInput(e)} />
                    <div className="split-container">
                        <div className='input'>
                            <h4>Query: </h4>
                            <sup>(tab indent supported)</sup>
                            <textarea className="query-input" onKeyDown={(e) => this.keyDown(e)}></textarea>
                            <br />
                            <button className="submit-button" onClick={() => this.submit()}>
                                Execute (Ctrl + Enter)
                            </button>
                            <br />
                            <h4>Files loaded:</h4>
                            <pre className='files-loaded'>{this.state.files}</pre>
                            <div className='footer'>
                                <sup>
                                    See documentations at: <a href="https://doc.proskomma.bible/en/latest/getting_started/tutorials/hello.html#querying-scripture">
                                        read the doc
                                    </a> and <a href="https://doc.proskomma.bible/en/latest/_static/schema/document.doc.html">
                                        GraphQL Schema for usfm
                                    </a>
                                </sup>
                            </div>
                        </div>
                        <pre id="output">{this.state.result}</pre>
                        <button className="copy-clipboard-btn" onClick={() => this.copyToClipboard()}>Copy</button>
                    </div>
                </div>
            </div>
        )
    }
}
