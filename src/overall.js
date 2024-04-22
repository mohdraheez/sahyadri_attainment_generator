import React from "react";
import { useState } from "react";
import * as XLSX from 'xlsx';


var coAttain = [[1.8], [1.8], [1.8], [1.8], [1.8]]
var attainmentData = [["COs", "Assigned Target Level", "Internal Direct Attainment", "SEE Direct Attainment", "Overall Direct Attainment", "Indirect Attainment", "Final Attainment"], [1, 0, 0, 0, 0, 0, 0], [2, 0, 0, 0, 0, 0, 0], [3, 0, 0, 0, 0, 0, 0], [4, 0, 0, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0, 0]]
function Overall() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [file4, setFile4] = useState(null);
    const [tableStyles, setTableStyles] = useState({ 'visibility': 'hidden' });
    const [refreshStyle, setrefreshStyle] = useState({ 'visibility': 'hidden' });


    function findAttain(index, val) {
        coAttain[index][1] = Math.round(((0.6 * val[0][4][index + 1]) + (0.4 * val[1][4][index + 1])) * 10) / 10;
        coAttain[index][2] = val[2][4][index + 1];
        coAttain[index][3] = Math.round(((0.5 * coAttain[index][1]) + (0.5 * coAttain[index][2])) * 10) / 10;
        coAttain[index][4] = val[3][2][index + 1];
        coAttain[index][5] = Math.round(((0.8 * coAttain[index][3]) + (0.2 * coAttain[index][4])) * 10) / 10;
    }
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    function handleExcelSubmit(e) {
        e.preventDefault();
        if (!file1 || !file2 || !file3 || !file4) {
            alert("Please select the file.");
            return;
        }

        setrefreshStyle({ 'visibility': 'visible' })


        const processFile = async (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const binaryString = e.target.result;
                    const workbook = XLSX.read(binaryString, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    if (!worksheet || Object.keys(worksheet).length === 0) {
                        console.log("Worksheet is empty or doesn't exist.");
                        resolve(null);
                        return;
                    }

                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    resolve(jsonData);
                };
                reader.readAsBinaryString(file);
            });
        };

        const processFiles = async (files) => {
            const jsonDataArray = [];

            for (const file of files) {
                const jsonData = await processFile(file);
                jsonDataArray.push(jsonData);

                // Add a delay of 500 milliseconds between processing each file
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Log all processed data
            console.log("All files processed:");
            console.log(jsonDataArray);

            // Process the data further as needed
            findAttain(0, jsonDataArray);
            findAttain(1, jsonDataArray);
            findAttain(2, jsonDataArray);
            findAttain(3, jsonDataArray);
            findAttain(4, jsonDataArray);
            for (let i = 0; i < 6; i++) {
                attainmentData[1][i + 1] = (coAttain[0][i]);
            }
            for (let i = 0; i < 6; i++) {
                attainmentData[2][i + 1] = (coAttain[1][i]);
            }
            for (let i = 0; i < 6; i++) {
                attainmentData[3][i + 1] = (coAttain[2][i]);
            }
            for (let i = 0; i < 6; i++) {
                attainmentData[4][i + 1] = (coAttain[3][i]);
            }
            for (let i = 0; i < 6; i++) {
                attainmentData[5][i + 1] = (coAttain[4][i]);
            }
            console.log(attainmentData);
            setTableStyles({ 'visibility': 'visible' });
            setrefreshStyle({ 'visibility': 'hidden' })

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(attainmentData);

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

            const fileName = 'COs Attainment.xlsx';
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        };

        // Call processFiles once with all files
        processFiles([file1, file2, file3, file4]);
    }


    const handleFile1Change = (e) => {
        const selectedFile = e.target.files[0];
        setFile1(selectedFile);
    };
    const handleFile2Change = (e) => {
        const selectedFile = e.target.files[0];
        setFile2(selectedFile);
    };
    const handleFile3Change = (e) => {
        const selectedFile = e.target.files[0];
        setFile3(selectedFile);
    };
    const handleFile4Change = (e) => {
        const selectedFile = e.target.files[0];
        setFile4(selectedFile);
    };

    return (
        <div className="overallDiv mainContentDiv">
            <div className="refresh-icon" style={refreshStyle}></div>

            <div className="refresh-back" style={refreshStyle}></div>
            <div className="overallSubDiv">
                <h2>Final Co Attainment</h2>
                <form onSubmit={handleExcelSubmit} className="inputExcelForm finalForm">
                    <label for="excelFile1">Upload Internal Co Attainment:</label>
                    <input type="file" id="excelFile1" name="excelFile1" accept=".xlsx, .xls" onChange={handleFile1Change} />

                    <label for="excelFile2">Upload Assignment Co Attainment:</label>
                    <input type="file" id="excelFile2" name="excelFile2" accept=".xlsx, .xls" onChange={handleFile2Change} />

                    <label for="excelFile3">Upload External Co Attainment:</label>
                    <input type="file" id="excelFile3" name="excelFile3" accept=".xlsx, .xls" onChange={handleFile3Change} />

                    <label for="excelFile4">Upload Feedback Co Attainment:</label>
                    <input type="file" id="excelFile4" name="excelFile4" accept=".xlsx, .xls" onChange={handleFile4Change} />

                    <input type="submit" value="Submit" className="btn" />
                </form>
                <table style={tableStyles} className="OverallTable">
                    <tr>
                        <th>{attainmentData[0][0]}</th>
                        <th>{attainmentData[0][1]}</th>
                        <th>{attainmentData[0][2]}</th>
                        <th>{attainmentData[0][3]}</th>
                        <th>{attainmentData[0][4]}</th>
                        <th>{attainmentData[0][5]}</th>
                        <th>{attainmentData[0][6]}</th>
                    </tr>
                    <tr>
                        <td>{attainmentData[1][0]}</td>
                        <td>{attainmentData[1][1]}</td>
                        <td>{attainmentData[1][2]}</td>
                        <td>{attainmentData[1][3]}</td>
                        <td>{attainmentData[1][4]}</td>
                        <td>{attainmentData[1][5]}</td>
                        <td>{attainmentData[1][6]}</td>
                    </tr>
                    <tr>
                        <td>{attainmentData[2][0]}</td>
                        <td>{attainmentData[2][1]}</td>
                        <td>{attainmentData[2][2]}</td>
                        <td>{attainmentData[2][3]}</td>
                        <td>{attainmentData[2][4]}</td>
                        <td>{attainmentData[2][5]}</td>
                        <td>{attainmentData[2][6]}</td>
                    </tr>
                    <tr>
                        <td>{attainmentData[3][0]}</td>
                        <td>{attainmentData[3][1]}</td>
                        <td>{attainmentData[3][2]}</td>
                        <td>{attainmentData[3][3]}</td>
                        <td>{attainmentData[3][4]}</td>
                        <td>{attainmentData[3][5]}</td>
                        <td>{attainmentData[3][6]}</td>
                    </tr>
                    <tr>
                        <td>{attainmentData[4][0]}</td>
                        <td>{attainmentData[4][1]}</td>
                        <td>{attainmentData[4][2]}</td>
                        <td>{attainmentData[4][3]}</td>
                        <td>{attainmentData[4][4]}</td>
                        <td>{attainmentData[4][5]}</td>
                        <td>{attainmentData[4][6]}</td>
                    </tr>
                    <tr>
                        <td>{attainmentData[5][0]}</td>
                        <td>{attainmentData[5][1]}</td>
                        <td>{attainmentData[5][2]}</td>
                        <td>{attainmentData[5][3]}</td>
                        <td>{attainmentData[5][4]}</td>
                        <td>{attainmentData[5][5]}</td>
                        <td>{attainmentData[5][6]}</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Overall;