import React, { useState } from "react";
import * as XLSX from 'xlsx';

var letters = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e'
};

var qtns = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
};

var coattain = {
    'CO1': [],
    'CO2': [],
    'CO3': [],
    'CO4': [],
    'CO5': []
}

var attainmentData = [["", "CO1", "CO2", "CO3", "CO4", "CO5"], ["Number of Students Attained CO:"], ["Number of Students Attempted:"], ["Percentage of Attainment:"], ["CO Attainment Level:"]]

function refreshCoattain() {
    coattain = {
        'CO1': [],
        'CO2': [],
        'CO3': [],
        'CO4': [],
        'CO5': []
    };

    attainmentData = [["", "CO1", "CO2", "CO3", "CO4", "CO5"], ["Number of Students Attained CO:"], ["Number of Students Attempted:"], ["Percentage of Attainment:"], ["CO Attainment Level:"]];
}
function findattainment(co, setTarget) {
    console.log("CO:", co)
    var maxMarks = co[0];
    var nullValues = 0;
    var noOfStudAttained = 0;
    var target = (setTarget * maxMarks) / 100;
    var arr = [];

    for (let i = 1; i < co.length; i++) {
        if (co[i] === null) {
            console.log(co[i] === null)
            nullValues++;
            continue;
        }

        if (co[i] >= target)
            noOfStudAttained++;
    }

    var noOfStudAttempeted = co.length - nullValues - 1;
    var percentage = 0;
    if(Number(noOfStudAttempeted)!==0){
    percentage=(Number(noOfStudAttained) / Number(noOfStudAttempeted)) * 100;
    percentage = Math.round(Number(percentage) * 10) / 10;
    }
    arr.push(noOfStudAttained);
    arr.push(noOfStudAttempeted);
    arr.push(percentage);
    var level = 0;

    if (percentage >= 50 && percentage < 60)
        level = 1;
    if (percentage >= 60 && percentage < 70)
        level = 2;
    if (percentage >= 70)
        level = 3;

    arr.push(level)
    return arr;
}

var questionIndex = 0;
var data = [['***', '***', '***'], ['SLNO', 'USN', 'STUDENT NAME'], ['***', '***', '***']];

