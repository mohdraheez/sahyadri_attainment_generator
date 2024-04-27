import React, { useState } from "react";
import Header from "./header";
import * as XLSX from 'xlsx';

var coValues = [0, 0, 0, 0, 0];
var classStrength = 0;
var participatedStudents = 0;
var attainmentData = [["", "CO1", "CO2", "CO3", "CO4", "CO5"], ["Total Attainment"], ["CO Attainment Level:"]]

function getLevel(val) {
    if (val >= 50 && val < 60)
        return 1;
    if (val >= 60 && val < 70)
        return 2;
    if (val >= 70)
        return 3;

    return 0;
}
function Feedback() {
    const [tableValues, setTableValues] = useState([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]])
    const [tableStyles, setTableStyles] = useState({ 'visibility': 'hidden' });
    const [refreshStyle, setrefreshStyle] = useState({ 'visibility': 'hidden' });

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    function handlesubmit(e) {
        e.preventDefault();

        setrefreshStyle({ 'visibility': 'visible' })

        // coValues 
        coValues[0] = Number(e.target.co1.value);
        coValues[1] = Number(e.target.co2.value);
        coValues[2] = Number(e.target.co3.value);
        coValues[3] = Number(e.target.co4.value);
        coValues[4] = Number(e.target.co5.value);
        classStrength = Number(e.target.classStrength.value);
        participatedStudents = Number(e.target.participatedStudents.value);

        var per = (participatedStudents / classStrength) * 100;
        attainmentData[1][1] = Math.round((coValues[0] * per / 10)) / 10;
        attainmentData[1][2] = Math.round((coValues[1] * per / 10)) / 10;
        attainmentData[1][3] = Math.round((coValues[2] * per / 10)) / 10;
        attainmentData[1][4] = Math.round((coValues[3] * per / 10)) / 10;
        attainmentData[1][5] = Math.round((coValues[4] * per / 10)) / 10;

        attainmentData[2][1] = getLevel(attainmentData[1][1]);
        attainmentData[2][2] = getLevel(attainmentData[1][2]);
        attainmentData[2][3] = getLevel(attainmentData[1][3])
        attainmentData[2][4] = getLevel(attainmentData[1][4])
        attainmentData[2][5] = getLevel(attainmentData[1][5]);

        setTimeout(() => {

            var tableArr = tableValues;

            tableArr[0][0] = attainmentData[1][1];
            tableArr[0][1] = attainmentData[1][2];
            tableArr[0][2] = attainmentData[1][3];
            tableArr[0][3] = attainmentData[1][4];
            tableArr[0][4] = attainmentData[1][5];

            tableArr[1][0] = attainmentData[2][1];
            tableArr[1][1] = attainmentData[2][2];
            tableArr[1][2] = attainmentData[2][3];
            tableArr[1][3] = attainmentData[2][4];
            tableArr[1][4] = attainmentData[2][5];

            setTableValues(tableArr);

            setTableStyles({ 'visibility': 'visible' });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(attainmentData);
            var selectedStudOption = e.target.student_list.value;

            if (selectedStudOption !== 'Select') {
                selectedStudOption = selectedStudOption.split(' ');
                selectedStudOption = selectedStudOption[1] + "_" + selectedStudOption[0][0] + "_" + selectedStudOption[0][1];
                if (localStorage.getItem('Internals') === null) {
                    var arr = [];
                    var keyname = 'feedback';
                    var obj = {

                    }

                    obj[keyname] = attainmentData;
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
                        var keyname = 'feedback';
                        var obj = {

                        }

                        obj[keyname] = attainmentData;
                        var obj2 = {

                        }
                        obj2[selectedStudOption] = obj;
                        arr.push(obj2);
                        localStorage.setItem('Internals', JSON.stringify(arr));
                    }
                    else {
                        const index = arr.findIndex(obj => !obj.hasOwnProperty(selectedStudOption));
                        var keyname = 'feedback';

                        foundobject[selectedStudOption][keyname] = attainmentData;

                        arr[index] = foundobject;

                        localStorage.setItem('Internals', JSON.stringify(arr));

                    }

                }

            }
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

            const fileName = 'feedbackCOAttainment.xlsx';
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

        console.log(attainmentData)
    }
    var noteStyle = {
        "color": 'red'
    }
    function studentDetails() {
        var stud_list = JSON.parse(localStorage.getItem("Student_list"));

        console.log(stud_list);
        if (stud_list === null || stud_list.length === 0) {
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

                    <option>{Object.keys(val)[0].split('_')[1] + Object.keys(val)[0].split('_')[2] + " " + Object.keys(val)[0].split('_')[0]}</option>
                )}
            </select>
        )

    }
    return (
        <div className="feedbackDiv mainContentDiv">

            <div>
                <div className="refresh-icon" style={refreshStyle}></div>

                <div className="refresh-back" style={refreshStyle}></div>
                <form className="feedbackForm" onSubmit={handlesubmit}>
                    <h2>Enter the Student Feedback on COs (% ) taken through class survey :</h2>
                    <span style={noteStyle}>Select sem,section and coursecode to store data locally in browser</span>
                    <div className="pair">
                        {studentDetails()}
                    </div>
                    <div>
                        <label>Feedback on CO1</label>
                        <input type="text" id="co1" name="co1"></input>
                    </div>
                    <div>
                        <label>Feedback on CO2</label>
                        <input type="text" id="co2" name="co2"></input>
                    </div>
                    <div>
                        <label>Feedback on CO3</label>
                        <input type="text" id="co3" name="co3"></input>
                    </div>
                    <div>
                        <label>Feedback on CO4</label>
                        <input type="text" id="co4" name="co4"></input>
                    </div>
                    <div>
                        <label>Feedback on CO5</label>
                        <input type="text" id="co5" name="co5"></input>
                    </div>
                    <div>
                        <label>Class Strength</label>
                        <input type="text" id="classStrength" name="classStrength"></input>
                    </div>
                    <div>
                        <label>Participated Students</label>
                        <input type="text" id="participatedStudents" name="participatedStudents"></input>
                    </div>
                    <button className="btn">Submit</button>
                </form>

                <table style={tableStyles} className="table">
                    <tr>
                        <th></th>
                        <th>CO1</th>
                        <th>CO2</th>
                        <th>CO3</th>
                        <th>CO4</th>
                        <th>CO5</th>
                    </tr>
                    <tr>
                        <td>Total Attainment:</td>
                        <td>{tableValues[0][0]}</td>
                        <td>{tableValues[0][1]}</td>
                        <td>{tableValues[0][2]}</td>
                        <td>{tableValues[0][3]}</td>
                        <td>{tableValues[0][4]}</td>
                    </tr>
                    <tr>
                        <td>CO attainment level:</td>
                        <td>{tableValues[1][0]}</td>
                        <td>{tableValues[1][1]}</td>
                        <td>{tableValues[1][2]}</td>
                        <td>{tableValues[1][3]}</td>
                        <td>{tableValues[1][4]}</td>
                    </tr>
                </table>
            </div>
        </div>

    )

}

export default Feedback
