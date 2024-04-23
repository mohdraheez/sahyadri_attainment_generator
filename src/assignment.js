import React, { useState } from "react";
import Header from "./header";
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
    }

    attainmentData = [["", "CO1", "CO2", "CO3", "CO4", "CO5"], ["Number of Students Attained CO:"], ["Number of Students Attempted:"], ["Percentage of Attainment:"], ["CO Attainment Level:"]]

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
    var percentage = (noOfStudAttained / noOfStudAttempeted) * 100;
    percentage = Math.round(percentage * 10) / 10;
    console.log("Number of Students Attained CO:", noOfStudAttained);
    console.log("Number of Students Attempted:", noOfStudAttempeted)
    console.log("Percentage of Attainment:", percentage);
    arr.push(noOfStudAttained);
    arr.push(noOfStudAttempeted);
    arr.push(percentage);
    var level = 0;

    if (percentage >= 50 && percentage < 60)
        level = 1;
    if (percentage > 60 && percentage < 70)
        level = 2;
    if (percentage > 70)
        level = 3;

    console.log("CO Attainment Level:", level);
    arr.push(level)

    return arr;


}

var questionIndex = 0;
var data = [['***', '***', '***', 'CO1', 'CO2', 'CO3', 'C04', 'CO5'], ['SLNO', 'USN', 'STUDENT NAME', 'A', 'B', 'C', 'D', 'E'], ['***', '***', '***', '10', '10', '10', '10', '10']];

