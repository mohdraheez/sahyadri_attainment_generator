import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
function View(props) {

    const { id1, id2 } = useParams();
    console.log(id1);
    console.log(id2);
    const navigate = useNavigate();
    var flag = 0;
    var student_list = [];
    const [selectedOption, changeOption] = useState("");
    if (localStorage.getItem('Student_list') !== null) {
        student_list = JSON.parse(localStorage.getItem('Student_list'));
        var obj = [];
        student_list.forEach(element => {
            obj.push(Object.keys(element));
        });

        student_list = obj;
        flag = 1;
    }


    function handleSelect(e) {

        changeOption(e.target.value);
        navigate('/view/' + e.target.value + '/studentList')

    }

    function getClassList() {

        console.log(student_list.length)
        if (student_list.length === 0) {
            return (
                <>

                </>
            );
        }
        else {
            return (
                <>
                    {student_list.map((val, index) =>
                        <option>
                            {val}
                        </option>
                    )}
                </>)
        }
    }

    function getStudentData() {

        var StudentData = [];
        if (localStorage.getItem('Student_list') !== null) {
            StudentData = JSON.parse(localStorage.getItem('Student_list'));

        }

        if (StudentData.length !== 0) {

            console.log('hehe')
            var obj = StudentData.find(function (item) {
                return item.hasOwnProperty(id1)
            })

            obj = obj[id1];
            return (
                <>
                    {obj.map((val, index) =>
                        index !== 0 ?
                            <tr>
                                <td>
                                    {val[0]}
                                </td>
                                <td>
                                    {val[1]}

                                </td>
                                <td>
                                    {val[2]}

                                </td>
                            </tr>
                            :
                            <>
                            </>

                    )}
                </>
            )
        }
        else {
            return (
                <>
                </>
            )
        }
    }

    function getInternalData(id) {
        var cie = id;
        var internals = '';

        if (localStorage.getItem('Internals') === null) {
            console.log('its  null')
        }
        else {
            internals = JSON.parse(localStorage.getItem('Internals'));
            var objToFind = internals.find(item => item.hasOwnProperty(id1));
            if (objToFind !== undefined) {
                var cieToFind = objToFind[id1].hasOwnProperty(cie);
                if (cieToFind) {
                    var ciedata = objToFind[id1][cie];
                    var ciearray = [];

                    for (let i = 0; i < ciedata.length; i++) {

                        ciearray.push(Object.values(ciedata[i]));

                    }
                    for (let i = 0; i < ciearray.length; i++) {
                        if (ciearray[0].length !== ciearray[i].length) {
                            let k = ciearray[0].length - ciearray[i].length;

                            for (let j = 0; j < k; j++) {
                                ciearray[i].push('');
                            }
                        }
                    }
                    return (
                        <table>
                            {ciearray.map((val, index) =>
                                <tr>
                                    {val.map((val1, index1) =>
                                        index === 0 || index === 1 || index === 2 ?


                                            <th>
                                                {val1}
                                            </th>
                                            : (index === 3 || index == 4) && (id === 'cieco' || id === 'assignmentco' || id === 'feedback' || id === 'unico' || id === 'overall') ?
                                                <th>
                                                    {val1}
                                                </th>
                                                : (index === 5 && id === 'overall') ?
                                                    <th>
                                                        {val1}
                                                    </th>
                                                    :
                                                    <td>
                                                        {val1}
                                                    </td>


                                    )}
                                </tr>
                            )}
                        </table>)
                }
            }
        }

        return (
            <>
            </>
        )

    }

    // if(flag===0)
    // return(
    //     <div className="viewMainDiv">
    //         There is nothing to view 
    //     </div>
    // )
    return (
        <div className="viewMainDiv">
            <form>
                <div className="pair">
                    <label> Select Class</label>
                    <select onChange={handleSelect}>
                        <option>Select</option>
                        {getClassList()}

                    </select>
                </div>
            </form>
            <nav className="Navbar viewNavbar">


                <ul>
                    <li><Link to={"/view/" + id1 + "/studentList"}>Student List</Link></li>
                    <li><Link to={"/view/" + id1 + "/cie1"}>CIE 1</Link></li>
                    <li><Link to={"/view/" + id1 + "/cie2"}>CIE 2</Link></li>
                    <li><Link to={"/view/" + id1 + "/cie3"}>CIE 3</Link></li>
                    <li><Link to={"/view/" + id1 + "/cieco"}>CIE CO attainmet</Link></li>
                    <li><Link to={"/view/" + id1 + "/assignment"}>Assignment</Link></li>
                    <li><Link to={"/view/" + id1 + "/feedback"}>Feedback attainmet</Link></li>

                    <li><Link to={"/view/" + id1 + "/external"}>External</Link></li>
                    <li><Link to={"/view/" + id1 + "/overall"}>Overall</Link></li>
                </ul>
            </nav>
            <div className="viewContent">
                {id2 === 'studentList' ?
                    <table>
                        <tr>
                            <th>SL NO</th>
                            <th>NAME</th>
                            <th>USN</th>
                        </tr>
                        {getStudentData()}
                    </table>
                    : id2 === 'cie1' ?
                        <>
                            {getInternalData('cie1')}
                        </>
                        : id2 === 'cie2' ?
                            <>
                                {getInternalData('cie2')}
                            </>
                            : id2 === 'cie3' ?
                                <>
                                    {getInternalData('cie3')}
                                </>
                                : id2 === 'cieco' ?
                                    <>
                                        {getInternalData('cieco')}
                                    </>
                                    :
                                    id2 === 'assignment' ?
                                        <>
                                            {getInternalData('assignment')}

                                            <h2>Assignment CO Attainment</h2>
                                            {getInternalData('assignmentco')}

                                        </> :
                                        id2 === 'feedback' ?
                                            <>
                                                {getInternalData('feedback')}

                                            </> : id2 === 'external' ?
                                                <>
                                                    {getInternalData('uni')}
                                                    <h2>University CO Attainment</h2>
                                                    {getInternalData('unico')}



                                                </> :
                                                id2 === 'overall' ?
                                                    <>
                                                        {getInternalData('overall')}

                                                    </> :
                                                    <>
                                                    </>
                }
            </div>
        </div >
    )
}

export default View;