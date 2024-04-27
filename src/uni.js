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

var attainmentData = [["", "CO1","CO2","CO3","CO4","CO5"], ["Number of Students Attained Set Target:"], ["Number of Students Attempted:"], ["Percentage of Attainment:"], ["Attainment Level:"]]

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
    console.log("Number of Students Attained Set Target:", noOfStudAttained);
    console.log("Number of Students Attempted:", noOfStudAttempeted)
    console.log("Percentage of Attainment:", percentage);
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

    console.log("Attainment Level:", level);
    arr.push(level)

    return arr;


}

var questionIndex = 0;
var data = [['***', '***', '***', '***'], ['SLNO', 'USN', 'STUDENT NAME', 'CO1', 'CO2', 'C03', 'CO4', 'CO5'], ['***', '***', '***', 20, 20, 20, 20, 20]];
function Uni() {
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

        if(event.target.student_list.value==="Select"){
            alert("Please select student List");
            return;
        }
        var stud_list_value = event.target.student_list.value;
        stud_list_value = stud_list_value.split(" ");
        stud_list_value = stud_list_value[1]+"_"+stud_list_value[0][0]+"_"+stud_list_value[0][1];

        console.log(stud_list_value);

        var student_list = JSON.parse(localStorage.getItem("Student_list"));

        console.log(student_list)
        var obj = student_list.find(function(item){
             return item.hasOwnProperty(stud_list_value)
        })

        obj[stud_list_value].forEach(element => {
            var values = Object.values(element);
            data.push(values);
        });

        console.log('data:', data)
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        const fileName = 'universityExamExcel.xlsx';
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
            alert("Please select the file.");
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
                var selectedStudOption = event.target.student_list.value;

                if (selectedStudOption !== 'Select') {
                    selectedStudOption = selectedStudOption.split(' ');
                    selectedStudOption = selectedStudOption[1] + "_" + selectedStudOption[0][0] + "_" + selectedStudOption[0][1];
                    if (localStorage.getItem('Internals') === null) {
                        var arr = [];
                        var keyname = 'uni';
                        var obj = {

                        }

                        obj[keyname] = jsonData;
                        var obj2 = {

                        }
                        obj2[selectedStudOption] = obj;
                        arr.push(obj2);
                        localStorage.setItem('Internals', JSON.stringify(arr));
                    }
                    else {
                        var arr = JSON.parse(localStorage.getItem('Internals'));
                        var foundobject = arr.find(obj => obj.hasOwnProperty(selectedStudOption));
                        if (foundobject === undefined) {
                            var arr = [];
                            var keyname = 'uni';
                            var obj = {

                            }

                            obj[keyname] = jsonData;
                            var obj2 = {

                            }
                            obj2[selectedStudOption] = obj;
                            arr.push(obj2);
                            localStorage.setItem('Internals', JSON.stringify(arr));
                        }
                        else {
                            const index = arr.findIndex(obj => !obj.hasOwnProperty(selectedStudOption));
                            var keyname = 'uni';

                            foundobject[selectedStudOption][keyname] = jsonData;

                            arr[index] = foundobject;

                            localStorage.setItem('Internals', JSON.stringify(arr));

                        }

                    }

                }

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

                console.log(coattain)

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
            var selectedStudOption = event.target.student_list.value;

            if (selectedStudOption !== 'Select') {
                selectedStudOption = selectedStudOption.split(' ');
                selectedStudOption = selectedStudOption[1] + "_" + selectedStudOption[0][0] + "_" + selectedStudOption[0][1];
                var arr = JSON.parse(localStorage.getItem('Internals'));
                var foundobject = arr.find(obj => obj.hasOwnProperty(selectedStudOption));
                const index = arr.findIndex(obj => !obj.hasOwnProperty(selectedStudOption));
                var keyname = 'unico';

                foundobject[selectedStudOption][keyname] = attainmentData;
                console.log(attainmentData)
                arr[index] = foundobject;

                localStorage.setItem('Internals', JSON.stringify(arr));
            }

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

            const fileName = 'ExternalCoAttainment.xlsx';
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

    function studentDetails() {
        var stud_list = JSON.parse(localStorage.getItem("Student_list"));

        console.log(stud_list);
        if(stud_list===null || stud_list.length===0){
            return (
                <select id="student_list" name="student_list">
                    <option>Select</option>
                </select>
            )
        }
        return (
            <select id="student_list" name="student_list">
                <option>Select</option>
                {stud_list.map((val, index) =>

                    <option>{Object.keys(val)[0].split('_')[1]+Object.keys(val)[0].split('_')[2]+ " "+Object.keys(val)[0].split('_')[0]}</option>
                )}
            </select>
        )

    }

    var noteStyle = {
        "color": 'red'
    }

    return (
        <div className="mainContentDiv">
            <div className="refresh-icon" style={refreshStyle}></div>

            <div className="refresh-back" style={refreshStyle}></div>
            <div className="box">

                <h2 className="headings">University Exam Excel Sheet Generator</h2>
                

                <form onSubmit={handleSubmit} className="firstInternal mainForm">
                <span style={noteStyle}>"note : student details must be uploaded in upload section or else it wont show up"</span>
                    <div className="pair">
                        <label for="student_list">Select Student details</label>
                        {studentDetails()}
                    </div>

                    <input type="submit" value="Generate" className="btn"></input>
                </form>

                <form onSubmit={handleExcelSubmit} className="inputExcelForm">
                <h2 className="headings">Generate CO Attainment</h2>
                <span style={noteStyle}>Select sem,section and coursecode to store data locally in browser</span>
                    <div className="pair">
                        {studentDetails()}
                    </div>
                    <label for="excelFile1">Upload External Marks Excel sheet:</label>
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

export default Uni;
