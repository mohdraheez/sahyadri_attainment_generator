import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function View(props) {

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
            {/* <nav className="Navbar viewNavbar">


                <ul>
                    <li><Link to="/upload">Student List</Link></li>
                    <li><Link to="/">CIE 1</Link></li>
                    <li><Link to="/assignment">CIE 2</Link></li>
                    <li><Link to="/uni">CIE 3</Link></li>
                    <li><Link to="/uni">CIE CO attainmet</Link></li>
                    <li><Link to="/uni">Feedback attainmet</Link></li>

                    <li><Link to="/feedback">External</Link></li>
                    <li><Link to="/overall">Overall</Link></li>
                </ul>
            </nav> */}
        </div>
    )
}

export default View;