function refreshExcel() {
    data = [['***', '***', '***', 'CO1', 'CO2', 'CO3', 'C04', 'CO5'], ['SLNO', 'USN', 'STUDENT NAME', 'A', 'B', 'C', 'D', 'E'], ['***', '***', '***', '10', '10', '10', '10', '10']];

}
function Assignment() {
    const [selectedValue, setSelectedValue] = useState(['1', '1', '1', '1']);
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

        console.log('data:', data)
        const wb = XLSX.utils.book_new();
        data[2][3] = Number(document.querySelector('.row1').innerHTML);
        data[2][4] = Number(document.querySelector('.row2').innerHTML);
        data[2][5] = Number(document.querySelector('.row3').innerHTML);
        data[2][6] = Number(document.querySelector('.row4').innerHTML);
        data[2][7] = Number(document.querySelector('.row5').innerHTML);


        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        const fileName = 'assignmentExcel.xlsx';
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
        setSelectedValue(selectedValue);
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


    const handleFile1Change = (e) => {
        const selectedFile = e.target.files[0];
        setFile1(selectedFile);
    };



    const handleExcelSubmit = (event) => {
        event.preventDefault();

        if (!file1) {
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


                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                var rowLenghtFile1 = Object.keys(jsonData[0]).length - 3;
                var numOfStudFile1 = jsonData.length - 3;

                var maxMarks = [10, 10, 10, 10, 10];

                console.log(jsonData)

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

                coattain['CO1'][0] = jsonData[2][3];
                coattain['CO2'][0] = jsonData[2][4];
                coattain['CO3'][0] = jsonData[2][5];
                coattain['CO4'][0] = jsonData[2][6];
                coattain['CO5'][0] = jsonData[2][7];

                for (let i = 1; i < numOfStudFile1 + 1; i++) {
                    coattain['CO1'][i] = jsonData[i + 2][3];
                    coattain['CO2'][i] = jsonData[i + 2][4];
                    coattain['CO3'][i] = jsonData[i + 2][5];
                    coattain['CO4'][i] = jsonData[i + 2][6];
                    coattain['CO5'][i] = jsonData[i + 2][7];
                }

            };
            reader.readAsBinaryString(file);
        };

        processFile(file1);

        setTimeout(() => {
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
            console.log(tableArr);
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

            const fileName = 'AssignmentCoAttainment.xlsx';
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

            refreshCoattain();
        }, 2500);

    };
    const getFormat = (formIndex, qtnno) => (
        <>
            { }
            <div>Q{qtns[qtnno]}:

            </div>
            {formStates[formIndex].map((value, index) => (
                <div key={index}>
                    <label>{letters[index]}</label>
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

    function rowValueChanged(e) {
        var classname = e.target.className;
        classname = classname.split("row")

        var row1 = document.querySelector('.' + classname[0] + 'row1').innerHTML;
        var row2 = document.querySelector('.' + classname[0] + 'row2').innerHTML;
        var row3 = document.querySelector('.' + classname[0] + 'row3').innerHTML;
        var row4 = document.querySelector('.' + classname[0] + 'row4').innerHTML;
        var row5 = document.querySelector('.' + classname[0] + 'row5').innerHTML;

        var row6 = document.querySelector('.' + classname[0] + 'row6');
        if (isNaN(row1))
            row1 = 0;
        if (isNaN(row2))
            row2 = 0;
        if (isNaN(row3))
            row3 = 0;
        if (isNaN(row4))
            row4 = 0;
        if (isNaN(row5))
            row5 = 0;
        var total = Number(row1) + Number(row2) + Number(row3) + Number(row4) + Number(row5);
        row6.innerHTML = total;
        console.log(total)
        var col1 = document.querySelector('.c1row' + classname[1]).innerHTML;
        var col2 = document.querySelector('.c2row' + classname[1]).innerHTML;
        var col3 = document.querySelector('.c3row' + classname[1]).innerHTML;
        var col4 = document.querySelector('.c4row' + classname[1]).innerHTML;
        var col5 = document.querySelector('.c5row' + classname[1]).innerHTML;
        if (isNaN(col1))
            col1 = 0;
        if (isNaN(col2))
            col2 = 0;
        if (isNaN(col3))
            col3 = 0;
        if (isNaN(col4))
            col4 = 0;
        if (isNaN(col5))
            col5 = 0;
        total = Number(col1) + Number(col2) + Number(col3) + Number(col4) + Number(col5);
        var col5 = document.querySelector('.row' + classname[1]);
        col5.innerHTML = total;


        var row1col6 = document.querySelector('.c1row6').innerHTML;
        var row2col6 = document.querySelector('.c2row6').innerHTML;
        var row3col6 = document.querySelector('.c3row6').innerHTML;
        var row4col6 = document.querySelector('.c4row6').innerHTML;
        var row5col6 = document.querySelector('.c5row6').innerHTML;
        var row6col6 = document.querySelector('.row6');

        if (isNaN(row1col6))
            row1col6 = 0;
        if (isNaN(row2col6))
            row2col6 = 0;
        if (isNaN(row3col6))
            row3col6 = 0;
        if (isNaN(row4col6))
            row4col6 = 0;
        if (isNaN(row5col6))
            row5col6 = 0;
        total = Number(row1col6) + Number(row2col6) + Number(row3col6) + Number(row4col6) + Number(row5col6);
        row6col6.innerHTML = total;
        console.log(total)
    }
    return (
        <div className="mainContentDiv">
            <div className="refresh-icon" style={refreshStyle}></div>

            <div className="refresh-back" style={refreshStyle}></div>
            <div className="box">
                <h2 className="headings">Assignment Excel Sheet Template Generator</h2>
                <form onSubmit={handleSubmit} className="firstInternal mainForm">
                    <table>
                        <tr>
                            <th rowSpan='2'>
                                SL NO
                            </th>
                            <th rowSpan='2'>
                                Short Description of Assignment
                            </th>
                            <th colSpan='5'>
                                Marks Allocated under each COs
                            </th>
                            <th rowSpan='2'>
                                Marks Per Assignment
                            </th>
                        </tr>
                        <tr>
                            <th>
                                CO1
                            </th>
                            <th>
                                CO2
                            </th>
                            <th>
                                CO3
                            </th>
                            <th>
                                CO4
                            </th>
                            <th>
                                CO5
                            </th>
                        </tr>

                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                Written Assignment
                            </td>
                            <td contentEditable className="c1row1" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c1row2" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c1row3" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c1row4" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c1row5" onInput={rowValueChanged}>

                            </td>
                            <td className="c1row6">

                            </td>
                        </tr>
                        <tr>
                            <td>
                                2
                            </td>
                            <td>
                                Group/Individual Seminar
                            </td>
                            <td contentEditable className="c2row1" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c2row2" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c2row3" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c2row4" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c2row5" onInput={rowValueChanged}>

                            </td>
                            <td className="c2row6">

                            </td>
                        </tr>
                        <tr>
                            <td>
                                3
                            </td>
                            <td>
                                Poster Presentation
                            </td>
                            <td contentEditable className="c3row1" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c3row2" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c3row3" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c3row4" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c3row5" onInput={rowValueChanged}>

                            </td>
                            <td className="c3row6">

                            </td>
                        </tr>
                        <tr>
                            <td>
                                4
                            </td>
                            <td>
                                Quiz
                            </td>
                            <td contentEditable className="c4row1" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c4row2" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c4row3" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c4row4" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c4row5" onInput={rowValueChanged}>

                            </td>
                            <td className="c4row6">

                            </td>
                        </tr>
                        <tr>
                            <td>
                                5
                            </td>
                            <td>
                                Tutorial
                            </td>
                            <td contentEditable className="c5row1" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c5row2" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c5row3" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c5row4" onInput={rowValueChanged}>

                            </td>
                            <td contentEditable className="c5row5" onInput={rowValueChanged}>

                            </td>
                            <td className="c5row6">

                            </td>
                        </tr>
                        <tr>
                            <td colSpan='2'>
                                Maximum Marks Per CO
                            </td>
                            <td className="row1">

                            </td>
                            <td className="row2">

                            </td>
                            <td className="row3">

                            </td>
                            <td className="row4">

                            </td>
                            <td className="row5">

                            </td>
                            <td className="row6">

                            </td>
                        </tr>
                    </table>
                    <input type="submit" value="Generate" className="btn"></input>
                </form>

                <form onSubmit={handleExcelSubmit} className="inputExcelForm">
                    <h2 className="headings">Generate CO Attainment</h2>

                    <label for="excelFile1">Upload Assignment Marks Excel sheet:</label>
                    <input type="file" id="excelFile1" name="excelFile1" accept=".xlsx, .xls" onChange={handleFile1Change} />

                    <input type="submit" value="Submit" className="btn" />
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

export default Assignment;