function refreshExcel() {
    data = [['***', '***', '***'], ['SLNO', 'USN', 'STUDENT NAME'], ['***', '***', '***']];
}
function Home() {
    const [tableValues, setTableValues] = useState([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])
    const [tableStyles, setTableStyles] = useState({ 'visibility': 'hidden' });
    const [refreshStyle, setrefreshStyle] = useState({ 'visibility': 'hidden' });


    const [formStates, setFormStates] = useState(
        Array.from({ length: Object.keys(qtns).length }, () => [''])
    );

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        var targetValue = event.target;
        var firstDiv = targetValue.querySelector('.one');
        var firstSubQ = firstDiv.childElementCount - 1;
        var firstCO = firstDiv.querySelector("#CO");


        for (let i = 0; i < firstSubQ; i++) {
            console.log(1 + letters[i], ':', firstDiv.querySelector('.' + letters[i]).value)
            data[0].push(firstCO.value);
            data[1].push(1 + letters[i]);
            data[2].push(firstDiv.querySelector('.' + letters[i]).value);
        }

        var secondDiv = targetValue.querySelector('.two');
        var secondSubQ = secondDiv.childElementCount - 1;
        var secondCO = secondDiv.querySelector("#CO");


        for (let i = 0; i < secondSubQ; i++) {
            console.log(2 + letters[i], ':', secondDiv.querySelector('.' + letters[i]).value)
            data[0].push(secondCO.value);
            data[1].push(2 + letters[i]);
            data[2].push(secondDiv.querySelector('.' + letters[i]).value);
        }

        var thirdDiv = targetValue.querySelector('.three');
        var thirdSubQ = thirdDiv.childElementCount - 1;
        var thirdCO = thirdDiv.querySelector("#CO");


        for (let i = 0; i < thirdSubQ; i++) {
            console.log(3 + letters[i], ':', thirdDiv.querySelector('.' + letters[i]).value)
            data[0].push(thirdCO.value);
            data[1].push(3 + letters[i]);
            data[2].push(thirdDiv.querySelector('.' + letters[i]).value);

        }

        var fourthDiv = targetValue.querySelector('.four');
        var fourthSubQ = fourthDiv.childElementCount - 1;
        var fourthCO = fourthDiv.querySelector("#CO");


        for (let i = 0; i < fourthSubQ; i++) {
            console.log(4 + letters[i], ':', fourthDiv.querySelector('.' + letters[i]).value)
            data[0].push(fourthCO.value);
            data[1].push(4 + letters[i]);
            data[2].push(fourthDiv.querySelector('.' + letters[i]).value);

        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        const fileName = 'Internal.xlsx';
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
        refreshExcel();
    };

    const handleChange = (index, event) => {
        const selectedValue = event.target.value;
        const newFormStates = [...formStates];
        newFormStates[index] = Array.from({ length: parseInt(selectedValue, 10) }, () => '');
        setFormStates(newFormStates);
    };

    const handleTextFieldChange = (formIndex, textFieldIndex, event) => {
        const newFormStates = [...formStates];
        newFormStates[formIndex][textFieldIndex] = event.target.value;
        setFormStates(newFormStates);
    };

    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);

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

    const handleExcelSubmit = (event) => {
        event.preventDefault();
        if (!file1 || !file2 || !file3) {
            alert("Please select all three files.");
            return;
        }
        setrefreshStyle({ 'visibility': 'visible' })
        var flag = true;
        const processFile = (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryString = e.target.result;
                const workbook = XLSX.read(binaryString, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Check if worksheet contains any data
                if (!worksheet || Object.keys(worksheet).length === 0) {
                    console.log("Worksheet is empty or doesn't exist.");
                    return;
                }

                // Read data from the worksheet
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                // console.log(jsonData);
                var rowLenghtFile1 = Object.keys(jsonData[0]).length - 3;
                var numOfStudFile1 = jsonData.length - 3;

                var noOfQ = [0, 0, 0, 0];
                var maxMarks = [0, 0, 0, 0];
                for (let i = 3; i <= rowLenghtFile1 + 3; i++) {
                    if (jsonData[1][i])
                        noOfQ[jsonData[1][i][0] - 1]++;
                    if (jsonData[2][i])
                        maxMarks[jsonData[1][i][0] - 1] += Number(jsonData[2][i]);
                }


                if (flag) {
                    for (let i = 0; i < numOfStudFile1 + 1; i++) {
                        coattain.CO1.push(null);
                        coattain.CO2.push(null);
                        coattain.CO3.push(null);
                        coattain.CO4.push(null);
                        coattain.CO5.push(null);
                    }
                }
                flag = false;

                coattain[jsonData[0][4]][0] += maxMarks[0];
                coattain[jsonData[0][rowLenghtFile1 + 2]][0] += maxMarks[3];

                for (let i = 1; i < numOfStudFile1 + 1; i++) {
                    let firstq = 0;
                    let secondq = 0;
                    let thirdq = 0;
                    let fourthq = 0;
                    let firstNull = 0;
                    let secondNull = 0;
                    let thirdNull = 0;
                    let fourthNull = 0;

                    //    console.log(jsonData[2+i])

                    for (let j = 0; j < noOfQ[0]; j++) {
                        let val = jsonData[2 + i][3 + j] === undefined ? 0 : jsonData[2 + i][3 + j];
                        if (jsonData[2 + i][3 + j] === undefined)
                            firstNull++;
                        firstq += val;
                    }


                    for (let j = 3 + noOfQ[0]; j < 3 + noOfQ[0] + noOfQ[1]; j++) {
                        let val = jsonData[2 + i][j] === undefined ? 0 : jsonData[2 + i][j];
                        if (jsonData[2 + i][j] === undefined)
                            secondNull++;
                        secondq += val;

                    }

                    for (let j = 3 + noOfQ[0] + noOfQ[1]; j < 3 + noOfQ[0] + noOfQ[1] + noOfQ[2]; j++) {
                        let val = jsonData[2 + i][j] === undefined ? 0 : jsonData[2 + i][j];
                        thirdq += val;
                        if (jsonData[2 + i][j] === undefined)
                            thirdNull++;

                    }

                    for (let j = 3 + noOfQ[0] + noOfQ[1] + noOfQ[2]; j < 3 + noOfQ[0] + noOfQ[1] + noOfQ[2] + noOfQ[3]; j++) {
                        let val = jsonData[2 + i][j] === undefined ? 0 : jsonData[2 + i][j];
                        if (jsonData[2 + i][j] === undefined)
                            fourthNull++;

                        fourthq += val;

                    }


                    if (firstNull === noOfQ[0] && secondNull === noOfQ[1]) {
                        if (coattain[jsonData[0][4]][i] === null)
                            coattain[jsonData[0][4]][i] = null
                    }
                    else
                        coattain[jsonData[0][4]][i] += firstq > secondq ? firstq : secondq;
                    if (thirdNull === noOfQ[2] && fourthNull === noOfQ[3]) {
                        if (coattain[jsonData[0][rowLenghtFile1 + 2]][i] === null)
                            coattain[jsonData[0][rowLenghtFile1 + 2]][i] = null;

                    }
                    else
                        coattain[jsonData[0][rowLenghtFile1 + 2]][i] += thirdq > fourthq ? thirdq : fourthq;


                }
            };
            reader.readAsBinaryString(file);
        };
        processFile(file1);
        processFile(file2);
        processFile(file3);
        setTimeout(() => {
        console.log(coattain)

            let arr1 = findattainment(coattain.CO1, 60);
            var tableArr = tableValues;
            tableArr[0] = arr1;
            let arr2 = findattainment(coattain.CO2, 60);
            tableArr[1] = arr2;
            let arr3 = findattainment(coattain.CO3, 60);
            tableArr[2] = arr3;
            let arr4 = findattainment(coattain.CO4, 60);
            tableArr[3] = arr4;
            let arr5 = findattainment(coattain.CO5, 60);
            tableArr[4] = arr5;
            // console.log(tableArr);
            setTableValues(tableArr);
            setTableStyles({ 'visibility': 'visible' });

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 5; j++) {
                    attainmentData[i + 1].push(tableValues[j][i])
                }
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(attainmentData);

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

            const fileName = 'InternalCOAttainment.xlsx';
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
            setrefreshStyle({ 'visibility': 'hidden' })

            // refreshCoattain();
        }, 2500);

    };
    const getFormat = (formIndex, qtnno) => (
        <>
            { }
            <div className="pair">Q{qtns[qtnno]}:
                <div>
                <select id="firstq" name="firstq" onChange={(event) => handleChange(formIndex, event)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                </select>
                <select id="CO" name="CO" >
                    <option value='CO1'>CO1</option>
                    <option value='CO2'>CO2</option>
                    <option value='CO3'>CO3</option>
                    <option value='CO4'>CO4</option>
                    <option value='CO5'>CO5</option>

                </select>
                </div>
            </div>
            {formStates[formIndex].map((value, index) => (
                <div key={index} className="pair">
                    <label>{letters[index]} </label>
                    <input
                        className={letters[index]}
                        type="text"
                        value={value}
                        onChange={(event) => handleTextFieldChange(formIndex, index, event)}
                    />
                </div>
            ))}
        </>
    );

    return (
        <div className="internalDiv mainContentDiv">
            <div className="refresh-icon" style={refreshStyle}></div>

            <div className="refresh-back" style={refreshStyle}></div>

            <div className="box">
                <h2 className="headings">Internal Excel Sheet Template Generator</h2>
                <form onSubmit={handleSubmit} className="firstInternal mainForm">
                    <label htmlFor="firstq" className="firstLabel">Select number of subquestions in each question</label>
                    <div className="one">
                        {getFormat(0, questionIndex)}
                    </div>

                    <div className="two">
                        {getFormat(1, questionIndex + 1)}
                    </div>

                    <div className="three">
                        {getFormat(2, questionIndex + 2)}
                    </div>

                    <div className="four">
                        {getFormat(3, questionIndex + 3)}

                    </div>
                    <input type="submit" value="Generate" className="btn"></input>
                </form>

                <form onSubmit={handleExcelSubmit} className="inputExcelForm">
                <h2 className="headings">Generate CO Attainment</h2>

                    <label for="excelFile1">Upload First Internal Marks Excel sheet:</label>
                    <input type="file" id="excelFile1" name="excelFile1" accept=".xlsx, .xls" onChange={handleFile1Change} />

                    <label for="excelFile2">Upload Second Internal Marks Excel sheet:</label>
                    <input type="file" id="excelFile2" name="excelFile2" accept=".xlsx, .xls" onChange={handleFile2Change} />

                    <label for="excelFile3">Upload Third Internal Marks Excel Sheet:</label>
                    <input type="file" id="excelFile3" name="excelFile3" accept=".xlsx, .xls" onChange={handleFile3Change} />


                    <input type="submit" value="Submit" className="btn"/>
                </form>

                <table style={tableStyles}>
                    <tr>
                        <th></th>
                        <th>CO1</th>
                        <th>CO2</th>
                        <th>CO3</th>
                        <th>CO4</th>
                        <th>CO5</th>
                    </tr>
                    <tr>
                        <td>Number of Students Attained CO:</td>
                        <td>{tableValues[0][0]}</td>
                        <td>{tableValues[1][0]}</td>
                        <td>{tableValues[2][0]}</td>
                        <td>{tableValues[3][0]}</td>
                        <td>{tableValues[4][0]}</td>
                    </tr>
                    <tr>
                        <td>Number of Students Attempted:</td>
                        <td>{tableValues[0][1]}</td>
                        <td>{tableValues[1][1]}</td>
                        <td>{tableValues[2][1]}</td>
                        <td>{tableValues[3][1]}</td>
                        <td>{tableValues[4][1]}</td>
                    </tr>
                    <tr>
                        <td>Percentage of Attainment:</td>
                        <td>{tableValues[0][2]}</td>
                        <td>{tableValues[1][2]}</td>
                        <td>{tableValues[2][2]}</td>
                        <td>{tableValues[3][2]}</td>
                        <td>{tableValues[4][2]}</td>
                    </tr>
                    <tr>
                        <td>CO Attainment Level:</td>
                        <td>{tableValues[0][3]}</td>
                        <td>{tableValues[1][3]}</td>
                        <td>{tableValues[2][3]}</td>
                        <td>{tableValues[3][3]}</td>
                        <td>{tableValues[4][3]}</td>
                    </tr>
                </table>

            </div>
        </div>
    );
}

export default Home;
