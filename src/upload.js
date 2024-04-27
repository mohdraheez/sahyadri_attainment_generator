import React from "react";
import * as XLSX from 'xlsx';
import { useState } from "react";

var data = [["SLNO", "USN", "STUDENT NAME"]];

function Upload() {
    const [file1, setFile1] = useState(null);
    const handleFile1Change = (e) => {
        const selectedFile = e.target.files[0];
        setFile1(selectedFile);
    };

    const [success, setSuccess] = useState({
        display: 'none'
    })

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!file1) {
            alert('Please select the file');
            return;
        }
        if (!(e.target.coursecode.value.trim())) {
            alert("course code cannot be empty");
            return;
        }
        if (!(e.target.sem.value.trim())) {
            alert("Sem code cannot be empty");
            return;
        }
        if (!(e.target.section.value.trim())) {
            alert("Section code cannot be empty");
            return;
        }

        if (isNaN(e.target.sem.value)) {
            alert("Sem Need to Numeric value");
            return;
        }
        if (!isNaN(e.target.section.value)) {
            alert("Section cannot be Numeric value");
            return;
        }
        var pattern = /^\d{2}[a-zA-z]{2}/;
        if (!(pattern.test(e.target.coursecode.value))) {
            alert("Course code must be of format 00XX (for eg: 18CS)");
            return;
        }


        const processFile = (file) => {
            var filename = e.target.coursecode.value + "_" + e.target.sem.value + "_" + e.target.section.value;

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

                var obj = {

                }

                obj[filename] = jsonData;

                console.log(obj)
                // console.log(jsonData);

                if (localStorage.getItem("Student_list") == null) {
                    var arr = [];
                    arr.push(obj);
                    localStorage.setItem("Student_list", JSON.stringify(arr));
                }
                else {
                    var arr = JSON.parse(localStorage.getItem("Student_list"))
                    var flag = 0;
                    var index = -1;
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].hasOwnProperty(filename)) {
                            flag = 1;
                            index = i;
                            break;
                        }
                    }

                    if (flag === 1) {
                        console.log("file is aldready present")
                        arr[index] = obj;
                    }
                    else {
                        arr.push(obj);
                    }
                    localStorage.setItem("Student_list", JSON.stringify(arr));

                }

            };
            reader.readAsBinaryString(file);
        };

        processFile(file1);
        setSuccess({
            backgroundColor: '#4fff9b',
            padding: '10px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        })

        setTimeout(() => {
            setSuccess({display:'none'})
        }
            , 1000)
    }
    function getExcelSheet(e) {
        e.preventDefault();
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        const fileName = 'Student_List.xlsx';
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
    }

    var spanstyle = {
        color: 'red'
    }


    return (
        <div className="uploadMain">
            <div className="uploadSubDiv">
                <form className="uploadExcelGenerator" onSubmit={getExcelSheet}>
                    <span style={spanstyle}>"note: Use same browser everytime. All the datas are stored locally in browser"</span>
                    <h2>Download the File and Upload Student details</h2>
                    <button className="btn">Generate Excel Sheet</button>
                </form>

                <form className="uploadExcel" onSubmit={handleSubmit}>
                    <label for="excelFile1">Upload Student Excel Sheet:</label>
                    <input type="file" id="excelFile1" name="excelFile1" accept=".xlsx, .xls" onChange={handleFile1Change} />
                    <div className="pair">
                        <label>Course Code</label>
                        <input type="text" className="uploadInputField" name="coursecode"></input>

                    </div>
                    <div className="pair" >
                        <label>Sem</label>
                        <input type="text" className="uploadInputField" name="sem" maxlength="1"></input>

                    </div>
                    <div className="pair">
                        <label>Section</label>
                        <input type="text" className="uploadInputField" name="section" maxlength="1"></input>

                    </div>
                    <div style={success}>Data Stored</div>
                    <button className="btn">Upload</button>
                </form>
            </div>
        </div>
    )
}

export default Upload;