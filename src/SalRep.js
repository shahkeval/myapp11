import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/selrep.css'; 

export default function SalRep() {
  const [allsal, setAllSal] = useState([]);
  const { id } = useParams();
  
  const navigate = useNavigate();
  const logout = async () => {
    const confirmlogout = window.confirm(`Are you sure do you want to logout??`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/oneSalary/${id}`);
        setAllSal(res.data);
      } catch (error) {
        console.error('Error fetching emps:', error);
      }
    };
    fetchData();
  }, [id]); 


  return (
    <div className='salrep'>
      <div className='nav'>
      <Link to={`/HomeEmp/${id}`} >Home</Link>
      <Link to={`/SalRep/${id}`} className='active'>Salary Report</Link>
      <Link to={`/LeaReqEmp/${id}`}>Leave Request</Link>
      <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
      </div>
        <div className="side">
          <div className="page" title='Salary Slip'>
            <div className="head">Salary Report</div>
            <div className="body">
              <div className="id">
                <div className="sid">Salary Id : {allsal.id}</div>
                <div className="eid">Employee Id : {allsal.s_eid}</div>
              </div>
              <div className="tbl">
                  <table border={1}>
                    <tr>
                      <th style={{width:'15%'}}>Sr no.</th>
                      <th>Particular</th>
                      <th style={{width:'25%'}}>Price</th>
                    </tr>
                    <tr>
                      <td align='center'>1</td>
                      <td>Gross Salary <span style={{float:'right',padding:'0 10px'}}><b>+</b></span></td>
                      <td align='center'>₹{allsal.g_sal}</td>
                    </tr>
                    <tr>
                      <td align='center'>2</td>
                      <td>Salary Tax <span style={{float:'right',padding:'0 10px'}}><b>-</b></span></td>
                      <td align='center'>₹{allsal.t_sal}</td>
                    </tr>
                    <tr height='175px'>
                    </tr>
                    <tr>
                      <td style={{padding:'5px 0'}} colSpan={2} align='center'><b>Total Amount</b></td>
                      <td align='center'><b>₹{allsal.sal_amt}</b></td>
                    </tr>
                  </table>
                </div>
                <div className="paid">Paid</div>
            </div>
          </div>
      </div>
    </div>
  );
}
